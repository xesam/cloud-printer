const CloudCore = require('@xesam/cloud-core');
const BASE_URL = 'https://open.spyun.net/v1/printer/';

class Cloud extends CloudCore.CloudApi {

    constructor() {
        super(...arguments);
    }

    request(url, payload, config) {
        payload = this.cloudEntries(payload);
        payload.appid = this._auth.id();
        payload.timestamp = this.nowSeconds();
        const paramStr = Object.entries(payload)
            .sort(([a], [b]) => a > b ? 1 : -1)
            .map(pair => {
                return pair[0] + '=' + pair[1];
            })
            .join('&');
        payload.sign = this._cloudClient.getSigner().MD5(`${paramStr}&appsecret=${this._auth.secret()}`);
        return this._cloudClient.request(
            BASE_URL + url,
            payload,
            config,
            "urlencoded"
        ).then(res => {
            const data = res.data;
            if (data.errorcode !== 0) {
                return Promise.reject(data);
            }
            return data;
        });
    }

    addDevice(devices) {
        const device = devices[0];
        return this.request(
            'add',
            {
                sn: device.sn(),
                pkey: device.key(),
                name: device.name()
            },
            {method: 'post'}
        ).then(data => {
            return {success: [device.clone()]};
        });
    }

    deleteDevice(devices) {
        const device = devices[0];
        return this.request(
            'delete',
            {
                sn: device.sn(),
            },
            {method: 'delete'}
        ).then(data => {
            return {success: [device.clone()]};
        });
    }

    updateDevice(device) {
        return this.request(
            'update',
            {
                sn: device.sn(),
                name: device.name()
            },
            {method: 'patch'}
        ).then(data => {
            return device.clone();
        });
    }

    queryDevice(device) {
        return this.request(
            'info',
            {
                sn: device.sn()
            },
            {method: 'get'}
        ).then(data => {
            return new CloudCore.Device()
                .sn(data.sn)
                .name(data.name)
                .online(data.online === 1)
                .status(data.status === 0 ? CloudCore.DeviceStatus.NORMAL : CloudCore.DeviceStatus.ANORMAL)
                .voice(data.voice)
                .cardno(data.imsi)
                .autoCut(data.auto_cut);
        })
    }

    settingDevice(device) {
        return this.request('setting',
            {
                sn: device.sn(),
                auto_cut: device.auto_cut(),
                voice: device.voice()
            },
            {method: 'PATCH'}
        ).then(data => {
            return {success: [device.clone()]};
        });
    }

    /**
     * 发过来的打印订单会缓存48小时，超时没有打印的订单将会自动清空
     * */
    printMsgOrder(device, order, orderConfig) {
        const payload = {
            sn: device.sn(),
            content: order.content()
        };
        if (orderConfig) {
            payload.times = orderConfig.copies() || 1;
        }
        return this.request(
            'print',
            payload,
            {method: 'post'}
        ).then(data => {
            return order.clone().id(data.id).createTime(data.create_time);
        });
    }

    printLabelOrder(device, order) {
        return Promise.reject({
            msg: 'sp 不支持 printLabelOrder'
        });
    }

    queryOrder(order) {
        return this.request('order/status',
            {
                id: order.id()
            },
            {method: 'get'}
        ).then(data => {
            return order.clone()
                .status(data.status ? CloudCore.OrderStatus.PRINTED : CloudCore.OrderStatus.WAITING)
                .printTime(data.print_time);
        });
    }

    clearOrders(device) {
        return this.request('cleansqs',
            {
                sn: device.sn()
            },
            {method: 'delete'}
        ).then(data => {
            return {
                done: true,
                cleared: data.cleannum
            };
        });
    }

    queryOrderCount(device, order, orderConfig) {
        const date = orderConfig.date();
        return this.request('order/number',
            {
                sn: device.sn(),
                date: date
            },
            {method: 'get'}
        ).then(data => {
            return {
                date: date,
                printed: data.number,
                waiting: data.waiting
            };
        });
    }
}

module.exports = Cloud;

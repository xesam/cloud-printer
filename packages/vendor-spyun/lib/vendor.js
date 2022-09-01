const CloudCore = require('@xesam/cloud-core');
const BASE_URL = 'https://open.spyun.net/v1/printer/';

class Printer extends CloudCore.CloudApi {

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
        payload.sign = this._cloud.getSigner().MD5(`${paramStr}&appsecret=${this._auth.secret()}`);
        return this._cloud.request(
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

    addPrinters(devices) {
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

    deletePrinters(devices) {
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

    updatePrinter(device) {
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

    queryPrinter(device) {
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

    settingPrinter(device) {
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
    printMsgOrder(device, order) {
        return this.request('print',
            {
                sn: device.sn(),
                content: order.content(),
                times: order.copies()
            },
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
                .status(data.status ? CloudCore.OrderStatus.DONE : CloudCore.OrderStatus.PENDING)
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

    queryOrderCount(device, order) {
        const date = order.date();
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

module.exports = Printer;

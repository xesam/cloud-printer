const CloudCore = require('@xesam/cloud-core');
const BASE_URL = 'https://open.spyun.net/v1/printer/';

class Printer extends CloudCore.Printer {

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
                sn: device.sn,
                pkey: device.key,
                name: device.name
            },
            {method: 'post'}
        );
    }

    deletePrinters(devices) {
        const device = devices[0];
        return this.request(
            'delete',
            {
                sn: device.sn,
            },
            {method: 'delete'}
        );
    }

    updatePrinter(device) {
        return this.request(
            'update',
            {
                sn: device.sn,
                name: device.name
            },
            {method: 'patch'}
        );
    }

    queryPrinter(device) {
        return this.request(
            'info',
            {
                sn: device.sn
            },
            {method: 'get'}
        );
    }

    settingPrinter(device) {
        return this.request('setting',
            {
                sn: device.sn,
                auto_cut: device.auto_cut,
                voice: device.voice
            },
            {method: 'PATCH'}
        );
    }

    /**
     * 发过来的打印订单会缓存48小时，超时没有打印的订单将会自动清空
     * */
    printMsgOrder(device, order) {
        return this.request('print',
            {
                sn: device.sn,
                content: order.content,
                times: order.times
            },
            {method: 'post'}
        );
    }

    printLabelOrder(device, order) {
        return Promise.reject({
            msg: 'sp 不支持 printLabelOrder'
        });
    }

    queryOrder(order) {
        return this.request('order/status',
            {
                id: order.id
            },
            {method: 'get'}
        );
    }

    clearOrders(device) {
        return this.request('cleansqs',
            {
                sn: device.sn
            },
            {method: 'delete'}
        );
    }

    queryOrderCount(device, order) {
        return this.request('order/number',
            {
                sn: device.sn,
                date: order.date
            },
            {method: 'get'}
        );
    }
}

module.exports = Printer;

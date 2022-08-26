const CloudCore = require('@xesam/cloud-core');
const BASE_URL = 'https://api.feieyun.cn/Api/Open/';

class Printer extends CloudCore.Printer {

    constructor() {
        super(...arguments);
    }

    request(url, payload, config) {
        payload = this.cloudEntries(payload);
        payload.user = this._auth.id();
        payload.stime = this.nowSeconds();
        payload.sig = this._cloud.getSigner().SHA1(this._auth.id() + this._auth.secret() + payload.stime);
        return this._cloud.request(
            url,
            payload,
            {
                method: 'post',
                ...config
            },
            "urlencoded"
        ).then(res => {
            const data = res.data;
            if (data.ret === 0 && data.msg === 'ok') {
                return data.data;
            } else {
                return Promise.reject(data);
            }
        });
    }

    addPrinters(devices) {
        const content = devices.map(device => {
            return `${device.sn}#${device.key}#${device.name || ''}#${device.cardno || ''}`;
        }).join('\n');
        return this.request(BASE_URL, {
            apiname: 'Open_deviceAddlist',
            deviceContent: content
        });
    }

    deletePrinters(devices) {
        const content = devices.map(device => {
            return `${device.sn}`;
        }).join('-');
        return this.request(BASE_URL, {
            apiname: 'Open_deviceDelList',
            snlist: content
        });
    }

    updatePrinter(device) {
        return this.request(BASE_URL, {
            apiname: 'Open_deviceEdit',
            sn: device.sn,
            name: device.name,
            phonenum: device.cardno
        });
    }

    queryPrinter(device) {
        return this.request(BASE_URL, {
            apiname: 'Open_queryPrinterStatus',
            sn: device.sn
        });
    }

    settingPrinter(device) {
        return Promise.reject({
            msg: 'feie 不支持 settingPrinter'
        });
    }

    printMsgOrder(device, order) {
        return this.request(BASE_URL, {
            apiname: 'Open_printMsg',
            sn: device.sn,
            content: order.content,
            expired: order.expired,
            times: order.times
        });
    }

    printLabelOrder(device, order) {
        return this.request(BASE_URL, {
            apiname: 'Open_printLabelMsg',
            sn: device.sn,
            content: order.content,
            expired: order.expired,
            times: order.times
        });
    }

    queryOrder(order) {
        return this.request(BASE_URL, {
            apiname: 'Open_queryOrderState',
            orderid: order.id
        });
    }

    clearOrders(device) {
        return this.request(BASE_URL, {
            apiname: 'Open_delPrinterSqs',
            sn: device.sn
        });
    }

    queryOrderCount(device, order) {
        return this.request(BASE_URL, {
            apiname: 'Open_queryOrderInfoByDate',
            sn: device.sn,
            date: order.date
        });
    }
}

module.exports = Printer;
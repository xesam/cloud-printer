const CloudCore = require('@xesam/cloud-core');
const BASE_URL = 'https://open.xpyun.net/api/openapi/xprinter/';

class Printer extends CloudCore.Printer {

    constructor() {
        super(...arguments);
    }

    request(url, payload, config) {
        payload = this.cloudEntries(payload);
        payload.timestamp = this.nowSeconds();
        payload.user = this._auth.id();
        payload.sign = this._cloud.getSigner().SHA1(this._auth.id() + this._auth.secret() + payload.timestamp);
        return this._cloud.request(
            BASE_URL + url,
            payload,
            {
                method: 'post',
                ...config
            },
            "json"
        ).then(res => {
            const data = res.data;
            if (data.code !== 0) {
                return Promise.reject(data);
            }
            return data;
        });
    }

    addPrinters(devices) {
        return this.request('addPrinters', {
            items: devices
        });
    }

    deletePrinters(devices) {
        const snlist = devices.map(device => device.sn);
        return this.request('delPrinters', {
            snlist: snlist
        });
    }

    updatePrinter(device) {
        return this.request('updPrinter', {
            sn: device.sn,
            name: device.name,
            cardno: device.cardno
        });
    }

    queryPrinter(device) {
        return this.request('queryPrinterStatus', {
            sn: device.sn
        });
    }

    settingPrinter(device) {
        return this.request('setVoiceType', {
            sn: device.sn,
            voiceType: device.voiceType,
            volumeLevel: device.volumeLevel
        });
    }

    printMsgOrder(device, order) {
        return this.request('print', {
            sn: device.sn,
            content: order.content,
            expiresIn: order.expired,
            copies: order.times
        });
    }

    printLabelOrder(device, order) {
        return this.request('printLabel', {
            sn: device.sn,
            content: order.content,
            expiresIn: order.expired,
            copies: order.times,
        });
    }

    queryOrder(order) {
        return this.request('queryOrderState', {
            orderId: order.id
        });
    }

    clearOrders(device) {
        return this.request('delPrinterQueue', {
            sn: device.sn
        });
    }

    queryOrderCount(device, order) {
        return this.request('queryOrderStatis', {
            sn: device.sn,
            date: order.date
        });
    }
}

module.exports = Printer;
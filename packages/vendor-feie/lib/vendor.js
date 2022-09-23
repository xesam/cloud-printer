const CloudCore = require('@xesam/cloud-core');
const BASE_URL = 'https://api.feieyun.cn/Api/Open/';

class Printer extends CloudCore.CloudApi {

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
            return `${device.sn()}#${device.key()}#${device.name() || ''}#${device.cardno() || ''}`;
        }).join('\n');
        return this.request(BASE_URL, {
            apiname: 'Open_printerAddlist',
            printerContent: content
        }).then(data => {
            const result = {};
            if (data.ok) {
                result.success = data.ok.map(ele => {
                    const [sn, key, name, cardno] = ele.split('#').map(attr => attr.trim());
                    return new CloudCore.Device().sn(sn).key(key).name(name).cardno(cardno);
                });
            }
            if (data.no) {
                result.fail = data.no.map(ele => {
                    const [sn, key, name, _] = ele.split('#').map(attr => attr.trim());
                    const outDevice = new CloudCore.Device().sn(sn).key(key).name(name);
                    const cardnoMatched = _.match(/^\d+/);
                    if (cardnoMatched) {
                        const cardno = cardnoMatched[0];
                        const error = _.replace(cardno, '');
                        outDevice.cardno(cardno).error(error);
                    } else {
                        outDevice.error(_);
                    }
                    return outDevice;
                });
            }
            return result;
        });
    }

    deletePrinters(devices) {
        const content = devices.map(device => {
            return `${device.sn()}`;
        }).join('-');
        return this.request(BASE_URL, {
            apiname: 'Open_printerDelList',
            snlist: content
        }).then(data => {
            const result = {};
            if (data.ok) {
                result.success = data.ok.map(ele => {
                    return new CloudCore.Device().sn(ele.match(/^\d+/)[0]);
                });
            }
            if (data.no) {
                result.fail = data.no.map(ele => {
                    return new CloudCore.Device().sn(ele.match(/^\d+/)[0]);
                });
            }
            return result;
        });
    }

    updatePrinter(device) {
        return this.request(BASE_URL, {
            apiname: 'Open_printerEdit',
            sn: device.sn(),
            name: device.name(),
            phonenum: device.cardno()
        }).then(data => {
            return device.clone();
        });
    }

    queryPrinter(device) {
        return this.request(BASE_URL, {
            apiname: 'Open_queryPrinterStatus',
            sn: device.sn()
        }).then(data => {
            // 0 表示离线
            // 1 表示在线正常
            // 2 表示在线异常
            // 备注：异常一般情况是缺纸，离线的判断是打印机与服务器失去联系超过 30 秒
            if (data === 0) {
                return new CloudCore.Device().online(false);
            } else {
                return new CloudCore.Device().online(true)
                    .status(data === 1 ? CloudCore.DeviceStatus.NORMAL : CloudCore.DeviceStatus.ANORMAL);
            }
        });
    }

    settingPrinter(device) {
        return Promise.reject({
            msg: 'feie 不支持 settingPrinter'
        });
    }

    _printOrder(apiname, device, order) {
        const payload = {
            apiname: apiname,
            sn: device.sn(),
            content: order.content()
        };
        if (order.expired()) {
            payload.expired = Math.floor(Date.now() / 1000);
        }
        if (order.copies()) {
            payload.times = order.copies();
        }
        return this.request(BASE_URL, payload).then(data => {
            return order.clone().id(data);
        });
    }

    printMsgOrder(device, order) {
        return this._printOrder('Open_printMsg', device, order);
    }

    printLabelOrder(device, order) {
        return this._printOrder('Open_printLabelMsg', device, order);
    }

    queryOrder(order) {
        return this.request(BASE_URL, {
            apiname: 'Open_queryOrderState',
            orderid: order.id()
        }).then(data => {
            return order.clone().status(data ? CloudCore.OrderStatus.DONE : CloudCore.OrderStatus.PENDING);
        });
    }

    clearOrders(device) {
        return this.request(BASE_URL, {
            apiname: 'Open_delPrinterSqs',
            sn: device.sn()
        }).then(data => {
            return {
                done: data
            };
        });
    }

    queryOrderCount(device, order) {
        const date = order.date();
        return this.request(BASE_URL, {
            apiname: 'Open_queryOrderInfoByDate',
            sn: device.sn(),
            date: order.date()
        }).then(data => {
            return {
                date: date,
                printed: data.print,
                waiting: data.waiting
            };
        });
    }
}

module.exports = Printer;
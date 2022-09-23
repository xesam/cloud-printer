const CloudCore = require('@xesam/cloud-core');
const BASE_URL = 'https://open.xpyun.net/api/openapi/xprinter/';

class Printer extends CloudCore.CloudApi {

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
            return data.data;
        });
    }

    addPrinters(devices) {
        return this.request('addPrinters', {
            items: devices.map(device => {
                return {
                    sn: device.sn(),
                    name: device.name()
                }
            })
        }).then(data => {
            const result = {};
            if (data.success) {
                result.success = data.success.map(ele => {
                    return new CloudCore.Device().sn(ele);
                });
            }
            if (data.fail) {
                result.fail = data.fail.map(ele => {
                    return new CloudCore.Device().sn(ele);
                });
            }
            return result;
        });
    }

    deletePrinters(devices) {
        return this.request('delPrinters', {
            snlist: devices.map(device => device.sn())
        }).then(data => {
            const result = {};
            if (data.success) {
                result.success = data.success.map(ele => {
                    return new CloudCore.Device().sn(ele);
                });
            }
            if (data.fail) {
                result.fail = data.fail.map(ele => {
                    return new CloudCore.Device().sn(ele);
                });
            }
            return result;
        });
    }

    updatePrinter(device) {
        return this.request('updPrinter', {
            sn: device.sn(),
            name: device.name(),
            cardno: device.cardno()
        }).then(data => {
            return device.clone();
        });
    }

    queryPrinter(device) {
        return this.request('queryPrinterStatus', {
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
        return this.request('setVoiceType', {
            sn: device.sn(),
            voiceType: device.voice(),
            volumeLevel: device.volume()
        }).then(data => {
            return device.clone();
        });
    }

    _printOrder(api, device, order, orderConfig) {
        const payload = {
            sn: device.sn(),
            content: order.content()
        };
        if (order.expired()) {
            const nowSeconds = Math.floor(Date.now() / 1000);
            const expiresIn = order.expired() - nowSeconds;
            if (expiresIn > 0) {
                payload.mode = 1;
                payload.expiresIn = expiresIn;
            }
        }
        if (orderConfig) {
            payload.copies = orderConfig.copies() || 1;
        }
        return this.request(api, payload).then(data => {
            return order.clone().id(data);
        });
    }

    printMsgOrder(device, order, orderConfig) {
        return this._printOrder('print', device, order, orderConfig);
    }

    printLabelOrder(device, order, orderConfig) {
        return this._printOrder('printLabel', device, order, orderConfig);
    }

    queryOrder(order) {
        return this.request('queryOrderState', {
            orderId: order.id()
        }).then(data => {
            return order.clone().status(data ? CloudCore.OrderStatus.PRINTED : CloudCore.OrderStatus.PENDING);
        });
    }

    clearOrders(device) {
        return this.request('delPrinterQueue', {
            sn: device.sn()
        }).then(data => {
            return {
                done: data
            };
        });
    }

    queryOrderCount(device, orderConfig) {
        const date = orderConfig.date();
        return this.request('queryOrderStatis', {
            sn: device.sn(),
            date: date
        }).then(data => {
            return {
                date: date,
                printed: data.printed,
                waiting: data.waiting
            };
        });
    }
}

module.exports = Printer;
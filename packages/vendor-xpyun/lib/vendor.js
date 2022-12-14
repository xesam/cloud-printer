const CloudCore = require('@xesam/cloud-core');
const BASE_URL = 'https://open.xpyun.net/api/openapi/xprinter/';

class Cloud extends CloudCore.CloudApi {

    constructor() {
        super(...arguments);
    }

    request(url, payload, config) {
        payload = this.cloudEntries(payload);
        payload.timestamp = this.getEpochSecond();
        payload.user = this._auth.id();
        payload.sign = this._cloudClient.getSigner().SHA1(this._auth.id() + this._auth.secret() + payload.timestamp);
        return this._cloudClient.request(
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

    addDevice(devices) {
        if (!Array.isArray(devices)) {
            devices = Array.of(devices);
        }
        return this.request('addPrinters', {
            items: devices.map(device => {
                return {
                    sn: device.sn(),
                    name: device.name()
                }
            })
        }).then(data => {
            const result = {
                success: [],
                fail: []
            };
            if (data.success) {
                result.success = data.success.map(ele => {
                    return new CloudCore.Device().sn(ele);
                });
            }
            if (data.fail) {
                result.fail = data.fail.map((ele, index) => {
                    return new CloudCore.Device().sn(ele).error(data.failMsg[index]);
                });
            }
            return result;
        });
    }

    deleteDevice(devices) {
        if (!Array.isArray(devices)) {
            devices = Array.of(devices);
        }
        return this.request('delPrinters', {
            snlist: devices.map(device => device.sn())
        }).then(data => {
            const result = {
                success: [],
                fail: []
            };
            if (data.success) {
                result.success = data.success.map(ele => {
                    return new CloudCore.Device().sn(ele);
                });
            }
            if (data.fail) {
                result.fail = data.fail.map((ele, index) => {
                    return new CloudCore.Device().sn(ele).error(data.failMsg[index]);
                });
            }
            return result;
        });
    }

    updateDevice(device) {
        return this.request('updPrinter', {
            sn: device.sn(),
            name: device.name(),
            cardno: device.cardno()
        }).then(data => {
            return device.clone();
        });
    }

    queryDevice(device) {
        return this.request('queryPrinterStatus', {
            sn: device.sn()
        }).then(data => {
            // 0 ????????????
            // 1 ??????????????????
            // 2 ??????????????????
            // ???????????????????????????????????????????????????????????????????????????????????????????????? 30 ???
            if (data === 0) {
                return new CloudCore.Device().online(false);
            } else {
                return new CloudCore.Device().online(true)
                    .status(data === 1 ? CloudCore.DeviceStatus.NORMAL : CloudCore.DeviceStatus.ANORMAL);
            }
        });
    }

    settingDevice(device) {
        return this.request('setVoiceType', {
            sn: device.sn(),
            voiceType: device.voice(),
            volumeLevel: device.volume()
        }).then(data => {
            return device.clone();
        });
    }

    _printOrder(api, device, order) {
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
        payload.copies = order.copies() || 1;
        return this.request(api, payload).then(data => {
            return order.clone().id(data);
        });
    }

    printMsgOrder(device, order) {
        return this._printOrder('print', device, order);
    }

    printLabelOrder(device, order) {
        return this._printOrder('printLabel', device, order);
    }

    queryOrder(order) {
        return this.request('queryOrderState', {
            orderId: order.id()
        }).then(data => {
            return order.clone().status(data ? CloudCore.OrderStatus.PRINTED : CloudCore.OrderStatus.WAITING);
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

    queryOrderCount(device, queryOption) {
        const date = queryOption.date();
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

module.exports = Cloud;

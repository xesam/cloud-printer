const CloudCore = require('@xesam/cloud-core');
const NodeCloudClient = require('@xesam/cloud-node');
const Cloud = require('../lib/index');

let auth;
let cloudClient;
let cloud;
let device;
let order;
let orderConfig;

beforeEach(() => {
    jest.spyOn(Date, 'now').mockReturnValue(1668416270000);
    auth = new CloudCore.CloudAuth('test', 'secret');
    cloudClient = new NodeCloudClient();
    cloud = new Cloud(auth, cloudClient);
    device = new CloudCore.Device()
        .sn('123456')
        .key("abcdefg")
        .name('p1')
        .autoCut(1)
        .voice('U')
        .volume(1)
        .cardno('654321');

    order = new CloudCore.Order()
        .id('order123')
        .content('Hello');

    orderConfig = new CloudCore.OrderConfig()
        .copies(3)
        .date('2022-08-31');
})

describe("addDevice", () => {
    test("when add a device then request config is correct", done => {
        const spy = jest.spyOn(cloudClient, 'request').mockResolvedValue({
            data: {
                "msg": "ok",
                "code": 0,
                "data": {
                    "success": ["123456"]
                },
                "serverExecutedTime": 1
            }
        });
        cloud.addDevice(device)
            .then(res => {
                expect(spy.mock.calls[0][0]).toEqual("https://open.xpyun.net/api/openapi/xprinter/addPrinters");
                expect(spy.mock.calls[0][1]).toStrictEqual({
                    "items": [
                        {"sn": "123456", "name": "p1"}
                    ],
                    "sign": "e8f57f3afdc83c474b85d98d32c4fc377ea963b3",
                    "timestamp": 1668416270,
                    user: 'test'
                });
                expect(spy.mock.calls[0][2]).toEqual({"method": "post"});
                expect(spy.mock.calls[0][3]).toEqual("json");
                done();
            });
    })
    test("when add a new device successfully then success list is not empty", done => {
        jest.spyOn(cloudClient, 'request').mockResolvedValue({
            data: {
                "msg": "ok",
                "code": 0,
                "data": {
                    "success": ["123456"]
                },
                "serverExecutedTime": 1
            }
        });
        cloud.addDevice(device)
            .then(res => {
                expect(res.success.length).toBe(1);
                expect(res.fail.length).toBe(0);
                const successDevice = res.success[0];
                expect(successDevice.sn()).toBe("123456");
                expect(successDevice.error()).toBeUndefined();
                done();
            });
    })
    test("when add a new device fail then fail list is not empty", done => {
        jest.spyOn(cloudClient, 'request').mockResolvedValue({
            data: {
                "msg": "ok",
                "code": 0,
                "data": {
                    "fail": ["123456"],
                    "failMsg": ["123456:1010"]
                },
                "serverExecutedTime": 1
            }
        });
        cloud.addDevice(device)
            .then(res => {
                expect(res.success.length).toBe(0);
                expect(res.fail.length).toBe(1);
                const failDevice = res.fail[0];
                expect(failDevice.sn()).toBe("123456");
                expect(failDevice.error()).toBe("123456:1010");
                done();
            });
    })
})

describe("deleteDevice", () => {
    test("when delete device then request config is correct", done => {
        const spy = jest.spyOn(cloudClient, 'request').mockResolvedValue({
            data: {
                "msg": "ok",
                "code": 0,
                "data": {
                    "success": ["123456"]
                },
                "serverExecutedTime": 1
            }
        });
        cloud.deleteDevice(device)
            .then(res => {
                expect(spy.mock.calls[0][0]).toEqual("https://open.xpyun.net/api/openapi/xprinter/delPrinters");
                expect(spy.mock.calls[0][1]).toStrictEqual({
                    snlist: ["123456"],
                    "sign": "e8f57f3afdc83c474b85d98d32c4fc377ea963b3",
                    "timestamp": 1668416270,
                    user: 'test'
                });
                expect(spy.mock.calls[0][2]).toEqual({"method": "post"});
                expect(spy.mock.calls[0][3]).toEqual("json");
                done();
            });
    })
    test("when delete device successfully then success list is not empty", done => {
        jest.spyOn(cloudClient, 'request').mockResolvedValue({
            data: {
                "msg": "ok",
                "code": 0,
                "data": {
                    "success": ["123456"]
                },
                "serverExecutedTime": 1
            }
        });
        cloud.deleteDevice(device)
            .then(res => {
                expect(res.success.length).toBe(1);
                expect(res.fail.length).toBe(0);
                const successDevice = res.success[0];
                expect(successDevice.sn()).toBe("123456");
                expect(successDevice.error()).toBeUndefined();
                done();
            });
    })
    test("when delete device fail then fail list is not empty", done => {
        jest.spyOn(cloudClient, 'request').mockResolvedValue({
            data: {
                "msg": "ok",
                "code": 0,
                "data": {
                    "fail": ["123456"],
                    "failMsg": ["123456:1010"]
                },
                "serverExecutedTime": 1
            }
        });
        cloud.deleteDevice(device)
            .then(res => {
                expect(res.success.length).toBe(0);
                expect(res.fail.length).toBe(1);
                const failDevice = res.fail[0];
                expect(failDevice.sn()).toBe("123456");
                expect(failDevice.error()).toBe("123456:1010");
                done();
            });
    })
})

describe("updateDevice", () => {
    test("when update device then request config is correct", done => {
        const spy = jest.spyOn(cloudClient, 'request').mockResolvedValue({
            data: {
                "msg": "ok",
                "code": 0,
                "data": 1,
                "serverExecutedTime": 1
            }
        });
        cloud.updateDevice(device)
            .then(res => {
                expect(spy.mock.calls[0][0]).toEqual("https://open.xpyun.net/api/openapi/xprinter/updPrinter");
                expect(spy.mock.calls[0][1]).toStrictEqual({
                    "name": "p1",
                    "sn": "123456",
                    "cardno": "654321",
                    "sign": "e8f57f3afdc83c474b85d98d32c4fc377ea963b3",
                    "timestamp": 1668416270,
                    user: 'test'
                });
                expect(spy.mock.calls[0][2]).toEqual({"method": "post"});
                expect(spy.mock.calls[0][3]).toEqual("json");
                done();
            });
    })
    test("when update device successfully then return the new device", done => {
        jest.spyOn(cloudClient, 'request').mockResolvedValue({
            data: {
                "msg": "ok",
                "code": 0,
                "data": 1,
                "serverExecutedTime": 1
            }
        });
        cloud.updateDevice(device)
            .then(retDevice => {
                expect(retDevice.name()).toBe("p1");
                expect(retDevice.sn()).toBe("123456");
                expect(retDevice.error()).toBeUndefined();
                done();
            });
    })
    test("when update device fail then catch err", done => {
        jest.spyOn(cloudClient, 'request').mockResolvedValue({
            data: {
                "msg": "REQUEST_PARAM_INVALID",
                "code": -2,
                "data": 0,
                "serverExecutedTime": 1
            }
        });
        cloud.updateDevice(device)
            .catch(err => {
                expect(err).toStrictEqual({
                    "msg": "REQUEST_PARAM_INVALID",
                    "code": -2,
                    "data": 0,
                    "serverExecutedTime": 1
                });
                done();
            });
    })
})

describe("queryDevice", () => {
    test("when query device then request config is correct", done => {
        const spy = jest.spyOn(cloudClient, 'request').mockResolvedValue({
            data: {
                "msg": "ok",
                "code": 0,
                "data": 1,
                "serverExecutedTime": 1
            }
        });
        cloud.queryDevice(device)
            .then(res => {
                expect(spy.mock.calls[0][0]).toEqual("https://open.xpyun.net/api/openapi/xprinter/queryPrinterStatus");
                expect(spy.mock.calls[0][1]).toStrictEqual({
                    "sn": "123456",
                    "sign": "e8f57f3afdc83c474b85d98d32c4fc377ea963b3",
                    "timestamp": 1668416270,
                    user: 'test'
                });
                expect(spy.mock.calls[0][2]).toEqual({"method": "post"});
                expect(spy.mock.calls[0][3]).toEqual('json');
                done();
            });
    })
    test("when query device successfully then return the new device", done => {
        jest.spyOn(cloudClient, 'request').mockResolvedValue({
            data: {
                "msg": "ok",
                "code": 0,
                "data": 1,
                "serverExecutedTime": 1
            }
        });
        cloud.queryDevice(device)
            .then(retDevice => {
                expect(retDevice.online()).toBeTruthy();
                expect(retDevice.status()).toBe(CloudCore.DeviceStatus.NORMAL);
                expect(retDevice.error()).toBeUndefined();
                done();
            });
    })
    test("when query device fail then catch err", done => {
        jest.spyOn(cloudClient, 'request').mockResolvedValue({
            data: {
                "msg": "REQUEST_PARAM_INVALID",
                "code": -2,
                "data": 0,
                "serverExecutedTime": 1
            }
        });
        cloud.queryDevice(device)
            .catch(err => {
                expect(err).toStrictEqual({
                    "msg": "REQUEST_PARAM_INVALID",
                    "code": -2,
                    "data": 0,
                    "serverExecutedTime": 1
                });
                done();
            });
    })
})

describe("settingDevice", () => {
    test("when setting device then request config is correct", done => {
        const spy = jest.spyOn(cloudClient, 'request').mockResolvedValue({
            data: {
                "msg": "ok",
                "code": 0,
                "data": true,
                "serverExecutedTime": 1
            }
        });
        cloud.settingDevice(device)
            .then(res => {
                expect(spy.mock.calls[0][0]).toEqual("https://open.xpyun.net/api/openapi/xprinter/setVoiceType");
                expect(spy.mock.calls[0][1]).toStrictEqual({
                    "sn": "123456",
                    "volumeLevel": 1,
                    "voiceType": "U",
                    "sign": "e8f57f3afdc83c474b85d98d32c4fc377ea963b3",
                    "timestamp": 1668416270,
                    user: 'test'
                });
                expect(spy.mock.calls[0][2]).toEqual({"method": "post"});
                expect(spy.mock.calls[0][3]).toEqual('json');
                done();
            });
    })
    test("when setting device successfully then return the new device", done => {
        jest.spyOn(cloudClient, 'request').mockResolvedValue({
            data: {
                "msg": "ok",
                "code": 0,
                "data": true,
                "serverExecutedTime": 1
            }
        });
        cloud.settingDevice(device)
            .then(retDevice => {
                expect(retDevice.name()).toBe("p1");
                expect(retDevice.sn()).toBe("123456");
                expect(retDevice.voice()).toBe("U");
                expect(retDevice.autoCut()).toBe(1);
                expect(retDevice.error()).toBeUndefined();
                done();
            });
    })
    test("when setting device fail then catch err", done => {
        jest.spyOn(cloudClient, 'request').mockResolvedValue({
            data: {
                "msg": "PRINTER_OFFLINE",
                "code": 1003,
                "data": false,
                "serverExecutedTime": 1
            }
        });
        cloud.settingDevice(device)
            .catch(err => {
                expect(err).toStrictEqual({
                    "msg": "PRINTER_OFFLINE",
                    "code": 1003,
                    "data": false,
                    "serverExecutedTime": 1
                });
                done();
            });
    })
})

describe("printMsgOrder", () => {
    test("when print msg order then request config is correct", done => {
        const spy = jest.spyOn(cloudClient, 'request').mockResolvedValue({
            data: {
                "msg": "ok",
                "code": 0,
                "data": "5c1af88568e417349343b942",
                "serverExecutedTime": 23
            }
        });
        cloud.printMsgOrder(device, order)
            .then(res => {
                expect(spy.mock.calls[0][0]).toEqual("https://open.xpyun.net/api/openapi/xprinter/print");
                expect(spy.mock.calls[0][1]).toStrictEqual({
                    "sn": "123456",
                    "content": 'Hello',
                    "sign": "e8f57f3afdc83c474b85d98d32c4fc377ea963b3",
                    "timestamp": 1668416270,
                    user: 'test'
                });
                expect(spy.mock.calls[0][2]).toEqual({"method": "post"});
                expect(spy.mock.calls[0][3]).toEqual('json');
                done();
            });
    })
    test("when print msg order successfully then return the order detail", done => {
        jest.spyOn(cloudClient, 'request').mockResolvedValue({
            data: {
                "msg": "ok",
                "code": 0,
                "data": "5c1af88568e417349343b942",
                "serverExecutedTime": 23
            }
        });
        cloud.printMsgOrder(device, order)
            .then(retOrder => {
                expect(retOrder.id()).toBe("5c1af88568e417349343b942");
                expect(retOrder.error()).toBeUndefined();
                done();
            });
    })
    test("when print msg order then catch err", done => {
        jest.spyOn(cloudClient, 'request').mockResolvedValue({
            data: {
                "msg": "PRINTER_NOT_REGISTER",
                "code": 1002,
                "data": null,
                "serverExecutedTime": 25
            }
        });
        cloud.printMsgOrder(device, order)
            .catch(err => {
                expect(err).toStrictEqual({
                    "msg": "PRINTER_NOT_REGISTER",
                    "code": 1002,
                    "data": null,
                    "serverExecutedTime": 25
                });
                done();
            });
    })
})

describe("printLabelOrder", () => {
    test("when print label order then request config is correct", done => {
        const spy = jest.spyOn(cloudClient, 'request').mockResolvedValue({
            data: {
                "msg": "ok",
                "code": 0,
                "data": "5c1af88568e417349343b942",
                "serverExecutedTime": 23
            }
        });
        cloud.printLabelOrder(device, order)
            .then(res => {
                expect(spy.mock.calls[0][0]).toEqual("https://open.xpyun.net/api/openapi/xprinter/printLabel");
                expect(spy.mock.calls[0][1]).toStrictEqual({
                    "sn": "123456",
                    "content": 'Hello',
                    "sign": "e8f57f3afdc83c474b85d98d32c4fc377ea963b3",
                    "timestamp": 1668416270,
                    user: 'test'
                });
                expect(spy.mock.calls[0][2]).toEqual({"method": "post"});
                expect(spy.mock.calls[0][3]).toEqual('json');
                done();
            });
    })
    test("when print label order successfully then return the order detail", done => {
        jest.spyOn(cloudClient, 'request').mockResolvedValue({
            data: {
                "msg": "ok",
                "code": 0,
                "data": "5c1af88568e417349343b942",
                "serverExecutedTime": 23
            }
        });
        cloud.printLabelOrder(device, order)
            .then(retOrder => {
                expect(retOrder.id()).toBe("5c1af88568e417349343b942");
                expect(retOrder.error()).toBeUndefined();
                done();
            });
    })
    test("when print label order then catch err", done => {
        jest.spyOn(cloudClient, 'request').mockResolvedValue({
            data: {
                "msg": "PRINTER_NOT_REGISTER",
                "code": 1002,
                "data": null,
                "serverExecutedTime": 25
            }
        });
        cloud.printLabelOrder(device, order)
            .catch(err => {
                expect(err).toStrictEqual({
                    "msg": "PRINTER_NOT_REGISTER",
                    "code": 1002,
                    "data": null,
                    "serverExecutedTime": 25
                });
                done();
            });
    })
})

describe("queryOrder", () => {
    test("when query order then request config is correct", done => {
        const spy = jest.spyOn(cloudClient, 'request').mockResolvedValue({
            data: {
                "msg": "ok",
                "code": 0,
                "data": true,
                "serverExecutedTime": 1
            }
        });
        cloud.queryOrder(order)
            .then(res => {
                expect(spy.mock.calls[0][0]).toEqual("https://open.xpyun.net/api/openapi/xprinter/queryOrderState");
                expect(spy.mock.calls[0][1]).toStrictEqual({
                    "orderId": "order123",
                    "sign": "e8f57f3afdc83c474b85d98d32c4fc377ea963b3",
                    "timestamp": 1668416270,
                    user: 'test'
                });
                expect(spy.mock.calls[0][2]).toEqual({"method": "post"});
                expect(spy.mock.calls[0][3]).toEqual('json');
                done();
            });
    })
    test("when query order successfully then return the order detail", done => {
        jest.spyOn(cloudClient, 'request').mockResolvedValue({
            data: {
                "msg": "ok",
                "code": 0,
                "data": true,
                "serverExecutedTime": 1
            }
        });
        cloud.queryOrder(order)
            .then(retOrder => {
                expect(retOrder.id()).toBe("order123");
                expect(retOrder.status()).toBe(CloudCore.OrderStatus.PRINTED);
                expect(retOrder.error()).toBeUndefined();
                done();
            });
    })
    test("when query order then catch err", done => {
        jest.spyOn(cloudClient, 'request').mockResolvedValue({
            data: {
                "msg": "ORDER_NOT_FOUND",
                "code": 1005,
                "data": false,
                "serverExecutedTime": 1
            }
        });
        cloud.queryOrder(order)
            .catch(err => {
                expect(err).toStrictEqual({
                    "msg": "ORDER_NOT_FOUND",
                    "code": 1005,
                    "data": false,
                    "serverExecutedTime": 1
                });
                done();
            });
    })
})

describe("clearOrders", () => {
    test("when query order then request config is correct", done => {
        const spy = jest.spyOn(cloudClient, 'request').mockResolvedValue({
            data: {
                "msg": "ok",
                "code": 0,
                "data": true,
                "serverExecutedTime": 1
            }
        });
        cloud.clearOrders(device)
            .then(res => {
                expect(spy.mock.calls[0][0]).toEqual("https://open.xpyun.net/api/openapi/xprinter/delPrinterQueue");
                expect(spy.mock.calls[0][1]).toStrictEqual({
                    "sn": "123456",
                    "sign": "e8f57f3afdc83c474b85d98d32c4fc377ea963b3",
                    "timestamp": 1668416270,
                    user: 'test'
                });
                expect(spy.mock.calls[0][2]).toEqual({"method": "post"});
                expect(spy.mock.calls[0][3]).toEqual('json');
                done();
            });
    })
    test("when query order successfully then return the order detail", done => {
        jest.spyOn(cloudClient, 'request').mockResolvedValue({
            data: {
                "msg": "ok",
                "code": 0,
                "data": true,
                "serverExecutedTime": 1
            }
        });
        cloud.clearOrders(device)
            .then(ret => {
                expect(ret).toStrictEqual({
                    done: true
                });
                done();
            });
    })
    test("when query order then catch err", done => {
        jest.spyOn(cloudClient, 'request').mockResolvedValue({
            data: {
                "msg": "PRINTER_NOT_REGISTER",
                "code": 1002,
                "data": false,
                "serverExecutedTime": 1
            }
        });
        cloud.clearOrders(device)
            .catch(err => {
                expect(err).toStrictEqual({
                    "msg": "PRINTER_NOT_REGISTER",
                    "code": 1002,
                    "data": false,
                    "serverExecutedTime": 1
                });
                done();
            });
    })
})

describe("queryOrderCount", () => {
    test("when query order then request config is correct", done => {
        const spy = jest.spyOn(cloudClient, 'request').mockResolvedValue({
            data: {
                "msg": "ok",
                "code": 0,
                "data": {"printed": 18, "waiting": 0},
                "serverExecutedTime": 1
            }
        });
        cloud.queryOrderCount(device, orderConfig)
            .then(res => {
                expect(spy.mock.calls[0][0]).toEqual("https://open.xpyun.net/api/openapi/xprinter/queryOrderStatis");
                expect(spy.mock.calls[0][1]).toStrictEqual({
                    "sn": "123456",
                    "date": "2022-08-31",
                    "sign": "e8f57f3afdc83c474b85d98d32c4fc377ea963b3",
                    "timestamp": 1668416270,
                    user: 'test'
                });
                expect(spy.mock.calls[0][2]).toEqual({"method": "post"});
                expect(spy.mock.calls[0][3]).toEqual('json');
                done();
            });
    })
    test("when query order successfully then return the order detail", done => {
        jest.spyOn(cloudClient, 'request').mockResolvedValue({
            data: {
                "msg": "ok",
                "code": 0,
                "data": {"printed": 18, "waiting": 0},
                "serverExecutedTime": 1
            }
        });
        cloud.queryOrderCount(device, orderConfig)
            .then(ret => {
                expect(ret).toStrictEqual({
                    date: '2022-08-31',
                    printed: 18,
                    waiting: 0
                })
                done();
            });
    })
    test("when query order then catch err", done => {
        jest.spyOn(cloudClient, 'request').mockResolvedValue({
            data: {
                "msg": "ORDER_DATE_INVALID",
                "code": 1006,
                "data": null,
                "serverExecutedTime": 1
            }
        });
        cloud.queryOrderCount(device, orderConfig)
            .catch(err => {
                expect(err).toStrictEqual({
                    "msg": "ORDER_DATE_INVALID",
                    "code": 1006,
                    "data": null,
                    "serverExecutedTime": 1
                });
                done();
            });
    })
})
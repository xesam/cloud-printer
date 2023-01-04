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
        .copies(3)
        .content('Hello');

    orderConfig = new CloudCore.OrderConfig()
        .date('2022-08-31');
})

describe("addDevice", () => {
    test("when add a device then request config is correct", done => {
        const spy = jest.spyOn(cloudClient, 'request').mockResolvedValue({
            data: {
                "msg": "ok",
                "ret": 0,
                "serverExecutedTime": 100,
                data: {"ok": ["316500010# abcdefgh# 快餐前台  # 13688889999 "]}
            }
        });
        cloud.addDevice(device)
            .then(res => {
                expect(spy.mock.calls[0][0]).toEqual("https://api.feieyun.cn/Api/Open/");
                expect(spy.mock.calls[0][1]).toStrictEqual({
                    "apiname": "Open_printerAddlist",
                    "printerContent": "123456#abcdefg#p1#654321",
                    "sig": "e8f57f3afdc83c474b85d98d32c4fc377ea963b3",
                    "stime": 1668416270,
                    "user": 'test'
                });
                expect(spy.mock.calls[0][2]).toEqual({"method": "post"});
                expect(spy.mock.calls[0][3]).toEqual("urlencoded");
                done();
            });
    })
    test("when add a new device successfully then success list is not empty", done => {
        jest.spyOn(cloudClient, 'request').mockResolvedValue({
            data: {
                "msg": "ok",
                "ret": 0,
                "serverExecutedTime": 100,
                data: {"ok": ["316500010# abcdefgh# 快餐前台  # 13688889999 "]}
            }
        });
        cloud.addDevice(device)
            .then(res => {
                expect(res.success.length).toBe(1);
                expect(res.fail.length).toBe(0);
                const successDevice = res.success[0];
                expect(successDevice.sn()).toBe("316500010");
                expect(successDevice.key()).toBe("abcdefgh");
                expect(successDevice.name()).toBe("快餐前台");
                expect(successDevice.cardno()).toBe("13688889999");
                expect(successDevice.error()).toBeUndefined();
                done();
            });
    })
    test("when add a new device fail then fail list is not empty", done => {
        jest.spyOn(cloudClient, 'request').mockResolvedValue({
            data: {
                "msg": "ok",
                "ret": 0,
                "serverExecutedTime": 100,
                data: {"no": ["316500010 # abcdefgh # 快餐前台  # 13688889999  （错误：识别码不正确）"]}
            }
        });
        cloud.addDevice(device)
            .then(res => {
                expect(res.success.length).toBe(0);
                expect(res.fail.length).toBe(1);
                const failDevice = res.fail[0];
                expect(failDevice.sn()).toBe("316500010");
                expect(failDevice.key()).toBe("abcdefgh");
                expect(failDevice.name()).toBe("快餐前台");
                expect(failDevice.cardno()).toBe("13688889999");
                expect(failDevice.error()).toBe("（错误：识别码不正确）");
                done();
            });
    })
})

describe("deleteDevice", () => {
    test("when delete a device then request config is correct", done => {
        const spy = jest.spyOn(cloudClient, 'request').mockResolvedValue({
            data: {
                "msg": "ok",
                "ret": 0,
                "serverExecutedTime": 100,
                data: {"ok": ["800000777成功", "915500104成功"]}
            }
        });
        cloud.deleteDevice(device)
            .then(res => {
                expect(spy.mock.calls[0][0]).toEqual("https://api.feieyun.cn/Api/Open/");
                expect(spy.mock.calls[0][1]).toStrictEqual({
                    "apiname": "Open_printerDelList",
                    "snlist": "123456",
                    "sig": "e8f57f3afdc83c474b85d98d32c4fc377ea963b3",
                    "stime": 1668416270,
                    "user": 'test'
                });
                expect(spy.mock.calls[0][2]).toEqual({"method": "post"});
                expect(spy.mock.calls[0][3]).toEqual("urlencoded");
                done();
            });
    })
    test("when delete a new device successfully then return the new device", done => {
        jest.spyOn(cloudClient, 'request').mockResolvedValue({
            data: {
                "msg": "ok",
                "ret": 0,
                "serverExecutedTime": 100,
                data: {"ok": ["123456成功"]}
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
})

describe("updateDevice", () => {
    test("when update device then request config is correct", done => {
        const spy = jest.spyOn(cloudClient, 'request').mockResolvedValue({
            data: {
                "msg": "ok",
                "ret": 0,
                "data": true,
                "serverExecutedTime": 9
            }
        });
        cloud.updateDevice(device)
            .then(res => {
                expect(spy.mock.calls[0][0]).toEqual('https://api.feieyun.cn/Api/Open/');
                expect(spy.mock.calls[0][1]).toStrictEqual({
                    "apiname": "Open_printerEdit",
                    "name": "p1",
                    "sn": "123456",
                    "phonenum": "654321",
                    'sig': "e8f57f3afdc83c474b85d98d32c4fc377ea963b3",
                    'stime': 1668416270,
                    user: 'test'
                });
                expect(spy.mock.calls[0][2]).toEqual({"method": "post"});
                expect(spy.mock.calls[0][3]).toEqual("urlencoded");
                done();
            });
    })
    test("when update device successfully then return the new device", done => {
        jest.spyOn(cloudClient, 'request').mockResolvedValue({
            data: {
                "msg": "ok",
                "ret": 0,
                "data": true,
                "serverExecutedTime": 9
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
                "msg": "参数错误 : 时间格式不正确。",
                "ret": 1001,
                "data": null,
                "serverExecutedTime": 37
            }
        });
        cloud.updateDevice(device)
            .catch(err => {
                expect(err).toStrictEqual({
                    "msg": "参数错误 : 时间格式不正确。",
                    "ret": 1001,
                    "data": null,
                    "serverExecutedTime": 37
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
                "ret": 0,
                "data": "在线，工作状态正常",
                "serverExecutedTime": 9
            }
        });
        cloud.queryDevice(device)
            .then(res => {
                expect(spy.mock.calls[0][0]).toEqual('https://api.feieyun.cn/Api/Open/');
                expect(spy.mock.calls[0][1]).toStrictEqual({
                    "apiname": "Open_queryPrinterStatus",
                    "sn": "123456",
                    'sig': "e8f57f3afdc83c474b85d98d32c4fc377ea963b3",
                    'stime': 1668416270,
                    user: 'test'
                });
                expect(spy.mock.calls[0][2]).toEqual({"method": "post"});
                expect(spy.mock.calls[0][3]).toEqual('urlencoded');
                done();
            });
    })
    test("when query device successfully then return the new device", done => {
        jest.spyOn(cloudClient, 'request').mockResolvedValue({
            data: {
                "msg": "ok",
                "ret": 0,
                "data": "在线，工作状态正常",
                "serverExecutedTime": 9
            }
        });
        cloud.queryDevice(device)
            .then(retDevice => {
                expect(retDevice.online()).toBe(true);
                expect(retDevice.status()).toBe(CloudCore.DeviceStatus.NORMAL);
                expect(retDevice.error()).toBeUndefined();
                done();
            });
    })
    test("when query device fail then catch err", done => {
        jest.spyOn(cloudClient, 'request').mockResolvedValue({
            data: {
                "msg": "参数错误 : 时间格式不正确。",
                "ret": 1001,
                "data": null,
                "serverExecutedTime": 37
            }
        });
        cloud.queryDevice(device)
            .catch(err => {
                expect(err).toStrictEqual({
                    "msg": "参数错误 : 时间格式不正确。",
                    "ret": 1001,
                    "data": null,
                    "serverExecutedTime": 37
                });
                done();
            });
    })
})

describe("settingDevice", () => {
    test("when setting device then throw not support", done => {
        cloud.settingDevice(device)
            .catch(err => {
                expect(err).toStrictEqual({
                    msg: 'feie 不支持 settingDevice'
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
                "ret": 0,
                "data": "5c1af88568e417349343b942",
                "serverExecutedTime": 3
            }
        });
        cloud.printMsgOrder(device, order)
            .then(res => {
                expect(spy.mock.calls[0][0]).toEqual('https://api.feieyun.cn/Api/Open/');
                expect(spy.mock.calls[0][1]).toStrictEqual({
                    "apiname": "Open_printMsg",
                    "sn": "123456",
                    "content": 'Hello',
                    'sig': "e8f57f3afdc83c474b85d98d32c4fc377ea963b3",
                    'stime': 1668416270,
                    'times': 3,
                    user: 'test'
                });
                expect(spy.mock.calls[0][2]).toEqual({"method": "post"});
                expect(spy.mock.calls[0][3]).toEqual('urlencoded');
                done();
            });
    })
    test("when print msg order successfully then return the order detail", done => {
        jest.spyOn(cloudClient, 'request').mockResolvedValue({
            data: {
                "msg": "ok",
                "ret": 0,
                "data": "5c1af88568e417349343b942",
                "serverExecutedTime": 3
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
                "msg": "参数错误 : 该帐号未注册.",
                "ret": -2,
                "data": null,
                "serverExecutedTime": 37
            }
        });
        cloud.printMsgOrder(device, order)
            .catch(err => {
                expect(err).toStrictEqual({
                    "msg": "参数错误 : 该帐号未注册.",
                    "ret": -2,
                    "data": null,
                    "serverExecutedTime": 37
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
                "ret": 0,
                "data": "5c1af88568e417349343b942",
                "serverExecutedTime": 3
            }
        });
        cloud.printLabelOrder(device, order)
            .then(res => {
                expect(spy.mock.calls[0][0]).toEqual('https://api.feieyun.cn/Api/Open/');
                expect(spy.mock.calls[0][1]).toStrictEqual({
                    "apiname": "Open_printLabelMsg",
                    "sn": "123456",
                    "content": 'Hello',
                    'sig': "e8f57f3afdc83c474b85d98d32c4fc377ea963b3",
                    'stime': 1668416270,
                    'times': 3,
                    user: 'test'
                });
                expect(spy.mock.calls[0][2]).toEqual({"method": "post"});
                expect(spy.mock.calls[0][3]).toEqual('urlencoded');
                done();
            });
    })
    test("when print label order successfully then return the order detail", done => {
        jest.spyOn(cloudClient, 'request').mockResolvedValue({
            data: {
                "msg": "ok",
                "ret": 0,
                "data": "5c1af88568e417349343b942",
                "serverExecutedTime": 3
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
                "msg": "参数错误 : 该帐号未注册.",
                "ret": -2,
                "data": null,
                "serverExecutedTime": 37
            }
        });
        cloud.printLabelOrder(device, order)
            .catch(err => {
                expect(err).toStrictEqual({
                    "msg": "参数错误 : 该帐号未注册.",
                    "ret": -2,
                    "data": null,
                    "serverExecutedTime": 37
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
                "ret": 0,
                "data": true,
                "serverExecutedTime": 2
            }
        });
        cloud.queryOrder(order)
            .then(res => {
                expect(spy.mock.calls[0][0]).toEqual('https://api.feieyun.cn/Api/Open/');
                expect(spy.mock.calls[0][1]).toStrictEqual({
                    "apiname": "Open_queryOrderState",
                    "orderid": "order123",
                    'sig': "e8f57f3afdc83c474b85d98d32c4fc377ea963b3",
                    'stime': 1668416270,
                    user: 'test'
                });
                expect(spy.mock.calls[0][2]).toEqual({"method": "post"});
                expect(spy.mock.calls[0][3]).toEqual('urlencoded');
                done();
            });
    })
    test("when query order successfully then return the order detail", done => {
        jest.spyOn(cloudClient, 'request').mockResolvedValue({
            data: {
                "msg": "ok",
                "ret": 0,
                "data": true,
                "serverExecutedTime": 2
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
                "msg": "参数错误 : 该帐号未注册.",
                "ret": -2,
                "data": null,
                "serverExecutedTime": 37
            }
        });
        cloud.queryOrder(order)
            .catch(err => {
                expect(err).toStrictEqual({
                    "msg": "参数错误 : 该帐号未注册.",
                    "ret": -2,
                    "data": null,
                    "serverExecutedTime": 37
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
                "ret": 0,
                "data": true,
                "serverExecutedTime": 9
            }
        });
        cloud.clearOrders(device)
            .then(res => {
                expect(spy.mock.calls[0][0]).toEqual('https://api.feieyun.cn/Api/Open/');
                expect(spy.mock.calls[0][1]).toStrictEqual({
                    "apiname": "Open_delPrinterSqs",
                    "sn": "123456",
                    'sig': "e8f57f3afdc83c474b85d98d32c4fc377ea963b3",
                    'stime': 1668416270,
                    user: 'test'
                });
                expect(spy.mock.calls[0][2]).toEqual({"method": "post"});
                expect(spy.mock.calls[0][3]).toEqual('urlencoded');
                done();
            });
    })
    test("when query order successfully then return the order detail", done => {
        jest.spyOn(cloudClient, 'request').mockResolvedValue({
            data: {
                "msg": "ok",
                "ret": 0,
                "data": true,
                "serverExecutedTime": 9
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
                "msg": "参数错误 : 时间格式不正确。",
                "ret": 1001,
                "data": null,
                "serverExecutedTime": 37
            }
        });
        cloud.clearOrders(device)
            .catch(err => {
                expect(err).toStrictEqual({
                    "msg": "参数错误 : 时间格式不正确。",
                    "ret": 1001,
                    "data": null,
                    "serverExecutedTime": 37
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
                "ret": 0,
                "data": {"print": 18, "waiting": 0},
                "serverExecutedTime": 9
            }
        });
        cloud.queryOrderCount(device, orderConfig)
            .then(res => {
                expect(spy.mock.calls[0][0]).toEqual('https://api.feieyun.cn/Api/Open/');
                expect(spy.mock.calls[0][1]).toStrictEqual({
                    "apiname": "Open_queryOrderInfoByDate",
                    "sn": "123456",
                    "date": "2022-08-31",
                    'sig': "e8f57f3afdc83c474b85d98d32c4fc377ea963b3",
                    'stime': 1668416270,
                    user: 'test'
                });
                expect(spy.mock.calls[0][2]).toEqual({"method": "post"});
                expect(spy.mock.calls[0][3]).toEqual('urlencoded');
                done();
            });
    })
    test("when query order successfully then return the order detail", done => {
        jest.spyOn(cloudClient, 'request').mockResolvedValue({
            data: {
                "msg": "ok",
                "ret": 0,
                "data": {"print": 18, "waiting": 0},
                "serverExecutedTime": 9
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
                "msg": "参数错误 : 时间格式不正确。",
                "ret": 1001,
                "data": null,
                "serverExecutedTime": 37
            }
        });
        cloud.queryOrderCount(device, orderConfig)
            .catch(err => {
                expect(err).toStrictEqual({
                    "msg": "参数错误 : 时间格式不正确。",
                    "ret": 1001,
                    "data": null,
                    "serverExecutedTime": 37
                });
                done();
            });
    })
})

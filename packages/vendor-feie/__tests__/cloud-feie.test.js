const CloudCore = require('@xesam/cloud-core');
const NodeCloudClient = require('@xesam/cloud-node');
const Cloud = require('../lib/index');
const authJson = require('./auth.private.json');

let auth;
let cloudClient;
let cloud;
let device;
let order;
let orderConfig;

beforeEach(() => {
    jest.spyOn(Date, 'now').mockReturnValue(1668416270000);
    auth = new CloudCore.CloudAuth(authJson.id, authJson.secret);
    cloudClient = new NodeCloudClient();
    cloud = new Cloud(auth, cloudClient);
    device = new CloudCore.Device()
        .sn('123456789')
        .key("abcdefghijk")
        .name('WH-XPY-5')
        .cardno('12345678');

    order = new CloudCore.Order()
        .id('551506419_20220831174524_657954193')
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
                    "printerContent": "123456789#abcdefghijk#WH-XPY-5#12345678",
                    "sig": "1246db0a2c766a41cced87644d747f59c51718ba",
                    "stime": 1668416270,
                    "user": authJson.id
                });
                expect(spy.mock.calls[0][2]).toEqual({"method": "post"});
                expect(spy.mock.calls[0][3]).toEqual("urlencoded");
                done();
            });
    })
    test("when add a new device successfully then return the new device", done => {
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
    test("when the device's sn is not correct then add the device fail", done => {
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
    test("when api error then return api error", done => {
        jest.spyOn(cloudClient, 'request').mockResolvedValue({
            data: {
                "msg": "参数错误 : 该帐号未注册.",
                "ret": -2,
                "data": null,
                "serverExecutedTime": 37
            }
        });
        cloud.addDevice(device)
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
    test("when network error then return network error", done => {
        jest.spyOn(cloudClient, 'request').mockRejectedValue({
            data: {
                msg: '403'
            }
        });
        cloud.addDevice(device)
            .catch(err => {
                expect(err).toStrictEqual({
                    data: {
                        msg: '403'
                    }
                });
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
                    "snlist": "123456789",
                    "sig": "1246db0a2c766a41cced87644d747f59c51718ba",
                    "stime": 1668416270,
                    "user": authJson.id
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
                data: {"ok": ["800000777成功"]}
            }
        });
        cloud.deleteDevice(device)
            .then(res => {
                expect(res.success.length).toBe(1);
                expect(res.fail.length).toBe(0);
                const successDevice = res.success[0];
                expect(successDevice.sn()).toBe("800000777");
                expect(successDevice.error()).toBeUndefined();
                done();
            });
    })
    test("when the UID is not correct then delete the device fail", done => {
        jest.spyOn(cloudClient, 'request').mockResolvedValue({
            data: {
                "msg": "ok",
                "ret": 0,
                "serverExecutedTime": 100,
                data: {"no": ["800000777用户UID不匹配"]}
            }
        });
        cloud.deleteDevice(device)
            .then(res => {
                expect(res.success.length).toBe(0);
                expect(res.fail.length).toBe(1);
                const failDevice = res.fail[0];
                expect(failDevice.sn()).toBe("800000777");
                expect(failDevice.error()).toBe("用户UID不匹配");
                done();
            });
    })
    test("when api error then return api error", done => {
        jest.spyOn(cloudClient, 'request').mockResolvedValue({
            data: {
                "msg": "参数错误 : 该帐号未注册.",
                "ret": -2,
                "data": null,
                "serverExecutedTime": 37
            }
        });
        cloud.deleteDevice(device)
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
    test("when network error then return network error", done => {
        jest.spyOn(cloudClient, 'request').mockRejectedValue({
            data: {
                msg: '403'
            }
        });
        cloud.deleteDevice(device)
            .catch(err => {
                expect(err).toStrictEqual({
                    data: {
                        msg: '403'
                    }
                });
                done();
            });
    })
})

// cloud.queryDevice(device, order).then(console.log).catch(console.error);
// cloud.printMsgOrder(device, order, orderConfig).then(console.log).catch(console.error);
// cloud.clearOrders(device, order).then(console.log).catch(console.error);
// cloud.queryOrderCount(device, orderConfig).then(console.log).catch(console.error);
// cloud.queryOrder(order).then(console.log).catch(console.error);
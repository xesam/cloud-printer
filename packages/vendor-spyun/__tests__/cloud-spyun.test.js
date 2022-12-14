const CloudCore = require('@xesam/cloud-core');
const NodeCloudClient = require('@xesam/cloud-node');
const Cloud = require('../lib/index');

let auth;
let cloudClient;
let cloud;
let device;
let order;
let queryOption;

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
        .cardno('654321');

    order = new CloudCore.Order()
        .id('order123')
        .copies(3)
        .content('Hello');

    queryOption = new CloudCore.QueryOption()
        .date('2022-08-31');
})

describe("addDevice", () => {
    test("when add a device then request config is correct", done => {
        const spy = jest.spyOn(cloudClient, 'request').mockResolvedValue({
            data: {"errorcode": 0}
        });
        cloud.addDevice(device)
            .then(res => {
                expect(spy.mock.calls[0][0]).toEqual("https://open.spyun.net/v1/printer/add");
                expect(spy.mock.calls[0][1]).toStrictEqual({
                    "name": "p1",
                    "sn": "123456",
                    "pkey": "abcdefg",
                    "sign": "C43CEC767495169D1DFC5E01E68E6F12",
                    "timestamp": 1668416270,
                    "appid": 'test'
                });
                expect(spy.mock.calls[0][2]).toEqual({"method": "post"});
                expect(spy.mock.calls[0][3]).toEqual("urlencoded");
                done();
            });
    })
    test("when add a new device successfully then success list is not empty", done => {
        jest.spyOn(cloudClient, 'request').mockResolvedValue({
            data: {"errorcode": 0}
        });
        cloud.addDevice(device)
            .then(res => {
                expect(res.success.length).toBe(1);
                expect(res.fail.length).toBe(0);
                const successDevice = res.success[0];
                expect(successDevice.name()).toBe("p1");
                expect(successDevice.sn()).toBe("123456");
                expect(successDevice.key()).toBe("abcdefg");
                expect(successDevice.error()).toBeUndefined();
                done();
            });
    })
    test("when add a new device fail then fail list is not empty", done => {
        jest.spyOn(cloudClient, 'request').mockResolvedValue({
            data: {
                "errorcode": -1, "errormsg": "appid??????"
            }
        });
        cloud.addDevice(device)
            .then(res => {
                expect(res.success.length).toBe(0);
                expect(res.fail.length).toBe(1);
                const failDevice = res.fail[0];
                expect(failDevice.name()).toBe("p1");
                expect(failDevice.sn()).toBe("123456");
                expect(failDevice.key()).toBe("abcdefg");
                expect(failDevice.error()).toBe("appid??????");
                done();
            });
    })
})

describe("deleteDevice", () => {
    test("when delete device then request config is correct", done => {
        const spy = jest.spyOn(cloudClient, 'request').mockResolvedValue({
            data: {"errorcode": 0}
        });
        cloud.deleteDevice(device)
            .then(res => {
                expect(spy.mock.calls[0][0]).toEqual("https://open.spyun.net/v1/printer/delete");
                expect(spy.mock.calls[0][1]).toStrictEqual({
                    "sn": "123456",
                    "sign": "E7FB7188C83F600F7E296C73F9D112CC",
                    "timestamp": 1668416270,
                    "appid": 'test'
                });
                expect(spy.mock.calls[0][2]).toEqual({"method": "delete"});
                expect(spy.mock.calls[0][3]).toEqual("urlencoded");
                done();
            });
    })
    test("when delete device successfully then success list is not empty", done => {
        jest.spyOn(cloudClient, 'request').mockResolvedValue({
            data: {"errorcode": 0}
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
                "errorcode": -1, "errormsg": "appid??????"
            }
        });
        cloud.deleteDevice(device)
            .then(res => {
                expect(res.success.length).toBe(0);
                expect(res.fail.length).toBe(1);
                const failDevice = res.fail[0];
                expect(failDevice.sn()).toBe("123456");
                expect(failDevice.error()).toBe("appid??????");
                done();
            });
    })
})

describe("updateDevice", () => {
    test("when update device then request config is correct", done => {
        const spy = jest.spyOn(cloudClient, 'request').mockResolvedValue({
            data: {"errorcode": 0}
        });
        cloud.updateDevice(device)
            .then(res => {
                expect(spy.mock.calls[0][0]).toEqual("https://open.spyun.net/v1/printer/update");
                expect(spy.mock.calls[0][1]).toStrictEqual({
                    "name": "p1",
                    "sn": "123456",
                    "sign": "96E4369B5382D085ED2DEFBA34602F07",
                    "timestamp": 1668416270,
                    "appid": 'test'
                });
                expect(spy.mock.calls[0][2]).toEqual({"method": "patch"});
                expect(spy.mock.calls[0][3]).toEqual("urlencoded");
                done();
            });
    })
    test("when update device successfully then return the new device", done => {
        jest.spyOn(cloudClient, 'request').mockResolvedValue({
            data: {"errorcode": 0}
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
                "errorcode": -1, "errormsg": "appid??????"
            }
        });
        cloud.updateDevice(device)
            .catch(err => {
                expect(err).toStrictEqual({
                    "errorcode": -1, "errormsg": "appid??????"
                });
                done();
            });
    })
})

describe("queryDevice", () => {
    test("when query device then request config is correct", done => {
        const spy = jest.spyOn(cloudClient, 'request').mockResolvedValue({
            data: {"errorcode": 0}
        });
        cloud.queryDevice(device)
            .then(res => {
                expect(spy.mock.calls[0][0]).toEqual("https://open.spyun.net/v1/printer/info");
                expect(spy.mock.calls[0][1]).toStrictEqual({
                    "sn": "123456",
                    "sign": "E7FB7188C83F600F7E296C73F9D112CC",
                    "timestamp": 1668416270,
                    "appid": 'test'
                });
                expect(spy.mock.calls[0][2]).toEqual({"method": "get"});
                expect(spy.mock.calls[0][3]).toEqual("urlencoded");
                done();
            });
    })
    test("when query device successfully then return the new device", done => {
        jest.spyOn(cloudClient, 'request').mockResolvedValue({
            data: {
                "errorcode": 0,
                "sn": "123",  // ???????????????
                "name": "name",      // ???????????????
                "online": 1,         // ???????????????1????????????0?????????
                "status": 0,         // ?????????0????????????1?????????
                "sqsnum": 1,         // ??????????????????
                "model": "xxx",      // ??????
                "auto_cut": 1,       // ?????????????????????1?????????0??????
                "voice": "U",        // ??????????????????  N?????????Y???????????????U???????????????V???????????????W????????????
                "imsi": "xxx"        // ???????????????,wifi??????????????????
            }
        });
        cloud.queryDevice(device)
            .then(retDevice => {
                expect(retDevice.name()).toBe("name");
                expect(retDevice.sn()).toBe("123");
                expect(retDevice.online()).toBe(true);
                expect(retDevice.status()).toBe(CloudCore.DeviceStatus.NORMAL);
                expect(retDevice.voice()).toBe("U");
                expect(retDevice.cardno()).toBe("xxx");
                expect(retDevice.autoCut()).toBe(1);
                expect(retDevice.error()).toBeUndefined();
                done();
            });
    })
    test("when query device fail then catch err", done => {
        jest.spyOn(cloudClient, 'request').mockResolvedValue({
            data: {
                "errorcode": -1, "errormsg": "appid??????"
            }
        });
        cloud.queryDevice(device)
            .catch(err => {
                expect(err).toStrictEqual({
                    "errorcode": -1, "errormsg": "appid??????"
                });
                done();
            });
    })
})

describe("settingDevice", () => {
    test("when setting device then request config is correct", done => {
        const spy = jest.spyOn(cloudClient, 'request').mockResolvedValue({
            data: {"errorcode": 0}
        });
        cloud.settingDevice(device)
            .then(res => {
                expect(spy.mock.calls[0][0]).toEqual("https://open.spyun.net/v1/printer/setting");
                expect(spy.mock.calls[0][1]).toStrictEqual({
                    "sn": "123456",
                    "auto_cut": 1,
                    "voice": "U",
                    "sign": "F7B77B2772515157F7A22F50428FF081",
                    "timestamp": 1668416270,
                    "appid": 'test'
                });
                expect(spy.mock.calls[0][2]).toEqual({"method": "PATCH"});
                expect(spy.mock.calls[0][3]).toEqual("urlencoded");
                done();
            });
    })
    test("when setting device successfully then return the new device", done => {
        jest.spyOn(cloudClient, 'request').mockResolvedValue({
            data: {
                "errorcode": 0
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
                "errorcode": -1, "errormsg": "appid??????"
            }
        });
        cloud.settingDevice(device)
            .catch(err => {
                expect(err).toStrictEqual({
                    "errorcode": -1, "errormsg": "appid??????"
                });
                done();
            });
    })
})

describe("printMsgOrder", () => {
    test("when print msg order then request config is correct", done => {
        const spy = jest.spyOn(cloudClient, 'request').mockResolvedValue({
            data: {"errorcode": 0}
        });
        cloud.printMsgOrder(device, order)
            .then(res => {
                expect(spy.mock.calls[0][0]).toEqual("https://open.spyun.net/v1/printer/print");
                expect(spy.mock.calls[0][1]).toStrictEqual({
                    "sn": "123456",
                    "content": 'Hello',
                    "sign": "C6283BCF24173C14FCB1DE1A4A1623F3",
                    "timestamp": 1668416270,
                    "appid": 'test',
                    "times": 3
                });
                expect(spy.mock.calls[0][2]).toEqual({"method": "post"});
                expect(spy.mock.calls[0][3]).toEqual("urlencoded");
                done();
            });
    })
    test("when print msg order successfully then return the order detail", done => {
        jest.spyOn(cloudClient, 'request').mockResolvedValue({
            data: {
                "errorcode": 0,
                "id": "5c1af88568e417349343b942",    // ????????????ID,?????????????????????????????????
                "create_time": "2019-01-01 00:00:00" // ??????????????????
            }

        });
        cloud.printMsgOrder(device, order)
            .then(retOrder => {
                expect(retOrder.id()).toBe("5c1af88568e417349343b942");
                expect(retOrder.createTime()).toBe("2019-01-01 00:00:00");
                expect(retOrder.error()).toBeUndefined();
                done();
            });
    })
    test("when print msg order then catch err", done => {
        jest.spyOn(cloudClient, 'request').mockResolvedValue({
            data: {
                "errorcode": -1, "errormsg": "appid??????"
            }
        });
        cloud.printMsgOrder(device, order)
            .catch(err => {
                expect(err).toStrictEqual({
                    "errorcode": -1, "errormsg": "appid??????"
                });
                done();
            });
    })
})

describe("printLabelOrder", () => {
    test("when print label order then not support", done => {
        const spy = jest.spyOn(cloudClient, 'request').mockResolvedValue({
            data: {"errorcode": 0}
        });
        cloud.printLabelOrder(device)
            .catch(err => {
                expect(err).toStrictEqual({
                    msg: 'spyun ????????? printLabelOrder'
                });
                done();
            });
    })
})

describe("queryOrder", () => {
    test("when query order then request config is correct", done => {
        const spy = jest.spyOn(cloudClient, 'request').mockResolvedValue({
            data: {"errorcode": 0}
        });
        cloud.queryOrder(order)
            .then(res => {
                expect(spy.mock.calls[0][0]).toEqual("https://open.spyun.net/v1/printer/order/status");
                expect(spy.mock.calls[0][1]).toStrictEqual({
                    "id": "order123",
                    "sign": "D4671D01D21BA7538762678A8D39CC0C",
                    "timestamp": 1668416270,
                    "appid": 'test'
                });
                expect(spy.mock.calls[0][2]).toEqual({"method": "get"});
                expect(spy.mock.calls[0][3]).toEqual("urlencoded");
                done();
            });
    })
    test("when query order successfully then return the order detail", done => {
        jest.spyOn(cloudClient, 'request').mockResolvedValue({
            data: {
                "errorcode": 0,
                "status": true,// ???????????????true???????????????false????????????
                "print_time": "2019-01-01 00:00:00" // ????????????
            }

        });
        cloud.queryOrder(order)
            .then(retOrder => {
                expect(retOrder.id()).toBe("order123");
                expect(retOrder.status()).toBe(CloudCore.OrderStatus.PRINTED);
                expect(retOrder.printTime()).toBe("2019-01-01 00:00:00");
                expect(retOrder.error()).toBeUndefined();
                done();
            });
    })
    test("when query order then catch err", done => {
        jest.spyOn(cloudClient, 'request').mockResolvedValue({
            data: {
                "errorcode": -1, "errormsg": "appid??????"
            }
        });
        cloud.queryOrder(order)
            .catch(err => {
                expect(err).toStrictEqual({
                    "errorcode": -1, "errormsg": "appid??????"
                });
                done();
            });
    })
})

describe("clearOrders", () => {
    test("when query order then request config is correct", done => {
        const spy = jest.spyOn(cloudClient, 'request').mockResolvedValue({
            data: {"errorcode": 0}
        });
        cloud.clearOrders(device)
            .then(res => {
                expect(spy.mock.calls[0][0]).toEqual("https://open.spyun.net/v1/printer/cleansqs");
                expect(spy.mock.calls[0][1]).toStrictEqual({
                    "sn": "123456",
                    "sign": "E7FB7188C83F600F7E296C73F9D112CC",
                    "timestamp": 1668416270,
                    "appid": 'test'
                });
                expect(spy.mock.calls[0][2]).toEqual({"method": "delete"});
                expect(spy.mock.calls[0][3]).toEqual("urlencoded");
                done();
            });
    })
    test("when query order successfully then return the order detail", done => {
        jest.spyOn(cloudClient, 'request').mockResolvedValue({
            data: {
                "errorcode": 0,
                "cleannum": 10  //??????????????????
            }
        });
        cloud.clearOrders(device)
            .then(ret => {
                expect(ret).toStrictEqual({
                    done: true,
                    cleared: 10
                });
                done();
            });
    })
    test("when query order then catch err", done => {
        jest.spyOn(cloudClient, 'request').mockResolvedValue({
            data: {
                "errorcode": -1, "errormsg": "appid??????"
            }
        });
        cloud.clearOrders(device)
            .catch(err => {
                expect(err).toStrictEqual({
                    "errorcode": -1, "errormsg": "appid??????"
                });
                done();
            });
    })
})

describe("queryOrderCount", () => {
    test("when query order then request config is correct", done => {
        const spy = jest.spyOn(cloudClient, 'request').mockResolvedValue({
            data: {"errorcode": 0}
        });
        cloud.queryOrderCount(device, queryOption)
            .then(res => {
                expect(spy.mock.calls[0][0]).toEqual("https://open.spyun.net/v1/printer/order/number");
                expect(spy.mock.calls[0][1]).toStrictEqual({
                    "sn": "123456",
                    "date": "2022-08-31",
                    "sign": "8FE4F405B108089F096F26AE0D5207D0",
                    "timestamp": 1668416270,
                    "appid": 'test'
                });
                expect(spy.mock.calls[0][2]).toEqual({"method": "get"});
                expect(spy.mock.calls[0][3]).toEqual("urlencoded");
                done();
            });
    })
    test("when query order successfully then return the order detail", done => {
        jest.spyOn(cloudClient, 'request').mockResolvedValue({
            data: {
                "errorcode": 0,
                "number": 18 // ??????????????????
            }
        });
        cloud.queryOrderCount(device, queryOption)
            .then(ret => {
                expect(ret).toStrictEqual({
                    date: '2022-08-31',
                    printed: 18
                })
                done();
            });
    })
    test("when query order then catch err", done => {
        jest.spyOn(cloudClient, 'request').mockResolvedValue({
            data: {
                "errorcode": -1, "errormsg": "appid??????"
            }
        });
        cloud.queryOrderCount(device, queryOption)
            .catch(err => {
                expect(err).toStrictEqual({
                    "errorcode": -1, "errormsg": "appid??????"
                });
                done();
            });
    })
})

const Device = require('../lib/Device');

describe('Device', () => {
    let device;
    beforeEach(() => {
        device = new Device().sn('123').cardno('').key(null).name(undefined);
    })
    test("when clone a device then get a new device", () => {
        const newDevice = device.clone();
        newDevice.sn('new123');
        expect(device.sn()).toEqual('123');
        expect(newDevice.sn()).toEqual('new123');
    })
});
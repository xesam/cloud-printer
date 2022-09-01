const CloudCore = require('@xesam/cloud-core');
const NodeCloud = require('@xesam/cloud-node');
const Printer = require('../lib/index');
const authJson = require('./auth.private.json');

const auth = new CloudCore.Auth(authJson.id, authJson.secret);
const cloud = new NodeCloud();
const p = new Printer(auth, cloud);
const device = new CloudCore.Device().sn(authJson.p_sn).key(authJson.p_key).name('WH-YK-003');
const order = new CloudCore.Order()
    .id('631030e3c390fe208d150aa6')
    .date('2022-09-01')
    .content('<L>Hello</L>');

// p.addPrinters([device]).then(JSON.stringify).then(console.log).catch(console.error);
// p.deletePrinters([device]).then(console.log).catch(console.error);
// p.updatePrinter(device).then(console.log).catch(console.error);
// p.queryPrinter(device, order).then(console.log).catch(console.error);
// p.printMsgOrder(device, order).then(console.log).catch(console.error);
// p.clearOrders(device, order).then(console.log).catch(console.error);
p.queryOrderCount(device, order).then(console.log).catch(console.error);
// p.queryOrder(order).then(console.log).catch(console.error);
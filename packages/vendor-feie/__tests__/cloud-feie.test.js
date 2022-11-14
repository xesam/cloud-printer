const CloudCore = require('@xesam/cloud-core');
const NodeCloud = require('@xesam/cloud-node');
const Printer = require('../lib/index');
const authJson = require('./auth.private.json');

const auth = new CloudCore.CloudAuth(authJson.id, authJson.secret);
const cloud = new NodeCloud();
const p = new Printer(auth, cloud);
const device = new CloudCore.Device().sn(authJson.p_sn).key(authJson.p_key).name('WH-XPY-5');
const order = new CloudCore.Order()
    .id('551506419_20220831174524_657954193')
    .content('Hello');
const orderConfig = new CloudCore.OrderConfig().date('2022-08-31');

// p.addDevice([device]).then(JSON.stringify).then(console.log).catch(console.error);
// p.deleteDevice([device]).then(console.log).catch(console.error);
// p.queryDevice(device, order).then(console.log).catch(console.error);
p.printMsgOrder(device, order, orderConfig).then(console.log).catch(console.error);
// p.clearOrders(device, order).then(console.log).catch(console.error);
// p.queryOrderCount(device, orderConfig).then(console.log).catch(console.error);
// p.queryOrder(order).then(console.log).catch(console.error);
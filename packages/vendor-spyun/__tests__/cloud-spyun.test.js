const CloudCore = require('@xesam/cloud-core');
const NodeCloud = require('@xesam/cloud-node');
const Printer = require('../lib/index');
const authJson = require('./auth.private.json');

const auth = new CloudCore.Auth(authJson.id, authJson.secret);
const cloud = new NodeCloud();
const p = new Printer(auth, cloud);
const device = {sn: authJson.p_sn, name: 'test', key: authJson.p_key};
const order = {
    id: '63059a15af7bbc589c6b4787',
    content: '<C><L1>你好呀，小垃圾</L1></C>'
};
// p.addPrinters([device]).then(console.log).catch(console.error);
// p.deletePrinters([device]).then(console.log).catch(console.error);
// p.updatePrinter({...device, name: Date.now()}).then(console.log).catch(console.error);
// p.settingPrinter({...device, voice: 'Y'}).then(console.log).catch(console.error);
p.queryPrinter(device).then(console.log).catch(console.error);
// p.clearOrders(device).then(console.log).catch(console.error);
// p.printMsgOrder(device, order).then(console.log).catch(console.error);
// p.queryOrder(order).then(console.log).catch(console.error);
// p.queryOrderCount(device, {date: '2022-08-24'}).then(console.log).catch(console.error);
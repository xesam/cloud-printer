const CloudCore = require('@xesam/cloud-core');
const NodeCloud = require('@xesam/cloud-node');
const Printer = require('../lib/index');
const authJson = require('./auth.private.json');

const auth = new CloudCore.Auth(authJson.id, authJson.secret);
const cloud = new NodeCloud();
const p = new Printer(auth, cloud);
const device = {
    sn: authJson.p_sn,
    name: '测试'
}
const order = {
    content: '<L>Hello</L>'
}
// p.addPrinters([device]).then(console.log).catch(console.error);
// p.deletePrinters([device]).then(console.log).catch(console.error);
p.queryPrinter(device).then(console.log).catch(console.error);
// p.printMsgOrder(device, order).then(console.log).catch(console.error);
const CloudCore = require('@xesam/cloud-core');
const NodeCloud = require('@xesam/cloud-node');
const Printer = require('../lib/index');
const authJson = require('./auth.private.json');

const auth = new CloudCore.Auth(authJson.id, authJson.secret);
const cloud = new NodeCloud();
const p = new Printer(auth, cloud);
const device = {
    sn: authJson.p_sn
};
const msg = {
    content: 'Hello'
};
p.queryPrinter(device, msg).then(console.log).catch(console.error);
// p.printMsgOrder(device, msg).then(console.log).catch(console.error);
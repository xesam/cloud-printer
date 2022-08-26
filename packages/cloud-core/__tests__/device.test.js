const Device = require('../lib/Device');
const d = new Device().sn('123').cardno('').key(null).name(undefined);
console.log(d.sn())
console.log(d.cardno())
console.log(d.key())
console.log(d.name())
console.log('-------------------');
console.log(d.entries())
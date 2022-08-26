'use strict';

const cloudMini = require('..');
const assert = require('assert').strict;

assert.strictEqual(cloudMini(), 'Hello from cloudMini');
console.info("cloudMini tests passed");

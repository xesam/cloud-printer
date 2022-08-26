'use strict';

const cloudCore = require('..');
const assert = require('assert').strict;

assert.strictEqual(cloudCore(), 'Hello from cloudCore');
console.info("cloudCore tests passed");

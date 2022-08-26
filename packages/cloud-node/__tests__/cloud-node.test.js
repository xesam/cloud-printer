'use strict';

const cloudNode = require('..');
const assert = require('assert').strict;

assert.strictEqual(cloudNode(), 'Hello from cloudNode');
console.info("cloudNode tests passed");

'use strict';

const mobile = require('..');
const assert = require('assert').strict;

assert.strictEqual(mobile(), 'Hello from mobile');
console.info("mobile tests passed");

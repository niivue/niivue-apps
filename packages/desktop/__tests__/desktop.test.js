'use strict';

const desktop = require('..');
const assert = require('assert').strict;

assert.strictEqual(desktop(), 'Hello from desktop');
console.info("desktop tests passed");

// node tools/test/testGlobalTest

require('../../src/global');
const Promise = require('bluebird');
process.env.AWS_PROFILE = '';
const {propertyId, url, expect, chai, stage} = require('../../tests/global.test.js');

console.log('testGlobalTest start!');

Promise.resolve().then(async() => {
  console.log('result - %o', {propertyId, url, stage});
  console.log('testGlobalTest finish!');
}).catch(err => {
    console.error(`Error : ${err.message}`);
});

// node tools/test/testEPGPost

require('../../src/global');
const Promise = require('bluebird');
process.env.AWS_PROFILE = '';
const lambda = require('libs/lambda');

console.log('testEPGPost start!');

const propertyId = '__mocha_test__';
const stage = 'dev';

const bodySetting = {
  'host': 'procentricepg.lge.com',
  'directory': 'USA60069',
  'user': 'pcsuser',
  'password': 'pcs123!@#',
  'hours': 48
};

Promise.resolve().then(async() => {
  const param = {
    headers: {
      'property_id': propertyId,
      'Content-Type': 'application/json'
    },
    body: bodySetting
  };
  const result = await lambda.apiRequest(`gem-${stage}-epg`, 'POST', '/setting/epg', param);
  console.log('result - %o', result);
  console.log('testEPGPost finish!');
}).catch(err => {
    console.error(`Error : ${err.message}`);
});

// node tools/test/testEPGDelete

require('../../src/global');
const Promise = require('bluebird');
process.env.AWS_PROFILE = '';
const lambda = require('libs/lambda');

console.log('testEPGDelete start!');

const propertyId = '__mocha_test__';
const stage = 'dev';

Promise.resolve().then(async() => {
  const param = {
    headers: {
      'property_id': propertyId
    }
  };
  const result = await lambda.apiRequest(`gem-${stage}-epg`, 'DELETE', '/setting/epg', param);
  console.log('result - %o', result);
  console.log('testEPGDelete finish!');
}).catch(err => {
    console.error(`Error : ${err.message}`);
});

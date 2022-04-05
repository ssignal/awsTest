// node tools/test/testFlightPostDisable

require('../../src/global');
const Promise = require('bluebird');
process.env.AWS_PROFILE = '';
const lambda = require('libs/lambda');

console.log('testFlightPostDisable start!');

const propertyId = '__mocha_test__';
const stage = 'dev';

const bodySetting = [{
  'status': 0,
  'appId': '92a8e0e2',
  'appKey': 'ac3086d8c22ddc00fc999df4868c3684',
  'interval': '10'
}];

Promise.resolve().then(async() => {
  const param = {
    headers: {
      'property_id': propertyId,
      'Content-Type': 'application/json'
    },
    body: bodySetting
  };
  const result = await lambda.apiRequest(`gem-${stage}-flight`, 'POST', '/setting/flight', param);
  console.log('result - %o', result);
  console.log('testFlightPostDisable finish!');
}).catch(err => {
    console.error(`Error : ${err.message}`);
});

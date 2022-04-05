// node tools/test/testFlightGet

require('../../src/global');
const Promise = require('bluebird');
process.env.AWS_PROFILE = '';
const lambda = require('libs/lambda');

console.log('testFlightGet start!');

const propertyId = '__mocha_test__';
const stage = 'dev';

Promise.resolve().then(async() => {
  const param = {
    headers: {
      'property_id': propertyId,
      'Content-Type': 'application/json'
    }
  };
  const result = await lambda.apiRequest(`gem-${stage}-flight`, 'GET', '/setting/flight', param);
  console.log('result - %o', result);
  console.log('testFlightGet finish!');
}).catch(err => {
    console.error(`Error : ${err.message}`);
});

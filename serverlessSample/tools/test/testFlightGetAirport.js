// node tools/test/testFlightGetAirport

require('../../src/global');
const Promise = require('bluebird');
process.env.AWS_PROFILE = '';
const lambda = require('libs/lambda');

console.log('testFlightGetAirport start!');

const propertyId = '__mocha_test__';
const stage = 'dev';

Promise.resolve().then(async() => {
  const param = {
    headers: {
      'property_id': propertyId,
      'Content-Type': 'application/json'
    }
  };
  const result = await lambda.apiRequest(`gem-${stage}-flight`, 'GET', '/flight/airport', param);
  console.log('result - %o', result);
  console.log('testFlightGetAirport finish!');
}).catch(err => {
    console.error(`Error : ${err.message}`);
});

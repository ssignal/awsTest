// node tools/test/testFlightGetArival

require('../../src/global');
const Promise = require('bluebird');
process.env.AWS_PROFILE = '';
const lambda = require('libs/lambda');

console.log('testFlightGetArival start!');

const propertyId = '__mocha_test__';
const stage = 'dev';

Promise.resolve().then(async() => {
  const param = {
    headers: {
      'property_id': propertyId,
      'Content-Type': 'application/json'
    },
    query: {
      'date': '2021_03_12_20',
      'iataCode': 'ICN'
    }
  };
  const result = await lambda.apiRequest(`gem-${stage}-flight`, 'GET', '/flight/arrival', param);
  console.log('result - %o', result);
  console.log('testFlightGetArival finish!');
}).catch(err => {
    console.error(`Error : ${err.message}`);
});

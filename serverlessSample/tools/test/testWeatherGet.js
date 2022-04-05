// node tools/test/testWeatherGet

require('../../src/global');
const Promise = require('bluebird');
process.env.AWS_PROFILE = '';
const lambda = require('libs/lambda');

console.log('testWeatherGet start!');

const propertyId = '__mocha_test__';
const stage = 'dev';

Promise.resolve().then(async() => {
  const param = {
    headers: {
      'property_id': propertyId,
      'Content-Type': 'application/json'
    }
  };
  const result = await lambda.apiRequest(`gem-${stage}-weather`, 'GET', '/setting/weather', param);
  console.log('result - %o', result);
  console.log('testWeatherGet finish!');
}).catch(err => {
    console.error(`Error : ${err.message}`);
});

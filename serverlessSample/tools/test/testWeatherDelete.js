// node tools/test/testWeatherDelete

require('../../src/global');
const Promise = require('bluebird');
process.env.AWS_PROFILE = '';
const lambda = require('libs/lambda');

console.log('testWeatherDelete start!');

const propertyId = '__mocha_test__';
const stage = 'dev';

Promise.resolve().then(async() => {
  const param = {
    headers: {
      'property_id': propertyId
    }
  };
  const result = await lambda.apiRequest(`gem-${stage}-weather`, 'DELETE', '/setting/weather', param);
  console.log('result - %o', result);
  console.log('testWeatherDelete finish!');
}).catch(err => {
    console.error(`Error : ${err.message}`);
});

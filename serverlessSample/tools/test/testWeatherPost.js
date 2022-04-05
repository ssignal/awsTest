// node tools/test/testWeatherPost

require('../../src/global');
const Promise = require('bluebird');
process.env.AWS_PROFILE = '';
const lambda = require('libs/lambda');

console.log('testWeatherPost start!');

const propertyId = '__mocha_test__';
const stage = 'dev';

const bodySetting = {
  'latitude': 42.04661570394843,
  'longitude': -87.83723831176758,
  'radarGeoWidth': 100,
  'satelliteGeoWidth': 1500,
  'useMetric': false,
  'useMetricDistance': false,
  'useSatellite': false
};

Promise.resolve().then(async() => {
  const param = {
    headers: {
      'property_id': propertyId,
      'Content-Type': 'application/json'
    },
    body: bodySetting
  };
  const result = await lambda.apiRequest(`gem-${stage}-weather`, 'POST', '/setting/weather', param);
  console.log('result - %o', result);
  console.log('testWeatherPost finish!');
}).catch(err => {
    console.error(`Error : ${err.message}`);
});

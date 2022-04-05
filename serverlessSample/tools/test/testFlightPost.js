// node tools/test/testFlightPost

require('../../src/global');
const Promise = require('bluebird');
process.env.AWS_PROFILE = '';
const lambda = require('libs/lambda');

console.log('testFlightPost start!');

const propertyId = '__mocha_test__';
const stage = 'dev';

const bodySetting = [{
  'status': 1,
  'appId': '0e7ea6b4',
  'appKey': '43b0b9582ad5eefa6804133ae555a035',
  'interval': '10',
  'flightId': 1,
  'iataCode': 'ICN',
  'isDeleted': 0,
  'airportName': 'Incheon International Airport'
}, {
  'status': 1,
  'appId': '0e7ea6b4',
  'appKey': '43b0b9582ad5eefa6804133ae555a035',
  'interval': '10',
  'flightId': 2,
  'iataCode': 'PUS',
  'isDeleted': 0,
  'airportName': 'Gimhae International Airport'
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
  console.log('testFlightPost finish!');
}).catch(err => {
    console.error(`Error : ${err.message}`);
});

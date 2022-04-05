// node tools/script/addData

require('app-module-path').addPath(__dirname + '/../../node_modules');
global._ = require('lodash');
const envJson = require('../../resources/env.json');
process.env.SERVERLESS_LOCAL = '';
process.env.LOG_LEVEL = 'debug';
process.env.REGION = _.get(envJson, ['code', 'region', envJson.region]);
process.env.GEM_SETTING_TABLE = `${envJson.stage}-gem-setting`;

const $ = require('shelljs');
if (_.size(process.argv) > 3) {
  console.info('Usage : yarn run db:add [profile]');
  $.exit(1);
}
const profile = process.argv[2];
process.env.AWS_PROFILE = profile ? profile : '';

require('app-module-path').addPath(__dirname + '/../../src');
require('../../src/global');

console.log(process.env.AWS_PROFILE);
console.log(process.env.REGION);
console.log(process.env.GEM_SETTING_TABLE);

const setting = require('models/setting');
const propertyId = 'test_property_id';

async function addData() {
  const data = [
    {
      service: 'WEATHER',
      data: {
        radarGeoWidth: 100,
        satelliteGeoWidth: 1500,
        latitude: 42.04661570394843,
        longitude: -87.83723831176758,
        useMetricDistance: false,
        useSatellite: false,
        useMetric: false
      }
    }
  ];
  for(const ele of data) {
    try {
      console.log(JSON.stringify(ele));
      await setting.add(propertyId, ele);
    } catch(e) {
      console.log('add error!');
      console.error(e);
    }
  }
}

async function asyncCall() {
  await addData();
  $.exit(0);
}

asyncCall();

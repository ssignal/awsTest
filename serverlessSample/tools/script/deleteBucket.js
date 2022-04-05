// node tools/script/deleteBucket [profile]

require('app-module-path').addPath(__dirname + '/../../node_modules');
global._ = require('lodash');
const envJson = require('../../resources/env.json');
process.env.SERVERLESS_LOCAL = '';
process.env.LOG_LEVEL = 'debug';
process.env.REGION = _.get(envJson, ['code', 'region', envJson.region]);
process.env.STAGE = _.get(envJson, 'stage');

const $ = require('shelljs');
if (_.size(process.argv) > 3) {
  console.info('Usage : yarn run create:domain [profile]');
  $.exit(1);
}
const profile = process.argv[2];
const callerIdentityString = profile ?
  $.exec(`aws sts get-caller-identity --profile ${profile}`, {silent: true}) :
  $.exec(`aws sts get-caller-identity`, {silent: true});
try {
  const callerIdentity = JSON.parse(callerIdentityString);
  process.env.STORAGE_BUCKET = `${envJson.region}-${envJson.stage}-${callerIdentity.Account}-gem-storage`;
} catch (e) {
  console.error('no prifile info');
  $.exit(1);
}
process.env.AWS_PROFILE = profile ? profile : '';

require('app-module-path').addPath(__dirname + '/../../src');
require('../../src/global');

console.log(process.env.AWS_PROFILE);
console.log(process.env.REGION);
console.log(process.env.STORAGE_BUCKET);

const s3 = require('libs/s3');

async function deleteBucket() {
  try {
    await s3.deleteBucket();
  } catch(e) {
    console.log('deleteBucket error!');
    console.error(e.message);
  }
}

async function asyncCall() {
  await deleteBucket();
  $.exit(0);
}

asyncCall();

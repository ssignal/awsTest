require('app-module-path').addPath(__dirname + '/../node_modules');
require('app-module-path').addPath(__dirname + '/../resources/testPayload');
require('app-module-path').addPath(__dirname + '/../src');
global._ = require('lodash');
const envJson = require('../resources/env.json');
process.env.LOG_LEVEL = 'test';
process.env.RTIS_URL = envJson.rtisUrl;
process.env.CLIENT_ID = envJson.clientId;
process.env.CLIENT_SECRET = envJson.clientSecret;
process.env.STAGE = envJson.stage;
process.env.REGIONCODE = envJson.region;
process.env.REGION = envJson.code.region[envJson.region];
process.env.SENDER_EMAIL = envJson.auth.email.sender;
process.env.VERIFY_EMAIL_TITLE = envJson.auth.email.title;
process.env.VERIFY_EMAIL_MESSAGE = envJson.auth.email.message;
process.env.VERIFY_EMAIL_LINK = envJson.auth.email.link;
process.env.CODE_MIN = envJson.auth.code.min;
process.env.CODE_MAX = envJson.auth.code.max;
process.env.TABLE_NAME = `${envJson.auth.db.tableName}-${envJson.stage}`;
process.env.COGNITO_USERPOOLID = envJson.auth.cognito.userPoolId;
process.env.COGNITO_CLIENTID = envJson.auth.cognito.clientId;

require('app-module-path').addPath(__dirname + '/../src');
require('global');

const stage = envJson.stage;
const chai = require('chai');
global.expect = chai.expect;
global.assert = chai.assert;

const expectThrowsAsync = async (method, errorMessage) => {
    let error = null;
    try {
        await method();
    } catch (err) {
        error = err;
    }
    expect(error).to.be.an('Error');
    if (errorMessage) {
        expect(error.message).to.equal(errorMessage);
    }
};

module.exports = {
    expect,
    chai,
    stage,
    expectThrowsAsync,
};

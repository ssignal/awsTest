// global functions
require('app-module-path').addPath(__dirname); // the path in 'require' chould start at root.
global._ = require('lodash');
global.stringify = (data) => JSON.stringify(data);
global.parse = (data) => JSON.parse(data);

// table name
global.STAGE = process.env.STAGE;
global.REGION = process.env.REGION;
global.REGIONCODE = process.env.REGIONCODE;
global.SENDER_EMAIL = process.env.SENDER_EMAIL;
global.VERIFY_EMAIL_TITLE = process.env.VERIFY_EMAIL_TITLE;
global.VERIFY_EMAIL_MESSAGE = process.env.VERIFY_EMAIL_MESSAGE;
global.VERIFY_EMAIL_LINK = process.env.VERIFY_EMAIL_LINK;

// const values
global.ERROR_CODE_BAD_REQUEST = 400;
global.ERROR_CODE_NOT_FOUND = 404;
global.ERROR_CODE_INTERNAL_ERROR = 500;
global.ERROR_CODE_UNAUTHORIZED = '1000';

// reply type
global.REPLYTYPE_HTTP = 0;
global.REPLYTYPE_LAMBDA = 1;

// code
global.CODE_MIN = process.env.CODE_MIN;
global.CODE_MAX = process.env.CODE_MAX;

// dynamoDB
global.CODE_TYPE_MOBILE = 'mobile';
global.CODE_TYPE_EMAIL = 'email';
global.TABLE_NAME = process.env.TABLE_NAME;

// cognito
global.COGNITO_USERPOOLID = process.env.COGNITO_USERPOOLID;
global.COGNITO_CLIENTID = process.env.COGNITO_CLIENTID;

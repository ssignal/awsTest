// global functions
require('app-module-path').addPath(__dirname); // the path in 'require' chould start at root.
global._ = require('lodash');
global.stringify = (data) => JSON.stringify(data);
global.parse = (data) => JSON.parse(data);

// table name
global.STAGE = process.env.STAGE;
global.REGION = process.env.REGION;
global.REGIONCODE = process.env.REGIONCODE;

// const values
global.ERROR_CODE_BAD_REQUEST = 400;
global.ERROR_CODE_NOT_FOUND = 404;
global.ERROR_CODE_INTERNAL_ERROR = 500;
global.ERROR_CODE_UNAUTHORIZED = '1000';

// reply type
global.REPLYTYPE_HTTP = 0;
global.REPLYTYPE_LAMBDA = 1;

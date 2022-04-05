require('../global.js');
const { jsonSuccess, jsonError } = require('libs/jsonResponse');

module.exports.getMobilyInfo = async (event) => {
  let ret = event;
  console.log('[handlers] getMobilityInfo: ', ret);
  if (ret.body) return jsonSuccess(ret);
  else return jsonError(ERROR_CODE_BAD_REQUEST, ret);

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};

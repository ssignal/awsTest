require('../global.js');
const headers = { 'Content-Type': 'application/json;charset=UTF-8' };
let replyType = REPLYTYPE_LAMBDA;

function replyFormat(ret) {
  if (replyType == REPLYTYPE_LAMBDA) {
    return ret;
  } else {
    return {
      statusCode: 200,
      headers,
      body: stringify(ret),
    };
  }
}

module.exports.setReplyType = (type) => {
  replyType = type;
};

module.exports.jsonSuccess = (result = undefined) => {
  let codeStr = '0000';
  let message = 'Success';

  console.log('[libs.jsonSuccess] result: ', stringify(result));
  return replyFormat({
    status: {
      code: codeStr,
      message: message,
    },
    result: result,
  });
};

module.exports.jsonError = (codeIn, resultIn) => {
  let code;
  let codeStr;
  let message;
  let result = undefined;

  if (resultIn) console.log('[libs.jsonError] resultIn:', resultIn);
  // set code and result if needed.
  if (typeof codeIn === 'number') {
    console.log('[libs.jsonError] codeIn: ', codeIn);
    code = codeIn;
    if (resultIn) {
      result = resultIn.message || resultIn.code || resultIn;
    }
  } else {
    if (typeof codeIn === 'object' && codeIn.status) {
      console.log('[libs.jsonError] codeIn: ', stringify(codeIn));
      return replyFormat(codeIn);
    } else if (typeof codeIn === 'object' && codeIn.code && codeIn.message) {
      console.log('[libs.jsonError] codeIn: ', stringify(codeIn));
      code = codeIn.code;
      result = codeIn.message;
    } else {
      code = ERROR_CODE_INTERNAL_ERROR;
      result = codeIn.message || codeIn.code || codeIn;
    }
  }

  // set codeStr and message according code.
  switch (code) {
    case ERROR_CODE_BAD_REQUEST:
      message = 'Bad Request Error';
      codeStr = '0110';
      break;
    case ERROR_CODE_NOT_FOUND:
      message = 'Not Found';
      codeStr = '0140';
      break;
    case ERROR_CODE_INTERNAL_ERROR:
    default:
      message = 'Internal Server Error';
      codeStr = '0150';
      break;
  }

  return replyFormat({
    status: {
      code: codeStr,
      message: message,
    },
    result,
  });
};

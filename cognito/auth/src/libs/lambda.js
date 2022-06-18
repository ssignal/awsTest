let aws = require('aws-sdk');
// const uuidBase62 = require('uuid-base62');
if (process.env.aws_PROFILE && process.env.aws_PROFILE !== '') {
    let credentials = new aws.SharedIniFileCredentials({
        profile: process.env.aws_PROFILE,
    });
    aws.config.credentials = credentials;
}
const lambda = new aws.Lambda({
    region: process.env.REGION || 'ap-northeast-2',
});

/* lambda library version 2.1.0 */

const apiRequest = async (functionName, payload) => {
    // const {headers, path, query, body} = data;
    // const payload = {
    //     // 'routeKey': method + ' ' + uri,
    //     // 'headers': headers,
    //     // 'pathParameters': path,
    //     // 'queryStringParameters': query,
    //     // 'body': JSON.stringify(body),
    //     // 'x-message-id': uuidBase62.v4(),
    //     // 'skipAuth': true
    // };
    const params = {
        FunctionName: functionName,
        InvocationType: 'RequestResponse',
        Payload: JSON.stringify(payload),
    };
    try {
        console.log(
            '[lib.lambda.apiRequest] params - %s',
            JSON.stringify(jsonPayload(params))
        );
        const ret = await lambda.invoke(params).promise();
        console.log('[lib.lambda.apiRequest] ret - %s', JSON.stringify(ret));
        return ret;
    } catch (e) {
        console.error('[lib.lambda.apiRequest] error: ', e);
        throw e;
    }
};

const asyncInvoke = async (functionName, payload) => {
    // const {resources} = data;
    // const payload = {
    //     resources,
    // 'skipAuth': true
    // };
    const params = {
        FunctionName: functionName,
        InvocationType: 'Event', // for async call
        Payload: JSON.stringify(payload),
    };
    try {
        console.log('[lib.lambda.asyncInvoke] params: ', stringify(params));
        const ret = await lambda.invoke(params).promise();
        console.log('[lib.lambda.asyncInvoke] ret: ', stringify(ret));
        return ret;
    } catch (e) {
        console.error('[lib.lambda.asyncInvoke] error: ', e);
        throw e;
    }
};

const jsonPayload = (params) => {
    let payload;
    try {
        payload = JSON.parse(_.get(params, 'Payload', '{}'));
    } catch (e) {
        payload = {};
    }
    const ret = _.cloneDeep(params);
    _.set(ret, 'Payload', payload);
    return ret;
};

// const parsePayload = (functionName, ret, method, uri) => {
//   let payload;
//   try {
//     payload = JSON.parse(_.get(ret, 'Payload', '{}'));
//   } catch (e) {
//     payload = {};
//   }
//   const statusCode =
//     _.get(payload, 'statusCode') | _.get(ret, 'StatusCode', 200);
//   const body = JSON.parse(_.get(payload, 'body', '{}'));
//   return {
//     lambda: functionName,
//     method,
//     uri,
//     statusCode,
//     body,
//   };
// };

module.exports = {
    apiRequest,
    asyncInvoke,
};

// Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const lambda = require('libs/lambda');

async function sendSMS(param) {
    const { StatusCode, Payload } = await lambda.apiRequest(
        `redcap-mobility-service-message-${STAGE}-sendSMS`,
        param
    );
    if (StatusCode != 200) throw 'Fail to call PMS Service.';
    let payload = JSON.parse(Payload);
    if (!payload.status) throw 'Error!! Sending SMS error!';
    // if(payload.status.code != "0000") throw (payload.result)? payload.result: payload.status.message;
    const code = _.get(payload, 'status.code');
    if (code != '0000') {
        payload.result =
            _.get(payload, 'result.error.message') || payload.result;
        throw payload;
    }

    return payload.result || null;
}

module.exports = {
    sendSMS,
};

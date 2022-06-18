// Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

let aws = require('aws-sdk');
let ses = new aws.SES({ region: 'ap-northeast-2' });
// let ses = new aws.SES({ region: 'us-west-2' });

const sendEmail = async ({ address, title, message }) => {
    let params = {
        Destination: {
            ToAddresses: [address],
        },
        Message: {
            Body: {
                Text: { Data: message },
            },
            Subject: { Data: title },
        },
        Source: SENDER_EMAIL,
    };

    const ret = await ses.sendEmail(params).promise();
    const id = _.get(ret, 'ResponseMetadata.RequestId');
    return id || ret;
};

module.exports = {
    sendEmail,
};

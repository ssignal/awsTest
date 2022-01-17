const AWS = require('aws-sdk');
if (process.env.AWS_PROFILE && process.env.AWS_PROFILE !== '') {
  let credentials = new AWS.SharedIniFileCredentials({
    profile: process.env.AWS_PROFILE,
  });
  AWS.config.credentials = credentials;
}

module.exports = AWS;

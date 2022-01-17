const AWS = require('aws-sdk');
// const AWS = require('./awsInit');

let cloudWatchLog = new AWS.CloudWatchLogs({
  region: process.env.REGION || 'ap-northeast-2',
});

function getStartEndTime(duration) {
  let [num, timeKeyward] = duration.split(/(\d)/);
  let currentTime = new Date();
  const startTime = currentTime.getTime();
  num = parseInt(num);
  switch (timeKeyward) {
    case 'm':
      currentTime.setMinutes(currentTime.getMinutes() + num);
      break;
    case 'h':
      currentTime.setHours(currentTime.getHours() + num);
      break;
    case 'd':
      currentTime.setDate(currentTime.getDate() + num);
      break;
    case 's':
      currentTime.setSeconds(currentTime.getSeconds() + num);
      break;
  }

  return { startTime, endTime: currentTime.getTime() };
}

//
async function getLogEvents(obj) {
  const { logGroupName, logStreamName, duration } = obj;
  const { startTime, endTime } = getStartEndTime(duration);
  let result = [];
  let nextToken = undefined;
  const param = {
    limit: 100,
    logGroupName,
    logStreamName,
    nextToken,
    // startTime,
    // endTime,
    // startFromHead: boolean,
  };

  // do {
  const ret = await new Promise((resolve, reject) => {
    cloudWatchLog.getLogEvents(param, function (err, data) {
      if (err) return reject(err);
      return data;
    });
  });
  console.log(ret);
  // result = [...result, ...ret.map((e) => e.message)];
  // if (ret.nextForwardToken === nextToken) break;
  // nextToken = ret.nextForwardToken;
  // } while (true);
}

async function getFilterLogEvents(obj) {
  const {
    filterPattern = '',
    limit = 1000,
    logGroupName,
    // logStreamName,
    // duration,
  } = obj;
  // const { startTime, endTime } = getStartEndTime(duration);
  let result = [];
  let nextToken = undefined;
  let params = {
    logGroupName,
    filterPattern,
    // interleaved: true || false,
    limit,
    // logStreamNamePrefix: 'STRING_VALUE',
    // logStreamNames: [
    //   'STRING_VALUE',
    //   [> more items <]
    // ],
    nextToken,
    // startTime: 'NUMBER_VALUE',
    // endTime,
  };

  do {
    let ret = await new Promise((resolve, reject) => {
      cloudWatchLog.filterLogEvents(params, function (err, data) {
        if (err) return reject(err);
        return resolve(data);
      });
    });
    console.log(ret);
    ret = ret.events.reduce((a, e) => {
      return { timestamp: e.timestamp, message: e.message };
    }, []);
    result = [...result, ...ret];
    if (ret.nextForwardToken === nextToken) break;
    nextToken = ret.nextForwardToken;
  } while (true);

  return result;
}

// function getLogGroups(freFix) {
//   let result = [];
//   let nextToken = undefined;
//   const param = {
//     limit: 100,
//   };
//
//   do {
//     let ret = cloudWatchLog.getLogGroups(param);
//     result = [...result, ...ret.map((e) => e.message)];
//     if (ret.nextForwardToken === nextToken) break;
//     nextToken = ret.nextForwardToken;
//   } while (true);
// }
//
module.exports = {
  getLogEvents,
  getFilterLogEvents,
  // getLogGroups,
};

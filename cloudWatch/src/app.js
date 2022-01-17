const cloudWatch = require('./libs/awsCloudWatch');
const cloudWatchLog = require('./libs/awsCloudWatchLog');

// const libs = require('lib.testNode');
// const lambda = new AWS.Lambda({
//   region: process.env.REGION || 'ap-northeast-2',
// });

async function main() {
  const argv = process.argv;
  const cmd = argv[2];
  console.log('cmd: ', cmd);
  let ret;
  const currentTime = new Date();
  console.log(currentTime.getTime());

  switch (cmd) {
    default:
      console.log('1  getDashBoardList');
      console.log('2  getDashBoard');
      console.log('3  getFilterLogEvents');
      console.log('4  getLogEvents');
      break;
    case '1':
      await cloudWatch.getDashBoardList();
      break;
    case '2': {
      const boardName = argv[3] || 'lambdaAll';
      await cloudWatch.getDashBoard(boardName);
      break;
    }
    case '3':
      // return logs in the only one logstream
      ret = await cloudWatchLog.getFilterLogEvents({
        logGroupName: '/aws/lambda/esm-dev-handleEvents',
        // logGroupName: '/aws/lambda/esm-dev-handleApi',
        filterPattern: 'REPORT',
        // logStreamName: '2021/09/28/[$LATEST]b8eb8bcb218c4b4f80df95499f283d7c',
        limit: 10,
        // duration: '10d',
      });
      ret = ret.filter((e) => e.indexOf('REPORT') === 0);
      console.log(ret);
      break;

    case '4':
      // await cloudWatchLog.getLogEvents({
      //   logGroupName: '/aws/lambda/pcn-room-control-service-dev-getGroup',
      //   logStreamName: '2021/09/28/[$LATEST]b8eb8bcb218c4b4f80df95499f283d7c',
      //   duration: '10d',
      // });
      break;
  } // switch
}

main();

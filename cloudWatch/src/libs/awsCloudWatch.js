const AWS = require('./awsInit');

const cloudwatch = new AWS.CloudWatch({
  region: process.env.REGION || 'ap-northeast-2',
});

function getDashBoardList() {
  let params = {
    // DashboardNamePrefix: 'STRING_VALUE',
    NextToken: null,
  };
  cloudwatch.listDashboards(params, function (err, data) {
    if (err) console.log(err, err.stack);
    // an error occurred
    else console.log(data); // successful response
  });
}

function getDashBoard(name) {
  let params = {
    DashboardName: name /* required */,
  };
  cloudwatch.getDashboard(params, function (err, data) {
    if (err) console.log(err, err.stack);
    // an error occurred
    else console.log(data); // successful response
  });
}

module.exports = {
  getDashBoardList,
  getDashBoard,
};

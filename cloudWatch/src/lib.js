const { exec } = require('child_process');
const path = require('path');
const { lookpath } = require('lookpath');

async function arrangeJS(fileName) {
  if (await lookpath('jq'))
    await doExec(
      `jq '.' ${fileName} > ./tmp; cat ./tmp > ${fileName}; rm ./tmp`
    );
}

function getSLSCommand(functionName, payloadName) {
  let command = `serverless invoke local --function ${functionName}`;
  const payload = payloadName || functionName;
  command += ` --path ${FILEPATH_PAYLOAD}${payload}${FILE_EXT}`;
  console.log('[SLS command]', command);
  return command;
}

async function writeToFile(fileName, obj) {
  let fs = require('fs');
  console.log(`${fileName} will be created`);

  const dir = path.dirname(fileName);
  if (dir && !fs.existsSync(fileName)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  await fs.writeFileSync(
    `${fileName}`,
    JSON.stringify(obj),
    'utf8',
    function (err) {
      if (err) return console.log(err);
      console.log(`${fileName} is saved`);
    }
  );

  await arrangeJS(fileName);
}

async function setPayload(cmd, obj) {
  const fileName = cmd + FILE_EXT;
  // await fs.writeFile(`./resource/serverless/${fileName}`, JSON.stringify(obj));
  console.log('[setPayload]', obj);
  await writeToFile(`${FILEPATH_PAYLOAD}${fileName}`, obj);
}

async function getResult(str, fileName = FILENAME_OUTPUT) {
  console.log('=[getResult]====================');
  console.log(str);
  if (!str) {
    console.log('there is no result string');
    return null;
  }

  const strParsing = str;
  console.log(strParsing);
  let match1 = strParsing.lastIndexOf('\n{\n');
  let match2 = strParsing.lastIndexOf('\n}\n');
  if (match1 && match2) {
    const jsonStr = strParsing.slice(match1, match2 + 2);
    console.log('[getResult]>>>>>>>>>>', jsonStr, '<<<<<<<<<<<');
    const ret = JSON.parse(jsonStr);
    if (!ret.status || ret.status.code !== '0000') throw ret;
    // console.log('[getResult] ===================', ret);
    if (fileName) await writeToFile(`${FILEPATH_OUTPUT}${fileName}`, ret);
    return ret;
  }
}

async function doExec(cmd) {
  return new Promise((resolve, reject) => {
    return exec(cmd, (error, data, stdErr) => {
      if (error) {
        console.log('error', error.message);
        return;
      }
      if (stdErr) {
        console.log('error', stdErr);
        return reject(stdErr);
      }
      console.log('data', data);

      return resolve(data);
    });
  });
}

async function doInvoke(cmd, payloadFile) {
  return doExec(getSLSCommand(cmd, payloadFile));
}

async function doInvokeNextToken(cmd, payload) {
  let next_token;
  let items = [];
  let ret;
  do {
    payload.next_token = next_token;
    await setPayload(TMP_PAYLOAD_FILE, payload);
    ret = await getResult(await doInvoke(cmd, TMP_PAYLOAD_FILE));
    if (_.get(ret, 'status.code') !== '0000') break;
    next_token = _.get(ret, 'result.next_token');
    items = [...items, ...(_.get(ret, 'result.Items') || _.get(ret, 'result'))];
  } while (next_token);

  if (_.get(ret, 'status.code') === '0000') {
    ret.result = items;
    return ret;
  } else {
    return ret;
  }
}

async function doTest(cmd, payload) {
  let ret = await doExec(getSLSCommand(cmd, payload));
  if (!ret) throw 'There is no result';
  ret = await getResult(ret, cmd);
  return ret.result;
}

async function sleep(delay) {
  console.log('--- sleep');
  let timerId = setInterval(() => process.stdout.write('>'), 500);
  return new Promise((r) =>
    setTimeout(() => {
      clearInterval(timerId);
      console.log('\n');
      r();
    }, delay * 100)
  );
}

module.exports = {
  sleep,
  setPayload,
  doInvoke,
  doInvokeNextToken,
  doTest,
  doExec,
  getResult,
};

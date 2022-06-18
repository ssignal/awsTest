const sms = require('libs/sms');
const authDb = require('libs/authDb');

async function sendCodeToMobile(phone) {
    let code = Math.floor(Math.random() * (CODE_MAX - CODE_MIN) + CODE_MIN);
    code = code.toString().padStart(4, '0');
    const payload = {
        targets: [
            {
                phone,
                mergeData: {
                    CODE: code,
                },
            },
        ],
        message: '[Redcap Mobility] 인증번호[#{CODE}]를 입력해주세요.',
    };
    const ret = await sms.sendSMS(payload);
    console.log('[handlers.sendVerifyCode] ret: ', stringify(ret));

    return code;
}

async function verifyUser(obj) {
    const { userId, code, token } = obj;
    const item = await authDb.getUserItem(userId, CODE_TYPE_MOBILE);
    const { createAt } = item;
    const current = new Date();
    const itemTime = new Date(createAt);

    if (current - itemTime > 30000)
        throw { code: ERROR_CODE_BAD_REQUEST, message: 'token is timeout' };

    if (code) {
        const { code: codeInDB } = item;
        if (code !== codeInDB)
            throw {
                code: ERROR_CODE_BAD_REQUEST,
                message: `code is not valid: ${code}`,
            };
    } else if (token) {
        const { cognitoTokens } = item;
        if (cognitoTokens.accessToken !== token)
            throw {
                code: ERROR_CODE_BAD_REQUEST,
                message: 'Error! accessToken is not correct',
            };
    } else {
        throw { code: ERROR_CODE_BAD_REQUEST, message: 'User is not valid' };
    }

    return true;
}

module.exports = {
    sendCodeToMobile,
    verifyUser,
};

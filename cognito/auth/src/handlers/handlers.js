require('../global.js');
const { jsonSuccess, jsonError } = require('libs/jsonResponse');
const schemaHelper = require('_helper/schema.helper');
const schemaValidate = require('libs/schema');
const ses = require('libs/ses');
const cognito = require('libs/cognito');
const authDb = require('libs/authDb');
const verifyCode = require('libs/verifyCode');

module.exports.sendVerifyEmail = async (event) => {
    try {
        let payload = schemaValidate(event, schemaHelper.sendVerifyEmail);
        console.log('[handlers.sendVerifyEmail]: ', event);
        // Create code and store into DB
        // 		user id | code | create time
        let message = `${VERIFY_EMAIL_MESSAGE}\nemail: ${payload.email}\nlink: ${VERIFY_EMAIL_LINK}`;
        payload = {
            ...payload,
            address: payload.email,
            title: VERIFY_EMAIL_TITLE,
            message,
        };
        const ret = await ses.sendEmail(payload);
        console.log('[handlers.sendVerifyEmail]: ', ret);
        if (ret) return jsonSuccess();
        else return jsonError(ERROR_CODE_BAD_REQUEST, ret);
    } catch (err) {
        console.log('[handlers.sendVerifyEmail]: ', err.toString());
        return jsonError(ERROR_CODE_BAD_REQUEST, err.toString());
    }

    // Use this code if you don't use the http event with the LAMBDA-PROXY integration
    // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};

module.exports.sendVerifyCode = async (event) => {
    try {
        console.log('[handlers.sendVerifyCode] event: ', stringify(event));
        let payload = schemaValidate(event, schemaHelper.sendVerifyCode);
        const { userId, phone, password } = payload;
        cognito.logInNOut(userId, password);
        const code = await verifyCode.sendCodeToMobile(phone);
        await authDb.set({ userId, code });
        return jsonSuccess();
    } catch (err) {
        if (err.codeIn) return jsonError(err);
        else {
            const message = err.message || err;
            console.log('[sendVerifyCode] err: ', message);
            return jsonError(ERROR_CODE_INTERNAL_ERROR, message);
        }
    }

    // Use this code if you don't use the http event with the LAMBDA-PROXY integration
    // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};

module.exports.sendVerifyCodeReturnCode = async (event) => {
    try {
        console.log('[handlers.sendVerifyCode] event: ', stringify(event));
        let payload = schemaValidate(event, schemaHelper.sendVerifyCode);
        const { userId, phone, password } = payload;
        cognito.logInNOut(userId, password);
        const code = await verifyCode.sendCodeToMobile(phone);
        await authDb.set({ userId, code });
        return jsonSuccess(code);
    } catch (err) {
        if (err.codeIn) return jsonError(err);
        else {
            const message = err.message || err;
            console.log('[sendVerifyCode] err: ', message);
            return jsonError(ERROR_CODE_INTERNAL_ERROR, message);
        }
    }

    // Use this code if you don't use the http event with the LAMBDA-PROXY integration
    // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};

module.exports.setLogIn = async (event) => {
    try {
        console.log('[handlers.setLogIn] event: ', stringify(event));
        let payload = schemaValidate(event, schemaHelper.setLogIn);
        const { userId, password, code } = payload;
        // Create code and store into DB
        await verifyCode.verifyUser(payload);
        const tokens = await cognito.logIn(userId, password);
        console.log('here', 'cognito');
        const { accessToken } = await authDb.set({
            userId,
            code,
            cognitoTokens: tokens,
            verifyFlag: true,
        });
        return jsonSuccess({ accessToken });
    } catch (err) {
        if (err.codeIn) return jsonError(err);
        else {
            const message = err.message || err;
            console.log('[handlers.setLogIn] err: ', message);
            return jsonError(ERROR_CODE_INTERNAL_ERROR, message);
        }
    }
};

module.exports.refreshToken = async (event) => {
    try {
        console.log('[handlers.setRefresh] event: ', stringify(event));
        let payload = schemaValidate(event, schemaHelper.refreshToken);
        const { userId } = payload;
        // Create code and store into DB
        await verifyCode.verifyUser(payload);
        let { cognitoTokens } = await authDb.get(userId);
        let newTokens = await cognito.refreshToken(cognitoTokens.refreshToken);
        cognitoTokens = {
            ...cognitoTokens,
            idToken: newTokens.idToken,
            accessToken: newTokens.accessToken,
        };
        await authDb.update({ userId, cognitoTokens });
        return jsonSuccess({ accessToken: cognitoTokens.accessToken });
    } catch (err) {
        if (err.codeIn) return jsonError(err);
        else {
            const message = err.message || err;
            console.log('[handlers.setRefresh] err: ', message);
            return jsonError(ERROR_CODE_INTERNAL_ERROR, message);
        }
    }
};

module.exports.setLogout = async (event) => {
    try {
        console.log('[handlers.setLogout] event: ', stringify(event));
        let payload = schemaValidate(event, schemaHelper.setLogout);
        const { userId } = payload;
        // Create code and store into DB
        await verifyCode.verifyCode(payload);
        await authDb.remove(userId);
        return jsonSuccess();
    } catch (err) {
        if (err.codeIn) return jsonError(err);
        else {
            const message = err.message || err;
            console.log('[handlers.setLogout] err: ', message);
            return jsonError(ERROR_CODE_INTERNAL_ERROR, message);
        }
    }
};

// check verification of the user
// params:
// 		userId
module.exports.isVerified = async (event) => {
    try {
        console.log('[handlers.isVerified] event: ', stringify(event));
        let payload = schemaValidate(event, schemaHelper.isVerified);
        const { userId, code } = payload;
        await verifyCode.verifyCode({ userId, code });
        return jsonSuccess(true);
    } catch (err) {
        if (err.codeIn) return jsonError(err);
        else {
            const message = err.message || err;
            console.log('[sendVerifyCode] err: ', message);
            return jsonError(ERROR_CODE_INTERNAL_ERROR, message);
        }
    }
};

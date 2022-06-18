require('../global.js');
const Joi = require('joi');
// const { codeType } = require('common/constants');

const sendVerifyEmail = Joi.object({
    userId: Joi.string().required(),
    email: Joi.string().required(),
});

const sendVerifyCode = Joi.object({
    userId: Joi.string().required(),
    phone: Joi.string().required(),
    password: Joi.string().required(),
});

const setLogIn = Joi.object({
    userId: Joi.string().required(),
    code: Joi.string().required(),
    password: Joi.string().required(),
    // type: Joi.string()
    //     .valid(...Object.values(codeType))
    //     .default(codeType.mobile),
});

const refreshToken = Joi.object({
    userId: Joi.string().required(),
    token: Joi.string().required(),
});

const isVerified = Joi.object({
    userId: Joi.string().required(),
    // type: Joi.string()
    //     .valid(...Object.values(codeType))
    //     .default(codeType.mobile),
    code: Joi.string().required(),
});

module.exports = {
    sendVerifyEmail,
    sendVerifyCode,
    isVerified,
    setLogIn,
    refreshToken,
};

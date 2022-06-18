require('../../global.test');
const handlers = require('handlers/handlers');
const { sleep } = require('libs/utils');

// const {expect} = require('../../global.test.js');
const sinon = require('sinon');

const beforeTest = async () => {
    try {
    } catch (err) {}
};

const afterTest = async () => {
    try {
    } catch (err) {}
};

let accessToken = '';

describe('[Auth Test app]', function () {
    // let accessToken = null;
    this.timeout(500000);
    before(async () => {});
    beforeEach(async () => {
        await beforeTest();
    });
    afterEach(async () => {
        await afterTest();
        sinon.verifyAndRestore();
    });
    it(`[send verification email]`, async function () {
        let ret = await handlers.sendVerifyEmail({
            email: 'jonghwa84.park@lge.com',
            userId: 'asdfasdf',
        });
        console.log('[send verification email] ret: ', ret);
        expect(_.get(ret, 'status.code')).to.equal('0000');
    });
    it(`[send verification code]`, async function () {
        let ret = await handlers.sendVerifyCode({
            phone: '01086034192',
            // phone: '01031875165',
            userId: 'kiho.choi@lge.com',
            password: 'asdfqwer!@34',
        });
        console.log('[send verification code] ret: ', stringify(ret));
        expect(_.get(ret, 'status.code')).to.equal('0000');
    });
    it(`[set login]`, async function () {
        let ret = await handlers.setLogIn({
            userId: 'kiho.choi@lge.com',
            password: 'asdfqwer!@34',
            code: '4792',
        });
        console.log('[set login] ret: ', stringify(ret));
        expect(_.get(ret, 'status.code')).to.equal('0000');
    });
    it(`[send code and login]`, async function () {
        let ret = await handlers.sendVerifyCodeReturnCode({
            phone: '01086034192',
            userId: 'kiho.choi@lge.com',
            password: 'asdfqwer!@34',
        });
        const code = _.get(ret, 'result');
        ret = await handlers.setLogIn({
            userId: 'kiho.choi@lge.com',
            password: 'asdfqwer!@34',
            code,
        });
        accessToken = _.get(ret, 'result.accessToken');
        console.log('[send code and login] ret: ', stringify(ret));
        expect(_.get(ret, 'status.code')).to.equal('0000');
    });
    it(`[set refresh]`, async function () {
        await sleep(50);
        let ret = await handlers.refreshToken({
            userId: 'kiho.choi@lge.com',
            token: 'asdfaf',
        });
        console.log('[set refresh] ret: ', stringify(ret));
        expect(_.get(ret, 'status.code')).to.equal('0000');
    });
    it(`[set logout]`, async function () {
        let ret = await handlers.testLogin({
            userId: 'kiho.choi@lge.com',
            password: 'asdfqwer!@34',
            code: 'dummy',
        });
        console.log('[set test login] ret: ', stringify(ret));
        expect(_.get(ret, 'status.code')).to.equal('0000');
    });
});

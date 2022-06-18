const db = require('../libs/db');

async function update({ userId, cognitoTokens, verifyFlag }) {
    try {
        let item = await getUserItem(userId);
        const newItem = {
            ...item,
            cognitoTokens: cognitoTokens || item.cognitoTokens,
            verifyFlag: verifyFlag || item.verifyFlag,
            updatedAt: new Date().toISOString(),
        };
        await db.add(TABLE_NAME, newItem);
        return newItem;
    } catch (err) {
        console.log('[authDb.update] err: ', err.message);
        throw err;
    }
}

async function set({ userId, code, cognitoTokens, verifyFlag }) {
    try {
        const newItem = {
            type: CODE_TYPE_MOBILE,
            userId,
            code,
            cognitoTokens,
            updatedAt: new Date().toISOString(),
            verifyFlag: verifyFlag || false,
        };
        await db.add(TABLE_NAME, newItem);
        return cognitoTokens;
    } catch (err) {
        console.log('[authDb.setCodeInfo] err: ', err.message);
        throw err;
    }
}

async function remove({ userId }) {
    try {
        const newItem = {
            type: CODE_TYPE_MOBILE,
            userId,
        };
        await db.delete(TABLE_NAME, newItem);
        return true;
    } catch (err) {
        console.log('[authDb.remove] err: ', err.message);
        throw err;
    }
}

async function getUserItem(userId, type = CODE_TYPE_MOBILE) {
    const item = await db.getBy(TABLE_NAME, { userId, type });
    if (!item.length) throw `Error! There is no client info: ${userId}`;
    return item[0];
}

module.exports = {
    set,
    update,
    remove,
    get: getUserItem,
};

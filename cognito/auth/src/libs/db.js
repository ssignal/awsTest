'use strict';
require('../global.js');
const AWS = require('aws-sdk');

if (process.env.AWS_PROFILE && process.env.AWS_PROFILE !== '') {
    let credentials = new AWS.SharedIniFileCredentials({
        profile: process.env.AWS_PROFILE,
    });
    AWS.config.credentials = credentials;
}
const options = {
    region: process.env.REGION || 'ap-northeast-2',
};
if (process.env.SERVERLESS_LOCAL) {
    options.endpoint = process.env.DYNAMODB_LOCAL_ENDPOINT;
}

const dynamodb = new AWS.DynamoDB.DocumentClient(options);

const makeExpression = (
    Item,
    fromToUnit = {},
    initString = '',
    joinString = 'and',
    opString = '='
) => {
    if (_.size(Item) < 1) {
        return {};
    }
    let expression = initString;
    const ExpressionAttributeNames = {};
    const ExpressionAttributeValues = {};
    _.each(Item, (value, key) => {
        if (value !== undefined) {
            expression += ` #${key} ${opString} :${key} ${joinString} `;
            _.set(ExpressionAttributeNames, `#${key}`, key);
            _.set(ExpressionAttributeValues, `:${key}`, value);
        }
    });
    if (_.size(fromToUnit) > 0) {
        const { unit_db: unitDb, from, to } = fromToUnit;
        expression += ` #unit between :from and :to ${joinString} `;
        _.set(ExpressionAttributeNames, `#unit`, unitDb);
        _.set(ExpressionAttributeValues, `:from`, from);
        _.set(ExpressionAttributeValues, `:to`, to);
    }
    const reg = new RegExp(` ${joinString} $`);
    expression = expression.replace(reg, '');
    return { expression, ExpressionAttributeNames, ExpressionAttributeValues };
};

const makeQueryExpression = (Key, Item, fromToUnit = {}) => {
    const {
        expression: KeyConditionExpression,
        ExpressionAttributeValues: keyAttributeValues,
        ExpressionAttributeNames: keyAttributeNames,
    } = makeExpression(Key);
    const {
        expression: FilterExpression,
        ExpressionAttributeValues: filterAttributeValues,
        ExpressionAttributeNames: filterAttributeNames,
    } = makeExpression(Item, fromToUnit);
    return {
        KeyConditionExpression,
        FilterExpression,
        ExpressionAttributeNames: _.merge(
            keyAttributeNames,
            filterAttributeNames
        ),
        ExpressionAttributeValues: _.merge(
            keyAttributeValues,
            filterAttributeValues
        ),
    };
};

const changeNull = (Item) => {
    const ret = _.omitBy(Item, _.isUndefined);
    _.each(ret, (value, key) =>
        _.set(ret, key, _.isNull(value) ? 'null' : value)
    );
    return ret;
};

// add or update an element.
module.exports.add = async (TableName, Item) => {
    const params = {
        TableName,
        Item: changeNull(Item),
    };
    console.log('[libs.db.add] - %s', stringify(params));
    return await dynamodb.put(params).promise();
};

module.exports.getBy = async (TableName, Key, Item, fromToUnit) => {
    const params = makeQueryExpression(Key, changeNull(Item), fromToUnit);
    _.set(params, 'TableName', TableName);
    console.log('[libs.db.getBy] param for a DB request: ', stringify(params));
    let LastEvaluatedKey;
    let items = [];
    do {
        const ret = await dynamodb.query(params).promise();
        console.log('[libs.db.getBy] return value from DB: ', stringify(ret));
        const Items = _.get(ret, 'Items', []);
        items = [...items, ...Items];
        LastEvaluatedKey = _.get(ret, 'LastEvaluatedKey');
        params.ExclusiveStartKey = LastEvaluatedKey;
    } while (LastEvaluatedKey);
    return items;
};

module.exports.getListBy = async (obj) => {
    const { TableName, Key, Item } = obj;
    let { LastEvaluatedKey } = obj;
    let Items;
    let params = makeQueryExpression(Key, changeNull(Item));
    _.set(params, 'TableName', TableName);
    // retry if the result is empty with LastEvaluatedKey
    do {
        params.ExclusiveStartKey = LastEvaluatedKey;
        console.log(
            '[libs.db.getBy] param for a DB request: ',
            stringify(params)
        );
        const ret = await dynamodb.query(params).promise();
        console.log('[libs.db.getBy] return value from DB: ', stringify(ret));
        Items = _.get(ret, 'Items', []);
        LastEvaluatedKey = _.get(ret, 'LastEvaluatedKey', undefined);
    } while (LastEvaluatedKey && Items.length === 0);
    return {
        Items,
        LastEvaluatedKey,
    };
};

module.exports.delete = async (TableName, Key) => {
    const params = {
        TableName,
        Key,
        ReturnValues: 'ALL_OLD', // this param makes the dynamodb return the deleted item.
    };
    console.log('[db.delete] - %s', JSON.stringify(params));
    return await dynamodb.delete(params).promise();
};

// query example
//   const query =  {
//     TableName: TABLE_NAME_SERVICE,
//     KeyConditionExpression: "#property_id = :property_id",
//     // ProjectionExpression: "service_type",
//     FilterExpression: "(#type <> :oneClickType) and (#groupId = :groupId or #groupId = :defaultId)",
//     ExpressionAttributeNames: {
//       "#property_id": "property_id",
//       "#groupId": "group_id",
//       "#type": "service_type",
//     },
//     ExpressionAttributeValues: {
//       ":property_id": property_id,
//       ":groupId": group_id,
//       ":defaultId": DEFAULT_GROUP_ID,
//       ":oneClickType": REQUEST_TYPE_1CLICK,
//     }
//   }
module.exports.getListByQuery = async (query) => {
    let LastEvaluatedKey = undefined;
    let Items = undefined;
    // retry if the return is empty with LastEvaluatedKey
    do {
        console.log(
            '[libs.db.getByQuery] param for a DB request: ',
            stringify(query)
        );
        const ret = await dynamodb.query(query).promise();
        console.log(
            '[libs.db.getByQuery] return value from DB: ',
            stringify(ret)
        );
        Items = _.get(ret, 'Items', []);
        LastEvaluatedKey = _.get(ret, 'LastEvaluatedKey', undefined);
        query.ExclusiveStartKey = LastEvaluatedKey;
    } while (LastEvaluatedKey && Items.length === 0);
    return {
        Items,
        LastEvaluatedKey,
    };
};

module.exports.updateByQuery = async (query) => {
    console.log(
        '[libs.db.updateByQuery] param for a DB request: ',
        stringify(query)
    );
    const ret = await dynamodb.update(query).promise();
    console.log(
        '[libs.db.updateByQuery] return value from DB: ',
        stringify(ret)
    );
    return ret;
};

module.exports.getByQuery = async (query) => {
    let LastEvaluatedKey;
    let items = [];
    do {
        console.log(
            '[libs.db.getByQuery] param for a DB request: ',
            stringify(query)
        );
        const ret = await dynamodb.query(query).promise();
        console.log(
            '[libs.db.getByQuery] return value from DB: ',
            stringify(ret)
        );
        items = [...items, ..._.get(ret, 'Items')];
        LastEvaluatedKey = _.get(ret, 'LastEvaluatedKey');
        query.ExclusiveStartKey = LastEvaluatedKey;
    } while (LastEvaluatedKey);
    return items;
};

require('../global.js');
// const { jsonSuccess, jsonError } = require('libs/jsonResponse');
// const schemaHelper = require('../_helper/schema.helper');
// const schemaValidate = require('../libs/schema');
// const ses = require('../libs/ses');

module.exports.licenseCallback = async (event) => {
    try {
        console.log('[licenceCallback]: ', event);
        return event;
    } catch (err) {
        return {};
    }
};

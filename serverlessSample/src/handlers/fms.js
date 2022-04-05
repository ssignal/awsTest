'use strict';
const httpHelper = require("../_helper/http.helper");
const response = require("../_helper/response.helper");

module.exports.requestToken = async (event) => {
    const token = await requestFmsToken();
    return response(200, token);
};

module.exports.mobilitySearch = async (event) => {
    const headers = await generateFmsHeader();
    const { serviceName } = event.pathParameters || {};
    const { deviceStatus, operationStatus, sortingType, deviceType, manufacturer } = event.queryStringParameters || {};
    let url = process.env.FMS_ENDPOINT + `openapi/v1/search/${serviceName}?`;
    if (deviceStatus) {
        url += `&deviceStatus=${deviceStatus}`;
    }
    if (operationStatus) {
        url += `&operationStatus=${operationStatus}`;
    }
    if (sortingType) {
        url += `&sortingType=${sortingType}`;
    }
    if (deviceType) {
        url += `&deviceType=${deviceType}`;
    }
    if (manufacturer) {
        url += `&manufacturer=${manufacturer}`;
    }
    const res = await httpHelper.get({ url, headers });
    return response(200, resolveFmsResponse(res));
}

module.exports.mobilityInfo = async (event) => {
    const headers = await generateFmsHeader();
    const { deviceNumber } = event.pathParameters || {};
    const url = process.env.FMS_ENDPOINT + `openapi/v1/device/${deviceNumber}`;
    const res = await httpHelper.get({ url, headers });
    return response(200, resolveFmsResponse(res));
}

module.exports.mobilityReservation = async (event) => {
    const headers = await generateFmsHeader();
    const data = event.body || {};
    const url = process.env.FMS_ENDPOINT + `openapi/v1/booking`;
    const res = await httpHelper.post({ url, body: data, headers });
    return response(200, resolveFmsResponse(res));
}

module.exports.mobilityReserveStatus = async (event) => {
    const headers = await generateFmsHeader();
    const { bookingNumber } = event.pathParameters || {};
    const url = process.env.FMS_ENDPOINT + `openapi/v1/booking/${bookingNumber}`;
    const res = await httpHelper.get({ url, headers });
    return response(200, resolveFmsResponse(res));
}

module.exports.mobilityReserveCancel = async (event) => {
    const headers = await generateFmsHeader();
    const { bookingNumber } = event.pathParameters || {};
    const url = process.env.FMS_ENDPOINT + `openapi/v1/booking/${bookingNumber}`;
    const res = await httpHelper.delete({ url, headers });
    return response(200, resolveFmsResponse(res));
}

module.exports.mobilityActivate = async (event) => {
    const headers = await generateFmsHeader();
    const { deviceNumber } = event.pathParameters || {};
    const url = process.env.FMS_ENDPOINT + `openapi/v1/event/${deviceNumber}/activate`;
    const res = await httpHelper.post({ url, headers });
    return response(200, resolveFmsResponse(res));
}

module.exports.mobilityDeactive = async (event) => {
    const headers = await generateFmsHeader();
    const { deviceNumber } = event.pathParameters || {};
    const url = process.env.FMS_ENDPOINT + `openapi/v1/event/${deviceNumber}/deactivate`;
    const res = await httpHelper.post({ url, headers });
    return response(200, resolveFmsResponse(res));
}

module.exports.mobilityRegister = async (event) => {
    const headers = await generateFmsHeader();
    const data = event.body;
    const url = process.env.FMS_ENDPOINT + `openapi/v1/register`;
    const res = await httpHelper.post({ url, body: data, headers });
    return response(200, resolveFmsResponse(res));
}

module.exports.mobilityEventHistory = async (event) => {
    const headers = await generateFmsHeader();
    const { deviceNumber } = event.pathParameters || {};
    const url = process.env.FMS_ENDPOINT + `openapi/v1/event/${deviceNumber}`;
    const res = await httpHelper.get({ url, headers });
    return response(200, resolveFmsResponse(res));
}

module.exports.mobilityEventUpdate = async (event) => {
    const headers = await generateFmsHeader();
    const { deviceNumber, eventType } = event.pathParameters || {};
    const data = event.body;
    const url = process.env.FMS_ENDPOINT + `openapi/v1/event/${deviceNumber}/${eventType}`;
    const res = await httpHelper.post({ url, body: data, headers });
    return response(200, resolveFmsResponse(res));
}

module.exports.mobilityControl = async (event) => {
    const headers = await generateFmsHeader();
    const { deviceNumber } = event.pathParameters || {};
    const data = event.body;
    const url = process.env.FMS_ENDPOINT + `openapi/v1/control/${deviceNumber}`;
    const res = await httpHelper.post({ url, body: data, headers });
    return response(200, resolveFmsResponse(res));
}

module.exports.mobilityNotify = async (event) => {
    const headers = await generateFmsHeader();
    const { serviceName } = event.pathParameters || {};
    const data = event.body;
    const url = process.env.FMS_ENDPOINT + `openapi/v1/announce/${serviceName}`;
    const res = await httpHelper.post({ url, body: data, headers });
    return response(200, resolveFmsResponse(res));
}

module.exports.mobilitySetPolicy = async (event) => {
    const headers = await generateFmsHeader();
    const { serviceName } = event.pathParameters || {};
    const data = event.body;
    const url = process.env.FMS_ENDPOINT + `openapi/v1/service/${serviceName}/policy`;
    const res = await httpHelper.put({ url, body: data, headers });
    return response(200, resolveFmsResponse(res));
}

module.exports.mobilityGetPolicy = async (event) => {
    const headers = await generateFmsHeader();
    const { serviceName } = event.pathParameters || {};
    const url = process.env.FMS_ENDPOINT + `openapi/v1/service/${serviceName}/policy`;
    const res = await httpHelper.get({ url, headers });
    return response(200, resolveFmsResponse(res));
}

module.exports.mobilitySetNotification = async (event) => {
    const headers = await generateFmsHeader();
    const { serviceName } = event.pathParameters || {};
    const data = event.body;
    const url = process.env.FMS_ENDPOINT + `openapi/v1/service/${serviceName}/notification`;
    const res = await httpHelper.post({ url, body: data, headers });
    return response(200, resolveFmsResponse(res));
}

module.exports.mobilityGetNotification = async (event) => {
    const headers = await generateFmsHeader();
    const { serviceName } = event.pathParameters || {};
    const url = process.env.FMS_ENDPOINT + `openapi/v1/service/${serviceName}/notification`;
    const res = await httpHelper.get({ url, headers });
    return response(200, resolveFmsResponse(res));
}

module.exports.mobilityUpdateNotification = async (event) => {
    const headers = await generateFmsHeader();
    const { serviceName, uid } = event.pathParameters || {};
    const data = event.body;
    const url = process.env.FMS_ENDPOINT + `openapi/v1/service/${serviceName}/notification/${uid}`;
    const res = await httpHelper.put({ url, body: data, headers });
    return response(200, resolveFmsResponse(res));
}

module.exports.mobilityDeleteNotification = async (event) => {
    const headers = await generateFmsHeader();
    const { serviceName, uid } = event.pathParameters || {};
    const url = process.env.FMS_ENDPOINT + `openapi/v1/service/${serviceName}/notification/${uid}`;
    const res = await httpHelper.delete({ url, headers });
    return response(200, resolveFmsResponse(res));
}

module.exports.mobilityTripInfo = async (event) => {
    const headers = await generateFmsHeader();
    const { deviceNumber } = event.pathParameters || {};
    const url = process.env.FMS_ENDPOINT + `openapi/v1/device/${deviceNumber}/trip`;
    const res = await httpHelper.get({ url, headers });
    return response(200, resolveFmsResponse(res));
}

const requestFmsToken = async () => {
    const url = process.env.FMS_ENDPOINT + 'openapi/v1/user/requestAuthToken';
    const res = await httpHelper.post({
        url,
        body: {
            "userID": process.env.FMS_USERID,
            "accessKey": process.env.FMS_ACCESSKEY,
            "expTime": 300
        }
    });

    return res && res.data && res.data.token;
}

const generateFmsHeader = async () => {
    const token = await requestFmsToken();
    const headers = {
        'X-Auth-Token': token,
    };

    return headers;
}


const resolveFmsResponse = (res) => {
    if (res && res.status === 200) {
        return res && res.data && res.data.data;
    } else {
        return res && res.response && res.response.data;
    }
}
const axios = require('axios');

class HttpHelper {
    static async get({ url, headers = null }) {
        const res = await send({ url, method: 'GET', headers });

        return res;
    }

    static async post({ url, body = null, headers = null }) {
        const res = await send({ url, method: 'POST', headers, body });

        return res;
    }

    static async put({ url, body = null, headers = null }) {
        const res = await send({ url, method: 'PUT', headers, body });

        return res;
    }

    static async delete({ url, headers = null }) {
        const res = await send({ url, method: 'DELETE', headers });

        return res;
    }

    static async send({ url, method, headers, body }) {
        const res = await send({ url, method, headers, body });

        return res;
    }
}

module.exports = HttpHelper;

async function send({ url, method, headers = null, body = null }) {
    try {
        // process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
        const options = {
            url,
            method,
            headers,
            data: body,
        };
        const result = await axios(options);
        return result;
    } catch (error) {
        return error;
    }
}

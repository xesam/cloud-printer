const axios = require('axios');
const Signer = require('./Signer');
const qs = require('querystring');

class CloudClient {
    constructor() {
        this._service = axios.create();
    }

    getSigner() {
        return Signer;
    }

    request(url, payload, config, type = 'json') {
        if (type === 'json') {
            return this._service.request({
                url: url,
                data: payload,
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8'
                },
                ...config
            });
        } else {
            return this._service.request({
                url: url,
                params: payload,
                data: qs.stringify(payload),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                },
                ...config
            });
        }
    }
}

module.exports = CloudClient;


const {request} = require('@mini-dev/request');
const Signer = require('./Signer');

const qs = {
    stringify(data) {
        return Object.entries(data)
            .map(([key, value]) => {
                return key + '=' + value
            }).join('&');
    }
}

class Cloud {
    constructor() {
        this._service = request.create();
    }

    getSigner() {
        return Signer;
    }

    request(url, payload, config, type = "json") {
        if (type === 'json') {
            return this._service({
                url: url,
                params: payload,
                data: payload,
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8'
                },
                ...config
            });
        } else {
            return this._service({
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

module.exports = Cloud;


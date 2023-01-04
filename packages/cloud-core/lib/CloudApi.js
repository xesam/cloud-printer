const utils = require('./utils');

class CloudApi {
    constructor(auth, cloudClient) {
        this._auth = auth;
        this._cloudClient = cloudClient;
    }

    getEpochSecond() {
        return Math.floor(Date.now() / 1000);
    }

    cloudEntries(data) {
        return utils.cloudEntries(data);
    }
}

module.exports = CloudApi;

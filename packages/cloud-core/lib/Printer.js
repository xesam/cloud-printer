const utils = require('./utils');

class Printer {
    constructor(auth, cloud) {
        this._auth = auth;
        this._cloud = cloud;
    }

    nowSeconds() {
        return Math.floor(Date.now() / 1000);
    }

    cloudEntries(data) {
        return utils.cloudEntries(data);
    }
}

module.exports = Printer;
class Auth {
    constructor(id, secret) {
        this._id = id;
        this._secret = secret;
    }

    id() {
        return this._id;
    }

    secret() {
        return this._secret;
    }
}

module.exports = Auth;
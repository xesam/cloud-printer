const utils = require('./utils');

class Optional {
    constructor() {
        this._data = {};
    }

    _attr(name) {
        if (arguments.length === 2) {
            this._data[name] = arguments[1];
            return this;
        } else {
            return this._data[name];
        }
    }

    error() {
        return this._attr.call(this, 'error', ...arguments);
    }

    clone() {
        const _new = new this.constructor();
        _new._data = {...this._data};
        return _new;
    }

    entries() {
        return utils.cloudEntries(this._data);
    }
}

module.exports = Optional;
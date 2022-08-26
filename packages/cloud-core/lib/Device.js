const Optional = require('./Optional');

class Device extends Optional {
    constructor(props) {
        super(props);
    }

    sn() {
        return this._attr.call(this, 'sn', ...arguments);
    }

    key() {
        return this._attr.call(this, 'key', ...arguments);
    }

    name() {
        return this._attr.call(this, 'name', ...arguments);
    }

    cardno() {
        return this._attr.call(this, 'cardno', ...arguments);
    }

    voiceType() {
        return this._attr.call(this, 'voiceType', ...arguments);
    }

    volumeLevel() {
        return this._attr.call(this, 'volumeLevel', ...arguments);
    }
}

module.exports = Device;
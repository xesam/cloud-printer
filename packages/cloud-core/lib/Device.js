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

    autoCut() {
        return this._attr.call(this, 'autoCut', ...arguments);
    }

    online() {
        return this._attr.call(this, 'online', ...arguments);
    }

    status() {
        return this._attr.call(this, 'status', ...arguments);
    }

    voice() {
        return this._attr.call(this, 'voice', ...arguments);
    }

    volume() {
        return this._attr.call(this, 'volume', ...arguments);
    }
}

module.exports = Device;
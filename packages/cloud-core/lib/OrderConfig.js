const Optional = require('./Optional');

class OrderConfig extends Optional {
    constructor(props) {
        super(props);
    }

    copies() {
        return this._attr.call(this, 'copies', ...arguments);
    }

    date() {
        return this._attr.call(this, 'date', ...arguments);
    }
}

module.exports = OrderConfig;
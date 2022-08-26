const Optional = require('./Optional');

class Order extends Optional {
    constructor(props) {
        super(props);
    }

    id() {
        return this._attr.call(this, 'id', ...arguments);
    }

    content() {
        return this._attr.call(this, 'content', ...arguments);
    }

    expired() {
        return this._attr.call(this, 'expired', ...arguments);
    }

    copies() {
        return this._attr.call(this, 'copies', ...arguments);
    }
}

module.exports = Order;
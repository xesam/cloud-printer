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

    date() {
        return this._attr.call(this, 'date', ...arguments);
    }

    status() {
        return this._attr.call(this, 'status', ...arguments);
    }

    createTime() {
        return this._attr.call(this, 'createTime', ...arguments);
    }

    printTime() {
        return this._attr.call(this, 'printTime', ...arguments);
    }
}

module.exports = Order;
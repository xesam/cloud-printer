const crypto = require('crypto');

function SHA1(data) {
    return crypto.createHash('sha1')
        .update(data)
        .digest('hex');
}

function MD5(data) {
    return crypto.createHash('md5')
        .update(data)
        .digest('hex')
        .toUpperCase();
}

exports.SHA1 = SHA1;
exports.MD5 = MD5;
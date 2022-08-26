const CryptoJS = require('crypto-js');

function SHA1(data) {
    return CryptoJS.SHA1(data).toString();
}

function MD5(data) {
    return CryptoJS.MD5(data).toString().toUpperCase();
}

exports.SHA1 = SHA1;
exports.MD5 = MD5;
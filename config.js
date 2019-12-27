const path = require('path');
const Cryptr = require('cryptr');
const encryptKey = process.env.ENCRYPT_KEY || 'some super secret value';

exports.port = process.env.PORT || 3200;
exports.staticRoute = '/public'; // The URL portion
exports.staticPath = path.join(process.cwd(), 'public'); // The local path on disk
exports.cryptr = new Cryptr(encryptKey);
exports.isDev = process.env !== 'production';
exports.logFileName = path.join(process.cwd(), 'domain-check.log');

exports.appStaticPath = '/static'; // The URL portion
exports.appStaticSrc = path.join(process.cwd(), 'app/static'); // The local path on disk

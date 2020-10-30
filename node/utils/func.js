const crypto = require('crypto')
const NodeRSA = require('node-rsa');

// RSA解密
/*
//生成 公钥私钥
// const key = new NodeRSA({ b: 512 }); //生成位的密钥
// var publicDer = key.exportKey('pkcs1-public-pem'); //公钥
// var privateDer = key.exportKey('pkcs1-private-pem');//私钥
*/
function RSADecrypt(data) {
    const key = new NodeRSA(`-----BEGIN RSA PRIVATE KEY-----
    MIIBPAIBAAJBAPFJJ4ZG2IFZJOD05HlzNuB50ISHvnvEZVpWwRLYmOge50On5c+3
    UOYAhxHMfDzhGp5odiKZVI7eacQXdtbeQlkCAwEAAQJBAJ5w1jZzcRpHClN6HEmw
    IXn4I7fTV374cUGINFKGzqmk0uQEXyzkaqgHvFrpIQCmjVjdbMkE67sD0Ly0j66a
    nf0CIQD+UNZCyE789EOy5w0wQGlM6wV6X8EAmVgwqinMjZWVRwIhAPLiOf+tctX9
    rh8WGkISNP0DhzZ4u4tAi560/vShp7tfAiEAuaSIw3c1MbGdOZswJWjfdSaaeRos
    6SMHHX8ZxBgWeUECIAM4drZqMVyfCYEGBQEdRrCYLGHPhgUZrQBEvCC4SAYXAiEA
    kixih/hHzhPVCOQAhzlqXxOOFbHvTMhZvhnE0jS4VFc=
    -----END RSA PRIVATE KEY-----`)
    const decrypted = key.decrypt(data, 'utf8')
    return decrypted
}

// md5加密
function md5Encrypt(data) {
    return crypto.createHash('md5').update(data).digest("hex")
}
// AES解密
// module.exports.aesDecrypt = function aesDecrypt(encrypted) {
//     const key = '1111111111111111'
//     const iv = '2222222222222222'
//     const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
//     let decrypted = decipher.update(encrypted, 'hex', 'utf8');
//     decrypted += decipher.final('utf8');
//     return decrypted;
// }


module.exports = {
    RSADecrypt,
    md5Encrypt
}
const crypto = require('crypto').randomBytes(256).toString('hex');

module.exports = {
    uri: 'mongodb://zcampuzano:x6WFVn7C234Jm68U@ds127899.mlab.com:27899/catalyst',
    secret: crypto,
    db: 'catalyst'
};



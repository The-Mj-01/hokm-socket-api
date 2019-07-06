const jwt = require('jsonwebtoken');
const privateKey = 'privateKeydddd';

exports.sign = (data) => jwt.sign(data, privateKey);
exports.verify = (token) => {
    let data;
    try{
      data = jwt.verify(token, privateKey);
    }
    catch (e) {console.log(e)}
    if (data) return data
};


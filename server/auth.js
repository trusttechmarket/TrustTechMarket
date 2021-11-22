var mysql = require('mysql');
var db = require('./database.js');
var account = mysql.createConnection(db.accountDB);
var jwt = require('jsonwebtoken');


let auth = function(request, response, next) {
    
    
    let token = request.cookies.X_auth;
    
    jwt.verify(token, 'secretToken', function(err, decoded) {
        var sql = `SELECT * FROM user WHERE user_sn = ${decoded}`;
        account.query(sql, function(err, data) {
            if(err) throw err;
            if(data.length == 0) {
                return res.json({isAuth: false, error: true})
            }
            request.token = token;
            request.user = data[0];
            next();
        })
    });
}

module.exports = { auth };
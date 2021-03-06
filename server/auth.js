var mysql = require('mysql');
var db = require('./database.js');
var account = mysql.createConnection(db.accountDB);
var jwt = require('jsonwebtoken');
var auth_key = db.auth_key;


let auth = function(request, response, next) {
    
    let token = request.cookies.X_auth;
    
    if(token == undefined) {
        return response.json({data: "로그인하세요", isAuth: false, error: true})
    }
    
    jwt.verify(token, auth_key, function(err, decoded) {
        var sql = `SELECT * FROM user WHERE user_sn = ${decoded}`;
        account.query(sql, function(err, data) {
            if(err) {
                console.log("auth.js error\n", err)
                return response.json({data: "auth 에러", isAuth: false, error: true})
            }
            if(data.length == 0) {
                return res.json({data: "로그인하세요", isAuth: false, error: true})
            }
            request.token = token;
            request.user = data[0];
            next();
        })
    });
}

module.exports = { auth };
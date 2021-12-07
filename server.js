var fs = require('fs');
var path = require('path');
var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var ejs = require('ejs');
var cjs = require('cjs');
var http = require('http');
var db = require('./database.js');
var bcrypt = require('bcrypt');
var board = mysql.createConnection(db.boardDB);
var account = mysql.createConnection(db.accountDB);
var jwt = require('jsonwebtoken');
var { auth } = require('./auth.js');


var saltRounds = 10;


var app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended : true})); //application/x-www-form-urlencoded
app.use(bodyParser.json());  //application/json
app.use(cookieParser());

app.get('/board/:id', function(request, response) {
    var boardID = Number(request.param('id'));
    var sql = `SELECT * FROM board WHERE Post_SN = ${boardID}`;
    board.query(sql, function(err, data) {
        if(err) console.log("query error \n" + err);
        else {
            response.send(`<h1>${data[0].title}</h1>`);
        }
    });
});

app.post('/register', function(request, response) {
    var userID = request.body.user_id;
    var userPW = request.body.user_pw;
    var userEmail = request.body.user_email;
    var userRegion = request.body.user_region;
    var sql = `SELECT * FROM user WHERE user_id = "${userID}"`;
    var userHashPW;
    console.log("id: " + userID);
    
    
    bcrypt.hash(userPW, saltRounds, function(err, hash) {
        if(err) console.log("encrypt error \n" + err);
        
        account.query(sql, function(err, data){
            if(err) console.log("register error \n" + err);
            if(data.length == 0) {
                account.query('INSERT INTO user(user_id, user_pw, user_email, user_region) values(?,?,?,?)',[userID, hash, userEmail, userRegion]);
                response.status(200).send('<srcript>alert("회원가입 성공");</script>'); 
                request.redirect('/');
            }
            else {
                response.status(400).send('<srcript>alert("회원가입 실패");</script>');
                response.redirect('/login');
            }
        });
    });
});

app.post('/login', function(request, response) {
    var userID = request.body.user_id;
    var userPW = request.body.user_pw;
    var sql = `SELECT * FROM user WHERE user_id = "${userID}"`;
    
    account.query(sql, function(err, data) {
        if(err) console.log("login error \n" + err);
        if(data.length == 0) {
            response.status(400).send('<srcript>alert("로그인 실패");</script>');
            response.redirect('/');
        }
        else {
            bcrypt.compare(userPW, data[0].user_pw, function(err, result) {
                if(err) console.log("password error \n" + err);
                if(!result) {
                    response.status(400).send('<srcript>alert("로그인 실패");</script>');
                    response.redirect('/login');
                }
                else {
                    var token = jwt.sign(data[0].user_sn, 'secretToken')
                    account.query(`UPDATE user SET token=(?) WHERE user_id = "${userID}"`, [token], function(err, data) {
                        if(err) console.log("login error2 \n" + err);
                        else {
                            var expiryDate = new Date( Date.now() + 60 * 60 * 1000 * 24);
                            response.cookie("X_auth", token, {expires: expiryDate});
                            response.status(200).send('<srcript>alert("로그인 성공");</script>');
                        }
                    });                 
                }
            });
        }
    });
});

app.get('/auth', auth, function(request, response) {
    
    response.status(200).json({
        user_sn: request.user.user_sn,
        user_id: request.user.user_id,
        isAuth: true,
        error: false
    });
});

app.get('/logout', auth, function(request, response){
    account.query(`UPDATE user SET token='' WHERE user_sn = ${request.user.user_sn}`, function(err, data) {
        if(err) console.log("logout error \n" + err);
        else {
            response.clearCookie("X_auth");    //.redirect('/');
            response.status(200).send('<srcript>alert("로그아웃");</script>');
        } 
    });
    
})

app.listen(7777, function() {
    console.log('Server Running');
});

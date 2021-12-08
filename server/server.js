var fs = require('fs');
var path = require('path');
var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var ejs = require('ejs');
var http = require('http');
var db = require('./database.js');
var bcrypt = require('bcrypt');
var board = mysql.createConnection(db.boardDB);
var account = mysql.createConnection(db.accountDB);
var jwt = require('jsonwebtoken');
var { auth } = require('./auth.js');
var auth_key = db.auth_key;
const socket = require('socket.io')
var saltRounds = 10;




var app = express();
var server = http.createServer(app);
const io = socket(server);

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended : true})); //application/x-www-form-urlencoded
app.use(bodyParser.json());  //application/json
app.use(cookieParser());


app.get('/api/hello', function(request, response) {
    response.send("안녕하세요!"); //axios
})

app.get('/api/board/:id', auth, function(request, response) {
    var boardID = Number(request.params.id);
    var sql = `SELECT * FROM board WHERE post_sn = ${boardID}`;
    board.query(sql, function(err, data) {
        if(err) console.log("query error \n" + err);
        else {
            var boardJson = {
                'boardID': data[0].post_sn,
                'writer': data[0].writer_id,
                'region': data[0].writer_region,
                'title': data[0].title,
                'contents': data[0].description,
                'picture': data[0].picture_url,
                'price': data[0].price,
            };
            response.send(boardJson);
        }
    });
});

app.post('/api/board/write', auth, function(request, response) {
    var writeJson = request.body;
    var datas = [writeJson.writer, writeJson.region, writeJson.title, writeJson.contents, writeJson.picture, writeJson.price, 0];
    var sql = 'INSERT INTO board(writer_id, writer_region, title, description, picture_url, price, del) values(?,?,?,?,?,?,?)';
    board.query(sql, datas, function(err, data) {
        if(err) {
            console.log("write error\n" + err);
            response.status(400).send('<srcript>alert("글쓰기 실패");</script>');
        }
        else {
            response.status(200).send('<srcript>alert("글쓰기 성공");</script>')
        }
    });
    
});

app.get('/api/board/edit/:id', auth, function(request, response) {
    var boardID = Number(request.params.id);
    var sql = `SELECT * FROM board WHERE post_sn = ${boardID}`;
    board.query(sql, function(err, data) {
        if(err) console.log("query error \n" + err);
        else {
            var boardJson = {
                'boardID': data[0].post_sn,
                'writer': data[0].writer_id,
                'region': data[0].writer_region,
                'title': data[0].title,
                'contents': data[0].description,
                'picture': data[0].picture_url,
                'price': data[0].price,
            };
            response.send(boardJson);
        }
    });
});

app.post('/api/board/update/:id', auth, function(request, response) {
    var updateJson = request.body;
    var boardID = Number(request.params.id);
    var datas = [updateJson.title, updateJson.contents, updateJson.picture, updateJson.price, updateJson.region, boardID];
    var sql = 'UPDATE board SET title=(?), description=(?), picture_url=(?), price=(?), writer_region=(?) WHERE post_sn=(?)';
    board.query(sql, datas, function(err, data) {
        if(err) console.log("update error\n" + err);
        
    });
});

app.post('/api/register', function(request, response) {
    var userID = request.body.userID;
    var userPW = request.body.userPW;
    var userEmail = request.body.userEmail;
    var userRegion = request.body.userRegion;
    var sql = `SELECT * FROM user WHERE user_id = "${userID}"`;
    var userHashPW;
    
    bcrypt.hash(userPW, saltRounds, function(err, hash) {
        if(err) console.log("encrypt error \n" + err);
        
        account.query(sql, function(err, data){
            if(err) console.log("register error \n" + err);
            if(data[0].length == 0) {
                account.query('INSERT INTO user(user_id, user_pw, user_email, user_region, del) values(?,?,?,?,0)',[userID, hash, userEmail, userRegion]);
                response.status(200).json({register: true}); 
                //request.redirect('/');
            }
            else {
                response.status(400).send("회원가입 실패");
                //response.redirect('/login');
            }
        });
    });
    
    

    
});

app.post('/api/login', function(request, response) {
    var userID = request.body.userID;
    var userPW = request.body.userPW;
    var sql = `SELECT * FROM user WHERE user_id = "${userID}"`;
    
    account.query(sql, function(err, data) {
        if(err) console.log("login error \n" + err);
        if(data[0].length == 0) {
            response.status(400).send('<srcript>alert("로그인 실패");</script>');
            //response.redirect('/');
        }
        else {
            bcrypt.compare(userPW, data[0].user_pw, function(err, result) {
                if(err) console.log("bcrypt error \n" + err);
                if(!result) {
                    response.status(400).send('<srcript>alert("로그인 실패");</script>');
                    //response.redirect('/login');
                }
                else {
                    var token = jwt.sign(data[0].user_sn, auth_key);
                    userSn = data[0].user_sn
                    account.query(`UPDATE user SET token=(?) WHERE user_id = "${userID}"`, [token], function(err, data) {
                        if(err) console.log("login error2 \n" + err);
                        else {
                            var expiryDate = new Date( Date.now() + 60 * 60 * 1000 * 24);
                            response.cookie("X_auth", token, {expires: expiryDate})
                            .status(200)
                            .json({loginSuccess: true, userId: userSn});
                            //response.status(200).send("로그인 성공");
                        }
                    });
                    
                }
                
            });
        }
    });
});

app.get('/api/auth', auth, function(request, response) {
    
    response.status(200).json({
        user_sn: request.user.user_sn,
        user_id: request.user.user_id,
        isAdmin: false,
        isAuth: true,
        error: false
        /*
        role: request.user.role,
        isAdmin: request.user.isAdmin,
        
        */
    });
});

app.get('/api/logout', auth, function(request, response){
    account.query(`UPDATE user SET token='' WHERE user_sn = ${request.user.user_sn}`, function(err, data) {
        if(err) console.log("logout error \n" + err);
        else {
            response.clearCookie("X_auth").json({logout: true});    //.redirect('/');
            //response.status(200).send('<srcript>alert("로그아웃");</script>');
        } 
    });
})


server.listen(7777, function() {
    console.log('Server Running');
    //console.log('test');
});

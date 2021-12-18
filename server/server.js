var fs = require('fs');
var path = require('path');
var mysql = require('mysql');
var express = require('express');
// var session = require('express-session');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
// var ejs = require('ejs');
var http = require('http');
var db = require('./database.js');
var bcrypt = require('bcrypt');
var board = mysql.createConnection(db.boardDB);
var account = mysql.createConnection(db.accountDB);
// var comment = mysql.createConnection(db.commentDB);
// var note = mysql.createConnection(db.noteDB);
var jwt = require('jsonwebtoken');
var { auth } = require('./auth.js');
var auth_key = db.auth_key;
var saltRounds = 10;
const multer = require('multer');


var app = express();
const server = http.createServer(app);
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended : true})); //application/x-www-form-urlencoded
app.use(bodyParser.json());  //application/json
app.use(cookieParser());

app.get('/api/hello', function(request, response) {
    var userID = request.cookies.X_userID;
    response.send(userID + "님 환영합니다!"); //axios
});

// app.get('/api/board/:id', auth, function(request, response) {
app.get('/api/board/:id', function(request, response) {
    console.log(request.params.id)
    var boardID = Number(request.params.id);
    console.log(boardID);
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
                'picture1': data[0].picture1_url,
                'picture2': data[0].picture2_url,
                'picture3': data[0].picture3_url,
                'picture4': data[0].picture4_url,
                'picture5': data[0].picture5_url,
                'price': data[0].price,
            };
            response.send(boardJson);
            console.log(boardJson);
            console.log('전송완료')
        }
    });
});

app.get('/api/board', function(request, response) {
    console.log('request 수신' + request)
    var sqlQuery = 'SELECT * FROM board ORDER BY post_sn DESC';
    board.query(sqlQuery, function(err, data) {
        let imagefiles = [];
        // fs.readFileSync(`server/public/images/`)
        for (let i = 0; i <data.length ; i++) {
            console.log(data[i].picture1_url);
            a = `data[${i}].picture1_url`;
            console.log(a)
        }
        response.send(data);
    })
})

app.get('/api/getimage', function(request, response) {

})

app.post('/api/board/upload', (req, res) => {
    var d = Date.now();
    var storRoute = `server/public/images/${d}`;
    if(!fs.existsSync(storRoute)) {
        fs.mkdirSync(storRoute)
    }
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {   
            cb(null, storRoute)
        },
        filename: (req, file, cb) => {
            cb(null, file.originalname)
        }
    });
    const upload_all = multer({storage}).array('file');
    upload_all(req, res, (err) => {
        if(err) {
            console.log(err)
            return res.status(500).json(err)
        }
        var upload_thumb = multer({ dest: 'server/public/thumbnail', filename: d}).single('file');
        // upload_thumb(req.files[0]);
        return res.status(200).send(req.files)
    })
})

app.post('/api/board/write', function(request, response) {
    var writeJson = request.body;
    var datas = [writeJson.writer, writeJson.region, writeJson.title, writeJson.contents, writeJson.price, writeJson.picture1, writeJson.picture2, writeJson.picture3,writeJson.picture4, writeJson.picture5, 1];
    var sql = 'INSERT INTO board(writer_id, writer_region, title, description, price, picture1_url, picture2_url,picture3_url,picture4_url,picture5_url,del) values(?,?,?,?,?,?,?,?,?,?,?)';
    board.query(sql, datas, function(err, data) {
        if(err) {
            console.log("write error\n" + err);
            response.status(400).send('<srcript>alert("글쓰기 실패");</script>');
        }
        else {
            response.status(200).json({writepostSuccess: true}); 
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
            if(data.length == 0) {
                account.query('INSERT INTO user(user_id, user_pw, user_email, user_region, del) values(?,?,?,?,0)',[userID, hash, userEmail, userRegion]);
                response.status(200).json({register: true}); 
                //request.redirect('/');
            }
            else {
                response.status(400).json({register: false, error: "회원가입 실패"});
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
        if(data.length == 0) {
            response.status(400).json({loginSuccess: false, error: '로그인 실패, 아이디 없음'});
            //response.redirect('/');
        }
        else {
            bcrypt.compare(userPW, data[0].user_pw, function(err, result) {
                if(err) console.log("bcrypt error \n" + err);
                if(!result) {
                    response.status(400).json({loginSuccess: false, error: '로그인 실패'});
                    //response.redirect('/login');
                }
                else {
                    var token = jwt.sign(data[0].user_sn, auth_key);
                    userSn = data[0].user_sn
                    account.query(`UPDATE user SET token=(?) WHERE user_id = "${userID}"`, [token], function(err, data) {
                        if(err) console.log("login error2 \n" + err);
                        else {
                            var expiryDate = new Date( Date.now() + 60 * 60 * 1000 * 24);
                            response.cookie("X_userID", userID, {expires: expiryDate});
                            response.cookie("X_auth", token, {expires: expiryDate})
                            .status(200)
                            .json({loginSuccess: true, userID: userID});
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
            response.clearCookie("X_userID");
            response.clearCookie("X_auth").json({logout: true});    //.redirect('/');
            //response.status(200).send('<srcript>alert("로그아웃");</script>');
        } 
    });
})

// app.post('/api/comment/saveComment', function(request, response) {
//     var content = request.body.content;
//     var writer = request.body.writer;
//     var postID = request.body.postID;
//     var responseTo = request.body.responseTo;
//     var time = new Date();
//     var datas = [writer, postID, content, responseTo, time];
//     var sqlInsert = 'INSERT INTO comment(writer_id, post_sn, content, responseTo, time) values(?,?,?,?,?)';
//     var sqlSelect = 'SELECT * FROM comment WHERE comment_sn = (?)';
//     comment.query(sqlInsert, datas, function(err, data) {
//         if(err) {
//             console.log("comment save error\n", err);
//             response.json({success: false, err});
//         }
//         else {
//             comment.query(sqlSelect, [data.insertId], function(err2, result) {
//                 if(err2) {
//                     console.log("comment load error\n", err2);
//                     response.json({success: false, err2});
//                 }
//                 else {
//                     response.status(200).json({success: true, result, data});
//                 }
                
//         })
//         }
        
//         //data.insertId
        
//     });
// })

// app.post('/api/comment/getComments', function(request, response) {
//     var sqlSelect = 'SELECT * FROM comment WHERE post_sn = (?)';
//     var postID = request.body.postID;
//     comment.query(sqlSelect, [postID], function(err, data) {
//         if(err) {
//             console.log("comment load error\n", err);
//             response.json({success: false, err});
//         }
//         else {
//             response.status(200).json({success: true, data});
//         }
//     })
// })



app.post('/api/note/sendNote', function(request, response) {
    var sql = 'INSERT INTO note(sender, receiver, title, content, time) values(?,?,?,?,?)'
    var sender = request.body.sender;
    var receiver = request.body.receiver;
    var title = request.body.title;
    var content = request.body.content;
    var time = new Date();
    note.query(sql, [sender, receiver, title, content, time], function(err, data) {
        if(err) {
            console.log("sendNote error \n", err);
            response.status(400).json({success: false, err});
        }
        else {
            response.status(200).json({success: true});
            console.log("note save\n");
        }
    })
})

app.post('/api/note/getSendNote', function(request, response) {
    var sqlSend = 'SELECT * FROM note WHERE sender = (?)';
    var sender = request.body.id;
    note.query(sqlSend, [sender], function(err, data) {
        if(err) {
            console.log("getSendNote error", err);
            response.status(400).json({success: false, err});
        }
        else {
            response.status(200).json({success: true, data});
        }
    })
})
app.post('/api/note/getRecNote', function(request, response) {
    var sqlSend = 'SELECT * FROM note WHERE receiver = (?)';
    var receiver = request.body.id;
    note.query(sqlSend, [sender], function(err, data) {
        if(err) {
            console.log("getRecNote error", err);
            response.status(400).json({success: false, err});
        }
        else {
            response.status(200).json({success: true, data});
        }
    })
})

server.listen(7777, function() {
    console.log('Server Running');
    //console.log('test');
});
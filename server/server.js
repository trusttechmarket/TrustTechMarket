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
var comment = mysql.createConnection(db.commentDB);
var note = mysql.createConnection(db.noteDB);
var jwt = require('jsonwebtoken');
var { auth } = require('./auth.js');
var fs = require('fs');
var auth_key = db.auth_key;
var saltRounds = 10;
const multer = require('multer');
const res = require('express/lib/response');
const { type } = require('express/lib/response');


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
                'price': data[0].price,
                'image_dir': data[0].image_dir,
            };
            response.send(boardJson);
            console.log(boardJson);
            console.log('전송완료')
        }
    });
});
app.get('/api/getImage/:id', function(request, response) {
    var boardID = Number(request.params.id);
    console.log(boardID);
    var sql = `SELECT image_dir FROM board WHERE post_sn = ${boardID}`;
    board.query(sql, function(err, data) {
        
        if(err) console.log("query error \n" + err);
        else {
            var dirNum = data[0].image_dir;
            var imageJson = {};
            fs.readdir(path.join(__dirname,`public/images/${dirNum}`), 'utf-8',(err, files)=> {
                if (err) {
                    res.status(500);
                    throw err;
                }
                console.log(files);
                files.forEach(function(filename){
                    var fileData = fs.readFileSync(path.join(__dirname,`public/images/${dirNum}/` + filename), "base64")
                    imageJson[filename] = fileData;
                    console.log(imageJson);
                })
                response.send(imageJson);
                })
        }
    })
})


app.get('/api/board', function(request, response) {
    console.log('request 수신' + request)
    var sqlQuery = 'SELECT * FROM board ORDER BY post_sn DESC';
    board.query(sqlQuery, function(err, data) {
        console.log(data);
        response.send(data);
    })
})

app.get('/api/getTumbnail', function(request, response) {
    var tumbjson = {};
    fs.readdir(path.join(__dirname,'public/images/thumbnail'), 'utf-8',(err, files)=> {
        if (err) {
            res.status(500);
            throw err;
        }
        files.forEach(function(filename){
            var fileData = fs.readFileSync(path.join(__dirname,'public/images/thumbnail/' + filename))
            tumbjson[filename] = fileData.toString();
        })
        response.send(tumbjson);
        })
})

app.post('/api/board/upload', (req, res) => {
    var storRoute = `server/public/images/${d}`;
    if(!fs.existsSync(storRoute)) {
        fs.mkdirSync(storRoute)
    }
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {   
            cb(null, storRoute)
        },
        filename: (req, file, cb) => {
            // console.log(file)
            cb(null, file.originalname)
        }
    });
    const upload_all = multer({storage}).array('file');
    upload_all(req, res, (err) => {
        if(err) {
            console.log(err)
            return res.status(500).json(err)
        }
        fs.readdir(storRoute, (err, data) => {
            console.log(data[0])
            fs.readFile(storRoute + "/" + data[0], 'base64', (err, file) => {
                fs.writeFile(`server/public/images/thumbnail/${d}`,file ,(err) => {
                    if (err) throw err;
                    console.log('저장 성공', data[0])
                })  
            })
        })

        return res.status(200).send(req.files)
    })
})


app.post('/api/board/write', function(request, response) {
    var writeJson = request.body;
    var datas = [writeJson.writer, writeJson.region, writeJson.title, writeJson.contents, writeJson.price, writeJson.pictureDIR, 1];
    var dir = writeJson.pictureDIR;
    d = dir;
    var sql = 'INSERT INTO board(writer_id, writer_region, title, description, price, image_dir ,del) values(?,?,?,?,?,?,?)';
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

  app.post('/api/comment/saveComment', function(request, response) {
      var content = request.body.content;
      var writer = request.body.writer;
      var postID = request.body.postID;
      var responseTo = request.body.responseTo;
      var time = new Date();
      var datas = [writer, postID, content, responseTo, time];
      var sqlInsert = 'INSERT INTO comment(writer_id, post_sn, content, responseTo, time) values(?,?,?,?,?)';
      var sqlSelect = 'SELECT * FROM comment WHERE comment_sn = (?)';
      comment.query(sqlInsert, datas, function(err, data) {
          if(err) {
              console.log("comment save error\n", err);
              response.json({success: false, err});
          }
          else {
              comment.query(sqlSelect, [data.insertId], function(err2, result) {
                 if(err2) {
                      console.log("comment load error\n", err2);
                      response.json({success: false, err2});
                  }
                 else {
                     response.status(200).json({success: true, result, data});
                  }
                
          })
          }
        
          //data.insertId
        
      });
  })

  app.post('/api/comment/getComments', function(request, response) {
      var sqlSelect = 'SELECT * FROM comment WHERE post_sn = (?)';
      var postID = request.body.postID;
      comment.query(sqlSelect, [postID], function(err, data) {
          if(err) {
              console.log("comment load error\n", err);
              response.json({success: false, err});
          }
          else {
              response.status(200).json({success: true, data});
          }
      })
  })



 app.post('/api/note/sendnote', function(request, response) {
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
         }
     })
 })

 app.post('/api/note/getsendnote', function(request, response) {
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
 app.post('/api/note/getrecnote', function(request, response) {
     var sqlSend = 'SELECT * FROM note WHERE receiver = (?)';
     var receiver = request.body.id;
     note.query(sqlSend, [receiver], function(err, data) {
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
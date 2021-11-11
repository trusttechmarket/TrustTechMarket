var fs = require('fs');
var path = require('path');
var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var http = require('http');
var db = require('./database.js');
var board = mysql.createConnection(db.boardDB);





var app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.get('/board/:id', function(request, response) {
    var bid = parseInt(request.param('id'));
     var sql = `SELECT * FROM board WHERE Post_SN = ${bid}`;
    board.query(sql, function(err, rows) {
        if(err) console.log(`query error \n` + err);
        else {
            response.send(`<h1>rows[0].title</h1>`);
        }
    })
})

app.listen(7777, function() {
    console.log('Server Running')
})

const express = require('express');
const mysql = require('mysql');
const app = express();

//publicフォルダを静的ファイルのルートとして指定
app.use(express.static('public'));

//データベースに接続するための設定
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'SDEV',
    password: 'password',
    database: 'app3'
});


//トップ画面（top.ejs）を表示するルーティング
app.get('/', (req, res) => {
    res.render('top.ejs');
});

//一覧画面（index.ejs）を表示するルーティング
app.get('/index', (req, res) => {
    connection.query(
        "SELECT * FROM items",
        (error, results) => {
            res.render('index.ejs', {items: results});
        }
    );
});

app.get('/new', (req, res) => {
    res.render('new.ejs');
});

//サーバーを起動
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
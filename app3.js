// ExpressとMySQLモジュールの読み込み
const express = require('express');
const mysql = require('mysql');

//Expressアプリケーションの作成
const app = express();

//静的ファイル（public配下）をHTTPで配信する
app.use(express.static('public'));

//データベースに接続するための設定
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'SDEV',
    password: 'password',
    database: 'app3'
});

//ルーティングを設定
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
//ポート3000で待ち受け開始
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
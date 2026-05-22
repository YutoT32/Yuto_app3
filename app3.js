// ExpressとMySQLモジュールの読み込み
const express = require('express');
const mysql = require('mysql2');

//Expressアプリケーションの作成
const app = express();

//静的ファイル（public配下）をHTTPで配信する
app.use(express.static('public'));

//データベースに接続するための設定
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'satumaimo3',
    //DATABASE名「ecapp3」を指定
    database: 'ecapp3'
});

//ルーティングを設定
//トップ画面（top.ejs）を表示するルーティング
app.get('/', (req, res) => {
    connection.query(
        "SELECT * FROM Products ORDER BY productID DESC LIMIT 4",
        (error, results) => {
            if (error) {
                console.log(error);
                return res.status(500).send('DB error');
            }
            res.render('top.ejs', {recommendedProducts: results});
        }
    );
});

//一覧画面（index.ejs）を表示するルーティング
app.get('/index', (req, res) => {
    //データベースからProductsテーブルのデータを取得
    connection.query(
        "SELECT * FROM Products",
        (error, results) => {
            //エラー処理
            if (error) {
                console.log(error);
                return res.status(500).send('DB error');
            }
            //取得したデータをindex.ejsに渡して表示
            res.render('index.ejs', {Products: results});
        }
    );
});

//カート画面（cart.ejs）を表示するルーティング
app.get('/cart', (req, res) => {
    res.render('cart.ejs');
});

//ログイン画面（login.ejs）を表示するルーティング
app.get('/login', (req, res) => {
    res.render('login.ejs');
});

//サーバーを起動
//ポート3000で待ち受け開始
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
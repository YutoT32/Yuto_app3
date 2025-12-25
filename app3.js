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
    res.render('top.ejs');
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


            console.log(results);
            //取得したデータをindex.ejsに渡して表示
            res.render('index.ejs', {Products: results});
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
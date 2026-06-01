// ExpressとMySQLモジュールの読み込み
const express = require('express');
const mysql = require('mysql2');
const session = require('express-session');
const bcrypt = require('bcryptjs');

//Expressアプリケーションの作成
const app = express();

//静的ファイル（public配下）をHTTPで配信する
app.use(express.static('public'));

// POSTリクエストのフォームデータを解析する
app.use(express.urlencoded({ extended: true }));

// セッションの設定
app.use(session({
    secret: 'ecapp3-secret-key', // セッションIDの暗号化に使うキー
    resave: false,               // セッションに変更がなくても保存し直さない
    saveUninitialized: true,     // 新規セッションを即座に保存する（カート未追加でも番号札を発行）
    cookie: { maxAge: 1000 * 60 * 60 * 24 } // Cookieの有効期限：24時間
}));

// ログイン中のユーザー情報をすべてのビューで利用できるようにする
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

//DBへの接続設定を持ったconnectionオブジェクトを作成
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'satumaimo3',
    database: 'ecapp3' //DATABASE名「ecapp3」を指定
});

//ルーティングを設定
//トップ画面（top.ejs）を表示するルーティング
app.get('/', (req, res) => {
    connection.query(
        "SELECT * FROM Products ORDER BY productID DESC LIMIT 6",
        (error, results) => {
            if (error) {
                console.log(error);
                return res.status(500).send('DB error');
            }
            res.render('top.ejs', {recommendedProducts: results}); // 配列resultsをtop.ejsに渡す
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
            res.render('index.ejs', {Products: results}); // 配列resultsをindex.ejsに渡す
        }
    );
});

//商品詳細画面（product.ejs）を表示するルーティング
app.get('/products/:id', (req, res) => { //「:id」はURLパラメータとして商品IDを受け取るための記述
    connection.query(
        `SELECT p.*, m.companyName
         FROM products p
         LEFT JOIN manufacturer m ON p.companyID = m.companyID
         WHERE p.productID = ?`,
        [req.params.id], // 「:id」に入った値を取り出す→上記SQLクエリの「?」に入る
        (error, results) => {
            // DBエラーが発生した場合の処理
            if (error) {
                console.log(error);
                return res.status(500).send('DB error');
            }
            // 商品が見つからなかった場合の処理
            if (results.length === 0) {
                return res.status(404).send('商品が見つかりません');
            }
            res.render('product.ejs', { product: results[0] }); // 配列resultsの最初の要素（オブジェクト）results[0]をproduct.ejsに渡す
        }
    );
});

//検索結果画面（search.ejs）を表示するルーティング
app.get('/search', (req, res) => {
    const keyword = req.query.q || ''; // クエリパラメータ（「?q=〇〇」のq）を取得。存在しない場合は空文字を使用
    connection.query(
        "SELECT * FROM Products WHERE productName LIKE ?",
        [`%${keyword}%`], // keywordを取得。「%」は前方一致・後方一致のワイルドカード→上記SQLクエリの「?」に入る
        (error, results) => {
            if (error) {
                console.log(error);
                return res.status(500).send('DB error');
            }
            res.render('search.ejs', { keyword: keyword, Products: results }); // クエリパラメータのkeywordと配列resultsをsearch.ejsに渡す
        }
    );
});

//カート画面（cart.ejs）を表示するルーティング
app.get('/cart', (req, res) => {
    const cart = req.session.cart || [];
    // 合計金額を計算
    const totalPrice = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    res.render('cart.ejs', { cart, totalPrice });
});

// カートに商品を追加するルーティング
app.post('/cart/add', (req, res) => {
    const { productID, productName, unitPrice, image } = req.body;

    if (!req.session.cart) {
        req.session.cart = [];
    }

    // すでにカートに同じ商品があれば数量を増やす
    const existingItem = req.session.cart.find(item => item.productID == productID);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        req.session.cart.push({
            productID,
            productName,
            unitPrice: parseInt(unitPrice),
            image,
            quantity: 1
        });
    }

    res.redirect('/cart');
});

// カートから商品を削除するルーティング
app.post('/cart/remove', (req, res) => {
    const { productID } = req.body;

    if (req.session.cart) {
        req.session.cart = req.session.cart.filter(item => item.productID != productID);
    }

    res.redirect('/cart');
});

//ログイン画面（login.ejs）を表示するルーティング
app.get('/login', (req, res) => {
    res.render('login.ejs', { error: null });
});

// ログイン処理
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    connection.query(
        'SELECT * FROM customer WHERE email = ?',
        [email],
        async (error, results) => {
            if (error) {
                console.log(error);
                return res.status(500).send('DB error');
            }
            if (results.length === 0) {
                return res.render('login.ejs', { error: 'メールアドレスまたはパスワードが正しくありません。' });
            }

            const user = results[0];
            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.render('login.ejs', { error: 'メールアドレスまたはパスワードが正しくありません。' });
            }

            // セッションにユーザー情報を保存
            req.session.user = { customerID: user.customerID, username: user.customerName };
            res.redirect('/');
        }
    );
});

// ログアウト処理
app.post('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
});

// 会員登録画面（register.ejs）を表示するルーティング
app.get('/register', (req, res) => {
    res.render('register.ejs', { error: null });
});

// 会員登録処理
app.post('/register', async (req, res) => {
    const { username, address, email, password } = req.body;

    // パスワードをハッシュ化
    const hashedPassword = await bcrypt.hash(password, 10);

    connection.query(
        'INSERT INTO customer (customerName, address, email, password) VALUES (?, ?, ?, ?)',
        [username, address, email, hashedPassword],
        (error, results) => {
            if (error) {
                // メールアドレスが重複している場合
                if (error.code === 'ER_DUP_ENTRY') {
                    return res.render('register.ejs', { error: 'このメールアドレスはすでに使用されています。' });
                }
                console.log(error);
                return res.status(500).send('DB error');
            }
            // 登録成功後、ログイン画面へ
            res.redirect('/login');
        }
    );
});

//サーバーを起動
//ポート3000で待ち受け開始
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

## はじめに

「Yuto_app2」のECサイト（JSP使用）を Node.js + Express で作り直しています。
登山用ウェアを扱うECサイトです。

---

## 技術スタック

| 項目 | 内容 |
|------|------|
| 実行環境 | Node.js |
| フレームワーク | Express 5 |
| テンプレートエンジン | EJS |
| データベース | MySQL（データベース名: `ecapp3`） |
| スタイル | CSS（`public/css/style.css`） |

---

## プロジェクト構成

```
app3/
├── app3.js              # サーバーのエントリーポイント（ルーティング・DB接続）
├── package.json
├── public/
│   ├── css/
│   │   └── style.css    # 全ページ共通スタイル
│   └── images/
│       ├── climbing/    # ヒーローバナー用画像
│       ├── tops/        # Tシャツ画像
│       ├── shirts/      # シャツ画像
│       ├── jakets/      # ジャケット画像
│       ├── pants/       # パンツ画像
│       ├── shoes/       # シューズ画像
│       ├── backpack/    # バックパック画像
│       └── scarts/      # スカート画像
└── views/
    ├── top.ejs          # トップページ（ヒーローバナー + おすすめ商品）
    ├── index.ejs        # 商品一覧ページ
    ├── product.ejs      # 商品詳細ページ
    ├── cart.ejs         # カートページ（未実装）
    └── login.ejs        # ログインページ（未実装）
```

---

## ルーティング一覧

| メソッド | パス | 説明 |
|---------|------|------|
| GET | `/` | トップページ（おすすめ商品6件表示） |
| GET | `/index` | 商品一覧ページ（全商品） |
| GET | `/products/:id` | 商品詳細ページ |
| GET | `/cart` | カートページ |
| GET | `/login` | ログインページ |

---

## データベース構成

### products（商品）

| カラム | 型 | 説明 |
|--------|----|------|
| productID | int (PK) | 商品ID（自動採番） |
| companyID | int (FK) | メーカーID |
| productName | varchar(100) | 商品名 |
| color | varchar(100) | カラー |
| unitPrice | int unsigned | 価格（税抜） |
| image | varchar(255) | 画像パス |

### manufacturer（メーカー）

| カラム | 型 | 説明 |
|--------|----|------|
| companyID | int (PK) | メーカーID（自動採番） |
| companyName | varchar(100) | メーカー名 |

メーカーは以下の3社が登録されています。

| companyID | companyName |
|-----------|-------------|
| 1 | ベーシックウェア |
| 2 | アーバンスタイル |
| 3 | ナチュラルコレクション |

### customer（顧客）

| カラム | 型 | 説明 |
|--------|----|------|
| customerID | int (PK) | 顧客ID（自動採番） |
| customerName | varchar(100) | 顧客名 |
| address | varchar(100) | 住所 |

### postcode（郵便番号）

| カラム | 型 | 説明 |
|--------|----|------|
| address | varchar(100) (PK) | 住所 |
| postCode | varchar(100) | 郵便番号 |

### purchase（購入履歴）

| カラム | 型 | 説明 |
|--------|----|------|
| purchaseID | int unsigned (PK) | 購入ID（自動採番） |
| productID | int unsigned (FK) | 商品ID |
| customerID | int unsigned (FK) | 顧客ID |
| purchaseDate | datetime | 購入日時（デフォルト: 現在時刻） |
| purchaseNum | int unsigned | 購入数量 |

---

## 起動方法

```bash
node app3.js
```

サーバーはポート3000で起動します。
ブラウザで `http://localhost:3000` にアクセスしてください。

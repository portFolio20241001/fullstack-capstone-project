require('dotenv').config();             // dotenvを読み込み環境変数を設定
const express = require('express');     // expressモジュールをインポートして、アプリケーションを作成
const cors = require('cors');           // CORS（クロスオリジンリソースシェアリング）を有効にするためのモジュール
const pinoLogger = require('./logger'); // ログ出力用のpinoLoggerをインポート
const connectToDatabase = require('./models/db');           // データベース接続のための関数をインポート
const { loadData } = require("./util/import-mongo/index");  // MongoDBデータのインポートを行うための関数をインポート

const app = express();  // express アプリケーションを作成

app.use("*", cors());   // 全てのリクエストに対してCORSを適用

const port = 3060;      // ポート番号を設定

// MongoDBに接続（1回のみ行う）
connectToDatabase().then(() => {
    // 接続成功時にログを出力
    pinoLogger.info('Connected to DB');
})
    .catch((e) => {
        // 接続失敗時にエラーログを出力
        console.error('Failed to connect to DB', e);
    });

app.use(express.json());    // リクエストのボディをJSONとして解析するミドルウェアを使用

// HTTPリクエストのログを取得する
const pinoHttp = require('pino-http');  // pino-httpをインポートして、HTTPリクエストのログを記録
const logger = require('./logger');     // ロガーをインポート（pinoLoggerは上でインポートしたもの）
app.use(pinoHttp({ logger }));          // pinoHttpを使って、HTTPリクエストのログを取得するミドルウェアを使用

// giftRoutesへルーティング
const giftRoutes = require('./routes/giftRoutes');  // ギフトAPIのルートをインポートし、giftRoutesという定数に格納
app.use('/api/gifts', giftRoutes);  // ギフトAPIをサーバーに追加する（'/api/gifts' というエンドポイント）

// authRoutesへルーティング
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

// searchRoutesへルーティング
const searchRoutes = require('./routes/searchRoutes'); // 検索APIのルートをインポートし、searchRoutesという定数に格納
app.use('/api/search', searchRoutes);  // 検索APIをサーバーに追加する（'/api/search'というエンドポイント）

// グローバルエラーハンドラー
app.use((err, req, res, next) => {
    // エラー発生時にエラーログを出力
    console.error(err);

    // クライアントに500ステータスを返す
    res.status(500).send('Internal Server Error');
});

// ルートエンドポイント（確認用）
app.get("/", (req, res) => {
    // サーバーが稼働していることを返す
    res.send("Inside the server");
});

// サーバーを起動し、指定されたポートでリクエストを待機
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

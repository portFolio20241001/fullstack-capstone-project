const express = require('express');     // Expressフレームワークをインポート
const app = express();                  // Expressアプリケーションのインスタンスを作成
const bcryptjs = require('bcryptjs');   // bcryptjsライブラリをインポート（パスワードのハッシュ化に使用）
const jwt = require('jsonwebtoken');    // JSON Web Token（JWT）ライブラリをインポート
const { body, validationResult } = require('express-validator');    // express-validatorライブラリをインポート（入力検証に使用）
const connectToDatabase = require('../models/db');                  // MongoDBデータベース接続関数をインポート
const router = express.Router();        // Expressのルーターを作成
const dotenv = require('dotenv');       // 環境変数を読み込むためのdotenvライブラリをインポート
const pino = require('pino');           // Pinoロガーライブラリをインポート（ログ出力に使用）


// Pinoロガーのインスタンスを作成
const logger = pino();

// 環境変数をロード
dotenv.config();

// JWTの秘密鍵を環境変数から取得
const JWT_SECRET = process.env.JWT_SECRET;

// ユーザー登録用のAPIエンドポイントを作成
router.post('/register', async (req, res) => {
    try {
        console.log("ポイント1")

        // Task 1: MongoDBの`giftsdb`に接続（`db.js`内の`connectToDatabase`を使用）
        const db = await connectToDatabase();

        // Task 2: MongoDBの`users`コレクションにアクセス
        const collection = db.collection("users");

        // Task 3: 既存のメールアドレスがあるかチェック
        const existingEmail = await collection.findOne({ email: req.body.email });

        // パスワードのハッシュ化のためのソルトを生成
        const salt = await bcryptjs.genSalt(10);
        // ソルトを使用してパスワードをハッシュ化
        const hash = await bcryptjs.hash(req.body.password, salt);
        // メールアドレスを取得
        const email = req.body.email;

        // Task 4: 新規ユーザー情報をデータベースに保存
        const newUser = await collection.insertOne({
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            password: hash, // ハッシュ化されたパスワードを保存
            createdAt: new Date(), // 作成日時を記録
        });

        // JWTのペイロードを作成（ユーザーIDを含む）
        const payload = {
            user: {
                id: newUser.insertedId, // 挿入されたユーザーのID
            },
        };

        // JWTトークンを生成
        const authtoken = jwt.sign(payload, JWT_SECRET);

        // ログにユーザー登録成功を記録
        logger.info('User registered successfully');

        // レスポンスとしてJWTトークンとメールアドレスを返す
        res.json({ authtoken, email });
    } catch (e) {
        console.log("ポイント2")
        // サーバーエラー発生時、500エラーを返す
        return res.status(500).send('Internal server error');
    }
});

// ルーターをエクスポート（他のモジュールで使用可能にする）
module.exports = router;

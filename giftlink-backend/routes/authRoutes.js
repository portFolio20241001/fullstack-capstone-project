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


// ログインエンドポイントを定義
router.post('/login', async (req, res) => {
    console.log("\n\n ログイン処理を開始"); // ログイン処理の開始をコンソールに出力

    try {
        // MongoDBデータベースに接続
        const db = await connectToDatabase();  
        // "users" コレクション（テーブルのようなもの）を取得
        const collection = db.collection("users");

        // リクエストで受け取ったemailを元に、ユーザー情報を取得
        const theUser = await collection.findOne({ email: req.body.email });

        // ユーザーが存在する場合
        if (theUser) {
            // 入力されたパスワードと保存されているハッシュ化されたパスワードを比較
            let result = await bcryptjs.compare(req.body.password, theUser.password);

            // パスワードが一致しない場合
            if (!result) {
                logger.error('パスワードが間違っています'); // ログにエラーを記録
                return res.status(404).json({ error: 'パスワードが間違っています' }); // 404エラーを返す
            }

            // JWT（JSON Web Token）のペイロード（認証情報）を作成
            let payload = {
                user: {
                    id: theUser._id.toString(), // ユーザーIDを文字列に変換して格納
                },
            };

            // ユーザー名とメールアドレスを取得
            const userName = theUser.firstName;
            const userEmail = theUser.email;

            // JWTを作成（秘密鍵 JWT_SECRET を使用）
            const authtoken = jwt.sign(payload, JWT_SECRET);

            // ログイン成功のログを記録
            logger.info('ユーザーが正常にログインしました');

            // 認証トークン、ユーザー名、メールアドレスをレスポンスとして返す
            return res.status(200).json({ 
                authtoken, 
                userName, 
                userEmail 
            });
        } else {
            // ユーザーが見つからなかった場合
            logger.error('ユーザーが見つかりません'); // エラーログを記録
            return res.status(404).json({ error: 'ユーザーが見つかりません' }); // 404エラーを返す
        }
    } catch (e) {
        // 予期しないエラーが発生した場合
        logger.error(e); // エラーログを記録
        return res.status(500).json({ 
            error: '内部サーバーエラーが発生しました', 
            details: e.message 
        }); // 500エラー（サーバー内部エラー）を返す
    }
});




// ルーターをエクスポート（他のモジュールで使用可能にする）
module.exports = router;

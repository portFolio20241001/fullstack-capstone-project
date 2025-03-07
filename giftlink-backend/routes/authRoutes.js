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


// `update` API のルートを定義
router.put('/update', [
    body('name').notEmpty().withMessage('名前は必須です'),
    body('email').isEmail().withMessage('有効なメールアドレスを入力してください'),
    body('age').optional().isInt({ gt: 0 }).withMessage('年齢は正の整数でなければなりません')
], async (req, res) => {
    // Task 2: `validationResult` を使用して入力を検証し、エラーがある場合は適切なメッセージを返す
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        // ログにエラーを記録
        logger.error('更新リクエストのバリデーションエラー', errors.array());

        return res.status(400).json({ 
            errors: errors.array()
        });        
        
    }

    try {
        // Task 3: name, email, age をボディから取得
        const { name, email, age } = req.body;

        // Task 4: MongoDB に接続
        const db = await connectToDatabase();
        const collection = db.collection("users");

        // Task 5: ユーザーの情報を検索
        const existingUser = await collection.findOne({ email });
        if (!existingUser) {
            logger.error('ユーザーが見つかりません');
            return res.status(404).json({ error: "ユーザーが見つかりません" });
        }

        // ユーザー情報を更新
        existingUser.firstName = name;
        if (age) existingUser.age = age;
        existingUser.updatedAt = new Date();

        // Task 6: ユーザー情報をデータベースに更新
        const updatedUser = await collection.findOneAndUpdate(
            { email },               // 更新対象の条件
            { $set: existingUser },  // 更新するデータ
            { returnDocument: 'after' } // 更新後のデータを取得
        );

        // Task 7: ユーザーの `_id` をペイロードとして JWT 認証トークンを作成（秘密鍵は .env から取得）
        const payload = {
            user: {
                id: updatedUser._id.toString(),
            },
        };
        const authtoken = jwt.sign(payload, JWT_SECRET);

        // 更新成功のログを記録
        logger.info('ユーザー情報が正常に更新されました');

        // 認証トークンをレスポンスとして返す
        res.json({ authtoken });

    } catch (error) {
        // サーバーエラー発生時の処理
        logger.error(error);
        return res.status(500).send("内部サーバーエラー");
    }
});




// ルーターをエクスポート（他のモジュールで使用可能にする）
module.exports = router;

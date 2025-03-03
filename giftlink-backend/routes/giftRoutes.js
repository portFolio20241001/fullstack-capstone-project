const express = require('express'); // expressモジュールをインポート
const router = express.Router(); // expressのルーターを作成
const connectToDatabase = require('../models/db'); // データベース接続関数をインポート
const logger = require('../logger'); // ロガーをインポート

// すべてのギフトを取得
router.get('/', async (req, res, next) => {
    logger.info('/ called'); // ルートが呼び出されたことをログに記録
    try {
        const db = await connectToDatabase(); // データベースに接続

        const collection = db.collection("gifts"); // "gifts" コレクションを取得
        const gifts = await collection.find({}).toArray(); // コレクションからすべてのギフトを取得
        res.json(gifts); // ギフトのリストをレスポンスとして返す
    } catch (e) {
        logger.console.error('oops something went wrong', e); // エラーログを記録
        next(e); // 次のミドルウェア（エラーハンドリング）にエラーを渡す
    }
});

// ギフトIDで単一のギフトを取得
router.get('/:id', async (req, res, next) => {
    try {
        const db = await connectToDatabase(); // データベースに接続
        const collection = db.collection("gifts"); // "gifts" コレクションを取得
        const id = req.params.id; // リクエストパラメータからIDを取得
        const gift = await collection.findOne({ id: id }); // 指定されたIDでギフトを検索

        if (!gift) {
            return res.status(404).send("Gift not found"); // ギフトが見つからない場合、404エラーを返す
        }

        res.json(gift); // ギフトをレスポンスとして返す
    } catch (e) {
        next(e); // エラーハンドリングのため次のミドルウェアにエラーを渡す
    }
});

// 新しいギフトを追加
router.post('/', async (req, res, next) => {
    try {
        const db = await connectToDatabase(); // データベースに接続
        const collection = db.collection("gifts"); // "gifts" コレクションを取得
        const gift = await collection.insertOne(req.body); // リクエストボディのデータをコレクションに挿入

        res.status(201).json(gift.ops[0]); // ギフトの情報をレスポンスとして返す（201 Created）
    } catch (e) {
        next(e); // エラーハンドリングのため次のミドルウェアにエラーを渡す
    }
});

module.exports = router; // このルーターをモジュールとしてエクスポート

const express = require('express'); // expressモジュールをインポート
const router = express.Router(); // 新しいルーターオブジェクトを作成
const connectToDatabase = require('../models/db'); // MongoDB接続用の関数をインポート
const logger = require('../logger'); // ロガー（logger）モジュールをインポート（../logger ファイルを参照）

// ギフトを検索するためのルートを定義
router.get('/', async (req, res, next) => {
    try {
        // タスク 1: MongoDB に接続する。connectToDatabaseを使用し、接続をdbに保存
        const db = await connectToDatabase(); // データベース接続を非同期で行う

        const collection = db.collection("gifts"); // 'gifts' コレクションを取得

        // クエリオブジェクトを初期化
        let query = {}; // 初期状態では全てのギフトを対象にする

        // タスク 2: 名前が存在し、空でないことを確認
        if (req.query.name && req.query.name.trim() !== '') { // 名前が指定されていて、空白でないことを確認
            query.name = { $regex: req.query.name, $options: "i" }; // 部分一致検索を行う、ケースインセンシティブ
        }

        // タスク 3: 他のフィルターをクエリに追加
        if (req.query.category) { // カテゴリが指定されていれば
            query.category = req.query.category; // クエリにカテゴリフィルタを追加
        }
        if (req.query.condition) { // 状態が指定されていれば
            query.condition = req.query.condition; // クエリに状態フィルタを追加
        }
        if (req.query.age_years) { // 年齢が指定されていれば
            query.age_years = { $lte: parseInt(req.query.age_years) }; // 年齢フィルタ（指定された年齢以下のギフトを取得）
        }

        // タスク 4: フィルタリングされたギフトを取得
        const gifts = await collection.find(query).toArray(); // クエリ条件に基づいてギフトを検索し、配列に変換

        // 結果を返す
        res.json(gifts); // 検索結果をJSON形式で返す
    } catch (e) {
        next(e); // エラーが発生した場合、次のミドルウェアにエラーを渡す
    }
});

// モジュールとしてエクスポート
module.exports = router;

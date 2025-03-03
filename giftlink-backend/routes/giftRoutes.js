const express = require('express');                 // Express モジュールをインポート
const router = express.Router();                    // Express のルーターを作成const connectToDatabase = require('./db'); 

 ../modelsconst logger = require('../logger'        );        // ロガー（logger）モジュールをインポート（../logger ファイルを参照）
 // データベース接続関数をインポート　// ルート: "/" (ギフトデータを取得する API エンドポイント)
router.get('/', async (req, res) => {
    try {
        // タスク 1: MongoDB に接続し、接続インスタンスを db 変数に保存
        // `connectToDatabase()` を実行し、MongoDB のデータベースインスタンスを取得
        const db = await connectToDatabase();

        // タスク 2: collection() メソッドを使用して "gifts" コレクションを取得
        // `db.collection("gifts")` を実行し、"gifts" コレクションへの参照を取得
        const collection = db.collection("gifts");

        // タスク 3: collection.find メソッドを使用してすべてのギフトデータを取得
        // `.find({})` を実行してすべてのドキュメントを検索し、`.toArray()` で JSON 配列に変換
        const gifts = await collection.find({}).toArray();

        // タスク 4: res.json メソッドを使用してクライアントにギフトデータを JSON 形式で返す
        res.json(gifts);
    } catch (e) {
        // エラーハンドリング: エラー発生時にコンソールにエラーメッセージを出力
        console.error('Error fetching gifts:', e);
        
        // HTTP ステータス 500 (内部サーバーエラー) を返し、エラーメッセージを送信
        res.status(500).send('Error fetching gifts');
    }
});


router.get('/:id', async (req, res) => {
// 特定のギフトを ID で取得するルート: "/:id"
router.get('/:id', async (req, res) => { 
    try { 
        // タスク 1: MongoDB に接続し、接続インスタンスを db 変数に保存
        const db = await connectToDatabase();

        // タスク 2: collection() メソッドを使用して "gifts" コレクションを取得
        const collection = db.collection("gifts");

        // クエリパラメータから ID を取得
        const id = req.params.id; 

        // タスク 3: collection.findOne メソッドを使用して ID で特定のギフトを検索し、gift 変数に保存
        // `_id` ではなく `id` フィールドを検索する場合、データベース内の ID 格納方法に注意
        const gift = await collection.findOne({ id: id });

        // 検索結果が存在しない場合は 404 エラーを返す
        if (!gift) { 
            return res.status(404).send('Gift not found'); 
        } 

        // 検索したギフトデータを JSON 形式でクライアントに返す
        res.json(gift); 
    } catch (e) { 
        // エラーハンドリング: エラー発生時にコンソールにエラーメッセージを出力
        console.error('Error fetching gift:', e); 
        
        // HTTP ステータス 500 (内部サーバーエラー) を返し、エラーメッセージを送信
        res.status(500).send('Error fetching gift'); 
    } 
});

router.post('/', async (req, res, next) => {
// 新しいギフトを追加するルート (POSTリクエスト)
// クライアントがギフトデータを送信すると、データベースに新しいギフトを追加する
router.post('/', async (req, res, next) => {
    try {
        
        const db = await connectToDatabase();               // MongoDB に接続し、接続インスタンスを db 変数に保存
        const collection = db.collection("gifts");          // "gifts" コレクションを取得
        const gift = await collection.insertOne(req.body);  // クライアントから送信されたデータ (req.body) をコレクションに追加

        // ステータス 201 (Created) を返し、追加されたギフトデータを JSON 形式でレスポンス
        res.status(201).json(gift.ops[0]);  // `gift.ops[0]` は挿入されたデータを取得
    } catch (e) {
        // エラー発生時は `next(e)` を呼び出し、エラーハンドリングミドルウェアに渡す
        next(e);
    }
});
// ルーターをエクスポートし、他のモジュールで使用できるようにする


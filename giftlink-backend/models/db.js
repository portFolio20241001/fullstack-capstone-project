require('dotenv').config();                 // 環境変数を読み込むための設定（.env ファイルから MONGO_URL を取得）
const { MongoClient } = require('mongodb'); // MongoDB クライアントのインポート
const url = process.env.MONGO_URL;          // 環境変数から MongoDB の接続 URL を取得（.env ファイルで設定されていることが前提）


let dbInstance = null;     // データベースインスタンスをキャッシュするための変数（すでに接続済みなら再接続を防ぐ）

const dbName = "giftdb";   // 接続するデータベース名（今回は "giftdb" を指定）

// MongoDB に接続し、データベースインスタンスを取得する非同期関数
async function connectToDatabase() {
    // すでにデータベースインスタンスが存在する場合は、新しい接続をせずにそのまま返す（不要な接続を防ぐ）
    if (dbInstance) {
        return dbInstance;
    }

    // MongoDB クライアントを作成（接続 URL を指定）
    const client = new MongoClient(url);

    // タスク1: MongoDB に接続する（非同期処理のため `await` を使用）
    await client.connect();

    // タスク2: giftDB というデータベースに接続し、そのインスタンスを変数 dbInstance に格納
    dbInstance = client.db(dbName);

    // タスク3: データベースインスタンスを返す（他のモジュールからこのインスタンスを使用できるようにする）
    return dbInstance;
}

// 他のファイルから `connectToDatabase` を利用できるようにエクスポート
module.exports = connectToDatabase;

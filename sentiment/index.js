require('dotenv').config(); // .envファイルを読み込んで環境変数を設定
const express = require('express'); // Expressライブラリをインポート
const axios = require('axios'); // Axiosライブラリをインポート（外部API呼び出しに使用予定）
const logger = require('./logger'); // ロガーをインポート（ログ出力用）
const expressPino = require('express-pino-logger')({ logger }); // express-pino-loggerでログを管理

// Task 1: naturalライブラリをインポート
const natural = require("natural"); // naturalライブラリをインポート

// Task 2: expressサーバーを初期化
const app = express(); // Expressアプリケーションを作成
const port = process.env.PORT || 3000; // 環境変数PORTが設定されていなければ3000番ポートを使用

app.use(express.json()); // リクエストボディをJSONとしてパース
app.use(expressPino); // PinoロガーをExpressのミドルウェアとして使用

// 感情分析用のルートを定義
// Task 3: POST /sentimentエンドポイントを作成
app.post('/sentiment', async (req, res) => { 

    // Task 4: sentenceパラメータをリクエストから抽出
    const { sentence } = req.query; // URLのクエリパラメータからsentenceを取得

    // sentenceが提供されていない場合のエラーハンドリング
    if (!sentence) { 
        logger.error('文が提供されていません'); // エラーログを記録
        return res.status(400).json({ error: '文が提供されていません' }); // 400 Bad Requestでエラーメッセージを返す
    } 

    // 感情分析用の初期設定
    const Analyzer = natural.SentimentAnalyzer; // SentimentAnalyzerをインスタンス化
    const stemmer = natural.PorterStemmer; // ポーター・ステマーをインポート（単語の原型化用）
    const analyzer = new Analyzer("English", stemmer, "afinn"); // "English"の分析器を作成

    // 感情分析を実行
    try { 
        const analysisResult = analyzer.getSentiment(sentence.split(' ')); // 入力された文章を単語ごとに分割して感情分析

        let sentiment = "neutral"; // デフォルトの感情を「neutral」に設定

        // Task 5: スコアに基づいて感情を決定
        if (analysisResult < 0) { // スコアが0未満なら「negative」
            sentiment = "negative"; 
        } else if (analysisResult <= 0.33) { // スコアが0以上0.33以下なら「neutral」
            sentiment = "neutral"; 
        } else { // スコアが0.33より大きければ「positive」
            sentiment = "positive"; 
        }

        // 結果をログに記録
        logger.info(`感情分析の結果: ${analysisResult}`); // 分析結果を情報としてログに記録

        // Task 6: ステータスコード200で、感情スコアと感情をJSON形式で返す
        return res.status(200).json({ sentimentScore: analysisResult, sentiment: sentiment }); 
    } catch (error) { 
        logger.error(`感情分析中にエラーが発生しました: ${error}`); // エラーが発生した場合、エラーログを記録
        // Task 7: エラー発生時にHTTPステータス500を返し、エラーメッセージをJSON形式で返す
        return res.status(500).json({ message: '感情分析中にエラーが発生しました' }); 
    } 
}); 

// サーバーをポート3000で開始
app.listen(port, () => { 
    logger.info(`サーバーがポート${port}で起動しました`); // サーバーが正常に起動したことをログに記録
});

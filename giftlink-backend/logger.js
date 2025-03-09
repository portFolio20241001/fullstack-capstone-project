const pino = require('pino'); // pinoライブラリをインポート

let logger; // ロガーを格納する変数を宣言

// 環境変数 NODE_ENV が 'production' 以外の場合（開発・テスト環境）
if (process.env.NODE_ENV !== 'production') {
    // 開発環境では、ログを見やすく整形してコンソールに出力する
    logger = pino({
        level: 'debug', // ログレベルを "debug" に設定（詳細なログを出力）
        transport: {
            target: "pino-pretty", // ログの整形を行うために "pino-pretty" を使用
        },
    });
} else {
    // 本番環境ではデフォルトの設定で Pino を使用（JSON 形式でログ出力）
    logger = pino();
}

// logger を他のモジュールで利用できるようにエクスポート
module.exports = logger;

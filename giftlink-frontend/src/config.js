// 設定オブジェクトを作成
const config = {
  // 環境変数からバックエンドのURLを取得して設定
  backendUrl: process.env.REACT_APP_BACKEND_URL,
};

// コンソールにバックエンドのURLを出力（デバッグ用）
console.log(`backendUrl in config.js: ${config.backendUrl}`)

// configオブジェクトをurlConfigとしてエクスポート
export {config as urlConfig}

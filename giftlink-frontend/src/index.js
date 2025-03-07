import React from 'react';                                  // React ライブラリをインポート
import ReactDOM from 'react-dom/client';                    // ReactDOM ライブラリをインポート（React 18 以降の新しい API）
import { BrowserRouter as Router } from 'react-router-dom'; // react-router-dom から Router をインポート（ルーティング用）
import './index.css';                                       // グローバルなスタイルをインポート
import App from './App';                                    // アプリケーションのメインコンポーネントである App をインポート
import { AuthProvider } from './context/AuthContext';       // 認証情報を提供するコンテキストプロバイダーをインポート

const root = ReactDOM.createRoot(document.getElementById('root')); // 'root' ID を持つ DOM 要素を取得し、React のルートを作成

root.render(
  <React.StrictMode>
    <Router> {/* アプリケーション全体にルーティング機能を提供 */}
      <AuthProvider> {/* アプリケーション全体に認証コンテキストを提供 */}
        <App /> {/* メインのアプリケーションコンポーネントを表示 */}
      </AuthProvider>
    </Router>
  </React.StrictMode>
);

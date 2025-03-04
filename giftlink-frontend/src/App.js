import React from 'react';  // Reactライブラリをインポート
import { Routes, Route } from 'react-router-dom';  // react-router-domから必要なモジュールをインポート

// 各ページコンポーネントをインポート
import MainPage from './components/MainPage/MainPage';
import LoginPage from './components/LoginPage/LoginPage';
import RegisterPage from './components/RegisterPage/RegisterPage';
import SearchPage from './components/SearchPage/SearchPage';
import DetailsPage from './components/DetailsPage/DetailsPage'; // 詳細ページのインポート

// Bootstrapのスタイルシートをインポート
import 'bootstrap/dist/css/bootstrap.min.css';

// カスタムCSSファイルをインポート
import './App.css';

// ナビゲーションバーコンポーネントをインポート
import Navbar from './components/Navbar/Navbar';

function App() {
  return (
    <>
      {/* ナビゲーションバーを表示 */}
      <Navbar />
      
      {/* ルーティングを定義 */}
      <Routes>
        {/* メインページのルート */}
        <Route path="/" element={<MainPage />} />
        {/* メインページの別のルート（`/app`にアクセスしてもMainPageが表示される） */}
        <Route path="/app" element={<MainPage />} />
        {/* ログインページのルート */}
        <Route path="/app/login" element={<LoginPage />} />
        {/* 会員登録ページのルート */}
        <Route path="/app/register" element={<RegisterPage />} />
        {/* 検索ページのルート */}
        <Route path="/app/search" element={<SearchPage />} />
        {/* 商品詳細ページのルート（動的な商品ID） */}
        <Route path="/app/product/:productId" element={<DetailsPage />} /> {/* DetailsPageに変更 */}
      </Routes>
    </>
  );
}

export default App;

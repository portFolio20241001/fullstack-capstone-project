// Reactライブラリをインポート
import React from 'react';
// react-router-domから必要なモジュールをインポート
import { Routes, Route, useNavigate } from 'react-router-dom';
// 各ページコンポーネントをインポート
import MainPage from './components/MainPage/MainPage';
import LoginPage from './components/LoginPage/LoginPage';
import RegisterPage from './components/RegisterPage/RegisterPage';
// Bootstrapのスタイルシートをインポート
import 'bootstrap/dist/css/bootstrap.min.css';
// カスタムCSSファイルをインポート
import './App.css';
// ナビゲーションバーコンポーネントをインポート
import Navbar from './components/Navbar/Navbar';

function App() {
  // useNavigateフックを使用して、ページ遷移を管理
  const navigate = useNavigate();

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
      </Routes>
    </>
  );
}

// Appコンポーネントをエクスポート
export default App;

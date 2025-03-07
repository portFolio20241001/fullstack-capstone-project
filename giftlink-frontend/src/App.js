// ReactとReact Routerの機能をインポート
import React, { useState } from 'react'; // ReactライブラリとuseStateフックをインポート
import { Routes, Route } from 'react-router-dom'; // React Routerのルーティング機能をインポート

// 各ページコンポーネントをインポート
import InitialPage from './components/InitialPage/InitialPage'; // 初期ページのコンポーネント
import MainPage from './components/MainPage/MainPage'; // メインページのコンポーネント
import LoginPage from './components/LoginPage/LoginPage'; // ログインページのコンポーネント
import RegisterPage from './components/RegisterPage/RegisterPage'; // 新規登録ページのコンポーネント
import SearchPage from './components/SearchPage/SearchPage'; // 検索ページのコンポーネント
import DetailsPage from './components/DetailsPage/DetailsPage'; // 商品詳細ページのコンポーネント
import Profile from './components/Profile/Profile'; // プロフィールページのコンポーネント

// Bootstrapのスタイルシートをインポート
import 'bootstrap/dist/css/bootstrap.min.css'; // BootstrapのCSSをインポート
import './App.css'; // アプリケーションのカスタムCSSをインポート

// ナビゲーションバーコンポーネントをインポート
import Navbar from './components/Navbar/Navbar'; // ナビゲーションバーのコンポーネントをインポート

function App() {
  const [visited, setVisited] = useState(false); // 初回訪問かどうかを管理するstate

  return (
    <>
      {/* ナビゲーションバーを表示 */}
      <Navbar /> 
      <Routes>
        {/* 初回訪問時に InitialPage を表示 */}
        {!visited ? (
          <Route path="/" element={<InitialPage onVisit={() => setVisited(true)} />} /> // 初回訪問時の処理
        ) : (
          <Route path="/" element={<MainPage />} /> // それ以降はMainPageを表示
        )}
        <Route path="/app" element={<MainPage />} /> // /appパスでMainPageを表示
        <Route path="/app/login" element={<LoginPage />} /> // /app/loginでLoginPageを表示
        <Route path="/app/register" element={<RegisterPage />} /> // /app/registerでRegisterPageを表示
        <Route path="/app/search" element={<SearchPage />} /> // /app/searchでSearchPageを表示
        <Route path="/app/product/:productId" element={<DetailsPage />} /> // 商品詳細ページ
        <Route path="/app/profile" element={<Profile />} /> // プロフィールページを表示
      </Routes>
    </>
  );
}

export default App; // Appコンポーネントをエクスポート

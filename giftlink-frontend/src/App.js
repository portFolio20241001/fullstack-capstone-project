import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';

// 各ページコンポーネントをインポート
import InitialPage from './components/InitialPage/InitialPage'; // 初期ページ
import MainPage from './components/MainPage/MainPage';
import LoginPage from './components/LoginPage/LoginPage';
import RegisterPage from './components/RegisterPage/RegisterPage';
import SearchPage from './components/SearchPage/SearchPage';
import DetailsPage from './components/DetailsPage/DetailsPage';
import Profile from './components/Profile/Profile';

// Bootstrapのスタイルシートをインポート
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// ナビゲーションバーコンポーネント
import Navbar from './components/Navbar/Navbar';

function App() {
  const [visited, setVisited] = useState(false); // 初回訪問かどうかを管理

  return (
    <>
      <Navbar />
      <Routes>
        {/* 初回訪問時に InitialPage を表示 */}
        {!visited ? (
          <Route path="/" element={<InitialPage onVisit={() => setVisited(true)} />} />
        ) : (
          <Route path="/" element={<MainPage />} />
        )}
        <Route path="/app" element={<MainPage />} />
        <Route path="/app/login" element={<LoginPage />} />
        <Route path="/app/register" element={<RegisterPage />} />
        <Route path="/app/search" element={<SearchPage />} />
        <Route path="/app/product/:productId" element={<DetailsPage />} />
        <Route path="/app/profile" element={<Profile/>} />
      </Routes>
    </>
  );
}

export default App;

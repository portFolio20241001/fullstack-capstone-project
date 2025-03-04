import React from 'react';

// Navbarコンポーネントを定義
export default function Navbar() {
    return (
        // ナビゲーションバーを定義
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            {/* ロゴとしてリンクを表示 */}
            <a className="navbar-brand" href="/">GiftLink</a>

            {/* ナビゲーションメニューの表示・非表示を管理するためのコンテナ */}
            <div className="collapse navbar-collapse" id="navbarNav">
                {/* ナビゲーション項目のリスト */}
                <ul className="navbar-nav">
                    {/* ホームページへのリンク */}
                    <li className="nav-item">
                        {/* ホームページへのリンク設定 */}
                        <a className="nav-link" href="/home.html">Home</a> {/* home.html へのリンク */}
                    </li>
                    
                    {/* ギフトページへのリンク */}
                    <li className="nav-item">
                        {/* ギフトページへのリンク設定 */}
                        <a className="nav-link" href="/app">Gifts</a> {/* ギフトページへの更新されたリンク */}
                    </li>
                </ul>
            </div>
        </nav>
    );
}

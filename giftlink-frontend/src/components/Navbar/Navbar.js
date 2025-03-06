import React, { useEffect } from 'react';                   // Reactをインポート
import { Link, useNavigate } from 'react-router-dom';       // LinkとuseNavigateをインポート
import { useAppContext } from '../../context/AuthContext';  // アプリケーションの状態管理用コンテキストをインポート

// Navbarコンポーネントを定義
export default function Navbar() {  
    // コンテキストからログイン状態、ユーザー名を取得
    const { isLoggedIn, setIsLoggedIn, userName, setUserName } = useAppContext();  

    const navigate = useNavigate();  // ページ遷移を制御するためのuseNavigateを定義

    // コンポーネントがマウントされた際に実行される副作用処理
    // isLoggedIn、setIsLoggedIn、setUserNameが変更された時にも再実行される
    useEffect(() => {  
        const authTokenFromSession = sessionStorage.getItem('auth-token');  // セッションから認証トークンを取得
        const nameFromSession = sessionStorage.getItem('name');             // セッションからユーザー名を取得

        // 認証トークンが存在する場合
        if (authTokenFromSession) {  
            if (isLoggedIn && nameFromSession) {    // すでにログインしている場合
                setUserName(nameFromSession);           // ユーザー名を設定
            } else {                                // ログインしていない場合
                sessionStorage.removeItem('auth-token');    // セッションから認証トークンを削除
                sessionStorage.removeItem('name');          // セッションから名前を削除
                sessionStorage.removeItem('email');         // セッションからメールを削除
                setIsLoggedIn(false);                       // ログイン状態をfalseに設定
            }
        }
    }, [isLoggedIn, setIsLoggedIn, setUserName]);  // isLoggedIn、setIsLoggedIn、setUserNameが変更された時に再実行

    // ログアウト処理
    const handleLogout = () => {  
        sessionStorage.removeItem('auth-token');    // セッションから認証トークンを削除
        sessionStorage.removeItem('name');          // セッションから名前を削除
        sessionStorage.removeItem('email');         // セッションからメールを削除
        setIsLoggedIn(false);                       // ログイン状態をfalseに設定
        navigate(`/app`);                           // アプリのトップページに遷移
    };

    // プロフィールページに遷移する処理
    const profileSecton = () => {  
        navigate(`/app/profile`);  // プロフィールページに遷移
    };


    return (  // JSXでナビゲーションバーを描画
    <>
        {/* ナビゲーションバーの開始 */}
        <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top" id='navbar_container'> 

            <div className='navbar-brand'>
                {/* ブランド名リンク */}
                <Link className="navbar-brand-link" to="/app">GiftLink</Link>  
            </div>


            {/* ナビゲーションのトグルボタン */}
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">  
                <span className="navbar-toggler-icon"></span>  {/* トグルアイコン */}
            </button>

            {/* ナビゲーションメニューのコンテンツ */}
            <div className="collapse navbar-collapse justify-content-end" id="navbarNav">  
                {/* ナビゲーションメニューのリスト */}
                <ul className="navbar-nav">  
                    {/* ギフトページへのリンク */}
                    <li className="nav-item">
                        <Link className="nav-link" to="/app">Gifts</Link>  
                    </li>
                    {/* 検索ページへのリンク */}
                    <li className="nav-item">
                        <Link className="nav-link" to="/app/search">Search</Link>  
                    </li>
                    {/* ログイン状態に応じたナビゲーション */}
                    <ul className="navbar-nav ml-auto">  
                        {isLoggedIn ? (  // ログインしている場合
                        <>
                            <li className="nav-item">
                                {/* ユーザー名の表示 */}
                                <span className="nav-link" style={{ color: "black", cursor: "pointer" }} onClick={profileSecton}>
                                    Welcome, {userName}
                                </span>  
                            </li>
                            <li className="nav-item">
                                {/* ログアウトボタン */}
                                <button className="nav-link login-btn" onClick={handleLogout}>Logout</button>  
                            </li>
                        </>
                        ) : (  // ログインしていない場合
                        <>
                            <li className="nav-item">
                                {/* ログインページへのリンク */}
                                <Link className="nav-link login-btn" to="/app/login">Login</Link>  
                            </li>
                            <li className="nav-item">
                                {/* 登録ページへのリンク */}
                                <Link className="nav-link register-btn" to="/app/register">Register</Link>  
                            </li>
                        </>
                        )}
                    </ul>
                </ul>
            </div>

        </nav>  {/* ナビゲーションバーの終了 */}
    </>
    );
}  // Navbarコンポーネントの終了

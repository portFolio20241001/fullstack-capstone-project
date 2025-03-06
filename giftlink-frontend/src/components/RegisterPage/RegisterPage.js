import React, { useState } from 'react';                    // ReactとuseStateフックをインポート
import {urlConfig} from '../../config';                     // 設定ファイルからURL情報をインポート
import { useAppContext } from '../../context/AuthContext';  // 認証用のコンテキストをインポート
import { useNavigate } from 'react-router-dom';             // React Routerのナビゲーションフックをインポート

import './RegisterPage.css';    // スタイルシートをインポート

import { Link } from 'react-router-dom';  // Link をインポート

// RegisterPageコンポーネントを定義
function RegisterPage() {
    // ユーザーの入力値を管理するためのステートを定義
    const [firstName, setFirstName] = useState(''); // 名
    const [lastName, setLastName] = useState('');   // 姓
    const [email, setEmail] = useState('');         // メールアドレス
    const [password, setPassword] = useState('');   // パスワード

    // エラーメッセージを表示するためのステートを定義
    const [showerr, setShowerr] = useState('');

    // ナビゲーションを制御するための関数を取得
    const navigate = useNavigate();
    
    // 認証状態を管理する関数を取得
    const { setIsLoggedIn } = useAppContext();

    // ユーザー登録処理を行う関数
    const handleRegister = async () => {
        // APIエンドポイントに対してPOSTリクエストを送信
        const response = await fetch(`${urlConfig.backendUrl}/api/auth/register`, {
            method: 'POST', // HTTPメソッドをPOSTに指定
            headers: {
                'content-type': 'application/json', // JSONデータを送信するためのヘッダー設定
            },
            body: JSON.stringify({      // ユーザーの入力データをJSON形式で送信
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: password
            })
        });

        // サーバーからのレスポンスをJSON形式で取得
        const json = await response.json();
        console.log('json data', json); // レスポンスデータをコンソールに出力
        console.log('er', json.error); // エラーメッセージをコンソールに出力

        // サーバーが認証トークンを返した場合の処理
        if (json.authtoken) {
            sessionStorage.setItem('auth-token', json.authtoken);   // 認証トークンをセッションストレージに保存
            sessionStorage.setItem('name', firstName);              // ユーザー名をセッションストレージに保存
            sessionStorage.setItem('email', json.email);            // メールアドレスをセッションストレージに保存
            setIsLoggedIn(true);                                    // ログイン状態をtrueに設定
            navigate('/app');                                       // ユーザーをアプリのメインページへ遷移
        }

        // サーバーがエラーを返した場合の処理
        if (json.error) {
            setShowerr(json.error); // エラーメッセージをステートに設定
        }
    }

    return (
        // 登録ページの全体コンテナ
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-4">
                    <div className="register-card p-4 border rounded">
                        <h2 className="text-center mb-4 font-weight-bold">Register</h2>

                        {/* 名の入力フィールド */}
                        <div className="mb-3">
                            <label htmlFor="firstName" className="form-label">FirstName</label>
                            <input
                                id="firstName"
                                type="text"
                                className="form-control"
                                placeholder="Enter your firstName"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                        </div>

                        {/* 姓の入力フィールド */}
                        <div className="mb-3">
                            <label htmlFor="lastName" className="form-label">LastName</label>
                            <input
                                id="lastName"
                                type="text"
                                className="form-control"
                                placeholder="Enter your lastName"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        </div>

                        {/* メールアドレスの入力フィールド */}
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input
                                id="email"
                                type="text"
                                className="form-control"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            {/* エラーメッセージ表示用の要素 */}
                            <div className="text-danger">{showerr}</div>
                        </div>

                        {/* パスワードの入力フィールド */}
                        <div className="mb-4">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input
                                id="password"
                                type="password"
                                className="form-control"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        {/* 登録ボタン */}
                        <button className="btn btn-primary w-100 mb-3" onClick={handleRegister}>Register</button>

                        {/* 既存ユーザー向けのログインリンク */}
                        <p className="mt-4 text-center">
                            Already a member? <Link to="/app/login" className="text-primary">Login</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

// コンポーネントをエクスポート
export default RegisterPage;
// ReactとuseStateフックをインポート
import React, { useState } from 'react';

// スタイルシートをインポート
import './RegisterPage.css';

// 登録ページ
function RegisterPage() {
    // 各フォームフィールドの状態を管理するためのuseStateフックを設定
    const [firstName, setFirstName] = useState('');  // 名
    const [lastName, setLastName] = useState('');    // 姓
    const [email, setEmail] = useState('');          // メールアドレス
    const [password, setPassword] = useState('');    // パスワード

    // 登録ボタンが押されたときに呼ばれる非同期関数
    const handleRegister = async () => {
        console.log("Register invoked")  // 登録が実行されたことをコンソールに表示
    }

    return (
        // メインのコンテナ
        <div className="container mt-5">
            <div className="row justify-content-center">     {/* 行を中央揃えにする */}
                <div className="col-md-6 col-lg-4">          {/* 画面サイズがmd（中）以上では6列、lg（大）以上では4列 */}
                    {/* 登録カードのスタイルを設定 */}
                    <div className="register-card p-4 border rounded">
                        {/* タイトル（登録フォームの見出し） */}
                        <h2 className="text-center mb-4 font-weight-bold">Register</h2>

                        {/* 名の入力フィールド */}
                        <div className="mb-3">
                            <label htmlFor="firstName" className="form-label">FirstName</label>
                            <input
                                id="firstName"                  // 入力フィールドのID
                                type="text"                     // テキスト入力フィールド
                                className="form-control"         // Bootstrapのフォームコントロールクラスを適用
                                placeholder="Enter your firstName"  // プレースホルダー
                                value={firstName}                // フィールドの現在の値
                                onChange={(e) => setFirstName(e.target.value)}  // 入力時に状態を更新
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
                                onChange={(e) => setLastName(e.target.value)}  // 入力時に状態を更新
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
                                onChange={(e) => setEmail(e.target.value)}  // 入力時に状態を更新
                            />
                        </div>

                        {/* パスワードの入力フィールド */}
                        <div className="mb-4">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input
                                id="password"
                                type="password"                // パスワード入力フィールド
                                className="form-control"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}  // 入力時に状態を更新
                            />
                        </div>

                        {/* 登録ボタン */}
                        <button className="btn btn-primary w-100 mb-3" onClick={handleRegister}>Register</button>

                        {/* 既に会員の方へのログインリンク */}
                        <p className="mt-4 text-center">
                            Already a member? <a href="/app/login" className="text-primary">Login</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

// RegisterPageコンポーネントをエクスポート
export default RegisterPage;

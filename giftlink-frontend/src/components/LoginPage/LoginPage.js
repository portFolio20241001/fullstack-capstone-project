import React, { useState, useEffect } from 'react';  // React と useState, useEffect をインポート

// スタイルシートのインポート
import './LoginPage.css';

function LoginPage() {
    // メールアドレスの状態を管理するための useState
    const [email, setEmail] = useState('');
    // パスワードの状態を管理するための useState
    const [password, setPassword] = useState('');

    // ログイン処理を行う非同期関数
    const handleLogin = async (e) => {
        e.preventDefault();  // デフォルトのフォーム送信を防止
    }

    return (
        // 画面全体を囲むコンテナ
        <div className="container mt-5">
            {/* 行を中央揃えにする */}
            <div className="row justify-content-center">
                {/* 中央に配置するためのカラム設定 */}
                <div className="col-md-6 col-lg-4">
                    {/* ログインカードのスタイルを適用 */}
                    <div className="login-card p-4 border rounded">
                        {/* ログインフォームのタイトル */}
                        <h2 className="text-center mb-4 font-weight-bold">Login</h2>

                        {/* メールアドレス入力フィールド */}
                        <div className="mb-3">
                            {/* メールアドレスのラベル */}
                            <label htmlFor="email" className="form-label">Email</label>
                            {/* メールアドレスの入力フィールド */}
                            <input
                                id="email"  // 入力フィールドのid
                                type="text"  // 入力タイプをテキストに設定
                                className="form-control"  // Bootstrapのフォームコントロールを適用
                                placeholder="Enter your email"  // プレースホルダーの設定
                                value={email}  // stateの値を表示
                                onChange={(e) => setEmail(e.target.value)}  // 入力内容が変わるたびにstateを更新
                            />
                        </div>

                        {/* パスワード入力フィールド */}
                        <div className="mb-4">
                            {/* パスワードのラベル */}
                            <label htmlFor="password" className="form-label">Password</label>
                            {/* パスワードの入力フィールド */}
                            <input
                                id="password"  // 入力フィールドのid
                                type="password"  // 入力タイプをパスワードに設定
                                className="form-control"  // Bootstrapのフォームコントロールを適用
                                placeholder="Enter your password"  // プレースホルダーの設定
                                value={password}  // stateの値を表示
                                onChange={(e) => setPassword(e.target.value)}  // 入力内容が変わるたびにstateを更新
                            />
                        </div>

                        {/* ログインボタン。クリック時にhandleLogin関数が呼ばれる */}
                        <button className="btn btn-primary w-100 mb-3" onClick={handleLogin}>Login</button>

                        {/* 新規登録を促すリンク */}
                        <p className="mt-4 text-center">
                            New here? <a href="/app/register" className="text-primary">Register Here</a>  {/* 新規登録ページへのリンク */}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;  // LoginPageコンポーネントをエクスポート

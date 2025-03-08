import React, { useState, useEffect } from 'react';         // React ライブラリと useState, useEffect フックをインポート
import { urlConfig } from '../../config';                   // 設定ファイルから URL 設定をインポート
import { useAppContext } from '../../context/AuthContext';  // 認証コンテキストから `useAppContext` をインポート
import { useNavigate } from 'react-router-dom';             // React Router の `useNavigate` フックをインポート（ページ遷移用）
import { Link } from 'react-router-dom';                    // React Router の `Link` コンポーネントをインポート（リンク作成用）

// ログインページのスタイルシートをインポート
import './LoginPage.css';

// ログインページコンポーネントの定義
function LoginPage() {
    // メールアドレスの入力値を管理するための state（初期値は空文字）
    const [email, setEmail] = useState('');

    // パスワードの入力値を管理するための state（初期値は空文字）
    const [password, setPassword] = useState('');

    // 認証エラーメッセージを管理するための state（初期値は空文字）
    const [incorrect, setIncorrect] = useState('');

    // ページ遷移を制御するための useNavigate フックを使用
    const navigate = useNavigate();

    // セッションストレージから Bearer トークンを取得（なければ null）
    const bearerToken = sessionStorage.getItem('bearer-token');

    // グローバルな認証状態を管理するコンテキストから setIsLoggedIn 関数を取得
    const { setIsLoggedIn } = useAppContext();

    // コンポーネントがマウントされた際に実行される useEffect フック
    useEffect(() => {
        // すでに認証トークンが存在する場合、メインページへリダイレクト
        if (sessionStorage.getItem('auth-token')) {
            navigate('/app');
        }
    }, [navigate]); // 依存配列に navigate を指定し、変更時に再実行

    // ログイン処理を実行する関数（非同期処理）
    const handleLogin = async (e) => {
        e.preventDefault(); // フォームのデフォルト送信を防止

        // ログイン API にリクエストを送信
        const res = await fetch(`${urlConfig.backendUrl}/api/auth/login`, {
            method: 'POST', // HTTP メソッドを POST に設定
            headers: {
                'content-type': 'application/json', // リクエストのデータ形式を JSON に指定
                'Authorization': bearerToken ? `Bearer ${bearerToken}` : '', // Bearer トークンがあれば追加
            },
            body: JSON.stringify({
                email: email,       // 入力されたメールアドレスを送信
                password: password, // 入力されたパスワードを送信
            }),
        });

        // レスポンスを JSON に変換
        const json = await res.json();
        console.log('Json', json); // デバッグ用にレスポンスを出力

        // 認証トークンが含まれている場合、ログイン成功と判断
        if (json.authtoken) {
            // 認証情報をセッションストレージに保存
            sessionStorage.setItem('auth-token', json.authtoken);
            sessionStorage.setItem('name', json.userName);
            sessionStorage.setItem('email', json.userEmail);

            // ログイン状態を更新
            setIsLoggedIn(true);

            // メインページへリダイレクト
            navigate('/app');
        } else {
            // ログイン失敗時の処理
            setEmail(''); // メールアドレス入力欄をクリア
            setPassword(''); // パスワード入力欄をクリア
            console.log(json.error); // エラーメッセージをコンソールに出力

            // エラーメッセージを適切に設定
            if (json.error === 'パスワードが間違っています') {
                setIncorrect("パスワードが間違っています。もう一度試してください。");
            } else if (json.error === 'ユーザーが見つかりません。登録されていないメールアドレスです。') {
                setIncorrect("このメールアドレスは登録されていません。");
            } else {
                setIncorrect("ログインに失敗しました。もう一度お試しください。");
            }

            // 以前のエラーメッセージをクリアするためのタイマー設定
            if (window.errorTimeout) clearTimeout(window.errorTimeout);
            window.errorTimeout = setTimeout(() => setIncorrect(""), 3000);
        }
    };

    return (
        // 画面全体を囲むコンテナ
        <div className="container mt-5">
            {/* 画面中央に配置する行 */}
            <div className="row justify-content-center">
                {/* 中央配置用のカラム設定 */}
                <div className="col-md-6 col-lg-4">
                    {/* ログインフォームのカードデザイン */}
                    <div className="login-card p-4 border rounded">
                        {/* タイトル（中央配置・太字） */}
                        <h2 className="text-center mb-4 font-weight-bold">Login</h2>

                        {/* ログインフォーム */}
                        <form onSubmit={handleLogin}>
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
                            </div>
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
                            {/* エラーメッセージ（エラー時に表示） */}
                            {incorrect && <p className="text-danger text-center">{incorrect}</p>}
                            {/* ログインボタン */}
                            <button type="submit" className="btn btn-primary w-100 mb-3">Login</button>
                        </form>

                        {/* 新規登録ページへのリンク */}
                        <p className="mt-4 text-center">
                            New here? <Link to="/app/register" className="text-primary">Register Here</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

// LoginPage コンポーネントをエクスポート
export default LoginPage;

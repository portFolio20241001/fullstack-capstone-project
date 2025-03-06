import React, { useState, useEffect } from 'react';         // React と useState, useEffect をインポート
import { urlConfig } from '../../config';                   // ステップ1 - タスク1: 設定ファイルから URL 設定をインポート
import { useAppContext } from '../../context/AuthContext';  // ステップ1 - タスク2: 認証コンテキストから `useAppContext` をインポート
import { useNavigate } from 'react-router-dom';             // ステップ1 - タスク3: React Router の `useNavigate` フックをインポート（ページ遷移用）


// スタイルシートのインポート
import './LoginPage.css';

function LoginPage() {
    // ReactのuseStateフックを使用して、emailの状態を管理
    const [email, setEmail] = useState('');

    // ReactのuseStateフックを使用して、passwordの状態を管理
    const [password, setPassword] = useState('');

    // ユーザーが間違ったパスワードを入力した際に、エラーメッセージを表示するための状態
    const [incorrect, setIncorrect] = useState('');

    // React RouterのuseNavigateフックを使用して、ページ遷移を管理
    const navigate = useNavigate();

    // セッションストレージから認証トークン（Bearerトークン）を取得
    const bearerToken = sessionStorage.getItem('bearer-token');

    // グローバルなログイン状態を管理するコンテキストからsetIsLoggedIn関数を取得
    const { setIsLoggedIn } = useAppContext();

    // コンポーネントがマウントされたときに実行される副作用処理
    useEffect(() => {
        // セッションストレージに認証トークンが存在する場合、アプリのメインページへリダイレクト
        if (sessionStorage.getItem('auth-token')) {
            navigate('/app');
        }
    }, [navigate]);

    // ログイン処理を行う関数
    const handleLogin = async (e) => {
        e.preventDefault(); // フォームのデフォルト送信を防ぐ

        // APIエンドポイントに対してログインリクエストを送信
        const res = await fetch(`${urlConfig.backendUrl}/api/auth/login`, {
            method: 'POST', // HTTPメソッドをPOSTに設定
            headers: {
                'content-type': 'application/json', // リクエストボディのデータ形式をJSONに指定
                'Authorization': bearerToken ? `Bearer ${bearerToken}` : '', // Bearerトークンがあればヘッダーに追加
            },
            body: JSON.stringify({
                email: email,       // 入力されたメールアドレスを送信
                password: password, // 入力されたパスワードを送信
            }),
        });

        // レスポンスをJSON形式に変換
        const json = await res.json();
        console.log('Json', json); // デバッグ用にJSONデータをコンソールに出力

        // 認証トークンがレスポンスに含まれている場合
        if (json.authtoken) {
            // セッションストレージに認証情報を保存
            sessionStorage.setItem('auth-token', json.authtoken);
            sessionStorage.setItem('name', json.userName);
            sessionStorage.setItem('email', json.userEmail);

            // ログイン状態をtrueに設定
            setIsLoggedIn(true);

            // アプリのメインページへリダイレクト
            navigate('/app');
        } else {
            // ログイン失敗時の処理
            document.getElementById("email").value = ""; // メールアドレス入力欄をクリア
            document.getElementById("password").value = ""; // パスワード入力欄をクリア
            setIncorrect("パスワードが間違っています。もう一度試してください。"); // エラーメッセージを表示
            
            // 2秒後にエラーメッセージを非表示にする
            setTimeout(() => {
                setIncorrect("");
            }, 2000);
        }
    };

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

                        {/* エラーメッセージを表示するセクション */}
                        {incorrect && <p className="text-danger text-center">{incorrect}</p>} 

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

import React, { useEffect, useState } from "react";          // Reactの基本フックをインポート
import { useNavigate } from "react-router-dom";              // ルーティング用のフックをインポート
import './Profile.css'                                       // CSSファイルをインポート
import {urlConfig} from '../../config';                      // 設定ファイルからURL情報をインポート
import { useAppContext } from '../../context/AuthContext';   // コンテキストをインポート

const Profile = () => {
  const [userDetails, setUserDetails] = useState({});       // ユーザーの詳細情報を管理する状態
  const [updatedDetails, setUpdatedDetails] = useState({}); // 更新後のユーザー情報を管理する状態
  const { setUserName } = useAppContext();                  // コンテキストからユーザー名の更新関数を取得
  const [changed, setChanged] = useState("");               // 更新メッセージを管理する状態

  const [editMode, setEditMode] = useState(false);          // 編集モードの状態を管理
  const navigate = useNavigate();                           // ナビゲーション用の関数を取得

  useEffect(() => {
    const authtoken = sessionStorage.getItem("auth-token"); // 認証トークンを取得
    if (!authtoken) {
      navigate("/app/login");     // 未ログインの場合はログイン画面へ遷移
    } else {
      fetchUserProfile();       // ユーザープロフィールを取得
    }
  }, [navigate]);

  // ユーザーのプロフィール情報を取得する関数
  const fetchUserProfile = async () => {
    try {
      const authtoken = sessionStorage.getItem("auth-token");   // 認証トークンを取得
      const email = sessionStorage.getItem("email");            // ユーザーのメールアドレスを取得
      const name = sessionStorage.getItem("name");              // ユーザー名を取得

        // name または authtoken が存在する場合
        if (name || authtoken) {
            // ユーザー情報をオブジェクトとして格納
            const storedUserDetails = {
            name: name,  // ユーザーの名前
            email: email // ユーザーのメールアドレス
            };
  

        setUserDetails(storedUserDetails);      // ユーザー詳細を更新
        setUpdatedDetails(storedUserDetails);   // 更新用のデータも設定
      }
    } catch (error) {
      console.error(error);
      // エラー発生時の処理
    }
  };

  // 編集モードに切り替える関数
  const handleEdit = () => {
    setEditMode(true);
  };

  // 入力変更時に状態を更新する関数
  const handleInputChange = (e) => {
    setUpdatedDetails({
      ...updatedDetails,
      [e.target.name]: e.target.value,
    });
  };

  // フォーム送信時の処理
  const handleSubmit = async (e) => {
    e.preventDefault(); // デフォルトの送信動作を防ぐ

    try {
      const authtoken = sessionStorage.getItem("auth-token");   // 認証トークンを取得
      const email = sessionStorage.getItem("email");            // ユーザーのメールアドレスを取得

      if (!authtoken || !email) {
        navigate("/app/login"); // 未認証の場合はログイン画面へ遷移
        return;
      }

      const payload = { ...updatedDetails }; // 更新データを作成
      const response = await fetch(`${urlConfig.backendUrl}/api/auth/update`, {
        method: "PUT", // HTTPリクエストのメソッドを指定
        headers: {
          "Authorization": `Bearer ${authtoken}`,   // 認証トークンをヘッダーに追加
          "Content-Type": "application/json",       // JSONデータを送信
          "Email": email,                           // ユーザーのメールアドレスをヘッダーに追加
        },
        body: JSON.stringify(payload), // JSON形式でデータを送信
      });

      if (response.ok) {
        // 更新が成功した場合
        setUserName(updatedDetails.name);                       // コンテキストのユーザー名を更新
        sessionStorage.setItem("name", updatedDetails.name);    // セッションストレージのユーザー名を更新
        setUserDetails(updatedDetails);                         // ユーザー詳細を更新
        setEditMode(false);                                     // 編集モードを終了
        setChanged("名前が正常に変更されました！");               // 成功メッセージを表示

        // 一定時間後にメッセージを消してトップページへ遷移
        setTimeout(() => {
          setChanged("");
          navigate("/");
        }, 1000);
      } else {
        console.log("エラーポイント1")

        // エラーメッセージを取得してスロー
        const errorData = await response.json();
        const errorMessages = errorData.errors.map(error => error.msg).join(", ");
        throw new Error(`エラー!プロフィールの更新に失敗しました: ${errorMessages}`); // エラーをスロー

      }
    } catch (error) {
        console.log("エラーポイント2")
        console.error(error);
        // エラー発生時の処理
        setChanged(error.message); // throwしたエラーメッセージを表示
    }
  };

  return (
    <div className="profile-container">
      {editMode ? ( // 編集モードの場合のUI
        <form onSubmit={handleSubmit}>
          <label>
            Email
            <input
              type="email"
              name="email"
              value={userDetails.email}
              disabled // メールアドレスは変更不可
            />
          </label>
          <label>
            Name
            <input
              type="text"
              name="name"
              value={updatedDetails.name}
              onChange={handleInputChange} // ユーザー名変更時の処理
            />
          </label>
          <button type="submit">保存</button> {/* 保存ボタン */}
          
        {/* メッセージ表示エリア */}
        {changed && (
          <div className={`feedback-message ${changed.includes('正常') ? 'success' : 'error'}`}>
            {changed}
          </div>
        )}

        </form>
      ) : ( // 通常表示モードの場合のUI
        <div className="profile-details">
          <h1>こんにちは, {userDetails.name}</h1>
          <p> <b>Email:</b> {userDetails.email}</p>
          <button onClick={handleEdit}>編集</button> {/* 編集ボタン */}
          <span 
            style={{
              color: 'green',
              height: '.5cm',
              display: 'block',
              fontStyle: 'italic',
              fontSize: '12px'
            }}>
            {changed}
          </span> {/* 更新メッセージを表示 */}
        </div>
      )}
    </div>
  );
};

export default Profile; // Profileコンポーネントをエクスポート

import React, { useEffect, useState } from 'react';  // ReactライブラリとuseEffect、useStateフックをインポート
import { useParams, useNavigate } from 'react-router-dom';  // useParamsとuseNavigateをインポート（URLパラメータとページ遷移に使用）
import './DetailsPage.css';  // スタイルシートをインポート
import { urlConfig } from '../../config';  // URL設定をインポート（バックエンドAPIのURLなど）

//　詳細ページ
function DetailsPage() {
    // ページ遷移を行うためのフック
    const navigate = useNavigate();
    // URLパラメータからproductIdを取得
    const { productId } = useParams();
    // ギフトデータを格納するための状態
    const [gift, setGift] = useState(null);
    // ローディング中かどうかを管理する状態
    const [loading, setLoading] = useState(true);
    // エラーを管理する状態
    const [error, setError] = useState(null);

    useEffect(() => {
        // セッションストレージから認証トークンを取得
        const authenticationToken = sessionStorage.getItem('auth-token');
        
        // 認証トークンがない場合、ログインページにリダイレクト
        if (!authenticationToken) {
            navigate('/app/login');
        }

        // ギフト情報を取得する非同期関数
        const fetchGift = async () => {
            try {
                // ギフト情報を取得するURLを設定
                const url = `${urlConfig.backendUrl}/api/gifts/${productId}`;
                
                // URLに対してGETリクエストを送信
                const response = await fetch(url);

                // レスポンスが正常でない場合、エラーを投げる
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                // レスポンスのJSONデータを取得
                const data = await response.json();

                // 取得したデータをgiftステートに設定
                setGift(data);
            } catch (error) {
                // エラーが発生した場合、そのエラーメッセージをセット
                setError(error.message);
            } finally {
                // データ取得完了後、ローディング状態をfalseに変更
                setLoading(false);
            }
        };

        // ギフト情報を取得
        fetchGift();

        // ページがマウントされた際にスクロール位置を一番上に設定
        window.scrollTo(0, 0);

    }, [productId, navigate]);  // productIdまたはnavigateが変更されるたびに実行される

    // 戻るボタンがクリックされたときの処理
    const handleBackClick = () => {
        // 1つ前のページに戻る
        navigate(-1);
    };

    // コメントデータ（ハードコード）
    const comments = [
        {
            author: "John Doe",  // コメント投稿者の名前
            comment: "I would like this!"  // コメント内容
        },
        {
            author: "Jane Smith",
            comment: "Just DMed you."
        },
        {
            author: "Alice Johnson",
            comment: "I will take it if it's still available."
        },
        {
            author: "Mike Brown",
            comment: "This is a good one!"
        },
        {
            author: "Sarah Wilson",
            comment: "My family can use one. DM me if it is still available. Thank you!"
        }
    ];

    // ローディング中の場合、ローディングメッセージを表示
    if (loading) return <div>Loading...</div>;

    // エラーが発生した場合、エラーメッセージを表示
    if (error) return <div>Error: {error}</div>;

    // ギフトが見つからなかった場合、「Gift not found」を表示
    if (!gift) return <div>Gift not found</div>;


    // Unixタイムスタンプを人間が読みやすい形式に変換する関数
    const formatDate = (timestamp) => { // 詳細ページへ遷移する関数
        const date = new Date(timestamp * 1000); // Unix timestamp は秒単位なのでミリ秒に変換
        return date.toLocaleString(); // ローカルのフォーマットで日付を表示
    };


    return (
        <div className="container mt-5">
            {/* 戻るボタン */}
            <button className="btn btn-secondary mb-3" onClick={handleBackClick}>Back</button>
            
            {/* ギフト詳細のカードコンポーネント */}
            <div className="card product-details-card">
                <div className="card-header text-white">
                    {/* ギフト名をタイトルとして表示 */}
                    <h2 className="details-title">{gift.name}</h2>
                </div>
                <div className="card-body">
                    <div className="image-placeholder-large">
                        {gift.image ? (
                            // ギフトに画像があればその画像を表示
                            <img src={gift.image} alt={gift.name} className="product-image-large" />
                        ) : (
                            // 画像がない場合は「画像なし」のメッセージを表示
                            <div className="no-image-available-large">No Image Available</div>
                        )}
                    </div>

                    {/* ギフトの詳細情報を表示 */}
                    <p><strong>Category:</strong> 
                        {gift.category}  {/* カテゴリ */}
                    </p>
                    <p><strong>Condition:</strong> 
                        {gift.condition}  {/* 状態 */}
                    </p>
                    <p><strong>Date Added:</strong> 
                        {formatDate(gift.date_added)}  {/* 登録日 */}
                    </p>
                    <p><strong>Age (Years):</strong> 
                        {gift.age_years}  {/* ギフトの年数 */}
                    </p>
                    <p><strong>Description:</strong> 
                        {gift.description}  {/* ギフトの説明 */}
                    </p>
                </div>
            </div>
            
            {/* コメントセクション */}
            <div className="comments-section mt-4">
                <h3 className="mb-3">Comments</h3>
                {/* コメントがあればリストで表示 */}
                {comments.map((comment, index) => (
                    <div key={index} className="card mb-3">
                        <div className="card-body">
                            {/* コメントの著者名を表示 */}
                            <p className="comment-author"><strong>{comment.author}:</strong></p>
                            {/* コメント内容を表示 */}
                            <p className="comment-text">{comment.comment}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default DetailsPage;  // DetailsPageコンポーネントをエクスポート

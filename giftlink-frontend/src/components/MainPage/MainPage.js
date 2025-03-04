import React, { useState, useEffect } from 'react'; // React と必要なフックをインポート
import { useNavigate } from 'react-router-dom'; // ルーティングのための useNavigate をインポート
import { urlConfig } from '../../config'; // URL 設定をインポート

function MainPage() {
    const [gifts, setGifts] = useState([]); // ギフトデータを格納するためのステート変数
    const navigate = useNavigate(); // ページ遷移用の関数を取得

    useEffect(() => {
        // タスク1: ギフト情報をフェッチする非同期関数
        const fetchGifts = async () => {
            try {
                let url = `${urlConfig.backendUrl}/api/gifts`; // ギフトAPIのURL
                const response = await fetch(url); // API からデータを取得
                if (!response.ok) {
                    // 応答が正常でない場合
                    throw new Error(`HTTP error; ${response.status}`); // エラーをスロー
                }
                const data = await response.json(); // 応答をJSONに変換
                setGifts(data); // ギフトデータをステートに設定
            } catch (error) {
                console.log('Fetch error: ' + error.message); // エラーメッセージをログに出力
            }
        };

        fetchGifts(); // 非同期関数を呼び出し
    }, []); // 空の依存配列で初回レンダリング時にのみ実行

    // タスク2: 詳細ページへの遷移
    const goToDetailsPage = (productId) => {
        console.log("aaa")
        navigate(`/app/product/${productId}`); // 製品IDを使って詳細ページへ遷移
    };

    // タスク3: タイムスタンプをフォーマットする関数
    const formatDate = (timestamp) => {
        const date = new Date(timestamp * 1000); // タイムスタンプ（秒）をミリ秒に変換
        return date.toLocaleDateString('default', { month: 'long', day: 'numeric', year: 'numeric' }); // 日付をフォーマットして返す
    };

    // ギフトの状態に応じたCSSクラスを返す関数
    const getConditionClass = (condition) => {
        return condition === "New" ? "list-group-item-success" : "list-group-item-warning"; // 状態が "New" なら成功クラス、それ以外は警告クラス
    };

    return (
        <div className="container mt-5"> 
            <div className="row">
                {gifts.map((gift) => (
                    <div key={gift.id} className="col-md-4 mb-4"> {/* ギフトごとにカードを表示 */}
                        <div className="card product-card"> {/* ギフトのカード */}
                            
                            {/* タスク4: ギフト画像またはプレースホルダーを表示 */}
                            <div className="image-placeholder">
                                {gift.image ? (
                                    <img src={gift.image} alt={gift.name} className="card-img-top" /> // 画像があれば表示
                                ) : (
                                    <div className="no-image-available">No Image Available</div> // 画像がなければプレースホルダーを表示
                                )}
                            </div>

                            <div className="card-body"> {/* カード本体 */}
                                {/* タスク5: ギフト名を表示 */}
                                <h5 className="card-title">{gift.name}</h5> {/* ギフトの名前を表示 */}

                                {/* タスク6: フォーマットされた日付を表示 */}
                                <p className="card-text">{formatDate(gift.date_added)}</p> {/* 日付をフォーマットして表示 */}

                                <p className={`card-text ${getConditionClass(gift.condition)}`}> {/* ギフトの状態に応じたクラスを適用 */}
                                    {gift.condition}
                                </p>

                                <button onClick={() => goToDetailsPage(gift.id)} className="btn btn-primary"> {/* 詳細ページに遷移するボタン */}
                                    View Details
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default MainPage; // MainPage コンポーネントをエクスポート

import React, { useEffect, useState } from 'react'; // ReactのuseEffectとuseStateをインポート
import { useNavigate } from 'react-router-dom'; // ルーティング用のuseNavigateをインポート
import 'bootstrap/dist/css/bootstrap.min.css'; // BootstrapのCSSをインポート
import { urlConfig } from '../../config'; // バックエンドのURL設定をインポート

function SearchPage() { // 検索ページコンポーネント
    const [searchQuery, setSearchQuery] = useState(''); // 検索クエリの状態を管理
    const [ageRange, setAgeRange] = useState(1); // 年齢範囲の初期値を1に設定
    const [category, setCategory] = useState(''); // カテゴリー選択の状態
    const [condition, setCondition] = useState(''); // 商品状態選択の状態
    const [searchResults, setSearchResults] = useState([]); // 検索結果の状態を管理
    const [errorMessage, setErrorMessage] = useState(''); // エラーメッセージ用の状態
    const categories = ['Living', 'Bedroom', 'Bathroom', 'Kitchen', 'Office']; // カテゴリーの選択肢
    const conditions = ['New', 'Like New', 'Older']; // 商品の状態の選択肢

    useEffect(() => { // 初回レンダリング時に商品データを取得
        const fetchProducts = async () => { // 非同期関数でAPIからデータを取得
            try {
                let url = `${urlConfig.backendUrl}/api/gifts`; // APIのエンドポイントURLを設定
                console.log(url); // デバッグ用にURLをコンソールに出力
                const response = await fetch(url); // APIからデータを取得
                if (!response.ok) {
                    throw new Error(`HTTPエラー; ${response.status}`); // エラー処理
                }
                const data = await response.json(); // 取得したデータをJSON形式に変換
                setSearchResults(data); // 取得したデータを状態にセット
            } catch (error) {
                setErrorMessage('商品情報の取得に失敗しました。後で再試行してください。'); // ユーザー向けエラーメッセージ
                console.log('取得エラー: ' + error.message); // エラーをコンソールに出力
            }
        };

        fetchProducts(); // fetchProducts関数を実行
    }, []); // 初回マウント時のみ実行

    const handleSearch = async () => { // 検索ボタンが押されたときの処理
        const baseUrl = `${urlConfig.backendUrl}/api/search?`; // 検索APIのURLを設定
        const queryParams = new URLSearchParams({ // クエリパラメータを生成
            name: searchQuery, // 検索クエリ
            age_years: ageRange, // 年齢フィルター
            category: category, // 選択したカテゴリー
            condition: condition, // 選択した状態
        }).toString();

        try {
            const response = await fetch(`${baseUrl}${queryParams}`); // APIを呼び出し
            if (!response.ok) {
                throw new Error('検索に失敗しました'); // エラー処理
            }
            const data = await response.json(); // 取得したデータをJSON形式に変換
            setSearchResults(data); // 検索結果を状態にセット
            setErrorMessage(''); // エラーメッセージをリセット
        } catch (error) {
            setErrorMessage('検索結果の取得に失敗しました。後で再試行してください。'); // ユーザー向けエラーメッセージ
            console.error('検索結果の取得に失敗:', error); // エラーをコンソールに出力
        }
    };

    const navigate = useNavigate(); // ルーティング用のnavigate関数を取得

    const goToDetailsPage = (productId) => { // 詳細ページへ遷移する関数
        navigate(`/app/product/${productId}`); // 商品IDをURLに追加して遷移
    };

    // Unixタイムスタンプを人間が読みやすい形式に変換する関数
    const formatDate = (timestamp) => { // 詳細ページへ遷移する関数
        const date = new Date(timestamp * 1000); // Unix timestamp は秒単位なのでミリ秒に変換
        return date.toLocaleString(); // ローカルのフォーマットで日付を表示
    };


    return (
        <div className="container mt-5"> {/* メインコンテナ */}
            <div className="row justify-content-center"> {/* 中央揃えの行 */}
                <div className="col-md-6"> {/* カラム設定 */}
                    <div className="filter-section mb-3 p-3 border rounded"> {/* フィルターセクション */}
                        <h5>フィルター</h5> {/* フィルターセクションのタイトル */}
                        <div className="d-flex flex-column"> {/* フィルター項目を縦に配置 */}
                            <label htmlFor="categorySelect">カテゴリー</label> {/* カテゴリーのラベル */}
                            <select 
                                id="categorySelect" 
                                className="form-control my-1" 
                                value={category} 
                                onChange={e => setCategory(e.target.value)} // 変更時にstateを更新
                            >
                                <option value="">すべて</option> {/* 全カテゴリー選択肢 */}
                                {categories.map(category => (
                                    <option key={category} value={category}>{category}</option> 
                                ))}
                            </select>

                            <label htmlFor="conditionSelect">状態</label> {/* 状態のラベル */}
                            <select 
                                id="conditionSelect" 
                                className="form-control my-1" 
                                value={condition} 
                                onChange={e => setCondition(e.target.value)} // 変更時にstateを更新
                            >
                                <option value="">すべて</option> {/* 全状態選択肢 */}
                                {conditions.map(condition => (
                                    <option key={condition} value={condition}>{condition}</option> 
                                ))}
                            </select>

                            <label htmlFor="ageRange">リリース年が {ageRange} 年未満</label> {/* リリース年フィルターのラベル */}
                            <input
                                type="range"
                                className="form-control-range"
                                id="ageRange"
                                min="1"
                                max="10"
                                value={ageRange}
                                onChange={e => setAgeRange(e.target.value)} // スライダーの値を更新
                            />
                        </div>
                    </div>

                    <input
                        type="text"
                        className="form-control mb-2"
                        placeholder="アイテムを検索..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)} // 検索クエリを更新
                    />
                    <button className="btn btn-primary" onClick={handleSearch}>検索</button> {/* 検索ボタン */}
                    
                    {errorMessage && (
                        <div className="alert alert-danger mt-4">
                            {errorMessage} {/* エラーメッセージの表示 */}
                        </div>
                    )}

                    <div className="search-results mt-4"> {/* 検索結果の表示エリア */}
                        {searchResults.length > 0 ? (
                            searchResults.map(product => (
                                <div key={product.id} className="card mb-3"> {/* 検索結果のカード */}
                                    {/* 商品画像 */}
                                    <img src={product.image} alt={product.name} className="card-img-top" /> 
                                    <div className="card-body">
                                        {/* 商品名 */}
                                        <h5 className="card-title">{product.name}</h5> 
                                        {/* 商品説明 */}
                                        <p className="card-text">{product.description.slice(0, 100)}...</p> 

                                        <p className="card-text">リリース年：{formatDate(product.date_added)}</p> 
                                    </div>
                                    <div className="card-footer">
                                        <button onClick={() => goToDetailsPage(product.id)} className="btn btn-primary">
                                            詳細を見る
                                        </button> {/* 詳細ページへ遷移ボタン */}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="alert alert-info" role="alert">
                                商品が見つかりませんでした。フィルターを修正してください。 {/* 検索結果がない場合のメッセージ */}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SearchPage; // SearchPageコンポーネントをエクスポート

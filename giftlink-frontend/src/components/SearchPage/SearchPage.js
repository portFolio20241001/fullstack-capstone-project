import React, { useEffect, useState } from 'react'; // ReactのuseEffectとuseStateをインポート
import { useNavigate } from 'react-router-dom'; // ルーティング用のuseNavigateをインポート
import 'bootstrap/dist/css/bootstrap.min.css'; // BootstrapのCSSをインポート
import {urlConfig} from '../../config'; // バックエンドのURL設定をインポート

function SearchPage() { // 検索ページのコンポーネント定義
    const [searchQuery, setSearchQuery] = useState(''); // 検索クエリの状態を管理
    const [ageRange, setAgeRange] = useState(6); // 年齢範囲の初期値を6に設定
    const [searchResults, setSearchResults] = useState([]); // 検索結果の状態を管理
    const categories = ['Living', 'Bedroom', 'Bathroom', 'Kitchen', 'Office']; // カテゴリーの選択肢
    const conditions = ['New', 'Like New', 'Older']; // 商品の状態の選択肢

    useEffect(() => { // 初回レンダリング時に商品データを取得
        const fetchProducts = async () => { // 非同期関数でAPIからデータを取得
            try {
                let url = `${urlConfig.backendUrl}/api/gifts`; // APIのエンドポイントURLを設定
                console.log(url); // デバッグ用にURLをコンソールに出力
                const response = await fetch(url); // APIからデータを取得
                if (!response.ok) {
                    throw new Error(`HTTP error; ${response.status}`); // エラー処理
                }
                const data = await response.json(); // 取得したデータをJSON形式に変換
                setSearchResults(data); // 取得したデータを状態にセット
            } catch (error) {
                console.log('Fetch error: ' + error.message); // エラーをコンソールに出力
            }
        };

        fetchProducts(); // fetchProducts関数を実行
    }, []); // 初回マウント時のみ実行

    const handleSearch = async () => { // 検索ボタンが押されたときの処理
        const baseUrl = `${urlConfig.backendUrl}/api/search?`; // 検索APIのURLを設定
        const queryParams = new URLSearchParams({ // クエリパラメータを生成
            name: searchQuery, // 検索クエリ
            age_years: ageRange, // 年齢フィルター
            category: document.getElementById('categorySelect').value, // 選択したカテゴリー
            condition: document.getElementById('conditionSelect').value, // 選択した状態
        }).toString();

        try {
            const response = await fetch(`${baseUrl}${queryParams}`); // APIを呼び出し
            if (!response.ok) {
                throw new Error('Search failed'); // エラー処理
            }
            const data = await response.json(); // 取得したデータをJSON形式に変換
            setSearchResults(data); // 検索結果を状態にセット
        } catch (error) {
            console.error('Failed to fetch search results:', error); // エラーをコンソールに出力
        }
    };

    const navigate = useNavigate(); // ルーティング用のnavigate関数を取得

    const goToDetailsPage = (productId) => { // 詳細ページへ遷移する関数
        navigate(`/app/product/${productId}`); // 商品IDをURLに追加して遷移
    };

    return (
        <div className="container mt-5"> {/* メインコンテナ */}
            <div className="row justify-content-center"> {/* 中央揃えの行 */}
                <div className="col-md-6"> {/* カラム設定 */}
                    <div className="filter-section mb-3 p-3 border rounded"> {/* フィルターセクション */}
                        <h5>Filters</h5> {/* フィルターセクションのタイトル */}
                        <div className="d-flex flex-column"> {/* フィルター項目を縦に配置 */}
                            <label htmlFor="categorySelect">Category</label> {/* カテゴリーのラベル */}
                            <select id="categorySelect" className="form-control my-1"> {/* カテゴリー選択 */}
                                <option value="">All</option> {/* 全カテゴリー選択肢 */}
                                {categories.map(category => (
                                    <option key={category} value={category}>{category}</option> 
                                ))}
                            </select>

                            <label htmlFor="conditionSelect">Condition</label> {/* 状態のラベル */}
                            <select id="conditionSelect" className="form-control my-1"> {/* 状態選択 */}
                                <option value="">All</option> {/* 全状態選択肢 */}
                                {conditions.map(condition => (
                                    <option key={condition} value={condition}>{condition}</option> 
                                ))}
                            </select>

                            <label htmlFor="ageRange">Less than {ageRange} years</label> {/* 年齢フィルターのラベル */}
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
                        placeholder="Search for items..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)} // 検索クエリを更新
                    />
                    <button className="btn btn-primary" onClick={handleSearch}>Search</button> {/* 検索ボタン */}
                    <div className="search-results mt-4"> {/* 検索結果の表示エリア */}
                        {searchResults.length > 0 ? (
                            searchResults.map(product => (
                                <div key={product.id} className="card mb-3"> {/* 検索結果のカード */}
                                    <img src={product.image} alt={product.name} className="card-img-top" /> {/* 商品画像 */}
                                    <div className="card-body">
                                        <h5 className="card-title">{product.name}</h5> {/* 商品名 */}
                                        <p className="card-text">{product.description.slice(0, 100)}...</p> {/* 商品説明 */}
                                    </div>
                                    <div className="card-footer">
                                        <button onClick={() => goToDetailsPage(product.id)} className="btn btn-primary">
                                            View More
                                        </button> {/* 詳細ページへ遷移ボタン */}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="alert alert-info" role="alert">
                                No products found. Please revise your filters. {/* 検索結果がない場合のメッセージ */}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SearchPage; // SearchPageコンポーネントをエクスポート

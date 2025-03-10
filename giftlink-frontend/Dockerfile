# Node.js の LTS (Long Term Support) バージョンを使用
FROM node:14.17.0-slim

# 作業ディレクトリを設定
WORKDIR /usr/src/app

# package.json と package-lock.json をコンテナ内にコピー
COPY package*.json ./

# 依存関係をインストール (本番環境用)
RUN npm install --production

# アプリケーションのソースコードをコンテナ内にコピー
COPY . .

# コンテナの 9000 番ポートを開放
EXPOSE 9000

# アプリケーションを起動
CMD ["node", "index.js"]

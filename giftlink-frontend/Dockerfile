# Node.js の LTS (Long Term Support) バージョンを使用
FROM node:14.17.0-slim

# 作業ディレクトリを設定
WORKDIR /usr/src/app

# package.json と package-lock.json をコンテナ内にコピー
COPY package*.json ./

# 依存関係をインストール (開発用と本番用)
RUN npm install

# アプリケーションのソースコードをコンテナ内にコピー
COPY . .

# React アプリをビルド（本番用）
RUN npm run build

# コンテナの 9000 番ポートを開放
EXPOSE 9000

# 'npm run serve' でビルドしたアプリケーションを提供
CMD ["npm", "run", "serve"]

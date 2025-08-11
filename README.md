# React + Hono + Connect(gRPC) 最小サンプル

このリポジトリは、Hono(バックエンド)とReact(Vite)(フロントエンド)で Connect(gRPC/gRPC-web 互換) を試す最小構成です。スキーマは Protocol Buffers で定義し、Buf でコード生成します。

- サーバ: Node.js + Hono + Connect Node Adapter (/rpc プレフィックスで公開)
- フロント: React(Vite) + @connectrpc/connect-web (Vite で /rpc をサーバへプロキシ)

## セットアップ

1. 依存関係のインストール

```powershell
npm install
npm --prefix server install
npm --prefix web install
```

2. Proto からコード生成

```powershell
npm run gen
```

3. サーバ起動

```powershell
npm --prefix server run dev
```

4. フロント起動 (別ターミナル)

```powershell
npm --prefix web run dev
```

- フロント: http://localhost:5173
- サーバ: http://localhost:3000
- RPC エンドポイント: http://localhost:3000/rpc/connectrpc.eliza.v1.ElizaService/Say

Vite は /rpc へのアクセスを http://localhost:3000 にプロキシするため、CORS 設定は不要です。

## フォルダ構成

- proto: .proto スキーマ
- server: Hono + Connect サーバ
- web: React + Connect クライアント

## 参考
- Connect Docs: https://connectrpc.com/docs
- Hono Docs: https://hono.dev

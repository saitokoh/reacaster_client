# リアキャスター クライアントサイド
リアキャスターは、送信されたメッセージをクライアントに配信するアプリケーションです。

## 用意されているメッセージ送信手段
現状、メッセージを送信する手段は下記になります。
- このリポジトリに同梱されている、専用フォームからpost
- slackでメッセージを送信（詳しい手順は準備中）
- 詳細はこちら：https://github.com/saitokoh/reacaster_server

## 用意されているメッセージ受信手段
- 専用のデスクトップアプリで受信（electron）

## サーバーサイド設定方法
- このリポジトリをclone
- 必要なパッケージをインストール

```
npm install
```

- config/default.yaml.sampleをdefault.yamlにリネームして、「socket_url」を設定
  - ローカルで試す分にはそのままでOKです。
  - reacaster_serverをPaaSなどで稼働させる場合は、そのURLを設定します。
- 下記コマンドでelectronアプリを起動

```
npm run start
```

- チャンネル名に、特定のslackチャンネル名を入力して、決定
- reacaster_serverに同梱されている専用フォームを使用する場合は、チャンネル名に「form」と入力し決定
- メッセージが送信されたら、画面に流れる

- 配布用exeを作成する場合は、下記コマンドを実行（windowsのみ）

```
npm run pack
```

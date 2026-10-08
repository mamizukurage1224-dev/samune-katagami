# サムネ型紙

人物・背景の画像と文字を入れると、配置の型と雰囲気（フォント＋配色）の候補が並び、選ぶだけで 1280×720 のサムネイルを作れるツールです。
入れた画像や動画はブラウザの中だけで処理し、外部には送信しません。

## できること

- 型（配置）と雰囲気（フォント＋配色）を、並んだ候補から選ぶ
- おまかせ3案・お気に入りで、まとめて決める
- 動画ファイルから、使いたい場面を画像として取り込む
- 吹き出し・文字スタンプ・矢印などの飾りを足す
- 作りかけを残して続きから再開する／保存したサムネを履歴から開いて作り直す（このブラウザの中に保存）
- 人物の背景を消す（アニメ絵向けのAIを、このブラウザの中だけで動かす。Web版のみ）

## 中身

| ファイル | 役割 |
| --- | --- |
| `public/index.html` | 公開されるページ |
| `public/ai/` | 背景を消すAIのデータ（初めて使うときに読み込み、ブラウザに保存）。作り方は `tools/ai/README.md` |
| `public/_headers` | 公開時のヘッダー。AIを複数のCPUコアで速く動かすための設定と、AIのデータの保存期間 |
| `wrangler.jsonc` | Cloudflare Workers の設定。`public` フォルダの中身を公開します |
| `src/samune-katagami.html` | ページの本体。直すときはこのファイルを編集します |
| `tools/make-web.js` | 本体から `public/index.html` を作り直すスクリプト |

## 公開のしくみ

Cloudflare の Workers & Pages にこのリポジトリをつなぐと、`main` ブランチが更新されるたびに自動で公開されます。

- プロジェクト名：`samune-katagami`（`wrangler.jsonc` の `name` と同じにします）
- ビルドコマンド：なし
- デプロイコマンド：`npx wrangler deploy`

## 更新のしかた

1. `src/samune-katagami.html` を直す
2. `node tools/make-web.js` を実行して、`public/index.html` を作り直す
3. 変更を `main` ブランチに反映する

## フォントとAI

- Google Fonts の書体（SIL Open Font License）を読み込んで使っています。
- 背景を消すAIは、[SkyTNT/anime-segmentation](https://github.com/SkyTNT/anime-segmentation) の学習済みモデル（Apache License 2.0）を、読み込みを軽くするため形式を変えて使っています（`public/ai/anime-seg-1/README.txt`）。
- AIの実行には [ONNX Runtime Web](https://github.com/microsoft/onnxruntime)（MIT License）を使っています。

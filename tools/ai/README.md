# 背景を消すAIのデータの作り方

`public/ai/` の中身（背景を消すAI）は、次の手順で作っています。作り直すときもこの順です。

## 1. AI の実行部品（ONNX Runtime Web）

```sh
npm pack onnxruntime-web@1.30.0 && tar xzf onnxruntime-web-1.30.0.tgz
cp package/dist/ort.webgpu.min.js package/dist/ort-wasm-simd-threaded.asyncify.mjs public/ai/ort-1.30.0/
# 1ファイル 25MiB までの配信の上限におさめるため、2つに分ける
split -b 14000000 -d -a 1 --additional-suffix=.bin package/dist/ort-wasm-simd-threaded.asyncify.wasm public/ai/ort-1.30.0/ort-wasm.part
```

## 2. 学習済みモデル（SkyTNT/anime-segmentation, Apache-2.0）

```sh
# もとのモデル isnetis.onnx（SHA-256 f15622d853e8260172812b657053460e20806f04b9e05147d49af7bed31a6e99）
#   https://huggingface.co/skytnt/anime-seg/resolve/main/isnetis.onnx
pip install onnx numpy
python3 tools/ai/convert.py isnetis.onnx isnetis.f16w.onnx   # 重みを fp16 で保存（88MB）
# 変換後の SHA-256: 87f57a2c2cebaf2ba0c71111dab6e262eac25e06a5e32a87ced41d7283508245
split -b 23000000 -d -a 1 --additional-suffix=.bin isnetis.f16w.onnx public/ai/anime-seg-1/model.part
```

## 3. ページの中の一覧を合わせる

分けたファイルの名前と大きさ（バイト）は、`src/samune-katagami.html` の `AI_PARTS` に書いてあります。
ファイルを変えたときは、フォルダ名（`anime-seg-1`、`ort-1.30.0`）と `AI_CACHE` の番号も上げてください。
ブラウザに保存された古いデータは、次に使ったときに自動で消えます。

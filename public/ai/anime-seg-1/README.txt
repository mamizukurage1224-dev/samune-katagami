背景を消すAI（アニメ絵の人物の切り抜き）について

■ もとのモデル
  SkyTNT/anime-segmentation の学習済みモデル isnetis.onnx
  https://github.com/SkyTNT/anime-segmentation
  https://huggingface.co/skytnt/anime-seg
  SHA-256: f15622d853e8260172812b657053460e20806f04b9e05147d49af7bed31a6e99（176,069,933 バイト）
  ライセンス: Apache License 2.0（同じフォルダの LICENSE.txt）

■ このサイトで変えたところ
  読み込みを軽くするため、次のように形を変えています（計算の内容は変えていません）。
  1. 1024 要素以上の重みを 16 ビット（fp16）で保存し、読み込むときに 32 ビットへ戻す Cast を足した
     （176MB → 88MB。手元の比較で、もとのモデルとの出力の差は最大 0.004 以下）
  2. 配信サイトの1ファイルあたりの上限（25MiB）におさめるため、4つに分けた（model.part0.bin〜part3.bin）
     4つをこの順につなぐと、変換後のモデル（SHA-256: 87f57a2c2cebaf2ba0c71111dab6e262eac25e06a5e32a87ced41d7283508245）になります。
  変換の手順は、リポジトリの tools/ai/ にあります。

■ 使い方
  サムネ型紙の「背景を消す」から、ブラウザの中だけで使います。画像はサイトの外へ送られません。

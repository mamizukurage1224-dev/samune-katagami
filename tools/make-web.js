// 公開用のページを作り直す:  node tools/make-web.js
// src/samune-katagami.html（ページの本体）を、ふつうのHTML文書に包んで public/index.html に書き出します。
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
const src = fs.readFileSync(path.join(root, 'src', 'samune-katagami.html'), 'utf8');
const m = src.match(/^<title>([^<]*)<\/title>\s*(<link rel="stylesheet" href="https:\/\/fonts\.googleapis\.com[^>]*>)\s*<style>([\s\S]*?)<\/style>\s*([\s\S]*)$/);
if (!m) throw new Error('src/samune-katagami.html の先頭の形（title → フォントの link → style）が変わっています');
const [, title, fontLink, css, rest] = m;
const desc = '人物・背景の画像と文字を入れると、配置の型と雰囲気（フォント＋配色）の候補が並び、選ぶだけで1280×720のサムネイルを作れるツール。画像や動画はブラウザの中だけで処理されます。';
const icon = "data:image/svg+xml," + encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><path d='M16 2v28M1 16h30' stroke='#131B36' stroke-width='1.4'/><rect x='4' y='8.5' width='24' height='15' fill='#FFDD33' stroke='#131B36' stroke-width='2.4'/></svg>");
// ふつうのWebページとして要る下地
const reset = `:root{color-scheme:light;padding:env(safe-area-inset-top,0px) 0 env(safe-area-inset-bottom,0px)}
[hidden]{display:none!important}
img{max-width:100%}
`;
const footCss = `
.foot{display:grid;gap:2px;color:var(--ink-soft);font-size:12.5px;line-height:1.7;max-width:62em}
.foot p{margin:0}
.foot a{color:var(--accent);font-weight:700}
`;
const foot = `
  <footer class="foot">
    <p>入れた画像や動画は、このブラウザの中だけで処理します。外部には送信しません。</p>
    <p>作りかけの画像・文字・設定と、お気に入り・履歴は、次に開いたときのために、このブラウザに保存されます。履歴は「履歴」からいつでも消せます。背景を消すAIのデータ（約115MB）も、初めて使ったときにこのブラウザに保存され、「背景を消す」の画面から消せます。</p>
    <p>フォントは Google Fonts の書体（SIL Open Font License）を使っています。</p>
    <p>背景を消すAIは、<a href="https://github.com/SkyTNT/anime-segmentation" target="_blank" rel="noopener">SkyTNT/anime-segmentation</a> の学習済みモデル（Apache License 2.0）を、読み込みを軽くするため形式を変えて使っています（<a href="ai/anime-seg-1/README.txt" target="_blank" rel="noopener">変えたところ</a>・<a href="ai/anime-seg-1/LICENSE.txt" target="_blank" rel="noopener">ライセンス</a>）。AIの実行には <a href="ai/ort-1.30.0/LICENSE.txt" target="_blank" rel="noopener">ONNX Runtime Web</a>（MIT License）を使っています。</p>
  </footer>
`;
const marker = '\n</div>\n\n<script>';
if (rest.split(marker).length !== 2) throw new Error('ページの終わりの目印が見つかりません');
const body = rest.replace(marker, foot + '</div>\n\n<script>');
const esc = s => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
const html = `<!doctype html>
<html lang="ja">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${title}</title>
<meta name="description" content="${esc(desc)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:type" content="website">
<meta property="og:locale" content="ja_JP">
<meta name="twitter:card" content="summary">
<meta name="theme-color" content="#F1F4F9" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#0E1730" media="(prefers-color-scheme: dark)">
<link rel="icon" href="${icon}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
${fontLink}
<style>
${reset}${css.replace(/^\n/, '')}${footCss}</style>
</head>
<body>
<noscript><p style="margin:16px;font:700 15px/1.6 sans-serif">このツールは、JavaScriptを有効にすると使えます。</p></noscript>
${body.trim()}
</body>
</html>
`;
const out = path.join(root, 'public', 'index.html');
fs.mkdirSync(path.dirname(out), {recursive: true});
fs.writeFileSync(out, html);
console.log('public/index.html を作りました（' + Buffer.byteLength(html) + ' バイト）');

# GEMINI.md（AGENTS.md と同じ内容。直すときは AGENTS.md を直してこのファイルにも写す）

このファイルは、このリポジトリを編集するAI（Codex・Gemini・Copilot・Claude など）向けの説明です。
持ち主は日本語で指示します。画面の文言・説明・コミットメッセージは日本語で書いてください。

## これは何か

四季報「年度比較」シート（日本株2,580銘柄、米国株S&P500、香港ハンセン指数）をスマホで見て、監視銘柄・保有銘柄と理論株価を管理するWebアプリ（PWA）。GitHub Pages（`main` のルート）で https://saradalog.github.io/shikiho-viewer/ に配信。

| 場所 | 中身 |
|---|---|
| このリポジトリ（公開） | 画面だけ：`index.html`（HTML・CSS・JS 1枚、ビルド不要）、`sw.js`、`manifest.webmanifest`、`icons/`、`sectors.json`（コード→東証17業種、業種内回帰用） |
| 非公開リポジトリ `saradalog/global-shikiho` | シートを作る・毎日更新する Python（J-Quants・Yahoo Finance・EDINET） |
| Googleスプレッドシート | 「四季報 2026年4集 2580銘柄 年度比較」（日本株）、米国株・香港株の年度比較、「四季報ビューア 監視銘柄」（監視・保有・投資ストーリー） |
| Apps Script（`Code.gs`） | シートのデータをアプリに返す・監視リストを保存する。**合言葉（TOKEN）を含むためリポジトリに無い**。直す必要があるときは持ち主に Apps Script エディタからコードを貼ってもらう |

## Apps Script との約束（`api()` 関数）

設定画面の URL（`…/exec`）と合言葉（`Code.gs` の TOKEN）を localStorage に保存し、`action` を付けて呼ぶ。

| action | 用途 |
|---|---|
| `ping` | 接続確認 |
| `data` | 年度比較シートのデータ（市場ごと）。端末の IndexedDB（`shikiho-viewer` の `kv`、キー `data` / `data-us` / `data-hk`）に保存してオフラインでも見られる |
| `list` | 監視銘柄・保有銘柄の一覧（保有詳細とストーリー判定も同梱） |
| `add` / `save` | 監視銘柄の追加・保存（POST、本文はJSON） |

`Code.gs` が古いと、新しい列（成長17分野・営業利益/EV順位・米国株など）が届かず `old_gas` の案内が出る。

## 理論株価（変えるときは持ち主に確認）

- 本体：残余利益モデル `rim()`。BPS ＋（ROE − 資本コスト）× BPS を、ROE が10年で資本コストに戻る前提で割引合計。資本コストは時価総額2,500億円以上6%・300億円以上8%・それ未満10%。過去3期と今期予想がすべて黒字でない銘柄は参考値。
- 確認：業種内回帰。17業種ごとに 対数PBR ＝ a ＋ b×予想ROE ＋ c×予想EPS伸び率 ＋ d×ROEのぶれ ＋ e×対数時価総額 をデータ読み込み時に当てはめる。
- 株主還元利回り（配当利回り＋株数の減少率）と「割安×高還元」の印。
- 根拠は非公開リポジトリ `saradalog/fair-value-backtest` の検証（5年後リターン）。銘柄分析アプリ（`saradalog/stock-analyzer-app`）も同じ残余利益の式を使っているので、式を変えるなら両方そろえる。

## 画面を直すときの約束

- **`sw.js` の `CACHE`（`shikiho-shell-vN`）の版を1つ上げる**（上げないとスマホに古い画面が残る）。
- スマホ幅（390px前後）で確認する。公開リポジトリなので、合言葉・Apps Script の URL・個人の保有情報をコードに入れない（`SID` は持ち主の監視銘柄シートを開くためのリンク用）。

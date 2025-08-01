# Layout Generator

## 概要
**Flexbox** または **CSS Grid** のレイアウトを生成できるツールです。
操作UIから各種プロパティを選択・入力することで、即座にプレビュー反映＆HTML/CSSコードのコピーが可能です。

## 主な機能

### 共通
- タブ UI で Flex / Grid のモード切り替え
- プレビュー領域・コード出力領域・操作パネルの3分割構成
- コードは HTML / CSS 別表示、コピー可能（ COPY ボタン付き）
-  RESET で初期状態へ戻る

### Flexモード
- 子要素数の変更（2〜10）
- `flex-direction`, `justify-content`, `align-items`, `flex-wrap` の設定
- 各ボタンはクリックで指定、キャンセル可
- `gap` の指定（px単位、数値入力）
- HTML, 一部補足コメント付きCSS出力

### Gridモード
- column数： 2〜10 で指定
- row数：-（未指定）または 2〜10 で指定
- gap：row-gap / col-gap の指定（px単位、数値入力）
- 各BOXに `grid-column`, `grid-row` の `span` 指定
- spanによりBOXが結合されるように見える視覚的描画（自動補正が加わった場合メッセージ出現）
- HTML, 一部補足コメント付きCSS出力

## 使用方法

1. 画面右上の「Flex」「Grid」タブでレイアウト方式を選択
2. 右側のコントロールパネルで設定を操作
3. 中央エリアでプレビューを確認
4. 左パネルで HTML / CSS コードを確認 → 各 COPY ボタンでコピー可能


## 技術スタック
- HTML5
- CSS3
- JavaScript（純正ES6+）


## 注意事項
このコードは可視化を目的とした展示用の制作物です。
無断転載・無断利用はご遠慮ください。

## 作者情報
- 名前: sari
- GitHub: [Layout-Generator](https://sao-ori.github.io/layout-generator/)

---

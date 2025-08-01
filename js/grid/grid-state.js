// ==============================
// grid-state.js - Grid状態管理
// ==============================

export class GridState {
  constructor() {
    this.reset();
  }

  reset() {
    this.columnCount = 2;       // 初期の列数（2列）
    this.rowCount = '-';        // 初期の行数（'-' は未指定を意味する）
    this.rowGap = '';           // 行間のgap（未入力＝gapなし）
    this.colGap = '';           // 列間のgap（同上）
    this.spans = [];            // 各BOXのcol-span, row-span情報（初期は空欄）
    this.hasInteracted = false; // ユーザーが操作したかどうか（初回表示制御用）
  }

  setHasInteracted(flag = true) {
    this.hasInteracted = flag;
  }

  // 状態変更時のコールバック
  onChange(callback) {
    this.changeCallback = callback;
  }

  // 状態変更の通知
  notifyChange() {
    if (this.changeCallback) {
      this.changeCallback();
    }
  }

  // カラム数の設定
  setColumnCount(count) {
    this.hasInteracted = true;
    this.columnCount = count;
    this.notifyChange();
  }

  // 行数の設定
  setRowCount(count) {
    this.setHasInteracted(true);
    this.rowCount = count;
    this.notifyChange();
  }

  // 行間gapの設定
  setRowGap(gap) {
    this.setHasInteracted(true);
    this.rowGap = gap;
    this.notifyChange();
  }

  // 列間gapの設定
  setColGap(gap) {
    this.setHasInteracted(true);
    this.colGap = gap;
    this.notifyChange();
  }

  // spanの設定
  setSpan(index, type, value) {
    this.setHasInteracted(true);

    // spansを必要な長さまで拡張
    while (this.spans.length <= index) {
      this.spans.push({ col: '', row: '' });
    }

    this.spans[index][type] = value;
    this.notifyChange();
  }

  // 現在の状態をログ出力（デバッグ用）
  log() {
    console.log('Grid State:', {
      columnCount: this.columnCount,
      rowCount: this.rowCount,
      rowGap: this.rowGap,
      colGap: this.colGap,
      spans: this.spans,
      hasInteracted: this.hasInteracted
    });
  }
}
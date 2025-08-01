// ==============================
// grid-utils.js - Grid共通処理
// ==============================

// ==============================
// BOX数の計算
// ==============================
export function calculateBoxCount(columnCount, rowCount) {
  const parsedRowCount = rowCount === '-' ? null : parseInt(rowCount, 10);
  return parsedRowCount ? parsedRowCount * columnCount : columnCount;
}

// ==============================
// span値をcolumn/row上限に応じて補正する関数
// ==============================
export function sanitizeSpan(value, max) {
  const v = parseInt(value, 10);
  if (isNaN(v) || v <= 1) return '';
  return v > max ? max : v;
}

// ==============================
// gap値をフォーマットする関数
// ==============================
export function formatGap(value) {
  if (!value) return '0';
  if (/^[\d.]+$/.test(value)) return `${value}px`;
  return value;
}

// ==============================
// 占有マス計算クラス
// ==============================
export class GridOccupancyCalculator {
  constructor(columnCount, rowCount) {
    this.columnCount = columnCount;
    this.rowCount = rowCount === '-' ? null : parseInt(rowCount, 10);
    this.occupied = new Set();
    this.boxIndex = 0;
  }

  // 次の配置可能位置を取得
  getNextAvailablePosition() {
    const maxBoxCount = calculateBoxCount(this.columnCount, this.rowCount || this.columnCount);
    
    for (let row = 0; !this.rowCount || row < this.rowCount; row++) {
      for (let col = 0; col < this.columnCount; col++) {
        const key = `${row}-${col}`;
        if (!this.occupied.has(key) && this.boxIndex < maxBoxCount) {
          return { row, col, boxIndex: this.boxIndex };
        }
      }
      if (!this.rowCount) break;
    }
    return null;
  }

  // spanで占有されるマスを記録
  markOccupied(row, col, colSpan, rowSpan) {
    const actualRowSpan = this.rowCount ? rowSpan : 1;
    
    for (let dy = 0; dy < actualRowSpan; dy++) {
      for (let dx = 0; dx < colSpan; dx++) {
        const r = row + dy;
        const c = col + dx;
        if (!this.rowCount || (r < this.rowCount && c < this.columnCount)) {
          this.occupied.add(`${r}-${c}`);
        }
      }
    }
    this.boxIndex++;
  }

  // 現在のボックスインデックスを取得
  getCurrentBoxIndex() {
    return this.boxIndex;
  }

  // 最大ボックス数に達したかチェック
  isMaxBoxReached() {
    const maxBoxCount = calculateBoxCount(this.columnCount, this.rowCount || this.columnCount);
    return this.boxIndex >= maxBoxCount;
  }
}

// ==============================
// BOX生成の共通処理
// ==============================
export function generateBoxes(state, callback) {
  const calculator = new GridOccupancyCalculator(state.columnCount, state.rowCount);
  const boxes = [];

  while (!calculator.isMaxBoxReached()) {
    const position = calculator.getNextAvailablePosition();
    if (!position) break;

    const { row, col, boxIndex } = position;
    const span = state.spans?.[boxIndex] || {};
    const colSpan = sanitizeSpan(span.col, state.columnCount) || 1;
    const rowSpan = calculator.rowCount ? sanitizeSpan(span.row, calculator.rowCount) || 1 : 1;

    calculator.markOccupied(row, col, colSpan, rowSpan);

    const boxData = {
      index: boxIndex,
      number: boxIndex + 1,
      row,
      col,
      colSpan,
      rowSpan,
      span
    };

    boxes.push(callback ? callback(boxData) : boxData);
  }

  return boxes;
}

// ==============================
// 実際に必要なspan入力エリア数を計算
// ==============================
export function calculateRequiredSpanInputs(state) {
  // 実際に配置されるBOX数を計算
  const calculator = new GridOccupancyCalculator(state.columnCount, state.rowCount);
  let actualBoxCount = 0;

  while (!calculator.isMaxBoxReached()) {
    const position = calculator.getNextAvailablePosition();
    if (!position) break;

    const { boxIndex } = position;
    const span = state.spans?.[boxIndex] || {};
    const colSpan = sanitizeSpan(span.col, state.columnCount) || 1;
    const rowSpan = calculator.rowCount ? sanitizeSpan(span.row, calculator.rowCount) || 1 : 1;

    calculator.markOccupied(position.row, position.col, colSpan, rowSpan);
    actualBoxCount++;
  }

  return actualBoxCount;
}
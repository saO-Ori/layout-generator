// ==============================
// grid-preview.js - Gridプレビュー描画（#gridFrame対応）
// ==============================

import { generateBoxes } from "./grid-utils.js";

export class GridPreview {
  constructor(state) {
    this.state = state;
    this.container = null;
    this.warningElement = null;
  }

  // ==============================
  // 初期化処理（DOM要素取得）
  // ==============================
  init() {
    this.container = document.getElementById("layoutContainer");
    this.warningElement = document.getElementById("spanWarning");

    if (!this.container) {
      console.error("Layout container not found");
      return false;
    }

    return true;
  }

  // ==============================
  // 警告表示
  // ==============================
  showSpanWarning(msg) {
    if (!this.warningElement) return;
    this.warningElement.textContent = `⚠ ${msg}`;
    this.warningElement.classList.add("visible");
  }

  // 警告非表示
  hideSpanWarning() {
    if (!this.warningElement) return;
    this.warningElement.classList.remove("visible");
  }

  // ==============================
  // 行数オーバーフロー判定（描画後チェック）
  // ==============================
checkRowOverflow() {
  if (!this.state.hasInteracted || this.state.rowCount === '-') {
    this.hideSpanWarning();
    return;
  }

  const frame = document.getElementById("gridFrame");
  if (!frame) return;

  const specifiedRows = parseInt(this.state.rowCount, 10);
  const rowGap = parseInt(this.state.rowGap) || 0;
  const baseSize = 80;

  const expectedHeight = specifiedRows * baseSize + (specifiedRows - 1) * rowGap;
  const actualHeight = frame.scrollHeight;

  const tolerance = 5;
  if (actualHeight > expectedHeight + tolerance) {
    this.showSpanWarning("自動配置により指定数を超えて描画されました");
  } else {
    this.hideSpanWarning();
  }
}

  // ==============================
  // プレビュー描画のメイン関数
  // ==============================
  render() {
    if (!this.container) return;

    // 中身をクリア
    this.container.innerHTML = "";

    if (!this.state.hasInteracted) {
      // 初期状態（2つのBOX）表示
      this.renderInitialPreview();
      this.hideSpanWarning();
      return;
    }

    // 設定に応じたプレビューを表示
    this.renderDynamicPreview();

    // オーバーフロー判定を非同期で実行
    setTimeout(() => this.checkRowOverflow(), 0);
  }

  // ==============================
  // 初期状態：2つのBOXを描画
  // ==============================
  renderInitialPreview() {
    this.container.style.cssText = "";
    this.container.className = "grid-container";

    // ▼ 中央に表示する仮想エリア（gridFrame）を生成
    const frame = document.createElement("div");
    frame.id = "gridFrame";

    for (let i = 0; i < 2; i++) {
      const box = document.createElement("div");
      box.classList.add("box", `box--${i + 1}`);
      box.textContent = `BOX ${i + 1}`;
      frame.appendChild(box);
    }

    this.container.appendChild(frame);
  }

  // ==============================
  // 設定に応じたダイナミック描画
  // ==============================
  renderDynamicPreview() {
    // ▼ 基本設定値の取得
    const rowCount = this.state.rowCount === "-" ? null : parseInt(this.state.rowCount, 10);
    const colCount = this.state.columnCount;
    const baseSize = 80;
    const colGap = parseInt(this.state.colGap) || 0;
    const rowGap = parseInt(this.state.rowGap) || 0;

    // ▼ .grid-containerリセット
    this.container.className = "grid-container";
    this.container.innerHTML = "";

    // ▼ 仮想レイアウト領域：#gridFrame を生成
    const frame = document.createElement("div");
    frame.id = "gridFrame";

    // ▼ サイズとグリッドレイアウトを指定（仮想モニター表示）
    const frameWidth = colCount * baseSize + (colCount - 1) * colGap;
    const frameHeight = rowCount
      ? rowCount * baseSize + (rowCount - 1) * rowGap
      : "auto";

    frame.style.width = `${frameWidth}px`;
    frame.style.height = typeof frameHeight === "number" ? `${frameHeight}px` : frameHeight;
    frame.style.display = "grid";
    frame.style.gap = `${rowGap}px ${colGap}px`;
    frame.style.gridTemplateColumns = Array(colCount).fill("1fr").join(" ");
    if (rowCount) {
      frame.style.gridTemplateRows = Array(rowCount).fill("1fr").join(" ");
    }

    // ▼ 各BOXを生成・配置
    const boxes = generateBoxes(this.state, (boxData) => {
      const box = document.createElement("div");
      box.classList.add("box", `box--${boxData.number}`);
      box.textContent = `BOX ${boxData.number}`;

      // span指定
      if (boxData.colSpan > 1) {
        box.style.gridColumn = `span ${boxData.colSpan}`;
      }
      if (rowCount && boxData.rowSpan > 1) {
        box.style.gridRow = `span ${boxData.rowSpan}`;
      }

      // サイズ指定
      box.style.width = `${baseSize * boxData.colSpan + colGap * (boxData.colSpan - 1)}px`;
      box.style.height = rowCount
        ? `${baseSize * boxData.rowSpan + rowGap * (boxData.rowSpan - 1)}px`
        : `${baseSize}px`;

      return box;
    });

    // ▼ frame内にBOXを追加 → containerへ反映
    boxes.forEach((box) => frame.appendChild(box));
    this.container.appendChild(frame);
  }

  // ==============================
  // アクティブ時：描画実行
  // ==============================
  activate() {
    this.render();
  }

  // ==============================
  // 非アクティブ時：クリア処理
  // ==============================
  deactivate() {
    this.hideSpanWarning();
    if (this.container) {
      this.container.innerHTML = "";
      this.container.style.cssText = "";
    }
  }
}

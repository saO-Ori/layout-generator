// ==============================
// grid-codegen.js - HTML/CSSコード生成
// ==============================

import { formatGap, generateBoxes } from './grid-utils.js';

export class GridCodeGenerator {
  constructor(state) {
    this.state = state;
  }

  // ==============================
  // HTMLコード生成
  // ==============================
  generateHTML() {
    // 強制的に出力欄を空にする場合 または 未操作の場合
    if (!this.state.hasInteracted) {
      return '';
    }

    const lines = ['<div class="grid-container">'];
    
    // 共通処理を使用してBOXを生成
    const boxes = generateBoxes(this.state, (boxData) => {
      return `  <div class="box box--${boxData.number}">BOX ${boxData.number}</div>`;
    });

    lines.push(...boxes);
    lines.push('</div>');

    return lines.join('\n');
  }

  // ==============================
  // CSSコード生成
  // ==============================
  generateCSS() {
    // 強制的に出力欄を空にする場合 または 未操作の場合
    if (!this.state.hasInteracted) {
      return '';
    }

    const lines = [
      ".grid-container {",
      "  display: grid;",
      `  grid-template-columns: ${Array(this.state.columnCount).fill("1fr").join(" ")};`,
      "  /* ▼ repeat構文も利用できます",
      `  grid-template-columns: repeat(${this.state.columnCount}, 1fr); */`,
    ];

    const rowCount = this.state.rowCount === '-' ? null : parseInt(this.state.rowCount, 10);
    if (rowCount) {
      lines.push(`  grid-template-rows: ${Array(rowCount).fill("1fr").join(" ")};`);
      lines.push("  /* ▼ repeat構文も利用できます");
      lines.push(`  grid-template-rows: repeat(${rowCount}, 1fr); */`);
    }

    const rowGap = formatGap(this.state.rowGap);
    const colGap = formatGap(this.state.colGap);
    const shouldOutputGap = this.state.rowGap || this.state.colGap;
    if (shouldOutputGap) {
      lines.push(`  gap: ${rowGap} ${colGap};`);
      if (rowGap === colGap) {
        lines.push(`  /* gap: ${rowGap}; と同じ意味です */`);
      }
    }

    lines.push("}");

    // 共通処理を使用してspan CSSを生成
    const boxes = generateBoxes(this.state);
    const spanLines = [];
    
    boxes.forEach((boxData) => {
      const rules = [];
      if (boxData.colSpan && boxData.colSpan > 1) {
        rules.push(`grid-column: span ${boxData.colSpan};`);
      }
      if (rowCount && boxData.rowSpan && boxData.rowSpan > 1) {
        rules.push(`grid-row: span ${boxData.rowSpan};`);
      }
      
      if (rules.length > 0) {
        spanLines.push(`.box--${boxData.number} {`);
        rules.forEach(rule => spanLines.push(`  ${rule}`));
        spanLines.push("}");
      }
    });

    // auto-fitコメントは下部に残す
    const autoFitComments = [];
    if (this.state.columnCount >= 2) {
      autoFitComments.push(
        "",
        "/* ▼ レスポンシブ対応したい場合の例",
        "   grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));",
        "*/"
      );
    }

    const allLines = [...lines, "", ...spanLines, ...autoFitComments];
    return allLines.join("\n");
  }

  // 両方のコードを生成して返す
  generateBoth() {
    return {
      html: this.generateHTML(),
      css: this.generateCSS()
    };
  }
}
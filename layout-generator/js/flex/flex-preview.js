// js/flex/flex-preview.js
export class FlexPreview {
  constructor() {
    this.container = null;
  }

  getContainer() {
    if (!this.container) {
      this.container = document.getElementById('layoutContainer');
    }
    return this.container;
  }

  render(state) {
    const container = this.getContainer();
    if (!container) {
      console.warn('Layout container not found');
      return;
    }

    // コンテナをクリア
    container.innerHTML = '';

    // Flexプロパティを適用（初期状態でもdisplay: flexは適用）
    this.applyFlexProperties(container, state);

    // 子要素を生成（初期状態でも表示）
    this.createFlexItems(container, state.getItemCount());
  }

  applyFlexProperties(container, state) {
    // 既存のスタイルをクリア
    container.removeAttribute('style');

    // display: flex は常に適用
    container.style.display = 'flex';

    // アクティブなプロパティのみ適用（初期状態では何も設定されていない）
    const activeProperties = state.getActiveProperties();
    Object.entries(activeProperties).forEach(([prop, value]) => {
      if (value) {
        container.style[this.camelCase(prop)] = value;
      }
    });

    const gap = state.getGap();
    if (gap) {
      container.style.gap = `${gap}px`;
    }
  }

  createFlexItems(container, itemCount) {
    // 現在のCSSスタイルを取得
    const computedStyle = window.getComputedStyle(container);
    const alignItems = computedStyle.alignItems;
    const flexDirection = computedStyle.flexDirection;

    const isStretch = alignItems === 'stretch';
    const isColumn = flexDirection === 'column' || flexDirection === 'column-reverse';

    // columnかつstretchのとき → 左右paddingを設定（再描画対策として毎回明示）
    container.style.paddingLeft = isColumn && isStretch ? '1rem' : '';
    container.style.paddingRight = isColumn && isStretch ? '1rem' : '';

    // containerの高さ計算（stretch時の参考用）
    const height = container.clientHeight;
    const paddingTop = parseFloat(computedStyle.paddingTop) || 0;
    const paddingBottom = parseFloat(computedStyle.paddingBottom) || 0;
    const availableHeight = height - paddingTop - paddingBottom;

    // 子要素を生成
    for (let i = 1; i <= itemCount; i++) {
      const item = document.createElement('div');
      item.className = `box box--${i}`;
      item.textContent = `BOX ${i}`;

      if (isColumn && isStretch) {
        // 横方向stretch（column時）はwidthを親に合わせて、高さ固定
        item.style.width = '100%';
        item.style.height = '80px';
      } else {
        // row時などは幅固定、高さはstretchに応じて変動
        item.style.width = '80px';
        item.style.height = isStretch ? `${availableHeight}px` : '80px';
      }

      container.appendChild(item);
    }
  }

  clear() {
    const container = this.getContainer();
    if (container) {
      container.innerHTML = '';
      container.removeAttribute('style');
      container.className = 'flex-container';
    }
  }

  camelCase(str) {
    return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
  }
}
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
    this.createFlexItems(container, state.getItemCount(), state);
  }

  applyFlexProperties(container, state) {
    // 既存のスタイルをクリア（高さは保持）
    const currentHeight = container.style.height;
    container.removeAttribute('style');
    
    // 元の高さを復元（ホワイトボード領域として固定）
    if (currentHeight) {
      container.style.height = currentHeight;
    }

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

  createFlexItems(container, itemCount, state) {
    const activeProperties = state.getActiveProperties();
    const flexWrap = activeProperties['flex-wrap'];
    const isWrap = flexWrap === 'wrap' || flexWrap === 'wrap-reverse';

    if (isWrap) {
      // wrap時は#flexFrameを生成して、その中に子要素を配置
      this.createFlexFrameLayout(container, itemCount, state);
    } else {
      // 通常時は直接子要素を配置
      this.createDirectLayout(container, itemCount, state);
    }
  }

  createFlexFrameLayout(container, itemCount, state) {
    // flexFrameを生成
    const flexFrame = document.createElement('div');
    flexFrame.id = 'flexFrame';
    
    // flexFrameにflexプロパティを適用
    flexFrame.style.display = 'flex';
    flexFrame.style.width = '100%';
    flexFrame.style.height = 'auto';
    flexFrame.style.minHeight = '100px';
    
    // 親のflexプロパティをflexFrameに移管
    const activeProperties = state.getActiveProperties();
    Object.entries(activeProperties).forEach(([prop, value]) => {
      if (value) {
        flexFrame.style[this.camelCase(prop)] = value;
      }
    });

    const gap = state.getGap();
    if (gap) {
      flexFrame.style.gap = `${gap}px`;
    }

    // 親コンテナはflexFrameを適切に配置するための設定
    const justifyContent = activeProperties['justify-content'];
    const alignItems = activeProperties['align-items'];
    
    // justify-contentの処理
    if (justifyContent === 'space-between' || justifyContent === 'space-around' || justifyContent === 'space-evenly') {
      // space系の場合はflexFrameがフル幅で動作するように
      container.style.justifyContent = 'flex-start';
    } else {
      // その他の場合は中央配置またはそのまま適用
      container.style.justifyContent = justifyContent || 'center';
    }
    
    // align-itemsの処理
    if (alignItems === 'stretch') {
      // stretchの場合はflexFrameが親の高さいっぱいに広がるように
      container.style.alignItems = 'stretch';
      flexFrame.style.height = '100%';
    } else {
      // その他の場合はそのまま適用
      container.style.alignItems = alignItems || 'flex-start';
    }
    
    container.style.flexWrap = 'nowrap';
    container.style.gap = '0';

    // 子要素をflexFrameに配置
    for (let i = 1; i <= itemCount; i++) {
      const item = document.createElement('div');
      item.className = `box box--${i}`;
      item.textContent = `BOX ${i}`;
      
      // wrap時は固定サイズ
      item.style.width = '80px';
      item.style.height = '80px';
      item.style.flexShrink = '0'; // 縮小を防ぐ
      
      flexFrame.appendChild(item);
    }

    container.appendChild(flexFrame);
  }

  createDirectLayout(container, itemCount, state) {
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
      } else if (isStretch && !isColumn) {
        // row方向でstretchの場合は親の高さに合わせる
        item.style.width = '80px';
        item.style.height = `${availableHeight}px`;
      } else {
        // その他は固定サイズ
        item.style.width = '80px';
        item.style.height = '80px';
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

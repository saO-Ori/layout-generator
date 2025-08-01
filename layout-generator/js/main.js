// js/main.js
import { TabManager } from './tab-manager.js';
import { FlexGenerator } from './flex/flex-generator.js';
import { GridGenerator } from './grid/grid-generator.js';
import { CodeManager } from './code-manager.js';

class LayoutGenerator {
  constructor() {
    this.tabManager = new TabManager();
    this.flexGenerator = new FlexGenerator();
    this.gridGenerator = new GridGenerator();
    this.codeManager = new CodeManager();

    this.currentMode = 'flex'; // 'flex' | 'grid'
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;

    // タブマネージャーの初期化
    this.tabManager.init((mode) => this.switchMode(mode));

    // 各ジェネレーターの初期化
    this.flexGenerator.init((html, css) => this.updateCode(html, css));
    this.gridGenerator.init((html, css) => this.updateCode(html, css));

    // コードマネージャーの初期化
    this.codeManager.init();

    // 初期モードを設定（flexを最初にアクティブ化）
    // DOM読み込み完了後に確実に実行されるよう、次のticで実行
    setTimeout(() => {
      this.flexGenerator.activate();
      this.switchMode('flex');
      // 初期描画を確実に実行
    }, 0);

    this.initialized = true;
  }

  switchMode(mode) {
    if (this.currentMode === mode) return;

    console.log(`Switching to ${mode} mode`);

    // 前のモードを非アクティブ化
    if (this.currentMode === 'flex') {
      this.flexGenerator.deactivate();
    } else {
      this.gridGenerator.deactivate();
    }

    // 新しいモードをアクティブ化
    this.currentMode = mode;
    if (mode === 'flex') {
      this.flexGenerator.activate();
    } else {
      this.gridGenerator.activate();
    }

    // タブの表示状態を更新
    this.tabManager.setActiveTab(mode);

    // プレビューコンテナのクラスを更新
    this.updatePreviewContainer(mode);
  }

  updatePreviewContainer(mode) {
    const container = document.getElementById('layoutContainer');
    if (!container) return;

    // 既存のクラスをクリア
    container.className = '';

    // 新しいクラスを設定
    if (mode === 'flex') {
      container.className = 'flex-container';
    } else {
      container.className = 'grid-container';
    }
  }

  updateCode(html, css) {
    this.codeManager.updateHTML(html);
    this.codeManager.updateCSS(css);
  }

  getCurrentMode() {
    return this.currentMode;
  }

  getCurrentGenerator() {
    return this.currentMode === 'flex' ? this.flexGenerator : this.gridGenerator;
  }
}

// グローバルインスタンス
let layoutGenerator;

// 初期化
document.addEventListener('DOMContentLoaded', () => {
  console.log('Layout Generator initializing...');
  layoutGenerator = new LayoutGenerator();
  layoutGenerator.init();
  console.log('Layout Generator initialized');
});

// エクスポート（デバッグ用）
window.layoutGenerator = layoutGenerator;
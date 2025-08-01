// js/flex/flex-generator.js
import { FlexState } from './flex-state.js';
import { FlexPreview } from './flex-preview.js';
import { FlexCodegen } from './flex-codegen.js';

export class FlexGenerator {
  constructor() {
    this.state = new FlexState();
    this.preview = new FlexPreview();
    this.codegen = new FlexCodegen();
    this.onCodeUpdate = null;
    this.active = false;
    this.initialized = false;
  }

  init(onCodeUpdateCallback) {
    if (this.initialized) return;

    this.onCodeUpdate = onCodeUpdateCallback;
    this.setupControls();
    this.setupResetButton();
    this.initialized = true;
  }

  activate() {
    if (this.active) return;
    this.active = true;
    this.render();
  }

  deactivate() {
    if (!this.active) return;
    this.active = false;
    this.clearPreview();
  }

  setupControls() {
    // 子要素数の変更
    const itemCountInput = document.getElementById('itemCount');
    if (itemCountInput) {
      itemCountInput.addEventListener('input', (e) => {
        const count = parseInt(e.target.value, 10);
        if (count >= 2 && count <= 10) {
          this.state.setItemCount(count);
          this.render();
        }
      });
    }

    // Flexプロパティボタンの設定
    const gapInput = document.getElementById('flexGap');
    if (gapInput) {
      gapInput.addEventListener('input', (e) => {
        this.state.setGap(e.target.value.trim());
        this.render();
      });
    }

    const buttons = document.querySelectorAll('#flexControls [data-prop]');
    buttons.forEach(button => {
      button.addEventListener('click', () => {
        const prop = button.dataset.prop;
        const value = button.dataset.value;
        const isCurrentActive = button.classList.contains('active');

        if (isCurrentActive) {
          // 既にアクティブなボタンをクリック → 解除
          this.state.setProperty(prop, undefined);
          this.updateButtonStates(prop, null);
        } else {
          // 新しいボタンをクリック → 設定
          this.state.setProperty(prop, value);
          this.updateButtonStates(prop, value);
        }

        this.render();
      });
    });
  }

  setupResetButton() {
    const resetButtons = document.querySelectorAll('#flexControls .reset-button');
    resetButtons.forEach(button => {
      button.addEventListener('click', () => {
        this.reset();
      });
    });
  }

  updateButtonStates(prop, activeValue) {
    const buttons = document.querySelectorAll(`#flexControls [data-prop="${prop}"]`);
    buttons.forEach(button => {
      const isActive = activeValue !== null && button.dataset.value === activeValue;
      button.classList.toggle('active', isActive);
    });
  }

  render() {
    if (!this.active) return;

    // プレビューを更新（初期状態でも表示）
    this.preview.render(this.state);

    // コードを更新（プロパティが設定されている場合のみ）
    if (this.onCodeUpdate) {
      const shouldGenerate = this.state.hasAnyProperty() || this.state.getGap();
      if (shouldGenerate) {
        const html = this.codegen.generateHTML(this.state);
        const css = this.codegen.generateCSS(this.state);
        this.onCodeUpdate(html, css);
      } else {
        this.onCodeUpdate('', '');
      }
    }
  }

  // 外部から呼び出せるrender関数を追加
  forceRender() {
    this.render();
  }

  clearPreview() {
    this.preview.clear();
  }

  reset() {
    // 状態をリセット
    this.state.reset();

    // UIをリセット
    const itemCountInput = document.getElementById('itemCount');
    if (itemCountInput) {
      itemCountInput.value = this.state.getItemCount();
    }

    const gapInput = document.getElementById('flexGap');
    if (gapInput) {
      gapInput.value = '';
    }

    // 全ボタンのアクティブ状態をリセット
    const buttons = document.querySelectorAll('#flexControls [data-prop]');
    buttons.forEach(button => {
      button.classList.remove('active');
    });

    // レンダリング
    this.render();
  }

  getState() {
    return this.state;
  }
}
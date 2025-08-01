// ==============================
// grid-generator.js - メインのGridジェネレーター
// ==============================

import { GridState } from './grid-state.js';
import { GridPreview } from './grid-preview.js';
import { GridCodeGenerator } from './grid-codegen.js';
import { calculateRequiredSpanInputs } from './grid-utils.js';

export class GridGenerator {
  constructor() {
    this.state = new GridState();
    this.preview = new GridPreview(this.state);
    this.codeGenerator = new GridCodeGenerator(this.state);
    this.onCodeChange = null;
    this.isActive = false;
    this.initialized = false;
  }

  init(onCodeChangeCallback) {
    if (this.initialized) return;

    console.log('Initializing GridGenerator...');

    this.onCodeChange = onCodeChangeCallback;

    // プレビューを初期化
    if (!this.preview.init()) {
      console.error('Failed to initialize grid preview');
      return;
    }

    // 状態変更時のコールバックを設定
    this.state.onChange(() => {
      if (this.isActive) {
        this.updateSpanUI();
        this.preview.render();
        this.updateCode();
      }
    });

    // DOMイベントリスナーを設定
    this.setupEventListeners();

    // 初期UIを構築
    this.initializeUI();

    this.initialized = true;
    console.log('GridGenerator initialized');
  }

  // ==============================
  // UIの初期化
  // ==============================
  initializeUI() {
    this.initializeFormElements();
    this.updateSpanUI();
  }

  // ==============================
  // フォーム要素の初期化
  // ==============================
  initializeFormElements() {

    // カラム数（2〜10）の入力欄を初期化
    const colSelect = document.querySelector('#columnCount');
    if (colSelect) {
      colSelect.innerHTML = '';
      for (let i = 2; i <= 10; i++) {
        const opt = document.createElement('option');
        opt.value = i;
        opt.textContent = i;
        colSelect.appendChild(opt);
      }
      colSelect.value = this.state.columnCount;
    }

    // 行数selectの選択肢を動的に生成（'-', 2〜10）
    const rowSelect = document.querySelector('#rowCount');
    if (rowSelect) {
      rowSelect.innerHTML = '<option value="-"> - </option>';
      for (let i = 2; i <= 10; i++) {
        const opt = document.createElement('option');
        opt.value = i;
        opt.textContent = i;
        rowSelect.appendChild(opt);
      }
      rowSelect.value = this.state.rowCount;
    }

    // gapの入力欄を初期化
    const rowGapInput = document.querySelector('#rowGap');
    if (rowGapInput) {
      rowGapInput.value = this.state.rowGap;
    }

    const colGapInput = document.querySelector('#colGap');
    if (colGapInput) {
      colGapInput.value = this.state.colGap;
    }
  }

  // ==============================
  // span入力欄の更新
  // ==============================
  updateSpanUI() {
    const area = document.querySelector('#gridSpan');
    if (!area) return;

    area.innerHTML = '';

    const col = this.state.columnCount;
    const row = this.state.rowCount === '-' ? 1 : parseInt(this.state.rowCount, 10);

    // 実際に必要なspan入力エリア数を計算
    const requiredInputs = calculateRequiredSpanInputs(this.state);

    // state.spansを必要な数だけ初期化
    this.state.spans = Array.from({ length: requiredInputs }, (_, i) =>
      this.state.spans?.[i] || { col: '', row: '' }
    );

    for (let i = 0; i < requiredInputs; i++) {
      const wrapper = document.createElement('div');
      wrapper.className = 'span-set';

      const label = document.createElement('div');
      label.textContent = `BOX ${i + 1}`;
      label.style.fontWeight = 'bold';
      label.style.marginBottom = '0.5rem';

      const inner = document.createElement('div');
      inner.className = 'span-inner';

      const colInput = document.createElement('input');
      colInput.type = 'number';
      colInput.placeholder = 'col';
      colInput.min = 2;
      colInput.max = col;
      colInput.value = this.state.spans[i].col || '';
      colInput.addEventListener('input', (e) => {
        const val = parseInt(e.target.value, 10);
        const spanValue = (val >= 2 && val <= col) ? val : '';
        this.state.setSpan(i, 'col', spanValue);
      });

      const rowInput = document.createElement('input');
      rowInput.type = 'number';
      rowInput.placeholder = 'row';
      rowInput.min = 2;
      rowInput.max = row;
      rowInput.value = this.state.spans[i].row || '';
      rowInput.addEventListener('input', (e) => {
        const val = parseInt(e.target.value, 10);
        const spanValue = (val >= 2 && val <= row) ? val : '';
        this.state.setSpan(i, 'row', spanValue);
      });

      inner.appendChild(colInput);
      inner.appendChild(rowInput);
      wrapper.appendChild(label);
      wrapper.appendChild(inner);
      area.appendChild(wrapper);
    }
  }

  // ==============================
  // イベントリスナーの設定
  // ==============================
  setupEventListeners() {
    const MAX = 10;

    // 汎用バリデーション関数（最大値補正＋メッセージ）
    function validateInput(value, type, setValueCallback, inputElement) {
      let v = parseInt(value, 10);
      if (isNaN(v)) return;

      const MAX = 10;
      const message = '⚠ 最大10としています';

      setValueCallback(v);
    }

    // ▼ カラム数
    const colSelect = document.querySelector('#columnCount');
    if (colSelect) {
      colSelect.addEventListener('change', (e) => {
        validateInput(
          e.target.value,
          'COL',
          (v) => this.state.setColumnCount(v),
          e.target
        );
      });
    }

    // ▼ 行数
    const rowSelect = document.querySelector('#rowCount');
    if (rowSelect) {
      rowSelect.addEventListener('change', (e) => {
        const val = e.target.value;
        if (val === '-') {
          this.state.setRowCount('-');
          this.preview.hideSpanWarning();
          return;
        }

        validateInput(
          val,
          'ROW',
          (v) => this.state.setRowCount(v),
          e.target
        );
      });
    }

    // 行間gapの変更
    const rowGapInput = document.querySelector('#rowGap');
    if (rowGapInput) {
      rowGapInput.addEventListener('input', (e) => {
        this.state.setRowGap(e.target.value.trim());
      });
    }

    // 列間gapの変更
    const colGapInput = document.querySelector('#colGap');
    if (colGapInput) {
      colGapInput.addEventListener('input', (e) => {
        this.state.setColGap(e.target.value.trim());
      });
    }

    // リセットボタン
    const resetBtn = document.getElementById('ResetBtn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        this.reset();
      });
    }
  }

  // ==============================
  // コード更新
  // ==============================
  updateCode() {
    if (this.onCodeChange) {
      const { html, css } = this.codeGenerator.generateBoth();
      this.onCodeChange(html, css);
    }
  }

  // ==============================
  // リセット処理
  // ==============================
  reset() {
    console.log('Resetting grid generator...');

    // 状態をリセット
    this.state.reset();

    // UIを更新
    this.initializeFormElements();
    this.updateSpanUI();

    if (this.isActive) {
      this.preview.render();
      this.updateCode();
    }
  }

  // ==============================
  // アクティブ化
  // ==============================
  activate() {
    console.log('Activating grid generator');
    this.isActive = true;
    this.updateSpanUI();
    this.preview.activate();
    this.updateCode();
  }

  // ==============================
  // 非アクティブ化
  // ==============================
  deactivate() {
    console.log('Deactivating grid generator');
    this.isActive = false;
    this.preview.deactivate();
  }

  // ==============================
  // 強制レンダリング（初期化用）
  // ==============================
  forceRender() {
    if (this.initialized && this.isActive) {
      this.preview.render();
      this.updateCode();
    }
  }

  // ==============================
  // 現在の状態を取得（デバッグ用）
  // ==============================
  getState() {
    return this.state;
  }
}
// js/tab-manager.js
export class TabManager {
  constructor() {
    this.onModeChange = null;
    this.currentTab = 'flex';
  }

  init(onModeChangeCallback) {
    this.onModeChange = onModeChangeCallback;
    this.setupTabEvents();
    this.switchTab('flex');
    // this.setActiveTab('flex');
  }

  setupTabEvents() {
    const flexTab = document.getElementById('tabFlex');
    const gridTab = document.getElementById('tabGrid');

    if (flexTab) {
      flexTab.addEventListener('click', () => {
        this.switchTab('flex');
      });
    }

    if (gridTab) {
      gridTab.addEventListener('click', () => {
        this.switchTab('grid');
      });
    }
  }

  switchTab(mode) {
    if (this.currentTab === mode) return;

    this.currentTab = mode;
    this.setActiveTab(mode);
    this.showControlPanel(mode);

    if (this.onModeChange) {
      this.onModeChange(mode);
    }
  }

  setActiveTab(mode) {
    const flexTab = document.getElementById('tabFlex');
    const gridTab = document.getElementById('tabGrid');

    if (flexTab && gridTab) {
      flexTab.classList.toggle('active', mode === 'flex');
      gridTab.classList.toggle('active', mode === 'grid');
    }
  }

  showControlPanel(mode) {
    const flexControls = document.getElementById('flexControls');
    const gridControls = document.getElementById('gridControls');

    if (flexControls) {
      flexControls.classList.toggle('hidden', mode !== 'flex');
    }

    if (gridControls) {
      gridControls.classList.toggle('hidden', mode !== 'grid');
    }
  }

  getCurrentTab() {
    return this.currentTab;
  }
}
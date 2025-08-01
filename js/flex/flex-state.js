// js/flex/flex-state.js
export class FlexState {
  constructor() {
    this.properties = {
      'flex-direction': undefined,
      'justify-content': undefined,
      'align-items': undefined,
      'flex-wrap': undefined
    };
    this.itemCount = 2;
    this.gap = '';
  }

  setProperty(prop, value) {
    if (prop in this.properties) {
      this.properties[prop] = value;
    }
  }

  getProperty(prop) {
    return this.properties[prop];
  }

  setItemCount(count) {
    this.itemCount = Math.max(2, Math.min(10, count));
  }

  getItemCount() {
    return this.itemCount;
  }

  setGap(value) {
    this.gap = value;
  }

  getGap() {
    return this.gap;
  }

  hasAnyProperty() {
    return Object.values(this.properties).some(value => value !== undefined);
  }

  getActiveProperties() {
    const active = {};
    Object.entries(this.properties).forEach(([key, value]) => {
      if (value !== undefined) {
        active[key] = value;
      }
    });
    return active;
  }

  reset() {
    Object.keys(this.properties).forEach(key => {
      this.properties[key] = undefined;
    });
    this.itemCount = 2;
    this.gap = '';
  }

  clone() {
    const newState = new FlexState();
    newState.properties = { ...this.properties };
    newState.itemCount = this.itemCount;
    newState.gap = this.gap;
    return newState;
  }
}
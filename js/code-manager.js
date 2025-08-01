// js/code-manager.js
export class CodeManager {
  constructor() {
    this.htmlElement = null;
    this.cssElement = null;
    this.htmlCopyBtn = null;
    this.cssCopyBtn = null;
  }

  init() {
    this.htmlElement = document.querySelector('#htmlOutput code');
    this.cssElement = document.querySelector('#cssOutput code');
    this.htmlCopyBtn = document.getElementById('htmlCopy');
    this.cssCopyBtn = document.getElementById('cssCopy');

    this.setupCopyButtons();
  }

  setupCopyButtons() {
    if (this.htmlCopyBtn) {
      this.htmlCopyBtn.addEventListener('click', () => {
        this.copyToClipboard(this.getHTML(), this.htmlCopyBtn);
      });
    }

    if (this.cssCopyBtn) {
      this.cssCopyBtn.addEventListener('click', () => {
        this.copyToClipboard(this.getCSS(), this.cssCopyBtn);
      });
    }
  }

  updateHTML(html) {
    if (this.htmlElement) {
      this.htmlElement.textContent = html || '';
    }
  }

  updateCSS(css) {
    if (this.cssElement) {
      this.cssElement.textContent = css || '';
    }
  }

  getHTML() {
    return this.htmlElement ? this.htmlElement.textContent : '';
  }

  getCSS() {
    return this.cssElement ? this.cssElement.textContent : '';
  }

  clear() {
    this.updateHTML('');
    this.updateCSS('');
  }

  async copyToClipboard(text, button) {
    if (!text.trim()) {
      this.showCopyFeedback(button, 'NO CODE');
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      this.showCopyFeedback(button, 'COPIED!');
    } catch (err) {
      console.error('Copy failed:', err);
      this.fallbackCopy(text, button);
    }
  }

  fallbackCopy(text, button) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      const successful = document.execCommand('copy');
      if (successful) {
        this.showCopyFeedback(button, 'COPIED!');
      } else {
        this.showCopyFeedback(button, 'COPY FAILED');
      }
    } catch (err) {
      console.error('Fallback copy failed:', err);
      this.showCopyFeedback(button, 'COPY FAILED');
    }

    document.body.removeChild(textArea);
  }

  showCopyFeedback(button, message) {
    const originalText = button.textContent;
    button.textContent = message;
    setTimeout(() => {
      button.textContent = originalText;
    }, 1000);
  }
}
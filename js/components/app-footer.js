export class AppFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <footer>
        <div class="footer-container">
          <button class="btn-toggle" id="dark-mode-toggle" type="button">
            <svg class="icon-moon" viewBox="0 0 24 24">
              <use href="images/sprite.svg#icon-moon"></use>
            </svg>
            <svg class="icon-sun" viewBox="0 0 24 24">
              <use href="images/sprite.svg#icon-sun"></use>
            </svg>
            <span>ダークモード</span>
          </button>
        </div>
      </footer>
    `;

    this.initDarkMode();
  }

  initDarkMode() {
    const toggleBtn = this.querySelector('#dark-mode-toggle');
    if (!toggleBtn) return;

    const btnText = toggleBtn.querySelector('span');
    const isDarkActive = document.documentElement.classList.contains('dark-mode');

    if (btnText) {
      btnText.textContent = isDarkActive ? 'ライトモード' : 'ダークモード';
    }

    toggleBtn.addEventListener('click', () => {
      document.documentElement.classList.toggle('dark-mode');
      const isDark = document.documentElement.classList.contains('dark-mode');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
      if (btnText) {
        btnText.textContent = isDark ? 'ライトモード' : 'ダークモード';
      }
    });
  }
}

if (!customElements.get('app-footer')) {
  customElements.define('app-footer', AppFooter);
}

export class AppHeader extends HTMLElement {
  connectedCallback() {
    const title = this.getAttribute('title') || 'ポケモンツール';
    const showBack = this.getAttribute('show-back') === 'true';
    const backUrl = this.getAttribute('back-url') || 'index.html';

    this.innerHTML = `
      <header>
        <div class="header-container ${showBack ? 'justify-between' : ''}">
          ${showBack ? `
            <a href="${backUrl}" class="header-back-link">
              <svg class="icon-back" viewBox="0 0 24 24">
                <path d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z" />
              </svg>
              <span>戻る</span>
            </a>
          ` : ''}
          <div class="header-title-group">
            <svg class="header-logo" viewBox="0 0 24 24">
              <use href="images/sprite.svg#logo"></use>
            </svg>
            <h1>${title}</h1>
          </div>
          ${showBack ? '<div style="width: 56px;"></div>' : ''}
        </div>
      </header>
    `;
  }
}

customElements.define('app-header', AppHeader);

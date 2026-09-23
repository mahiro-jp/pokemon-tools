// 技データの動的読み込みと <move-slot> カスタムエレメント定義
let movesDataCache = null;

// タイプごとのCSSバッジクラスのマッピング
export const TYPE_BADGE_MAP = {
  'ほのお': 'badge-fire',
  'みず': 'badge-water',
  'くさ': 'badge-grass',
  'ひこう': 'badge-flying',
  'ドラゴン': 'badge-dragon',
  'でんき': 'badge-electric',
  'じめん': 'badge-ground',
  'かくとう': 'badge-fighting',
  'むし': 'badge-bug',
  'ノーマル': 'badge-normal',
  'こおり': 'badge-ice',
  'あく': 'badge-dark',
  'エスパー': 'badge-psychic',
  'いわ': 'badge-rock',
  'はがね': 'badge-steel',
  'ゴースト': 'badge-ghost',
  'フェアリー': 'badge-fairy',
  'どく': 'badge-poison'
};

// moves.json を非同期読み込みする関数
export async function loadMovesData() {
  if (movesDataCache) return movesDataCache;
  try {
    const paths = ['data/moves.json', '../data/moves.json', '/pokemon-tools/data/moves.json'];
    let response = null;
    for (const path of paths) {
      try {
        response = await fetch(path);
        if (response.ok) break;
      } catch (e) {}
    }
    if (response && response.ok) {
      movesDataCache = await response.json();
    } else {
      movesDataCache = [];
    }
  } catch (error) {
    console.error('moves.json の読み込みに失敗しました:', error);
    movesDataCache = [];
  }
  return movesDataCache;
}

export class MoveSlot extends HTMLElement {
  async connectedCallback() {
    this.index = this.getAttribute('index') || '1';
    this.initialValue = this.getAttribute('value') || '';

    // 技データのロード
    const moves = await loadMovesData();

    // HTML構造の設定
    this.innerHTML = `
      <div class="move-row">
        <div class="move-select-wrapper">
          <label for="move-${this.index}" class="move-label">技${this.index}</label>
          <select id="move-${this.index}" class="form-select move-select">
            <option value="">技を選択...</option>
            ${moves.map(m => `
              <option value="${m.name}" ${m.name === this.initialValue ? 'selected' : ''}>${m.name}</option>
            `).join('')}
          </select>
        </div>
        <div class="move-meta">
          <span class="badge badge-none">--</span>
          <span class="move-power">威力: <strong class="power-val">--</strong></span>
        </div>
      </div>
    `;

    this.selectEl = this.querySelector('.move-select');
    this.badgeEl = this.querySelector('.badge');
    this.powerEl = this.querySelector('.power-val');

    this.movesMap = new Map(moves.map(m => [m.name, m]));

    this.selectEl.addEventListener('change', () => this.updateMeta());
    this.updateMeta();
  }

  updateMeta() {
    if (!this.selectEl) return;
    const selectedName = this.selectEl.value;
    const moveInfo = this.movesMap ? this.movesMap.get(selectedName) : null;

    if (moveInfo) {
      const typeName = moveInfo.type || '--';
      const badgeClass = TYPE_BADGE_MAP[typeName] || 'badge-none';
      const powerDisplay = (moveInfo.power !== "" && moveInfo.power !== null && moveInfo.power !== undefined) 
        ? moveInfo.power 
        : '--';

      this.badgeEl.textContent = typeName;
      this.badgeEl.className = `badge ${badgeClass}`;
      this.powerEl.textContent = powerDisplay;
    } else {
      this.badgeEl.textContent = '--';
      this.badgeEl.className = 'badge badge-none';
      this.powerEl.textContent = '--';
    }
  }

  get value() {
    return this.selectEl ? this.selectEl.value : '';
  }

  set value(val) {
    if (this.selectEl) {
      this.selectEl.value = val;
      this.updateMeta();
    } else {
      this.setAttribute('value', val);
    }
  }
}

// カスタムエレメント <move-slot> の登録
if (!customElements.get('move-slot')) {
  customElements.define('move-slot', MoveSlot);
}

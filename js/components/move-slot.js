// 技マスタデータ (技名 => { タイプ名, バッジCSSクラス, 威力 })
export const MOVE_DATA = {
  'かえんほうしゃ': { type: 'ほのお', badgeClass: 'badge-fire', power: '90' },
  'りゅうせいぐん': { type: 'ドラゴン', badgeClass: 'badge-dragon', power: '130' },
  'エアスラッシュ': { type: 'ひこう', badgeClass: 'badge-flying', power: '75' },
  'おにび': { type: 'ほのお', badgeClass: 'badge-fire', power: '--' },
  '10まんボルト': { type: 'でんき', badgeClass: 'badge-electric', power: '90' },
  'ハイドロポンプ': { type: 'みず', badgeClass: 'badge-water', power: '110' },
  'じしん': { type: 'じめん', badgeClass: 'badge-ground', power: '100' },
  'インファイト': { type: 'かくとう', badgeClass: 'badge-fighting', power: '120' },
  'とんぼがえり': { type: 'むし', badgeClass: 'badge-bug', power: '70' },
  'つるぎのまい': { type: 'ノーマル', badgeClass: 'badge-normal', power: '--' }
};

export class MoveSlot extends HTMLElement {
  connectedCallback() {
    const index = this.getAttribute('index') || '1';
    const initialValue = this.getAttribute('value') || '';

    // HTML構造の設定
    this.innerHTML = `
      <div class="move-row">
        <div class="move-select-wrapper">
          <label for="move-${index}" class="move-label">技${index}</label>
          <select id="move-${index}" class="form-select move-select">
            <option value="">技を選択...</option>
            ${Object.keys(MOVE_DATA).map(move => `
              <option value="${move}" ${move === initialValue ? 'selected' : ''}>${move}</option>
            `).join('')}
          </select>
        </div>
        <div class="move-meta">
          <span class="badge badge-none">--</span>
          <span class="move-power">威力: <strong class="power-val">--</strong></span>
        </div>
      </div>
    `;

    // 内部エレメントの参照保持
    this.selectEl = this.querySelector('.move-select');
    this.badgeEl = this.querySelector('.badge');
    this.powerEl = this.querySelector('.power-val');

    // 変更イベントリスナーの登録
    this.selectEl.addEventListener('change', () => this.updateMeta());

    // 初期表示の反映
    this.updateMeta();
  }

  // 選択された技に応じてタイプバッジと威力を動的に切り替え
  updateMeta() {
    const selectedMove = this.selectEl.value;
    const data = MOVE_DATA[selectedMove];

    if (data) {
      this.badgeEl.textContent = data.type;
      this.badgeEl.className = `badge ${data.badgeClass}`;
      this.powerEl.textContent = data.power;
    } else {
      this.badgeEl.textContent = '--';
      this.badgeEl.className = 'badge badge-none';
      this.powerEl.textContent = '--';
    }
  }

  // 外部(親スクリプト)からの値取得・設定用インターフェース
  get value() {
    return this.selectEl ? this.selectEl.value : '';
  }

  set value(val) {
    if (this.selectEl) {
      this.selectEl.value = val;
      this.updateMeta();
    }
  }
}

// カスタムエレメント <move-slot> の登録
customElements.define('move-slot', MoveSlot);

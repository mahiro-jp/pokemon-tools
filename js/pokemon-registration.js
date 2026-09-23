// 性格の補正テーブル定義 (1.1倍アップ, 0.9倍ダウン)
const NATURE_MODIFIERS = {
  'いじっぱり': { up: 'atk', down: 'spa' },
  'ひかえめ': { up: 'spa', down: 'atk' },
  'ようき': { up: 'spe', down: 'spa' },
  'おくびょう': { up: 'spe', down: 'atk' },
  'わんぱく': { up: 'def', down: 'spa' },
  'ずぶとい': { up: 'def', down: 'atk' },
  'しんちょう': { up: 'apd', down: 'spa' },
  'おだやか': { up: 'apd', down: 'atk' },
  'さみしがり': { up: 'atk', down: 'def' },
  'やんちゃ': { up: 'atk', down: 'apd' },
  'おっとり': { up: 'spa', down: 'def' },
  'うっかりや': { up: 'spa', down: 'apd' },
  'のうてんき': { up: 'def', down: 'apd' },
  'おとなしい': { up: 'apd', down: 'def' },
  'せっかち': { up: 'spe', down: 'def' },
  'ゆうかん': { up: 'atk', down: 'spe' },
  'のんき': { up: 'def', down: 'spe' },
  'れいせい': { up: 'spa', down: 'spe' },
  'なまいき': { up: 'apd', down: 'spe' },
  'まじめ': { up: null, down: null }
};

// データの保持
let pokemonsData = [];
let currentPokemon = null;

// DOM要素の参照
const nameInput = document.getElementById('pokemon-name-input');
const suggestionsDatalist = document.getElementById('pokemon-suggestions');
const typeBadgesContainer = document.querySelector('.type-badges');
const abilitySelect = document.getElementById('pokemon-ability');
const natureSelect = document.getElementById('pokemon-nature');
const apSummaryValue = document.querySelector('.ap-summary-value');

// ステータス行のマップ (HP, 攻撃, 防御, 特攻, 特防, 素早さ)
const STAT_KEYS = ['hp', 'atk', 'def', 'spa', 'apd', 'spe'];

// pokemons.json の非同期読み込み
async function loadPokemonsData() {
  const paths = ['data/pokemons.json', '../data/pokemons.json', '/pokemon-tools/data/pokemons.json'];
  let response = null;
  for (const path of paths) {
    try {
      response = await fetch(path);
      if (response.ok) break;
    } catch (e) {}
  }
  if (response && response.ok) {
    pokemonsData = await response.json();
    initDatalist();
    // 初期選択（例: 先頭のポケモン）
    if (pokemonsData.length > 0) {
      selectPokemon(pokemonsData[0].name);
    }
  }
}

// サジェストdatalistの初期化
function initDatalist() {
  if (!suggestionsDatalist) return;
  suggestionsDatalist.innerHTML = pokemonsData.map(p => `
    <option value="${p.name}">
  `).join('');
}

// ポケモンが選択された時の処理
function selectPokemon(pokemonName) {
  const pokemon = pokemonsData.find(p => p.name === pokemonName);
  if (!pokemon) return;

  currentPokemon = pokemon;
  if (nameInput) nameInput.value = pokemon.name;

  // タイプバッジの更新
  updateTypeBadges(pokemon);

  // 特性ドロップダウンの更新
  updateAbilities(pokemon);

  // 種族値の反映と実数値再計算
  updateBaseStats(pokemon);
  recalculateRealStats();
}

// タイプバッジの更新
function updateTypeBadges(pokemon) {
  if (!typeBadgesContainer) return;

  const TYPE_CLASS_MAP = {
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

  let html = '';
  if (pokemon.type1) {
    const cls1 = TYPE_CLASS_MAP[pokemon.type1] || 'badge-none';
    html += `<span class="badge ${cls1}">${pokemon.type1}</span>`;
  }
  if (pokemon.type2) {
    const cls2 = TYPE_CLASS_MAP[pokemon.type2] || 'badge-none';
    html += `<span class="badge ${cls2}">${pokemon.type2}</span>`;
  }

  typeBadgesContainer.innerHTML = html || '<span class="badge badge-none">--</span>';
}

// 特性ドロップダウンの更新
function updateAbilities(pokemon) {
  if (!abilitySelect) return;
  const abilities = [pokemon.ability1, pokemon.ability2, pokemon.ability3].filter(a => a && a.trim() !== '');

  abilitySelect.innerHTML = abilities.map((ab, idx) => `
    <option value="${ab}" ${idx === 0 ? 'selected' : ''}>${ab}</option>
  `).join('');
}

// 種族値テーブルの表示更新
function updateBaseStats(pokemon) {
  const rows = document.querySelectorAll('.status-table tbody tr');
  STAT_KEYS.forEach((key, index) => {
    if (rows[index]) {
      const baseCell = rows[index].querySelector('.status-base');
      if (baseCell) {
        baseCell.textContent = pokemon[key];
      }
    }
  });
}

// 実数値および残り能力ポイントのリアルタイム計算
function recalculateRealStats() {
  if (!currentPokemon) return;

  const nature = natureSelect ? natureSelect.value : 'まじめ';
  const modifier = NATURE_MODIFIERS[nature] || { up: null, down: null };

  const rows = document.querySelectorAll('.status-table tbody tr');
  let totalAP = 0;

  STAT_KEYS.forEach((key, index) => {
    const row = rows[index];
    if (!row) return;

    const apInput = row.querySelector('.ap-input');
    const realCell = row.querySelector('.status-real');
    const apValue = apInput ? Math.max(0, Math.min(32, parseInt(apInput.value, 10) || 0)) : 0;
    totalAP += apValue;

    const baseValue = currentPokemon[key] || 0;
    let realValue = 0;

    if (key === 'hp') {
      if (currentPokemon.name === 'ヌケニン') {
        realValue = 1;
      } else {
        realValue = baseValue + 75 + apValue;
      }
    } else {
      let mult = 1.0;
      if (modifier.up === key) mult = 1.1;
      if (modifier.down === key) mult = 0.9;

      realValue = Math.floor((baseValue + 20 + apValue) * mult);
    }

    if (realCell) {
      realCell.textContent = realValue;
    }
  });

  // 残り能力ポイントの更新
  const maxAP = 66;
  const remainingAP = maxAP - totalAP;

  if (apSummaryValue) {
    if (remainingAP < 0) {
      apSummaryValue.textContent = `超過: ${Math.abs(remainingAP)} pt (最大 ${maxAP})`;
      apSummaryValue.style.color = '#ff3b30';
    } else {
      apSummaryValue.textContent = `${remainingAP} / ${maxAP}`;
      apSummaryValue.style.color = '';
    }
  }
}

// イベントリスナーのセットアップ
function setupEventListeners() {
  // ポケモン名入力イベント
  if (nameInput) {
    nameInput.addEventListener('change', (e) => {
      selectPokemon(e.target.value);
    });
    nameInput.addEventListener('input', (e) => {
      const matched = pokemonsData.find(p => p.name === e.target.value);
      if (matched) {
        selectPokemon(matched.name);
      }
    });
  }

  // 性格変更イベント
  if (natureSelect) {
    natureSelect.addEventListener('change', recalculateRealStats);
  }

  // AP調整ボタン (+, -, 0, 32 プリセット)
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-ap-adjust')) {
      const row = e.target.closest('tr');
      const input = row ? row.querySelector('.ap-input') : null;
      if (input) {
        let current = parseInt(input.value, 10) || 0;
        if (e.target.textContent === '+') {
          current = Math.min(32, current + 1);
        } else if (e.target.textContent === '-') {
          current = Math.max(0, current - 1);
        }
        input.value = current;
        recalculateRealStats();
      }
    } else if (e.target.classList.contains('btn-preset')) {
      const row = e.target.closest('tr');
      const input = row ? row.querySelector('.ap-input') : null;
      if (input) {
        const val = parseInt(e.target.textContent, 10);
        if (!isNaN(val)) {
          input.value = val;
          recalculateRealStats();
        }
      }
    }
  });

  // AP直接入力イベント
  document.addEventListener('input', (e) => {
    if (e.target.classList.contains('ap-input')) {
      recalculateRealStats();
    }
  });
}

// 画面初期化
document.addEventListener('DOMContentLoaded', () => {
  setupEventListeners();
  loadPokemonsData();
});

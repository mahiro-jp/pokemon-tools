const toggleBtn = document.getElementById('dark-mode-toggle');
const btnText = toggleBtn.querySelector('span');

// システム設定やローカルストレージの優先読み込み
const savedTheme = localStorage.getItem('theme');
const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
    document.body.classList.add('dark-mode');
    btnText.textContent = 'ライトモード';
}

toggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    
    // ローカルストレージに保存
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    
    // ボタンテキストの切り替え
    btnText.textContent = isDark ? 'ライトモード' : 'ダークモード';
});

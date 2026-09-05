// システム設定やローカルストレージの読込
const savedTheme = localStorage.getItem('theme');
const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const isDarkMode = savedTheme === 'dark' || (!savedTheme && systemPrefersDark);

if (isDarkMode) {
    document.body.classList.add('dark-mode');
}

const toggleBtn = document.getElementById('dark-mode-toggle');

if (toggleBtn) {
    const btnText = toggleBtn.querySelector('span');
    if (btnText) {
        btnText.textContent = isDarkMode ? 'ライトモード' : 'ダークモード';
    }
    toggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        
        // ローカルストレージに保存
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        
        // ボタンテキストの切り替え
        if (btnText) {
            btnText.textContent = isDark ? 'ライトモード' : 'ダークモード';
        }
    });
}

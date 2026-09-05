const toggleBtn = document.getElementById('dark-mode-toggle');

if (toggleBtn) {
    const btnText = toggleBtn.querySelector('span');
    if (btnText) {
        btnText.textContent = isDarkMode ? 'ライトモード' : 'ダークモード';
    }
    toggleBtn.addEventListener('click', () => {
        document.documentElement.classList.toggle('dark-mode');
        const isDark = document.documentElement.classList.contains('dark-mode');
        
        // ローカルストレージに保存
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        
        // ボタンテキストの切り替え
        if (btnText) {
            btnText.textContent = isDark ? 'ライトモード' : 'ダークモード';
        }
    });
}

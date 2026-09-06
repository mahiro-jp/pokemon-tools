// 1. 各要素の取得と安全なダークモード制御
const toggleBtn = document.getElementById('dark-mode-toggle');

if (toggleBtn) {
    const btnText = toggleBtn.querySelector('span');
    
    // すでに html に dark-mode クラスが付いているかで初期状態を決定する
    const isDarkActive = document.documentElement.classList.contains('dark-mode');

    if (btnText) {
        btnText.textContent = isDarkActive ? 'ライトモード' : 'ダークモード';
    }

    toggleBtn.addEventListener('click', () => {
        document.documentElement.classList.toggle('dark-mode');
        const isDark = document.documentElement.classList.contains('dark-mode');

        // ローカルストレージに設定を保存
        localStorage.setItem('theme', isDark ? 'dark' : 'light');

        // ボタンテキストの切り替え
        if (btnText) {
            btnText.textContent = isDark ? 'ライトモード' : 'ダークモード';
        }
    });
}

// 2. サービスワーカーの登録（PWA化の必須要件）
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/pokemon-tools/sw.js')
            .then((registration) => {
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
            })
            .catch((err) => {
                console.log('ServiceWorker registration failed: ', err);
            });
    });
}

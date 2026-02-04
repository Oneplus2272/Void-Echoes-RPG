/**
 * Файл управления загрузкой игры
 */
(function() {
    console.log("Loading system initialized");

    function initLoader() {
        const fill = document.getElementById('progress-fill');
        const pct = document.getElementById('loading-pct');
        const loadScreen = document.getElementById('loading-screen');
        const selectScreen = document.getElementById('selection-screen');

        if (!fill || !pct) {
            // Если DOM еще не готов, ждем немного
            setTimeout(initLoader, 50);
            return;
        }

        let progress = 0;
        const interval = setInterval(() => {
            progress += 5;
            fill.style.width = progress + '%';
            pct.textContent = progress + '%';

            if (progress >= 100) {
                clearInterval(interval);
                
                if (loadScreen) loadScreen.style.display = 'none';
                if (selectScreen) {
                    selectScreen.style.display = 'block';
                    setTimeout(() => { selectScreen.style.opacity = '1'; }, 50);
                }
            }
        }, 40);
    }

    // Запуск Telegram WebApp
    if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.expand();
        window.Telegram.WebApp.ready();
    }

    // Запускаем как только возможно
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initLoader);
    } else {
        initLoader();
    }
})();

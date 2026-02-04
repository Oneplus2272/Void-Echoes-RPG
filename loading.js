/**
 * Улучшенный загрузчик с защитой от ошибок
 */
(function() {
    // Заглушки, чтобы код не падал, если конфиги не загрузились
    if (typeof window.config === 'undefined') window.config = {};
    if (typeof window.heroesData === 'undefined') window.heroesData = {};

    function startLoading() {
        const fill = document.getElementById('progress-fill');
        const pct = document.getElementById('loading-pct');
        const screen = document.getElementById('loading-screen');
        const next = document.getElementById('selection-screen');

        if (!fill || !pct) {
            setTimeout(startLoading, 100);
            return;
        }

        let p = 0;
        const timer = setInterval(() => {
            p += 2;
            fill.style.width = p + '%';
            pct.textContent = p + '%';

            if (p >= 100) {
                clearInterval(timer);
                if (screen) screen.style.display = 'none';
                if (next) {
                    next.style.display = 'block';
                    setTimeout(() => { next.style.opacity = '1'; }, 50);
                }
            }
        }, 30);
    }

    // Инициализация Telegram
    if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.expand();
        window.Telegram.WebApp.ready();
    }

    if (document.readyState === 'complete') {
        startLoading();
    } else {
        window.addEventListener('load', startLoading);
    }
})();

/**
 * Бронебойный загрузчик: запускается несмотря ни на что
 */
(function() {
    console.log("Loading script active");

    function startProgress() {
        const fill = document.getElementById('progress-fill');
        const pct = document.getElementById('loading-pct');
        const loadScreen = document.getElementById('loading-screen');
        const selectScreen = document.getElementById('selection-screen');

        if (!fill || !pct) {
            console.log("Waiting for DOM elements...");
            setTimeout(startProgress, 50);
            return;
        }

        let p = 0;
        const interval = setInterval(() => {
            p += 2;
            fill.style.width = p + '%';
            pct.textContent = p + '%';

            if (p >= 100) {
                clearInterval(interval);
                console.log("Progress 100%");
                
                if (loadScreen) loadScreen.style.display = 'none';
                if (selectScreen) {
                    selectScreen.style.display = 'block';
                    setTimeout(() => { selectScreen.style.opacity = '1'; }, 50);
                }
            }
        }, 30);
    }

    // Телеграм WebApp
    if (window.Telegram && window.Telegram.WebApp) {
        try {
            window.Telegram.WebApp.expand();
            window.Telegram.WebApp.ready();
        } catch (e) {
            console.error("TG init error:", e);
        }
    }

    // Запуск шкалы
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        startProgress();
    } else {
        document.addEventListener('DOMContentLoaded', startProgress);
    }
})();

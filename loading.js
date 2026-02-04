/**
 * Бронебойный загрузчик v4.0 - Полная изоляция
 */
(function() {
    console.log("Loading system: STANDALONE MODE");

    function startLoading() {
        const fill = document.getElementById('progress-fill');
        const pct = document.getElementById('loading-pct');
        const loadScreen = document.getElementById('loading-screen');
        const selectScreen = document.getElementById('selection-screen');

        if (!fill || !pct) {
            // Если элементы еще не созданы, пробуем снова через 50мс
            setTimeout(startLoading, 50);
            return;
        }

        let p = 0;
        const timer = setInterval(() => {
            p += 2;
            
            // Прямое управление через style, чтобы никакие CSS-ошибки не мешали
            fill.style.setProperty('width', p + '%', 'important');
            pct.innerHTML = p + '%';

            if (p >= 100) {
                clearInterval(timer);
                console.log("100% - Switching screen");
                
                if (loadScreen) loadScreen.style.display = 'none';
                if (selectScreen) {
                    selectScreen.style.display = 'block';
                    selectScreen.style.opacity = '1';
                }
            }
        }, 30);
    }

    // Инициализация Telegram с защитой
    try {
        if (window.Telegram && window.Telegram.WebApp) {
            window.Telegram.WebApp.expand();
            window.Telegram.WebApp.ready();
        }
    } catch (e) {}

    // Запуск несмотря ни на что
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startLoading);
    } else {
        startLoading();
    }
})();

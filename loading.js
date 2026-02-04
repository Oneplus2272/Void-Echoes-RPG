/**
 * Бронебойный загрузчик v3.0
 * Работает в изоляции от других скриптов
 */
(function() {
    console.log("Loading engine started");

    function runProgressBar() {
        const fill = document.getElementById('progress-fill');
        const pct = document.getElementById('loading-pct');
        const loadScreen = document.getElementById('loading-screen');
        const selectScreen = document.getElementById('selection-screen');

        // Если HTML еще не прогрузился, ждем 50мс и пробуем снова
        if (!fill || !pct) {
            setTimeout(runProgressBar, 50);
            return;
        }

        let progress = 0;
        const timer = setInterval(() => {
            progress += 2;
            
            // Прямое управление стилями без посредников
            fill.style.width = progress + '%';
            pct.innerHTML = progress + '%';

            if (progress >= 100) {
                clearInterval(timer);
                console.log("Load complete, switching screens...");
                
                if (loadScreen) loadScreen.style.display = 'none';
                if (selectScreen) {
                    selectScreen.style.display = 'block';
                    // Форсируем видимость
                    selectScreen.style.opacity = '1';
                }
            }
        }, 30);
    }

    // Инициализация Telegram WebApp с защитой от вылета
    try {
        if (window.Telegram && window.Telegram.WebApp) {
            window.Telegram.WebApp.expand();
            window.Telegram.WebApp.ready();
        }
    } catch (e) {
        console.warn("TG Init failed, but moving on...");
    }

    // Запуск процесса при первой возможности
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        runProgressBar();
    } else {
        window.addEventListener('load', runProgressBar);
    }
})();

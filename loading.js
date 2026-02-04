/**
 * Файл управления загрузкой игры
 */
window.addEventListener('load', function() {
    console.log("DOM полностью загружен");

    // Инициализация Telegram WebApp
    const tg = window.Telegram?.WebApp;
    if (tg) {
        tg.expand();
        tg.ready();
    }

    let progress = 0;
    const fill = document.getElementById('progress-fill');
    const pctText = document.getElementById('loading-pct');
    const loaderScreen = document.getElementById('loading-screen');
    const selectScreen = document.getElementById('selection-screen');

    // Интервал обновления шкалы
    const interval = setInterval(() => {
        progress += 2; // Уменьшил шаг для более плавной анимации

        if (fill) {
            fill.style.width = progress + '%';
        }

        if (pctText) {
            pctText.textContent = progress + '%';
        }

        if (progress >= 100) {
            clearInterval(interval);
            finishLoading();
        }
    }, 20);

    function finishLoading() {
        console.log("Загрузка завершена");
        
        if (loaderScreen) {
            loaderScreen.style.opacity = '0';
            setTimeout(() => {
                loaderScreen.style.display = 'none';
                
                if (selectScreen) {
                    selectScreen.style.display = 'block';
                    // Задержка для плавного появления
                    setTimeout(() => {
                        selectScreen.style.opacity = '1';
                    }, 50);
                }
            }, 400);
        }
    }
});

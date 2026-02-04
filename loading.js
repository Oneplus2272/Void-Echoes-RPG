/**
 * Файл управления загрузкой игры
 * Полная версия без изменений в логике, только фикс инициализации
 */
function startLoadingProcess() {
    console.log("Инициализация загрузчика...");

    const progressFill = document.getElementById('progress-fill');
    const loadingPct = document.getElementById('loading-pct');
    const loadingScreen = document.getElementById('loading-screen');
    const selectionScreen = document.getElementById('selection-screen');

    // Если элементы еще не в DOM, пробуем снова через 10мс
    if (!progressFill || !loadingPct) {
        setTimeout(startLoadingProcess, 10);
        return;
    }

    let p = 0;
    const loadingInterval = setInterval(() => {
        p += 5;
        
        progressFill.style.width = p + '%';
        loadingPct.textContent = p + '%';
        
        if (p >= 100) {
            clearInterval(loadingInterval);
            console.log("Загрузка завершена успешно");
            
            if (loadingScreen) {
                loadingScreen.style.display = 'none';
            }
            
            if (selectionScreen) {
                selectionScreen.style.display = 'block';
                setTimeout(() => {
                    selectionScreen.style.opacity = '1';
                }, 50);
            }
        }
    }, 30);
}

// Запуск сразу, как только скрипт прочитан
if (document.readyState === 'complete') {
    startLoadingProcess();
} else {
    window.addEventListener('load', startLoadingProcess);
}

// Инициализация Telegram WebApp отдельно
if (window.Telegram && window.Telegram.WebApp) {
    window.Telegram.WebApp.expand();
    window.Telegram.WebApp.ready();
}

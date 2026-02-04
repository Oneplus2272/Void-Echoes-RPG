/**
 * Файл управления загрузкой игры + Экранный логгер ошибок
 */

// 1. Создаем панель для вывода ошибок прямо на экран
const errorConsole = document.createElement('div');
errorConsole.id = 'debug-console';
Object.assign(errorConsole.style, {
    position: 'fixed',
    bottom: '0',
    left: '0',
    width: '100%',
    maxHeight: '40%',
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    color: '#ff4444',
    fontSize: '12px',
    fontFamily: 'monospace',
    padding: '10px',
    zIndex: '10000',
    overflowY: 'auto',
    borderTop: '2px solid red',
    pointerEvents: 'none' // Чтобы не мешала кликам, если пустая
});
document.documentElement.appendChild(errorConsole);

// Функция для вывода текста в нашу панель
function debugLog(msg, isError = false) {
    const line = document.createElement('div');
    line.style.marginBottom = '5px';
    line.style.color = isError ? '#ff4444' : '#00ff00';
    line.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
    errorConsole.appendChild(line);
    errorConsole.scrollTop = errorConsole.scrollHeight;
}

// Перехват всех ошибок браузера
window.onerror = function(message, source, lineno, colno, error) {
    debugLog(`ОШИБКА: ${message} (Файл: ${source}, Строка: ${lineno})`, true);
    return false;
};

// Перехват ошибок загрузки файлов (404)
window.addEventListener('error', function(e) {
    if (e.target.tagName === 'SCRIPT' || e.target.tagName === 'LINK' || e.target.tagName === 'IMG') {
        debugLog(`ФАЙЛ НЕ НАЙДЕН: ${e.target.src || e.target.href}`, true);
    }
}, true);

// 2. Основная логика загрузки
function startLoadingProcess() {
    debugLog("Проверка элементов DOM...");
    
    const progressFill = document.getElementById('progress-fill');
    const loadingPct = document.getElementById('loading-pct');
    const loadingScreen = document.getElementById('loading-screen');
    const selectionScreen = document.getElementById('selection-screen');

    if (!progressFill || !loadingPct) {
        debugLog("Элементы шкалы не найдены, повтор через 100мс...", true);
        setTimeout(startLoadingProcess, 100);
        return;
    }

    debugLog("Запуск шкалы загрузки...");
    let p = 0;
    const loadingInterval = setInterval(() => {
        p += 5;
        
        progressFill.style.width = p + '%';
        loadingPct.textContent = p + '%';
        
        if (p >= 100) {
            clearInterval(loadingInterval);
            debugLog("Загрузка 100%!");
            
            if (loadingScreen) {
                loadingScreen.style.display = 'none';
                debugLog("Экран загрузки скрыт");
            }
            
            if (selectionScreen) {
                selectionScreen.style.display = 'block';
                setTimeout(() => {
                    selectionScreen.style.opacity = '1';
                }, 50);
                debugLog("Экран выбора героя отображен");
            }
        }
    }, 30);
}

// Запуск инициализации
document.addEventListener('DOMContentLoaded', () => {
    debugLog("DOM готов. Начинаем процесс...");
    startLoadingProcess();
});

// Telegram WebApp
if (window.Telegram && window.Telegram.WebApp) {
    window.Telegram.WebApp.expand();
    window.Telegram.WebApp.ready();
    debugLog("Telegram WebApp инициализирован");
} else {
    debugLog("Telegram WebApp не обнаружен (это нормально для браузера)");
}

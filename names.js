(function() {
    /**
     * Конфигурация: укажи здесь селектор своей шкалы загрузки
     */
    const LOADER_SELECTOR = '#loading-bar-container, .loading-progress, #loader'; 

    /**
     * Функция для вывода текста ошибки над шкалой
     */
    function showErrorMessage(errorText) {
        // Ищем контейнер шкалы
        const loader = document.querySelector(LOADER_SELECTOR);
        
        if (loader) {
            // Проверяем, нет ли уже блока с ошибкой
            let errorDiv = document.getElementById('debug-error-display');
            if (!errorDiv) {
                errorDiv = document.createElement('div');
                errorDiv.id = 'debug-error-display';
                
                // Стили для текста ошибки (красный, заметный, над шкалой)
                Object.assign(errorDiv.style, {
                    position: 'absolute',
                    bottom: '120%', // Размещаем над шкалой
                    left: '0',
                    width: '100%',
                    color: '#ff4444',
                    background: 'rgba(0, 0, 0, 0.8)',
                    padding: '10px',
                    borderRadius: '5px',
                    fontSize: '14px',
                    textAlign: 'center',
                    fontFamily: 'monospace',
                    zIndex: '9999',
                    border: '1px solid #ff4444',
                    boxSizing: 'border-box'
                });
                
                // Чтобы bottom: 120% работал, у лоадера должен быть position relative
                if (window.getComputedStyle(loader).position === 'static') {
                    loader.style.position = 'relative';
                }
                
                loader.appendChild(errorDiv);
            }
            
            // Добавляем текст ошибки (накапливаем, если их несколько)
            errorDiv.innerText = "Ошибка загрузки: " + errorText;
            console.error("Критическая ошибка для игрока:", errorText);
        }
    }

    /**
     * Перехват всех ошибок JavaScript на странице
     */
    window.onerror = function(message, source, lineno, colno, error) {
        const simpleMessage = `${message} (в файле: ${source.split('/').pop()}, строка: ${lineno})`;
        showErrorMessage(simpleMessage);
        return false; // Позволяет ошибке также отображаться в обычной консоли
    };

    /**
     * Перехват ошибок загрузки ресурсов (картинки, скрипты 404)
     */
    window.addEventListener('error', function(event) {
        if (event.target && (event.target.src || event.target.href)) {
            const fileName = (event.target.src || event.target.href).split('/').pop();
            showErrorMessage(`Не удалось загрузить файл: ${fileName}`);
        }
    }, true);

    /**
     * Перехват необработанных обещаний (Promise)
     */
    window.addEventListener('unhandledrejection', function(event) {
        showErrorMessage("Ошибка в сети/запросе: " + event.reason);
    });

    console.log("Система отслеживания ошибок над шкалой запущена.");
})();

(function() {
    function start() {
        const fill = document.getElementById('progress-fill');
        const pct = document.getElementById('loading-pct');
        
        // Если элементы еще не появились в DOM, подождем немного
        if (!fill || !pct) return setTimeout(start, 50);

        let p = 0;
        console.log("Начало загрузки War of Kings...");

        // Имитация загрузки ресурсов
        const inv = setInterval(() => {
            // Случайный шаг загрузки для реализма
            p += Math.floor(Math.random() * 5) + 2; 
            
            if (p >= 100) {
                p = 100;
                clearInterval(inv);
                completeLoading();
            }

            fill.style.width = p + '%';
            pct.textContent = p + '%';
        }, 50);

        // В фоне пытаемся проверить твой сервер 45.128.204.64
        fetch('http://45.128.204.64/api/status').then(res => {
            console.log("Связь с сервером установлена!");
        }).catch(err => {
            console.warn("Сервер недоступен из-за HTTPS ограничений, но игра продолжается.");
        });
    }

    function completeLoading() {
        const loadingScreen = document.getElementById('loading-screen');
        const selectionScreen = document.getElementById('selection-screen');
        
        if (loadingScreen) loadingScreen.style.display = 'none';
        if (selectionScreen) {
            selectionScreen.style.display = 'block';
            setTimeout(() => selectionScreen.style.opacity = '1', 50);
        }
    }

    // Запускаем, когда окно загрузится
    if (document.readyState === 'complete') {
        start();
    } else {
        window.addEventListener('load', start);
    }
})();

(function() {
    async function start() {
        const fill = document.getElementById('progress-fill');
        const pct = document.getElementById('loading-pct');
        if (!fill || !pct) return setTimeout(start, 50);

        let p = 0;
        
        // 1. Сначала плавно доходим до 30%, пока ждем сервер
        const initialLoad = setInterval(() => {
            if (p < 30) {
                p += 2;
                updateProgress(p, fill, pct);
            } else {
                clearInterval(initialLoad);
                checkServer(); // Проверяем твой сервер на AdminVPS
            }
        }, 50);

        async function checkServer() {
            try {
                // Пытаемся связаться с твоим бэкендом на 3.6 ГГц
                const response = await fetch('http://45.128.204.64/api/status');
                if (response.ok) {
                    // 2. Если сервер ответил, быстро докручиваем до 100%
                    const finalLoad = setInterval(() => {
                        p += 10;
                        updateProgress(p, fill, pct);
                        if (p >= 100) {
                            clearInterval(finalLoad);
                            showSelection();
                        }
                    }, 30);
                }
            } catch (error) {
                console.error("Сервер пока не отвечает:", error);
                // Если сервер выключен, пишем ошибку прямо на шкале
                document.getElementById('status-text').textContent = "Ошибка связи с империей...";
            }
        }
    }

    function updateProgress(p, fill, pct) {
        if (p > 100) p = 100;
        fill.style.width = p + '%';
        pct.textContent = Math.floor(p) + '%';
    }

    function showSelection() {
        document.getElementById('loading-screen').style.display = 'none';
        const next = document.getElementById('selection-screen');
        next.style.display = 'block';
        setTimeout(() => next.style.opacity = '1', 50);
    }

    window.onload = start;
})();

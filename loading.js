(function() {
    async function start() {
        const fill = document.getElementById('progress-fill');
        const pct = document.getElementById('loading-pct');
        if (!fill || !pct) return setTimeout(start, 50);

        let p = 0;
        const interval = setInterval(async () => {
            p += Math.random() * 5;
            if (p >= 100) {
                p = 100;
                clearInterval(interval);
                finishLoading();
            }
            fill.style.width = p + '%';
            pct.textContent = Math.floor(p) + '%';
        }, 100);

        // Попытка связаться с сервером в фоновом режиме
        try {
            await fetch('http://45.128.204.64/api/status', { mode: 'no-cors' });
            console.log("Связь с сервером AdminVPS установлена");
        } catch (e) {
            console.log("Работаем в автономном режиме");
        }
    }

    function finishLoading() {
        document.getElementById('loading-screen').style.display = 'none';
        const next = document.getElementById('selection-screen');
        next.style.display = 'block';
        setTimeout(() => next.style.opacity = '1', 50);
    }
    window.onload = start;
})();

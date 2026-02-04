(function() {
    console.log("Forced loading started");

    function update() {
        const fill = document.getElementById('progress-fill');
        const pct = document.getElementById('loading-pct');
        const loadScreen = document.getElementById('loading-screen');
        const next = document.getElementById('selection-screen');

        if (!fill || !pct) {
            setTimeout(update, 50);
            return;
        }

        let p = 0;
        const interval = setInterval(() => {
            p += 2;
            fill.style.width = p + '%';
            pct.innerHTML = p + '%';

            if (p >= 100) {
                clearInterval(interval);
                if (loadScreen) loadScreen.style.display = 'none';
                if (next) {
                    next.style.display = 'block';
                    next.style.opacity = '1';
                }
            }
        }, 30);
    }

    if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.ready();
        window.Telegram.WebApp.expand();
    }

    window.onload = update;
})();

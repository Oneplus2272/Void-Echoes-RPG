(function() {
    function start() {
        const fill = document.getElementById('progress-fill');
        const pct = document.getElementById('loading-pct');
        if (!fill || !pct) return setTimeout(start, 50);

        let p = 0;
        const inv = setInterval(() => {
            p += 5;
            fill.style.width = p + '%';
            pct.textContent = p + '%';
            if (p >= 100) {
                clearInterval(inv);
                // После 100% просто переходим к выбору
                document.getElementById('loading-screen').style.display = 'none';
                const next = document.getElementById('selection-screen');
                next.style.display = 'block';
                setTimeout(() => next.style.opacity = '1', 50);
            }
        }, 30);
    }
    window.onload = start;
})();

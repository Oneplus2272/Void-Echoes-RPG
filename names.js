(function() {
    const isTablet = window.innerWidth > 768;

    // ФИКСИРОВАННЫЕ КООРДИНАТЫ ДЛЯ ПЛАНШЕТА (больше не трогаем)
    const tabletLayout = {
        "profile":   { x: 367, y: 936, size: 154 },
        "battle":    { x: 81,  y: 938, size: 150 },
        "quests":    { x: -9,  y: 938, size: 139 },
        "calendar":  { x: -21, y: 314, size: 161 },
        "alliance":  { x: 179, y: 938, size: 147 },
        "community": { x: -17, y: 211, size: 144 },
        "mail":      { x: 230, y: 891, size: 234 },
        "rating":    { x: -24, y: 88,  size: 159 },
        "benchmark": { x: 571, y: 924, size: 152 },
        "lotto":     { x: 468, y: 930, size: 159 }
    };

    const ids = Object.keys(tabletLayout);

    const style = document.createElement('style');
    style.innerHTML = `
        .game-nav-layer { position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 1000; }
        .nav-icon { position: absolute; display: flex; align-items: center; justify-content: center; touch-action: none; pointer-events: auto; }
        .nav-icon img { width: 100%; height: 100%; object-fit: contain; pointer-events: none; }
        #ui-save-mobile { position: fixed; top: 10px; right: 10px; z-index: 10001; padding: 15px; background: #ffd700; font-weight: bold; border-radius: 8px; display: ${isTablet ? 'none' : 'block'}; }
        #mobile-output { position: fixed; top: 10%; left: 10%; width: 80%; height: 70%; background: #000; color: #0f0; z-index: 10002; display: none; padding: 20px; font-family: monospace; }
    `;
    document.head.appendChild(style);

    function init() {
        const menu = document.querySelector('#menu-screen .menu-container') || document.body;
        const layer = document.createElement('div');
        layer.className = 'game-nav-layer';
        menu.appendChild(layer);

        ids.forEach((id, index) => {
            const btn = document.createElement('div');
            btn.className = 'nav-icon';
            btn.id = 'btn-' + id;

            if (isTablet) {
                // ПРИМЕНЯЕМ ГОТОВОЕ ДЛЯ ПЛАНШЕТА
                const config = tabletLayout[id];
                btn.style.left = config.x + 'px';
                btn.style.top = config.y + 'px';
                btn.style.width = config.size + 'px';
                btn.style.height = config.size + 'px';
            } else {
                // РЕЖИМ РЕДАКТИРОВАНИЯ ДЛЯ ТЕЛЕФОНА (Сетка 5х2)
                const col = index % 5;
                const row = Math.floor(index / 5);
                const size = 70; // Начальный размер для телефона
                btn.style.width = btn.style.height = size + 'px';
                btn.style.left = (col * (window.innerWidth / 5) + 5) + 'px';
                btn.style.top = (window.innerHeight - 200 + (row * 80)) + 'px';
                
                setupMobileTouch(btn); // Включаем тач только для телефона
            }

            btn.innerHTML = `<img src="icon_${id}.png">`;
            layer.appendChild(btn);
        });

        // Кнопка сохранения только для телефона
        if (!isTablet) {
            const sBtn = document.createElement('button');
            sBtn.id = 'ui-save-mobile';
            sBtn.innerText = 'СОХРАНИТЬ (ТЕЛЕФОН)';
            const out = document.createElement('textarea');
            out.id = 'mobile-output';
            
            sBtn.onclick = () => {
                const res = [];
                document.querySelectorAll('.nav-icon').forEach(el => {
                    res.push({ id: el.id.replace('btn-',''), x: parseInt(el.style.left), y: parseInt(el.style.top), size: parseInt(el.style.width) });
                });
                out.value = JSON.stringify(res, null, 2);
                out.style.display = 'block';
            };
            document.body.appendChild(sBtn);
            document.body.appendChild(out);
        }
    }

    function setupMobileTouch(el) {
        let startDist = 0, startSize = 70;
        el.addEventListener('touchstart', function(e) {
            if (e.touches.length === 1) {
                let t = e.touches[0];
                let sX = t.clientX - el.offsetLeft;
                let sY = t.clientY - el.offsetTop;
                function move(ev) {
                    el.style.left = (ev.touches[0].clientX - sX) + 'px';
                    el.style.top = (ev.touches[0].clientY - sY) + 'px';
                }
                el.addEventListener('touchmove', move);
                el.addEventListener('touchend', () => el.removeEventListener('touchmove', move), {once:true});
            } else if (e.touches.length === 2) {
                startDist = Math.hypot(e.touches[0].pageX-e.touches[1].pageX, e.touches[0].pageY-e.touches[1].pageY);
                startSize = parseInt(el.style.width);
            }
        });
        el.addEventListener('touchmove', function(e) {
            if (e.touches.length === 2) {
                let d = Math.hypot(e.touches[0].pageX-e.touches[1].pageX, e.touches[0].pageY-e.touches[1].pageY);
                let nS = Math.max(30, startSize * (d / startDist));
                el.style.width = el.style.height = nS + 'px';
            }
        });
    }

    init();
})();

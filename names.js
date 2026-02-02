(function() {
    const isTablet = window.innerWidth > 1024 || (window.innerWidth <= 1024 && window.innerHeight > 1024);
    let isEditMode = false;
    let currentPage = 1;

    // Списки иконок по страницам
    const page2List = ["benchmark", "rating", "profile", "lotto", "mail"];

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
        "lotto":     { x: 468, y: 930, size: 159 },
        "shop":      { x: 10,  y: 10,  size: 100 },
        "inventory": { x: 120, y: 10,  size: 100 }
    };

    const phoneLayout = {
        "community": { x: 5, y: 164, size: 136 },
        "calendar":  { x: -6, y: 245, size: 161 },
        "quests":    { x: -18, y: 580, size: 128 },
        "battle":    { x: 63.1, y: 582, size: 137 },
        "alliance":  { x: 152.5, y: 584.5, size: 129 },
        "shop":      { x: 10, y: 10, size: 80 },
        "inventory": { x: 100, y: 10, size: 80 },
        "mail":      { x: 195.5, y: 538.5, size: 217 },
        "profile":   { x: -26.5, y: 574, size: 145 },
        "rating":    { x: 153.7, y: 567.7, size: 160 },
        "lotto":     { x: 60.2, y: 565.2, size: 160 },
        "benchmark": { x: 252.8, y: 558.2, size: 160 }
    };

    const style = document.createElement('style');
    style.innerHTML = `
        .ui-master-layer { position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 9999; }
        .game-icon { 
            position: absolute; display: flex; align-items: center; justify-content: center;
            pointer-events: auto; touch-action: none; transition: opacity 0.3s, transform 0.2s;
        }
        .game-icon img { width: 100%; height: 100%; object-fit: contain; pointer-events: none; }
        .m-hidden { opacity: 0 !important; pointer-events: none !important; pointer-events: none; }
        
        .edit-active { outline: 2px dashed rgba(255,255,255,0.5); background: rgba(255,255,255,0.1); }

        .nav-arrow-custom {
            position: fixed; right: 20px; bottom: 30px; width: 55px; height: 55px;
            background: rgba(0,0,0,0.8); border: 3px solid #ffd700; border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            z-index: 10001; pointer-events: auto; box-shadow: 0 0 20px #ffd700;
        }
        .nav-arrow-custom::after {
            content: ''; width: 14px; height: 14px; border-top: 5px solid #ffd700; border-right: 5px solid #ffd700;
            transform: rotate(45deg); margin-right: 6px;
        }
        .nav-arrow-custom.flip { transform: rotate(180deg); border-color: #00d4ff; box-shadow: 0 0 20px #00d4ff; }

        .save-coords-btn {
            position: fixed; top: 15px; left: 50%; transform: translateX(-50%);
            padding: 15px 35px; background: #28a745; color: #fff; border-radius: 30px;
            font-weight: bold; z-index: 10002; display: none; border: 3px solid #fff;
        }

        #code-output-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.95); z-index: 20000; display: none;
            flex-direction: column; align-items: center; justify-content: center; padding: 20px;
        }
        #code-text-area { width: 90%; height: 60%; background: #000; color: #0f0; padding: 15px; font-family: monospace; font-size: 11px; border: 1px solid #0f0; overflow: auto; white-space: pre; user-select: all; }
        .close-output-btn { margin-top: 20px; padding: 12px 30px; background: #dc3545; color: #fff; border-radius: 8px; font-weight: bold; }
    `;
    document.head.appendChild(style);

    function init() {
        const container = document.querySelector('.menu-container') || document.body;
        const layer = document.createElement('div');
        layer.className = 'ui-master-layer';
        container.appendChild(layer);

        const overlay = document.createElement('div');
        overlay.id = 'code-output-overlay';
        overlay.innerHTML = `
            <div style="color:#ffd700; font-weight:bold; margin-bottom:10px;">СКОПИРУЙ И ЗАМЕНИ В СКРИПТЕ:</div>
            <div id="code-text-area"></div>
            <div class="close-output-btn" onclick="document.getElementById('code-output-overlay').style.display='none'; location.reload();">ЗАКРЫТЬ И ОБНОВИТЬ</div>
        `;
        document.body.appendChild(overlay);

        const refs = {};
        const data = isTablet ? tabletLayout : phoneLayout;

        const saveBtn = document.createElement('div');
        saveBtn.className = 'save-coords-btn';
        saveBtn.innerText = '💾 СОХРАНИТЬ';
        saveBtn.onclick = () => saveAndShowCode(refs);
        document.body.appendChild(saveBtn);

        Object.keys(data).forEach(id => {
            const d = data[id];
            const icon = createIcon(id, d.x, d.y, d.size, layer);
            refs[id] = icon;
            updateVisibility(id, icon);
        });

        const arrow = document.createElement('div');
        arrow.className = 'nav-arrow-custom';
        arrow.onclick = () => {
            if (isEditMode) return;
            currentPage = currentPage === 1 ? 2 : 1;
            arrow.classList.toggle('flip', currentPage === 2);
            Object.keys(refs).forEach(id => updateVisibility(id, refs[id]));
        };
        document.body.appendChild(arrow);
    }

    function updateVisibility(id, el) {
        const isP2 = page2List.includes(id);
        if (currentPage === 1) {
            el.classList.toggle('m-hidden', isP2);
        } else {
            el.classList.toggle('m-hidden', !isP2);
        }
    }

    function createIcon(id, x, y, size, parent) {
        const wrap = document.createElement('div');
        wrap.className = 'game-icon';
        wrap.style.width = size + 'px'; wrap.style.height = size + 'px';
        wrap.style.left = x + 'px'; wrap.style.top = y + 'px';

        const img = document.createElement('img');
        img.src = `icon_${id}.png`;
        img.onerror = () => img.src = 'https://cdn-icons-png.flaticon.com/512/236/236831.png';
        wrap.appendChild(img);

        let initialDist = 0;
        let initialSize = 0;
        let pressTimer;

        wrap.onpointerdown = (e) => {
            if (!isEditMode) pressTimer = setTimeout(() => enterEditMode(), 1500);
        };
        wrap.onpointerup = () => clearTimeout(pressTimer);

        wrap.ontouchmove = (e) => {
            if (!isEditMode) return;
            // Проверяем, принадлежит ли иконка текущей странице
            const isP2 = page2List.includes(id);
            if ((currentPage === 1 && isP2) || (currentPage === 2 && !isP2)) return;

            if (e.touches.length === 1) {
                const touch = e.touches[0];
                const rect = parent.getBoundingClientRect();
                wrap.style.left = (touch.clientX - rect.left - parseFloat(wrap.style.width)/2) + 'px';
                wrap.style.top = (touch.clientY - rect.top - parseFloat(wrap.style.height)/2) + 'px';
            } 
            else if (e.touches.length === 2) {
                const dist = Math.hypot(e.touches[0].pageX - e.touches[1].pageX, e.touches[0].pageY - e.touches[1].pageY);
                if (initialDist === 0) {
                    initialDist = dist;
                    initialSize = parseFloat(wrap.style.width);
                } else {
                    const newSize = initialSize * (dist / initialDist);
                    wrap.style.width = newSize + 'px';
                    wrap.style.height = newSize + 'px';
                }
            }
        };

        wrap.ontouchend = () => { initialDist = 0; };

        img.onclick = () => {
            if (isEditMode) return;
            console.log("Open:", id);
        };

        parent.appendChild(wrap);
        return wrap;
    }

    function enterEditMode() {
        isEditMode = true;
        document.querySelectorAll('.game-icon').forEach(el => {
            if (!el.classList.contains('m-hidden')) {
                el.classList.add('edit-active');
            }
        });
        document.querySelector('.save-coords-btn').style.display = 'block';
    }

    function saveAndShowCode(refs) {
        let result = {};
        Object.keys(refs).forEach(id => {
            const el = refs[id];
            result[id] = {
                x: Math.round(parseFloat(el.style.left)),
                y: Math.round(parseFloat(el.style.top)),
                size: Math.round(parseFloat(el.style.width))
            };
        });

        const layoutName = isTablet ? "tabletLayout" : "phoneLayout";
        document.getElementById('code-text-area').innerText = `const ${layoutName} = ${JSON.stringify(result, null, 4)};`;
        document.getElementById('code-output-overlay').style.display = 'flex';
    }

    init();
})();

(function() {
    const isTablet = window.innerWidth > 1024 || (window.innerWidth <= 1024 && window.innerHeight > 1024);
    let isEditMode = false;

    // Начальные конфиги
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
        "mail":      { x: 195.5, y: 538.5, size: 217 },
        "profile":   { x: -26.5, y: 574, size: 145 },
        "rating":    { x: 153.7, y: 567.7, size: 160 },
        "lotto":     { x: 60.2, y: 565.2, size: 160 },
        "benchmark": { x: 252.8, y: 558.2, size: 160 },
        "shop":      { x: 10, y: 10, size: 80 },
        "inventory": { x: 100, y: 10, size: 80 }
    };

    const style = document.createElement('style');
    style.innerHTML = `
        .ui-master-layer { position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 9999; }
        .game-icon { 
            position: absolute; display: flex; align-items: center; justify-content: center;
            pointer-events: auto; cursor: grab; touch-action: none;
        }
        .game-icon img { width: 100%; height: 100%; object-fit: contain; pointer-events: none; }
        
        /* Кнопки размера */
        .size-controls { position: absolute; top: -35px; display: none; gap: 8px; z-index: 10; }
        .edit-mode .size-controls { display: flex; }
        .size-btn {
            width: 32px; height: 32px; background: #fff; color: #000; border: 2px solid #000;
            border-radius: 6px; font-weight: bold; font-size: 20px; display: flex; align-items: center; justify-content: center;
        }

        .m-hidden { opacity: 0 !important; pointer-events: none !important; }

        .nav-arrow-custom {
            position: fixed; right: 20px; bottom: 30px; width: 50px; height: 50px;
            background: rgba(0,0,0,0.7); border: 2px solid #ffd700; border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            z-index: 10001; pointer-events: auto; box-shadow: 0 0 15px #ffd700;
        }
        .nav-arrow-custom::after {
            content: ''; width: 12px; height: 12px; border-top: 4px solid #ffd700; border-right: 4px solid #ffd700;
            transform: rotate(45deg); margin-right: 5px;
        }
        .nav-arrow-custom.flip { transform: rotate(180deg); border-color: #00d4ff; box-shadow: 0 0 15px #00d4ff; }

        .save-coords-btn {
            position: fixed; top: 10px; left: 50%; transform: translateX(-50%);
            padding: 12px 25px; background: #28a745; color: #fff; border-radius: 25px;
            font-weight: bold; z-index: 10002; display: none; border: 2px solid #fff;
        }

        /* Окно с кодом для копирования */
        #code-output-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.9); z-index: 20000; display: none;
            flex-direction: column; align-items: center; justify-content: center; padding: 20px;
        }
        #code-text-area { width: 90%; height: 60%; background: #111; color: #0f0; padding: 10px; font-family: monospace; font-size: 12px; border: 1px solid #555; overflow: auto; white-space: pre; }
        .close-output-btn { margin-top: 15px; padding: 10px 20px; background: #dc3545; color: #fff; border-radius: 5px; font-weight: bold; }
    `;
    document.head.appendChild(style);

    function init() {
        const container = document.querySelector('.menu-container') || document.body;
        const layer = document.createElement('div');
        layer.className = 'ui-master-layer';
        container.appendChild(layer);

        // Окно вывода кода
        const overlay = document.createElement('div');
        overlay.id = 'code-output-overlay';
        overlay.innerHTML = `
            <div style="color:white; margin-bottom:10px;">СКОПИРУЙ ЭТОТ КОД:</div>
            <div id="code-text-area"></div>
            <div class="close-output-btn" onclick="document.getElementById('code-output-overlay').style.display='none'">ЗАКРЫТЬ</div>
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
            if (!isTablet && ["profile", "rating", "lotto", "benchmark", "shop", "inventory"].includes(id)) {
                icon.classList.add('m-hidden');
            }
        });

        const arrow = document.createElement('div');
        arrow.className = 'nav-arrow-custom';
        let page = 1;
        arrow.onclick = () => {
            if (isEditMode) return;
            page = page === 1 ? 2 : 1;
            arrow.classList.toggle('flip', page === 2);
            const p1 = ["quests", "battle", "alliance", "mail", "community", "calendar"];
            const p2 = ["profile", "rating", "lotto", "benchmark", "shop", "inventory"];
            p1.forEach(id => refs[id] && refs[id].classList.toggle('m-hidden', page === 2));
            p2.forEach(id => refs[id] && refs[id].classList.toggle('m-hidden', page === 1));
        };
        document.body.appendChild(arrow);
    }

    function createIcon(id, x, y, size, parent) {
        const wrap = document.createElement('div');
        wrap.className = 'game-icon';
        wrap.style.width = size + 'px'; wrap.style.height = size + 'px';
        wrap.style.left = x + 'px'; wrap.style.top = y + 'px';

        const img = document.createElement('img');
        img.src = `icon_${id}.png`;
        img.onerror = () => img.src = 'https://cdn-icons-png.flaticon.com/512/236/236831.png';

        const controls = document.createElement('div');
        controls.className = 'size-controls';
        const btnPlus = document.createElement('div');
        btnPlus.className = 'size-btn'; btnPlus.innerText = '+';
        const btnMinus = document.createElement('div');
        btnMinus.className = 'size-btn'; btnMinus.innerText = '-';

        btnPlus.onpointerdown = (e) => { e.stopPropagation(); changeSize(wrap, 5); };
        btnMinus.onpointerdown = (e) => { e.stopPropagation(); changeSize(wrap, -5); };

        controls.appendChild(btnMinus);
        controls.appendChild(btnPlus);
        wrap.appendChild(controls);
        wrap.appendChild(img);

        img.onclick = () => {
            if (isEditMode) return;
            if (id === 'shop' && window.openShop) openShop();
            if (id === 'inventory' && window.openInventory) openInventory();
        };

        let pressTimer;
        wrap.onpointerdown = (e) => {
            if (!isEditMode) {
                pressTimer = setTimeout(() => enterEditMode(), 1500);
            }
        };
        wrap.onpointerup = () => clearTimeout(pressTimer);

        wrap.onpointermove = (e) => {
            if (!isEditMode || e.buttons !== 1) return;
            const rect = parent.getBoundingClientRect();
            wrap.style.left = (e.clientX - rect.left - parseFloat(wrap.style.width)/2) + 'px';
            wrap.style.top = (e.clientY - rect.top - parseFloat(wrap.style.height)/2) + 'px';
        };

        parent.appendChild(wrap);
        return wrap;
    }

    function changeSize(el, delta) {
        let currentSize = parseFloat(el.style.width);
        el.style.width = (currentSize + delta) + 'px';
        el.style.height = (currentSize + delta) + 'px';
    }

    function enterEditMode() {
        isEditMode = true;
        document.querySelectorAll('.game-icon').forEach(el => {
            el.classList.add('edit-mode');
            el.classList.remove('m-hidden');
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
        const code = `const ${layoutName} = ${JSON.stringify(result, null, 4)};`;
        
        document.getElementById('code-text-area').innerText = code;
        document.getElementById('code-output-overlay').style.display = 'flex';
        
        isEditMode = false;
        document.querySelectorAll('.game-icon').forEach(el => el.classList.remove('edit-mode'));
        document.querySelector('.save-coords-btn').style.display = 'none';
    }

    init();
})();

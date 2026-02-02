(function() {
    const isTablet = window.innerWidth > 1024 || (window.innerWidth <= 1024 && window.innerHeight > 1024);
    let isEditMode = false;
    let currentPage = 1;

    // Списки иконок по страницам
    const page2List = ["benchmark", "rating", "profile", "lotto", "mail"];

    // Начальные конфиги (добавил параметры для панели)
    let config = {
        panel: { x: 0, y: window.innerHeight - 120, w: window.innerWidth, h: 100 },
        layout: isTablet ? {
            "profile": { x: 367, y: 936, size: 154 },
            "battle": { x: 81, y: 938, size: 150 },
            "quests": { x: -9, y: 938, size: 139 },
            "calendar": { x: -21, y: 314, size: 161 },
            "alliance": { x: 179, y: 938, size: 147 },
            "community": { x: -17, y: 211, size: 144 },
            "mail": { x: 230, y: 891, size: 234 },
            "rating": { x: -24, y: 88, size: 159 },
            "benchmark": { x: 571, y: 924, size: 152 },
            "lotto": { x: 468, y: 930, size: 159 },
            "shop": { x: 10, y: 10, size: 100 },
            "inventory": { x: 120, y: 10, size: 100 }
        } : {
            "community": { x: 5, y: 164, size: 136 },
            "calendar": { x: -6, y: 245, size: 161 },
            "quests": { x: -18, y: 580, size: 128 },
            "battle": { x: 63.1, y: 582, size: 137 },
            "alliance": { x: 152.5, y: 584.5, size: 129 },
            "shop": { x: 10, y: 10, size: 80 },
            "inventory": { x: 100, y: 10, size: 80 },
            "mail": { x: 195.5, y: 538.5, size: 217 },
            "profile": { x: -26.5, y: 574, size: 145 },
            "rating": { x: 153.7, y: 567.7, size: 160 },
            "lotto": { x: 60.2, y: 565.2, size: 160 },
            "benchmark": { x: 252.8, y: 558.2, size: 160 }
        }
    };

    const style = document.createElement('style');
    style.innerHTML = `
        .ui-master-layer { position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 9999; }
        .game-icon { position: absolute; display: flex; align-items: center; justify-content: center; pointer-events: auto; touch-action: none; z-index: 10001; }
        .game-icon img { width: 100%; height: 100%; object-fit: contain; pointer-events: none; }
        
        /* Нижняя панель */
        .bottom-panel {
            position: absolute; background: rgba(70, 40, 20, 0.6); 
            border-top: 2px solid rgba(255,255,255,0.2); pointer-events: auto; touch-action: none; z-index: 10000;
        }
        .panel-line { position: absolute; left: 0; width: 100%; height: 2px; background: #ffd700; box-shadow: 0 0 8px #ffd700; pointer-events: none; }
        .line-top { top: 10%; }
        .line-bottom { bottom: 10%; }

        .m-hidden { opacity: 0 !important; pointer-events: none !important; }
        .edit-active { outline: 2px dashed #fff; background: rgba(255,255,255,0.1); }

        .nav-arrow-custom {
            position: absolute; left: 50%; top: -60px; transform: translateX(-50%);
            width: 50px; height: 50px; background: rgba(0,0,0,0.8); border: 3px solid #ffd700;
            border-radius: 50%; display: flex; align-items: center; justify-content: center;
            cursor: pointer; pointer-events: auto; box-shadow: 0 0 15px #ffd700; transition: transform 0.3s;
        }
        .nav-arrow-custom::after {
            content: ''; width: 12px; height: 12px; border-top: 4px solid #ffd700; border-right: 4px solid #ffd700;
            transform: rotate(45deg); margin-right: 4px;
        }
        .nav-arrow-custom.flip { transform: translateX(-50%) rotate(180deg); border-color: #00d4ff; box-shadow: 0 0 15px #00d4ff; }

        .save-coords-btn {
            position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
            padding: 15px 30px; background: #28a745; color: #fff; border-radius: 30px;
            font-weight: bold; z-index: 10005; display: none; border: 2px solid #fff;
        }

        #code-output-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.95); z-index: 20000; display: none;
            flex-direction: column; align-items: center; justify-content: center; padding: 20px;
        }
        #code-text-area { width: 90%; height: 60%; background: #000; color: #0f0; padding: 15px; font-family: monospace; font-size: 10px; border: 1px solid #0f0; overflow: auto; white-space: pre; user-select: all; }
    `;
    document.head.appendChild(style);

    function init() {
        const container = document.querySelector('.menu-container') || document.body;
        const layer = document.createElement('div');
        layer.className = 'ui-master-layer';
        container.appendChild(layer);

        // Создаем панель
        const panel = document.createElement('div');
        panel.className = 'bottom-panel';
        panel.style.left = config.panel.x + 'px';
        panel.style.top = config.panel.y + 'px';
        panel.style.width = config.panel.w + 'px';
        panel.style.height = config.panel.h + 'px';
        panel.innerHTML = '<div class="panel-line line-top"></div><div class="panel-line line-bottom"></div>';
        layer.appendChild(panel);

        // Стрелка (внутри панели, чтобы двигалась с ней)
        const arrow = document.createElement('div');
        arrow.className = 'nav-arrow-custom';
        panel.appendChild(arrow);

        const refs = { icons: {} };

        // Иконки
        Object.keys(config.layout).forEach(id => {
            const d = config.layout[id];
            const icon = createDraggableElement(id, d.x, d.y, d.size, layer, true);
            refs.icons[id] = icon;
            updateVisibility(id, icon);
        });

        // Делаем панель перетаскиваемой
        createDraggableElement('panel', config.panel.x, config.panel.y, config.panel.h, layer, false, panel);

        arrow.onclick = (e) => {
            e.stopPropagation();
            if (isEditMode) return;
            currentPage = currentPage === 1 ? 2 : 1;
            arrow.classList.toggle('flip', currentPage === 2);
            Object.keys(refs.icons).forEach(id => updateVisibility(id, refs.icons[id]));
        };

        const saveBtn = document.createElement('div');
        saveBtn.className = 'save-coords-btn';
        saveBtn.innerText = '💾 СОХРАНИТЬ ВСЁ';
        saveBtn.onclick = () => saveAndShowCode(refs, panel);
        document.body.appendChild(saveBtn);

        // Оверлей для кода
        const overlay = document.createElement('div');
        overlay.id = 'code-output-overlay';
        overlay.innerHTML = `
            <div style="color:gold; margin-bottom:10px;">КОПИРУЙ ЭТОТ ТЕКСТ:</div>
            <div id="code-text-area"></div>
            <div style="margin-top:20px; padding:10px 30px; background:red; color:white; border-radius:8px;" onclick="location.reload()">ЗАКРЫТЬ</div>
        `;
        document.body.appendChild(overlay);
    }

    function updateVisibility(id, el) {
        const isP2 = page2List.includes(id);
        el.classList.toggle('m-hidden', currentPage === 1 ? isP2 : !isP2);
    }

    function createDraggableElement(id, x, y, size, parent, isIcon, customEl = null) {
        const el = customEl || document.createElement('div');
        if (isIcon) {
            el.className = 'game-icon';
            el.style.width = size + 'px'; el.style.height = size + 'px';
            const img = document.createElement('img');
            img.src = `icon_${id}.png`;
            img.onerror = () => img.src = 'https://cdn-icons-png.flaticon.com/512/236/236831.png';
            el.appendChild(img);
        }

        let startDist = 0, startW = 0, startH = 0, pressTimer;

        el.onpointerdown = (e) => {
            if (!isEditMode) pressTimer = setTimeout(() => {
                isEditMode = true;
                document.querySelectorAll('.game-icon, .bottom-panel').forEach(item => item.classList.add('edit-active'));
                document.querySelectorAll('.m-hidden').forEach(item => item.classList.remove('m-hidden'));
                document.querySelector('.save-coords-btn').style.display = 'block';
            }, 1500);
        };
        el.onpointerup = () => clearTimeout(pressTimer);

        el.ontouchmove = (e) => {
            if (!isEditMode) return;
            if (e.touches.length === 1) {
                const t = e.touches[0];
                const rect = parent.getBoundingClientRect();
                el.style.left = (t.clientX - rect.left - parseFloat(el.style.width)/2) + 'px';
                el.style.top = (t.clientY - rect.top - parseFloat(el.style.height)/2) + 'px';
            } else if (e.touches.length === 2) {
                const dist = Math.hypot(e.touches[0].pageX - e.touches[1].pageX, e.touches[0].pageY - e.touches[1].pageY);
                if (startDist === 0) {
                    startDist = dist;
                    startW = parseFloat(el.style.width);
                    startH = parseFloat(el.style.height);
                } else {
                    const scale = dist / startDist;
                    el.style.width = (startW * scale) + 'px';
                    el.style.height = (startH * scale) + 'px';
                }
            }
        };
        el.ontouchend = () => { startDist = 0; };

        if (!customEl) parent.appendChild(el);
        return el;
    }

    function saveAndShowCode(refs, panel) {
        let finalConfig = {
            panel: {
                x: Math.round(parseFloat(panel.style.left)),
                y: Math.round(parseFloat(panel.style.top)),
                w: Math.round(parseFloat(panel.style.width)),
                h: Math.round(parseFloat(panel.style.height))
            },
            layout: {}
        };
        Object.keys(refs.icons).forEach(id => {
            const icon = refs.icons[id];
            finalConfig.layout[id] = {
                x: Math.round(parseFloat(icon.style.left)),
                y: Math.round(parseFloat(icon.style.top)),
                size: Math.round(parseFloat(icon.style.width))
            };
        });

        const output = isTablet ? "const tabletLayoutConfig = " : "const phoneLayoutConfig = ";
        document.getElementById('code-text-area').innerText = output + JSON.stringify(finalConfig, null, 4) + ";";
        document.getElementById('code-output-overlay').style.display = 'flex';
    }

    init();
})();

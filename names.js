(function() {
    const isTablet = window.innerWidth > 1024 || (window.innerWidth <= 1024 && window.innerHeight > 1024);
    let isEditMode = false;
    let currentPage = 1;

    // Списки иконок строго по страницам
    const page1List = ["quests", "battle", "alliance", "community", "calendar", "shop", "inventory"];
    const page2List = ["benchmark", "rating", "profile", "lotto", "mail"];

    let config = {
        panel: { x: 0, y: window.innerHeight - 130, w: window.innerWidth, h: 110 },
        layout: isTablet ? {
            "quests": { x: 50, y: 850, size: 140 }, "battle": { x: 200, y: 850, size: 140 },
            "alliance": { x: 350, y: 850, size: 140 }, "community": { x: 500, y: 850, size: 140 },
            "calendar": { x: 650, y: 850, size: 140 }, "shop": { x: 800, y: 850, size: 140 },
            "inventory": { x: 950, y: 850, size: 140 }, 
            "benchmark": { x: 50, y: 850, size: 140 }, "rating": { x: 200, y: 850, size: 140 }, 
            "profile": { x: 350, y: 850, size: 140 }, "lotto": { x: 500, y: 850, size: 140 }, 
            "mail": { x: 650, y: 850, size: 140 }
        } : {
            "quests": { x: 20, y: 500, size: 100 }, "battle": { x: 130, y: 500, size: 100 },
            "alliance": { x: 240, y: 500, size: 100 }, "community": { x: 20, y: 400, size: 100 },
            "calendar": { x: 130, y: 400, size: 100 }, "shop": { x: 240, y: 400, size: 100 },
            "inventory": { x: 20, y: 300, size: 100 }, 
            "benchmark": { x: 20, y: 500, size: 100 }, "rating": { x: 130, y: 500, size: 100 }, 
            "profile": { x: 240, y: 500, size: 100 }, "lotto": { x: 20, y: 400, size: 100 }, 
            "mail": { x: 130, y: 400, size: 100 }
        }
    };

    const style = document.createElement('style');
    style.innerHTML = `
        .ui-master-layer { position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 9999; }
        .game-icon { position: absolute; display: flex; align-items: center; justify-content: center; pointer-events: auto; touch-action: none; z-index: 10001; }
        .game-icon img { width: 100%; height: 100%; object-fit: contain; pointer-events: none; }
        .bottom-panel { position: absolute; background: rgba(85, 45, 25, 0.6); border-top: 2px solid rgba(255,215,0,0.4); pointer-events: auto; touch-action: none; z-index: 10000; }
        .panel-line { position: absolute; left: 0; width: 100%; height: 2px; background: #ffd700; opacity: 0.7; pointer-events: none; }
        .line-top { top: 20%; } .line-bottom { bottom: 20%; }
        .m-hidden { display: none !important; }
        .edit-border { outline: 2px dashed #fff; background: rgba(255,255,255,0.1); }
        .nav-arrow-custom {
            position: absolute; left: 50%; top: -70px; transform: translateX(-50%);
            width: 60px; height: 60px; background: rgba(20,10,5,0.9); border: 3px solid #ffd700;
            border-radius: 50%; display: flex; align-items: center; justify-content: center;
            pointer-events: auto; box-shadow: 0 0 15px #ffd700; z-index: 10005;
        }
        .nav-arrow-custom::after { content: ''; width: 14px; height: 14px; border-top: 5px solid #ffd700; border-right: 5px solid #ffd700; transform: rotate(45deg); margin-right: 5px; }
        .nav-arrow-custom.flip { transform: translateX(-50%) rotate(180deg); border-color: #00d4ff; box-shadow: 0 0 15px #00d4ff; }
        .save-coords-btn { position: fixed; top: 20px; left: 50%; transform: translateX(-50%); padding: 15px 40px; background: #28a745; color: #fff; border-radius: 30px; font-weight: bold; z-index: 10006; display: none; border: 2px solid #fff; }
        #code-output-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.95); z-index: 20000; display: none; flex-direction: column; align-items: center; justify-content: center; padding: 20px; }
        #code-text-area { width: 90%; height: 60%; background: #000; color: #0f0; padding: 15px; font-family: monospace; font-size: 10px; border: 1px solid #0f0; overflow: auto; white-space: pre; user-select: all; }
    `;
    document.head.appendChild(style);

    function init() {
        const container = document.querySelector('.menu-container') || document.body;
        const layer = document.createElement('div');
        layer.className = 'ui-master-layer';
        container.appendChild(layer);

        const panel = document.createElement('div');
        panel.className = 'bottom-panel';
        Object.assign(panel.style, { left: config.panel.x+'px', top: config.panel.y+'px', width: config.panel.w+'px', height: config.panel.h+'px' });
        panel.innerHTML = '<div class="panel-line line-top"></div><div class="panel-line line-bottom"></div>';
        layer.appendChild(panel);

        const arrow = document.createElement('div');
        arrow.className = 'nav-arrow-custom';
        panel.appendChild(arrow);

        const refs = { icons: {} };
        Object.keys(config.layout).forEach(id => {
            const d = config.layout[id];
            const icon = createDraggableElement(id, d.x, d.y, d.size, layer, true);
            refs.icons[id] = icon;
            updateVisibility(id, icon);
        });

        createDraggableElement('panel', config.panel.x, config.panel.y, config.panel.h, layer, false, panel);

        arrow.onclick = (e) => {
            e.stopPropagation();
            currentPage = currentPage === 1 ? 2 : 1;
            arrow.classList.toggle('flip', currentPage === 2);
            Object.keys(refs.icons).forEach(id => updateVisibility(id, refs.icons[id]));
        };

        const saveBtn = document.createElement('div');
        saveBtn.className = 'save-coords-btn';
        saveBtn.innerText = '💾 СОХРАНИТЬ';
        saveBtn.onclick = () => saveAndShowCode(refs, panel);
        document.body.appendChild(saveBtn);

        const overlay = document.createElement('div');
        overlay.id = 'code-output-overlay';
        overlay.innerHTML = `<div style="color:gold;margin-bottom:10px;">СКОПИРУЙ ЭТОТ КОД:</div><div id="code-text-area"></div><div style="margin-top:20px;padding:12px 40px;background:red;color:white;border-radius:10px;font-weight:bold;" onclick="location.reload()">ЗАКРЫТЬ</div>`;
        document.body.appendChild(overlay);
    }

    function updateVisibility(id, el) {
        const onPage2 = page2List.includes(id);
        const shouldShow = (currentPage === 1 && !onPage2) || (currentPage === 2 && onPage2);
        el.classList.toggle('m-hidden', !shouldShow);
    }

    function createDraggableElement(id, x, y, size, parent, isIcon, customEl = null) {
        const el = customEl || document.createElement('div');
        if (isIcon) {
            el.className = 'game-icon';
            Object.assign(el.style, { width: size+'px', height: size+'px', left: x+'px', top: y+'px' });
            const img = document.createElement('img');
            img.src = `icon_${id}.png`;
            img.onerror = () => img.src = 'https://cdn-icons-png.flaticon.com/512/236/236831.png';
            el.appendChild(img);
        }

        let sD = 0, sW = 0, sH = 0, pT;
        el.onpointerdown = (e) => {
            if (!isEditMode) pT = setTimeout(() => {
                isEditMode = true;
                document.querySelectorAll('.game-icon, .bottom-panel').forEach(i => i.classList.add('edit-border'));
                document.querySelector('.save-coords-btn').style.display = 'block';
            }, 1500);
        };
        el.onpointerup = () => clearTimeout(pT);

        el.ontouchmove = (e) => {
            if (!isEditMode) return;
            if (isIcon && el.classList.contains('m-hidden')) return;

            if (e.touches.length === 1) {
                const t = e.touches[0];
                el.style.left = (t.clientX - parseFloat(el.style.width)/2) + 'px';
                el.style.top = (t.clientY - parseFloat(el.style.height)/2) + 'px';
            } else if (e.touches.length === 2) {
                const d = Math.hypot(e.touches[0].pageX - e.touches[1].pageX, e.touches[0].pageY - e.touches[1].pageY);
                if (sD === 0) { sD = d; sW = parseFloat(el.style.width); sH = parseFloat(el.style.height); }
                else { const sc = d / sD; el.style.width = (sW * sc) + 'px'; el.style.height = (sH * sc) + 'px'; }
            }
        };
        el.ontouchend = () => { sD = 0; };
        if (!customEl) parent.appendChild(el);
        return el;
    }

    function saveAndShowCode(refs, panel) {
        let res = { panel: { x: parseInt(panel.style.left), y: parseInt(panel.style.top), w: parseInt(panel.style.width), h: parseInt(panel.style.height) }, layout: {} };
        Object.keys(refs.icons).forEach(id => { 
            const i = refs.icons[id]; 
            res.layout[id] = { x: parseInt(i.style.left), y: parseInt(i.style.top), size: parseInt(i.style.width) }; 
        });
        document.getElementById('code-text-area').innerText = (isTablet ? "const tabletLayout = " : "const phoneLayout = ") + JSON.stringify(res, null, 4) + ";";
        document.getElementById('code-output-overlay').style.display = 'flex';
    }

    init();
})();

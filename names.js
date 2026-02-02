(function() {
    const isTablet = true; // Принудительно планшет, так как даны его координаты
    let isEditMode = false;
    let currentPage = 1;

    const page1List = ["quests", "battle", "alliance", "community", "calendar", "shop", "inventory"];
    const page2List = ["benchmark", "rating", "profile", "lotto", "mail"];

    // Твои точные координаты
    let config = {
        "panel": { "x": -17, "y": 880, "w": 854, "h": 130 },
        "layout": {
            "quests": { "x": -19, "y": 877, "size": 145 },
            "battle": { "x": 102, "y": 880, "size": 160 },
            "alliance": { "x": 237, "y": 882, "size": 150 },
            "community": { "x": -15, "y": 127, "size": 153 },
            "calendar": { "x": -69, "y": 414, "size": 256 },
            "shop": { "x": 357, "y": 886, "size": 152 },
            "inventory": { "x": 487, "y": 872, "size": 150 },
            "benchmark": { "x": 477, "y": 868, "size": 162 },
            "rating": { "x": 229, "y": 871, "size": 162 },
            "profile": { "x": 99, "y": 867, "size": 165 },
            "lotto": { "x": 344, "y": 870, "size": 167 },
            "mail": { "x": 350, "y": 50, "size": 140 } // Поставил вверху по центру для начала
        }
    };

    const style = document.createElement('style');
    style.innerHTML = `
        .ui-master-layer { position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 9999; }
        .game-icon { position: absolute; display: flex; align-items: center; justify-content: center; pointer-events: auto; touch-action: none; z-index: 10001; }
        .game-icon img { width: 100%; height: 100%; object-fit: contain; pointer-events: none; }
        .bottom-panel { position: absolute; background: rgba(85, 45, 25, 0.6); border-top: 2px solid rgba(255,215,0,0.4); pointer-events: none; z-index: 10000; }
        .panel-line { position: absolute; left: 0; width: 100%; height: 2px; background: #ffd700; opacity: 0.7; }
        .line-top { top: 20%; } .line-bottom { bottom: 20%; }
        .m-hidden { display: none !important; }
        .editable-mail { outline: 3px dashed #0f0 !important; background: rgba(0,255,0,0.1); }
        .nav-arrow-custom {
            position: absolute; left: 50%; top: -70px; transform: translateX(-50%);
            width: 60px; height: 60px; background: rgba(20,10,5,0.9); border: 3px solid #ffd700;
            border-radius: 50%; display: flex; align-items: center; justify-content: center;
            pointer-events: auto; box-shadow: 0 0 15px #ffd700;
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
            const isMail = (id === "mail");
            const icon = createIcon(id, d.x, d.y, d.size, layer, isMail);
            refs.icons[id] = icon;
            updateVisibility(id, icon);
        });

        arrow.onclick = (e) => {
            e.stopPropagation();
            currentPage = currentPage === 1 ? 2 : 1;
            arrow.classList.toggle('flip', currentPage === 2);
            Object.keys(refs.icons).forEach(id => updateVisibility(id, refs.icons[id]));
        };

        const saveBtn = document.createElement('div');
        saveBtn.className = 'save-coords-btn';
        saveBtn.innerText = '💾 СОХРАНИТЬ КООРДИНАТЫ ПИСЬМА';
        saveBtn.onclick = () => saveAndShowCode(refs, panel);
        document.body.appendChild(saveBtn);

        const overlay = document.createElement('div');
        overlay.id = 'code-output-overlay';
        overlay.innerHTML = `<div style="color:gold;margin-bottom:10px;">СКОПИРУЙ НОВЫЙ КОНФИГ:</div><div id="code-text-area"></div><div style="margin-top:20px;padding:12px 40px;background:red;color:white;border-radius:10px;font-weight:bold;" onclick="location.reload()">ЗАКРЫТЬ</div>`;
        document.body.appendChild(overlay);
    }

    function updateVisibility(id, el) {
        const onPage2 = page2List.includes(id);
        const shouldShow = (currentPage === 1 && !onPage2) || (currentPage === 2 && onPage2);
        el.classList.toggle('m-hidden', !shouldShow);
    }

    function createIcon(id, x, y, size, parent, canEdit) {
        const el = document.createElement('div');
        el.className = 'game-icon';
        Object.assign(el.style, { width: size+'px', height: size+'px', left: x+'px', top: y+'px' });
        
        const img = document.createElement('img');
        img.src = `icon_${id}.png`;
        img.onerror = () => img.src = 'https://cdn-icons-png.flaticon.com/512/236/236831.png';
        el.appendChild(img);

        if (canEdit) {
            let sD = 0, sW = 0, pT;
            el.onpointerdown = (e) => {
                pT = setTimeout(() => {
                    isEditMode = true;
                    el.classList.add('editable-mail');
                    document.querySelector('.save-coords-btn').style.display = 'block';
                }, 1500);
            };
            el.onpointerup = () => clearTimeout(pT);
            
            el.ontouchmove = (e) => {
                if (!isEditMode) return;
                if (e.touches.length === 1) {
                    const t = e.touches[0];
                    el.style.left = (t.clientX - parseFloat(el.style.width)/2) + 'px';
                    el.style.top = (t.clientY - parseFloat(el.style.height)/2) + 'px';
                } else if (e.touches.length === 2) {
                    const d = Math.hypot(e.touches[0].pageX - e.touches[1].pageX, e.touches[0].pageY - e.touches[1].pageY);
                    if (sD === 0) { sD = d; sW = parseFloat(el.style.width); }
                    else { const sc = d / sD; el.style.width = (sW * sc) + 'px'; el.style.height = (sW * sc) + 'px'; }
                }
            };
            el.ontouchend = () => { sD = 0; };
        }

        parent.appendChild(el);
        return el;
    }

    function saveAndShowCode(refs, panel) {
        let res = { panel: config.panel, layout: {} };
        Object.keys(refs.icons).forEach(id => { 
            const i = refs.icons[id]; 
            res.layout[id] = { x: parseInt(i.style.left), y: parseInt(i.style.top), size: parseInt(i.style.width) }; 
        });
        document.getElementById('code-text-area').innerText = "const tabletLayout = " + JSON.stringify(res, null, 4) + ";";
        document.getElementById('code-output-overlay').style.display = 'flex';
    }

    init();
})();

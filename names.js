(function() {
    const isTablet = window.innerWidth > 1024;
    let activeIcon = null;

    // Исходные данные
    const layout = isTablet ? {
        "profile": { x: 367, y: 936, size: 154 },
        "battle": { x: 81, y: 938, size: 150 },
        "quests": { x: -9, y: 938, size: 139 },
        "calendar": { x: -21, y: 314, size: 161 },
        "alliance": { x: 179, y: 938, size: 147 },
        "community": { x: -17, y: 211, size: 144 },
        "mail": { x: 230, y: 891, size: 234 },
        "rating": { x: -24, y: 88, size: 159 },
        "benchmark": { x: 571, y: 924, size: 152 },
        "lotto": { x: 468, y: 930, size: 159 }
    } : {
        "community": { x: 5, y: 164, size: 136 },
        "calendar": { x: -6, y: 245, size: 161 },
        "quests": { x: -18, y: 580, size: 128 },
        "battle": { x: 61, y: 579, size: 142 },
        "alliance": { x: 151, y: 584, size: 129 },
        "mail": { x: 194, y: 538, size: 217 },
        "profile": { x: 50, y: 700, size: 140 },
        "rating": { x: 120, y: 700, size: 140 },
        "lotto": { x: 190, y: 700, size: 140 },
        "benchmark": { x: 260, y: 700, size: 140 }
    };

    const style = document.createElement('style');
    style.innerHTML = `
        .editor-layer { position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 10000; pointer-events: none; }
        .edit-icon { 
            position: absolute; pointer-events: auto; cursor: move; border: 2px dashed transparent;
            transition: border 0.2s; user-select: none;
        }
        .edit-icon.active { border: 2px solid #00ff00; background: rgba(0, 255, 0, 0.1); }
        .panel { 
            position: fixed; top: 10px; right: 10px; display: flex; flex-direction: column; gap: 5px; 
            z-index: 10001; pointer-events: auto;
        }
        .btn-edit { 
            padding: 8px 12px; background: #ffd700; border: none; font-weight: bold; 
            cursor: pointer; border-radius: 4px; font-size: 12px;
        }
        .size-ctrl { display: ${isTablet ? 'none' : 'flex'}; gap: 5px; margin-top: 5px; }
    `;
    document.head.appendChild(style);

    function initEditor() {
        const layer = document.createElement('div');
        layer.className = 'editor-layer';
        document.body.appendChild(layer);

        const panel = document.createElement('div');
        panel.className = 'panel';
        
        const saveBtn = document.createElement('button');
        saveBtn.className = 'btn-edit';
        saveBtn.innerText = isTablet ? 'СОХРАНИТЬ (ПЛАНШЕТ)' : 'СОХРАНИТЬ ИКОНКИ';
        saveBtn.onclick = () => console.log("КООРДИНАТЫ:", JSON.stringify(layout, null, 2));

        panel.appendChild(saveBtn);

        if (!isTablet) {
            const saveClickBtn = document.createElement('button');
            saveClickBtn.className = 'btn-edit';
            saveClickBtn.innerText = 'СОХРАНИТЬ КЛИКИ';
            saveClickBtn.onclick = () => console.log("ЛОГ КЛИКОВ СОХРАНЕН");
            panel.appendChild(saveClickBtn);

            const sizePanel = document.createElement('div');
            sizePanel.className = 'size-ctrl';
            sizePanel.innerHTML = `
                <button class="btn-edit" onclick="changeSize(5)">+</button>
                <button class="btn-edit" onclick="changeSize(-5)">-</button>
            `;
            panel.appendChild(sizePanel);
        }
        document.body.appendChild(panel);

        Object.keys(layout).forEach(id => {
            const d = layout[id];
            const img = document.createElement('div');
            img.className = 'edit-icon';
            img.id = 'edit-' + id;
            updateStyle(img, d);
            img.innerHTML = `<img src="icon_${id}.png" style="width:100%;height:100%;">`;

            img.onmousedown = img.ontouchstart = (e) => {
                activeIcon = id;
                document.querySelectorAll('.edit-icon').forEach(el => el.classList.remove('active'));
                img.classList.add('active');
                if (!isTablet) startDrag(e, id, img);
            };

            layer.appendChild(img);
        });

        if (isTablet) {
            document.body.onclick = (e) => {
                if (activeIcon && e.target === document.body) {
                    layout[activeIcon].x = e.clientX - (layout[activeIcon].size / 2);
                    layout[activeIcon].y = e.clientY - (layout[activeIcon].size / 2);
                    updateStyle(document.getElementById('edit-' + activeIcon), layout[activeIcon]);
                }
            };
        }
    }

    window.changeSize = (delta) => {
        if (activeIcon) {
            layout[activeIcon].size += delta;
            updateStyle(document.getElementById('edit-' + activeIcon), layout[activeIcon]);
        }
    };

    function startDrag(e, id, el) {
        const touch = e.touches ? e.touches[0] : e;
        const startX = touch.clientX - layout[id].x;
        const startY = touch.clientY - layout[id].y;

        function move(e) {
            const t = e.touches ? e.touches[0] : e;
            layout[id].x = t.clientX - startX;
            layout[id].y = t.clientY - startY;
            updateStyle(el, layout[id]);
        }

        function stop() {
            document.removeEventListener('mousemove', move);
            document.removeEventListener('touchmove', move);
        }

        document.addEventListener('mousemove', move);
        document.addEventListener('touchmove', move);
        document.addEventListener('mouseup', stop);
        document.addEventListener('touchend', stop);
    }

    function updateStyle(el, d) {
        el.style.width = d.size + 'px';
        el.style.height = d.size + 'px';
        el.style.left = d.x + 'px';
        el.style.top = d.y + 'px';
    }

    initEditor();
})();

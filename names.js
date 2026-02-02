(function() {
    // Твои финальные координаты (зафиксировано)
    const layout = {
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

    const style = document.createElement('style');
    style.innerHTML = `
        .game-nav-layer {
            position: absolute; top: 0; left: 0; width: 100%; height: 100%;
            pointer-events: none; z-index: 1000;
        }
        .nav-icon {
            position: absolute; display: flex; align-items: center; justify-content: center;
            pointer-events: auto; cursor: pointer;
        }
        .nav-icon img { width: 100%; height: 100%; object-fit: contain; }
    `;
    document.head.appendChild(style);

    function init() {
        const container = document.querySelector('#menu-screen .menu-container') || document.body;
        const layer = document.createElement('div');
        layer.className = 'game-nav-layer';
        container.appendChild(layer);

        Object.keys(layout).forEach(id => {
            const conf = layout[id];
            const btn = document.createElement('div');
            btn.className = 'nav-icon';
            btn.id = 'btn-' + id;
            
            // Установка позиции и размера
            btn.style.left = conf.x + 'px';
            btn.style.top = conf.y + 'px';
            btn.style.width = conf.size + 'px';
            btn.style.height = conf.size + 'px';

            btn.innerHTML = `<img src="icon_${id}.png">`;
            
            // Логика нажатий (добавь свои функции сюда)
            btn.onclick = () => {
                console.log("Нажата иконка:", id);
            };

            layer.appendChild(btn);
        });
    }

    // Запуск после загрузки DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

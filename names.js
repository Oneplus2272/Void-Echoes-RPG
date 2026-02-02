(function() {
    const isTablet = window.innerWidth > 1024 || (window.innerWidth <= 1024 && window.innerHeight > 1024);

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
        "benchmark": { x: 252.8, y: 558.2, size: 160 }
    };

    const style = document.createElement('style');
    style.innerHTML = `
        .ui-master-layer { position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 9999; }
        .game-icon { 
            position: absolute; display: flex; align-items: center; justify-content: center;
            pointer-events: none; transition: opacity 0.4s cubic-bezier(0.25, 1, 0.5, 1), transform 0.4s cubic-bezier(0.25, 1, 0.5, 1);
        }
        .game-icon img { 
            width: 100%; height: 100%; object-fit: contain; 
            pointer-events: auto; cursor: pointer; -webkit-tap-highlight-color: transparent;
        }
        .game-icon img:active { transform: scale(0.9); transition: transform 0.1s; }
        
        .nav-arrow-min {
            position: fixed; right: 12px; bottom: 25px; width: 28px; height: 28px;
            background: #ffd700; clip-path: polygon(0% 0%, 100% 50%, 0% 100%);
            z-index: 10001; cursor: pointer; pointer-events: auto;
            transition: transform 0.3s ease; display: none;
        }
        .menu-container ~ .nav-arrow-min, body:has(.menu-container) .nav-arrow-min { display: ${isTablet ? 'none' : 'block'}; }
        .nav-arrow-min.flip { transform: rotate(180deg); }
        .m-hidden { opacity: 0 !important; pointer-events: none !important; transform: translateX(30px); }
    `;
    document.head.appendChild(style);

    function init() {
        const container = document.querySelector('.menu-container') || document.body;
        const layer = document.createElement('div');
        layer.className = 'ui-master-layer';
        container.appendChild(layer);

        const refs = {};
        const data = isTablet ? tabletLayout : phoneLayout;

        Object.keys(data).forEach(id => {
            const d = data[id];
            const icon = createIcon(id, d.x, d.y, d.size, layer);
            refs[id] = icon;
            if (!isTablet && ["profile", "rating", "lotto", "benchmark"].includes(id)) {
                icon.classList.add('m-hidden');
            }
        });

        if (!isTablet) {
            const arrow = document.createElement('div');
            arrow.className = 'nav-arrow-min';
            let page = 1;
            arrow.onclick = (e) => {
                e.stopPropagation();
                page = page === 1 ? 2 : 1;
                arrow.classList.toggle('flip', page === 2);
                const p1 = ["quests", "battle", "alliance", "mail"];
                const p2 = ["profile", "rating", "lotto", "benchmark"];
                p1.forEach(id => refs[id].classList.toggle('m-hidden', page === 2));
                p2.forEach(id => refs[id].classList.toggle('m-hidden', page === 1));
            };
            document.body.appendChild(arrow);
        }
    }

    function createIcon(id, x, y, size, parent) {
        const btn = document.createElement('div');
        btn.className = 'game-icon';
        btn.style.width = size + 'px'; btn.style.height = size + 'px';
        btn.style.left = x + 'px'; btn.style.top = y + 'px';
        const img = document.createElement('img');
        img.src = `icon_${id}.png`;
        img.onclick = () => { /* Твой вызов функции открытия окна */ console.log("Open:", id); };
        btn.appendChild(img);
        parent.appendChild(btn);
        return btn;
    }

    init();
})();

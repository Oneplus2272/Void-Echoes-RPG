(function() {
    const isTablet = window.innerWidth > 1024 || (window.innerWidth <= 1024 && window.innerHeight > 1024);
    let currentPage = 1;

    // Группировка
    const bottomPage1 = ["quests", "battle", "alliance", "inventory"];
    const bottomPage2 = ["benchmark", "rating", "profile", "lotto"];

    const tabletLayout = {
        "panel": { "x": -17, "y": 880, "w": 854, "h": 130 },
        "layout": {
            "quests": { "x": -19, "y": 877, "size": 145 }, "battle": { "x": 102, "y": 880, "size": 160 },
            "alliance": { "x": 237, "y": 882, "size": 150 }, "community": { "x": -15, "y": 127, "size": 153 },
            "calendar": { "x": -69, "y": 414, "size": 256 }, "shop": { "x": 357, "y": 886, "size": 152 },
            "inventory": { "x": 487, "y": 872, "size": 150 }, "benchmark": { "x": 477, "y": 868, "size": 162 },
            "rating": { "x": 229, "y": 871, "size": 162 }, "profile": { "x": 99, "y": 867, "size": 165 },
            "lotto": { "x": 344, "y": 870, "size": 167 }, "mail": { "x": -79, "y": 835, "size": 243 }
        }
    };

    const phoneLayout = {
        "panel": { "x": -24, "y": 551, "w": 398, "h": 99 },
        "layout": {
            "quests": { "x": -22, "y": 551, "size": 106 }, "battle": { "x": 59, "y": 553, "size": 119 },
            "alliance": { "x": 154, "y": 554, "size": 110 }, "community": { "x": 17, "y": 167, "size": 114 },
            "calendar": { "x": 218, "y": 358, "size": 188 }, "shop": { "x": 246, "y": 94, "size": 115 },
            "inventory": { "x": 248, "y": 547, "size": 112 }, "benchmark": { "x": 238, "y": 542, "size": 127 },
            "rating": { "x": 57, "y": 544, "size": 127 }, "profile": { "x": -27, "y": 543, "size": 123 },
            "lotto": { "x": 143, "y": 543, "size": 131 }, "mail": { "x": -14, "y": 250, "size": 190 }
        }
    };

    const config = isTablet ? tabletLayout : phoneLayout;

    const style = document.createElement('style');
    style.innerHTML = `
        #fixed-game-ui { position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 99999; display: none; }
        .game-icon { position: absolute; pointer-events: auto; cursor: pointer; transition: transform 0.05s; -webkit-tap-highlight-color: transparent; }
        .game-icon img { width: 100%; height: 100%; object-fit: contain; pointer-events: none; }
        .game-icon:active { transform: scale(0.9); filter: brightness(0.8); }
        .bottom-panel { position: absolute; background: rgba(85, 45, 25, 0.6); border-top: 2px solid rgba(255,215,0,0.4); pointer-events: none; }
        .m-hidden { display: none !important; }
        .nav-arrow-custom {
            position: absolute; left: 50%; top: -65px; transform: translateX(-50%);
            width: 55px; height: 55px; background: rgba(15,5,0,0.9); border: 3px solid #ffd700;
            border-radius: 50%; display: flex; align-items: center; justify-content: center;
            pointer-events: auto; cursor: pointer; z-index: 100000;
        }
        .nav-arrow-custom::after { content: ''; width: 10px; height: 10px; border-top: 4px solid #ffd700; border-right: 4px solid #ffd700; transform: rotate(45deg); margin-right: 4px; }
        .nav-arrow-custom.flip { transform: translateX(-50%) rotate(180deg); border-color: #00d4ff; }
    `;
    document.head.appendChild(style);

    const root = document.createElement('div');
    root.id = 'fixed-game-ui';
    document.body.appendChild(root);

    const panel = document.createElement('div');
    panel.className = 'bottom-panel';
    Object.assign(panel.style, { left: config.panel.x+'px', top: config.panel.y+'px', width: config.panel.w+'px', height: config.panel.h+'px' });
    root.appendChild(panel);

    const arrow = document.createElement('div');
    arrow.className = 'nav-arrow-custom';
    panel.appendChild(arrow);

    const iconRefs = {};
    Object.keys(config.layout).forEach(id => {
        const d = config.layout[id];
        const icon = document.createElement('div');
        icon.className = 'game-icon';
        Object.assign(icon.style, { width: d.size+'px', height: d.size+'px', left: d.x+'px', top: d.y+'px' });
        const img = document.createElement('img');
        img.src = `icon_${id}.png`; 
        img.onerror = () => img.src = 'https://cdn-icons-png.flaticon.com/512/236/236831.png';
        icon.appendChild(img);
        root.appendChild(icon);
        iconRefs[id] = icon;
    });

    function updateNav() {
        bottomPage1.forEach(id => iconRefs[id]?.classList.toggle('m-hidden', currentPage !== 1));
        bottomPage2.forEach(id => iconRefs[id]?.classList.toggle('m-hidden', currentPage !== 2));
    }

    arrow.onclick = (e) => {
        e.stopPropagation();
        currentPage = currentPage === 1 ? 2 : 1;
        arrow.classList.toggle('flip', currentPage === 2);
        updateNav();
    };

    updateNav();

    // Простая проверка фона
    setInterval(() => {
        const menu = document.querySelector('.menu-container');
        if (menu) {
            const bg = window.getComputedStyle(menu).backgroundImage;
            // Показываем только если на фоне главная "луна"
            root.style.display = bg.includes('Bg_menu_main.png') ? 'block' : 'none';
        } else {
            root.style.display = 'none';
        }
    }, 100);
})();

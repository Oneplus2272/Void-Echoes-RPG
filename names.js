(function() {
    const isTablet = window.innerWidth > 768;

    // 1. ФИКСИРОВАННЫЕ КООРДИНАТЫ ДЛЯ ПЛАНШЕТА
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

    // 2. КООРДИНАТЫ ДЛЯ ТЕЛЕФОНА (из твоих скриншотов)
    const phoneLayout = {
        "community": { x: 5,   y: 164, size: 136, page: 1 },
        "quests":    { x: -18, y: 580, size: 128, page: 1 },
        "battle":    { x: 61,  y: 579, size: 142, page: 1 },
        "alliance":  { x: 151, y: 584, size: 129, page: 1 },
        "mail":      { x: 194, y: 538, size: 217, page: 1 },
        "calendar":  { x: -6,  y: 245, size: 161, page: 1 },
        // Эти 4 иконки на 2-ю страницу (в нижнюю панель)
        "profile":   { x: 220, y: 379, size: 167, page: 2 },
        "rating":    { x: 218, y: 286, size: 161, page: 2 },
        "benchmark": { x: 227, y: 469, size: 157, page: 2 },
        "lotto":     { x: -10, y: 342, size: 165, page: 2 }
    };

    const style = document.createElement('style');
    style.innerHTML = `
        .canvas-page {
            position: absolute; top: 0; left: 0; width: 100%; height: 100%;
            transition: transform 0.4s ease-out; pointer-events: none;
        }
        .canvas-page.active { pointer-events: auto; }
        .nav-icon { 
            position: absolute; display: flex; align-items: center; justify-content: center; 
            cursor: pointer;
        }
        .nav-icon img { width: 100%; height: 100%; object-fit: contain; }
        
        .page-arrow {
            position: fixed; left: 50%; bottom: 15px; transform: translateX(-50%);
            width: 50px; height: 35px; background: rgba(255, 215, 0, 0.8);
            clip-path: polygon(50% 100%, 0% 0%, 100% 0%);
            z-index: 2000; cursor: pointer; display: ${isTablet ? 'none' : 'block'};
        }
        .page-arrow.up { transform: translateX(-50%) rotate(180deg); }
    `;
    document.head.appendChild(style);

    let currentPage = 1;

    function init() {
        const container = document.querySelector('#menu-screen .menu-container') || document.body;
        
        const p1 = document.createElement('div'); p1.className = 'canvas-page active';
        const p2 = document.createElement('div'); p2.className = 'canvas-page';
        if(!isTablet) p2.style.transform = 'translateY(100%)';

        container.appendChild(p1);
        container.appendChild(p2);

        Object.keys(phoneLayout).forEach(id => {
            const btn = document.createElement('div');
            btn.className = 'nav-icon';
            btn.innerHTML = `<img src="icon_${id}.png">`;

            if (isTablet) {
                const conf = tabletLayout[id];
                btn.style.left = conf.x + 'px';
                btn.style.top = conf.y + 'px';
                btn.style.width = btn.style.height = conf.size + 'px';
                p1.appendChild(btn);
            } else {
                const conf = phoneLayout[id];
                btn.style.left = conf.x + 'px';
                btn.style.top = conf.y + 'px';
                btn.style.width = btn.style.height = conf.size + 'px';
                (conf.page === 1 ? p1 : p2).appendChild(btn);
            }
            
            // Здесь можно добавить функции клика
            btn.onclick = () => console.log("Нажато:", id);
        });

        if (!isTablet) {
            const arrow = document.createElement('div');
            arrow.className = 'page-arrow';
            arrow.onclick = () => {
                if (currentPage === 1) {
                    p1.style.transform = 'translateY(-100%)';
                    p2.style.transform = 'translateY(0)';
                    currentPage = 2; arrow.classList.add('up');
                } else {
                    p1.style.transform = 'translateY(0)';
                    p2.style.transform = 'translateY(100%)';
                    currentPage = 1; arrow.classList.remove('up');
                }
            };
            document.body.appendChild(arrow);
        }
    }

    init();
})();

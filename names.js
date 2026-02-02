(function() {
    const isTablet = window.innerWidth > 768;

    // ФИКСИРОВАННЫЕ КООРДИНАТЫ ПЛАНШЕТА
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

    // НАСТРОЙКИ ДЛЯ ТЕЛЕФОНА
    const phoneStatic = {
        "community": { x: 5,   y: 164, size: 136 },
        "calendar":  { x: -6,  y: 245, size: 161 }
    };

    // Иконки нижней панели (Телефон)
    const phoneBottomGroup1 = ["quests", "battle", "alliance", "mail"];
    const phoneBottomGroup2 = ["profile", "rating", "lotto", "benchmark"];

    const style = document.createElement('style');
    style.innerHTML = `
        .game-nav-layer { position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 1000; overflow: hidden; }
        
        .nav-icon { 
            position: absolute; display: flex; align-items: center; justify-content: center; 
            pointer-events: auto; cursor: pointer;
            transition: transform 0.1s ease;
            -webkit-tap-highlight-color: transparent; /* Убирает белый квадрат */
        }
        
        /* Эффект нажатия */
        .nav-icon:active { transform: scale(0.9); }
        .nav-icon img { width: 100%; height: 100%; object-fit: contain; }

        /* Контейнер для слайдера на телефоне */
        .mobile-slider-container {
            position: fixed; bottom: 0; left: 0; width: 100%; height: 120px;
            pointer-events: none; display: ${isTablet ? 'none' : 'block'};
        }
        
        .slider-track {
            position: absolute; width: 200%; height: 100%;
            display: flex; transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            pointer-events: none;
        }

        .slider-page { width: 50%; height: 100%; position: relative; pointer-events: none; }
        .slider-page .nav-icon { pointer-events: auto; }

        .side-arrow {
            position: fixed; right: 5px; bottom: 40px; width: 40px; height: 40px;
            background: rgba(255, 215, 0, 0.7); clip-path: polygon(0% 0%, 100% 50%, 0% 100%);
            z-index: 2000; cursor: pointer; pointer-events: auto;
            display: ${isTablet ? 'none' : 'block'};
            transition: transform 0.3s ease;
            -webkit-tap-highlight-color: transparent;
        }
        .side-arrow.reversed { transform: rotate(180deg); }
    `;
    document.head.appendChild(style);

    function init() {
        const container = document.querySelector('#menu-screen .menu-container') || document.body;
        const mainLayer = document.createElement('div');
        mainLayer.className = 'game-nav-layer';
        container.appendChild(mainLayer);

        if (isTablet) {
            // ПЛАНШЕТ: Рендерим всё по твоим координатам
            Object.keys(tabletLayout).forEach(id => {
                const conf = tabletLayout[id];
                createIcon(id, conf.x, conf.y, conf.size, mainLayer);
            });
        } else {
            // ТЕЛЕФОН
            // 1. Статичные иконки (верхние)
            Object.keys(phoneStatic).forEach(id => {
                const conf = phoneStatic[id];
                createIcon(id, conf.x, conf.y, conf.size, mainLayer);
            });

            // 2. Слайдер для нижней панели
            const sliderCont = document.createElement('div');
            sliderCont.className = 'mobile-slider-container';
            const track = document.createElement('div');
            track.className = 'slider-track';
            
            const page1 = document.createElement('div'); page1.className = 'slider-page';
            const page2 = document.createElement('div'); page2.className = 'slider-page';
            
            track.appendChild(page1);
            track.appendChild(page2);
            sliderCont.appendChild(track);
            mainLayer.appendChild(sliderCont);

            // Заполняем 1-й ряд (Задания, Сражения и т.д.)
            phoneBottomGroup1.forEach((id, i) => {
                const x = 10 + (i * (window.innerWidth / 4.5));
                createIcon(id, x, 10, 80, page1); 
            });

            // Заполняем 2-й ряд (Профиль, Рейтинг и т.д.)
            phoneBottomGroup2.forEach((id, i) => {
                const x = 10 + (i * (window.innerWidth / 4.5));
                createIcon(id, x, 10, 80, page2);
            });

            // Стрелка управления
            const arrow = document.createElement('div');
            arrow.className = 'side-arrow';
            let isPage2 = false;
            arrow.onclick = () => {
                isPage2 = !isPage2;
                track.style.transform = isPage2 ? 'translateX(-50%)' : 'translateX(0)';
                arrow.classList.toggle('reversed', isPage2);
            };
            document.body.appendChild(arrow);
        }
    }

    function createIcon(id, x, y, size, parent) {
        const btn = document.createElement('div');
        btn.className = 'nav-icon';
        btn.style.left = x + 'px';
        btn.style.top = y + 'px';
        btn.style.width = size + 'px';
        btn.style.height = size + 'px';
        btn.innerHTML = `<img src="icon_${id}.png">`;
        btn.onclick = () => console.log("Клик:", id);
        parent.appendChild(btn);
    }

    init();
})();

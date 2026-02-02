(function() {
    const isTablet = window.innerWidth > 1024 || (window.innerWidth <= 1024 && window.innerHeight > 1024);
    let isEditMode = false;

    // Начальные конфиги (добавил shop и inventory)
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
        "shop":      { x: 10,  y: 10,  size: 100 }, // Новая
        "inventory": { x: 120, y: 10,  size: 100 }  // Новая
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
        "shop":      { x: 10, y: 10, size: 80 },    // Новая
        "inventory": { x: 100, y: 10, size: 80 }   // Новая
    };

    const style = document.createElement('style');
    style.innerHTML = `
        .ui-master-layer { position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 9999; }
        .game-icon { 
            position: absolute; display: flex; align-items: center; justify-content: center;
            pointer-events: auto; transition: opacity 0.4s ease, transform 0.2s;
            cursor: grab; touch-action: none;
        }
        .game-icon img { width: 100%; height: 100%; object-fit: contain; pointer-events: none; }
        .game-icon:active { cursor: grabbing; }
        
        /* Красивая стрелка */
        .nav-arrow-custom {
            position: fixed; right: 20px; bottom: 30px; width: 50px; height: 50px;
            background: rgba(0,0,0,0.6); border: 2px solid #ffd700; border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            z-index: 10001; cursor: pointer; pointer-events: auto;
            box-shadow: 0 0 15px #ffd700; transition: all 0.3s ease;
        }
        .nav-arrow-custom::after {
            content: ''; width: 12px; height: 12px;
            border-top: 4px solid #ffd700; border-right: 4px solid #ffd700;
            transform: rotate(45deg); margin-right: 5px;
        }
        .nav-arrow-custom.flip { transform: rotate(180deg); box-shadow: 0 0 15px #00d4ff; border-color: #00d4ff; }
        .nav-arrow-custom.flip::after { border-color: #00d4ff; }

        .m-hidden { opacity: 0 !important; pointer-events: none !important; transform: scale(0.5); }

        /* Эффект редактирования */
        .edit-pulse { animation: pulseIcon 1.5s infinite; border: 1px dashed gold; background: rgba(255,215,0,0.1); }
        @keyframes pulseIcon { 0% { opacity: 1; } 50% { opacity: 0.6; } 100% { opacity: 1; } }

        /* Кнопка сохранения */
        .save-coords-btn {
            position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
            padding: 12px 24px; background: #28a745; color: white; border-radius: 8px;
            font-weight: bold; z-index: 10002; cursor: pointer; display: none;
            box-shadow: 0 4px 15px rgba(0,0,0,0.5); border: 2px solid #fff;
        }
    `;
    document.head.appendChild(style);

    function init() {
        const container = document.querySelector('.menu-container') || document.body;
        const layer = document.createElement('div');
        layer.className = 'ui-master-layer';
        container.appendChild(layer);

        const refs = {};
        const data = isTablet ? tabletLayout : phoneLayout;

        // Создаем кнопку сохранения
        const saveBtn = document.createElement('div');
        saveBtn.className = 'save-coords-btn';
        saveBtn.innerText = '💾 СОХРАНИТЬ ПОЗИЦИИ';
        saveBtn.onclick = () => saveNewLayout(refs);
        document.body.appendChild(saveBtn);

        Object.keys(data).forEach(id => {
            const d = data[id];
            const icon = createIcon(id, d.x, d.y, d.size, layer);
            refs[id] = icon;
            // Прячем вторую страницу на телефонах
            if (!isTablet && ["profile", "rating", "lotto", "benchmark", "shop", "inventory"].includes(id)) {
                icon.classList.add('m-hidden');
            }
        });

        // Создаем стрелку (теперь и для планшетов, если нужно перемещать лишние иконки)
        const arrow = document.createElement('div');
        arrow.className = 'nav-arrow-custom';
        let page = 1;
        arrow.onclick = (e) => {
            e.stopPropagation();
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
        const btn = document.createElement('div');
        btn.className = 'game-icon';
        btn.dataset.id = id;
        btn.style.width = size + 'px'; btn.style.height = size + 'px';
        btn.style.left = x + 'px'; btn.style.top = y + 'px';
        
        const img = document.createElement('img');
        img.src = `icon_${id}.png`;
        img.onerror = () => { img.src = 'https://cdn-icons-png.flaticon.com/512/236/236831.png'; }; // Фолбек
        
        // Открытие окон (если не режим редактирования)
        img.onclick = (e) => {
            if (isEditMode) return;
            console.log("Open Window:", id);
            if (id === 'shop' && window.openShop) openShop();
            if (id === 'inventory' && window.openInventory) openInventory();
        };

        // Логика зажатия для входа в режим редактирования
        let pressTimer;
        btn.onpointerdown = (e) => {
            pressTimer = setTimeout(() => {
                enterEditMode();
            }, 1500);
        };
        btn.onpointerup = () => clearTimeout(pressTimer);

        // Drag and Drop логика
        btn.onpointermove = (e) => {
            if (!isEditMode) return;
            if (e.buttons !== 1) return;
            
            const rect = parent.getBoundingClientRect();
            let newX = e.clientX - rect.left - (parseInt(btn.style.width) / 2);
            let newY = e.clientY - rect.top - (parseInt(btn.style.height) / 2);
            
            btn.style.left = newX + 'px';
            btn.style.top = newY + 'px';
        };

        btn.appendChild(img);
        parent.appendChild(btn);
        return btn;
    }

    function enterEditMode() {
        if (isEditMode) return;
        isEditMode = true;
        document.querySelectorAll('.game-icon').forEach(el => {
            el.classList.add('edit-pulse');
            el.classList.remove('m-hidden'); // Показываем все для редактирования
        });
        document.querySelector('.save-coords-btn').style.display = 'block';
        alert("РЕЖИМ РЕДАКТИРОВАНИЯ: Тяните иконки для перемещения.");
    }

    function saveNewLayout(refs) {
        let result = {};
        Object.keys(refs).forEach(id => {
            const el = refs[id];
            result[id] = {
                x: parseFloat(el.style.left),
                y: parseFloat(el.style.top),
                size: parseFloat(el.style.width)
            };
        });

        const mode = isTablet ? "tabletLayout" : "phoneLayout";
        console.log(`--- NEW ${mode} ---`);
        console.log(JSON.stringify(result, null, 4));
        console.log(`-----------------------`);
        
        alert(`Сохранено!\nДанные выведены в консоль.\nТип устройства: ${mode}`);
        
        // Выход из режима редактирования
        isEditMode = false;
        document.querySelectorAll('.game-icon').forEach(el => el.classList.remove('edit-pulse'));
        document.querySelector('.save-coords-btn').style.display = 'none';
        location.reload(); // Перезагрузка для применения скрытия по страницам
    }

    init();
})();

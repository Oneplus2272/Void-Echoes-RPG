/**
 * Основная логика интерфейса и меню
 */
let currentPage = 1;

function showMenu() {
    // Скрываем экран выбора
    const selectionScreen = document.getElementById('selection-screen');
    if (selectionScreen) selectionScreen.style.display = 'none';
    
    // Показываем меню
    const menuScreen = document.getElementById('menu-screen'); 
    if (menuScreen) {
        menuScreen.style.display = 'block'; 
        setTimeout(() => menuScreen.style.opacity = '1', 50);
    }
    
    // Обновляем данные героя
    if (typeof currentHeroId !== 'undefined' && currentHeroId && typeof heroesData !== 'undefined' && heroesData[currentHeroId]) {
        const avatar = document.getElementById('menu-avatar');
        const nameDisplay = document.getElementById('p-name-display');
        
        if (avatar) avatar.src = heroesData[currentHeroId].face;
        if (nameDisplay) nameDisplay.textContent = heroesData[currentHeroId].name;
    }
    
    buildDynamicUI();
}

function buildDynamicUI() {
    const layer = document.getElementById('ui-dynamic-layer');
    if (!layer || typeof config === 'undefined') return;
    
    layer.innerHTML = '';
    
    // Создаем подложку панели
    const bg = document.createElement('div');
    bg.id = 'bottom-panel-main'; 
    bg.className = 'bottom-panel-bg';
    
    if (config.panel) {
        Object.assign(bg.style, { 
            left: config.panel.x + 'px', 
            top: config.panel.y + 'px', 
            width: config.panel.w + 'px', 
            height: config.panel.h + 'px' 
        });
    }
    
    // Стрелка навигации
    const arrow = document.createElement('div');
    arrow.className = 'nav-arrow-custom';
    arrow.onclick = (e) => { 
        e.stopPropagation(); 
        currentPage = (currentPage === 1) ? 2 : 1; 
        bg.classList.toggle('page2', currentPage === 2); 
        arrow.classList.toggle('flip', currentPage === 2); 
        updateIconVisibility(); 
    };
    bg.appendChild(arrow);
    layer.appendChild(bg);

    // Отрисовка иконок
    if (config.layout) {
        Object.keys(config.layout).forEach(id => {
            const d = config.layout[id];
            
            // Иконка
            const icon = document.createElement('div');
            icon.id = 'icon-' + id; 
            icon.className = 'game-icon';
            Object.assign(icon.style, { 
                width: d.s + 'px', 
                height: d.s + 'px', 
                left: d.x + 'px', 
                top: d.y + 'px' 
            });
            icon.innerHTML = `<img src="icon_${id}.png" style="width:100%; height:100%;">`;
            
            icon.onclick = () => { 
                if (id === 'inventory') {
                    if (typeof openInventory === 'function') openInventory();
                } else {
                    const name = (typeof iconNames !== 'undefined') ? iconNames[id] : id;
                    alert(`Функция: ${name}`);
                }
            };
            layer.appendChild(icon);
            
            // Подпись (Label)
            const label = document.createElement('div');
            label.id = 'label-' + id;
            label.className = 'icon-label';
            label.textContent = (typeof iconNames !== 'undefined' && iconNames[id]) ? iconNames[id] : id;
            
            // Позиция текста
            const textPos = (typeof textPositions !== 'undefined' && textPositions[id]) 
                ? textPositions[id] 
                : { x: d.x + (d.s / 2), y: d.y + d.s + 5 };
                
            Object.assign(label.style, { 
                top: textPos.y + 'px', 
                left: textPos.x + 'px', 
                transform: 'translateX(-50%)' 
            });
            layer.appendChild(label);
        });
    }
    updateIconVisibility();
}

function updateIconVisibility() {
    if (typeof config === 'undefined' || !config.layout) return;
    
    Object.keys(config.layout).forEach(id => {
        const el = document.getElementById('icon-' + id);
        const label = document.getElementById('label-' + id);
        const data = config.layout[id];
        
        // Проверяем, должна ли иконка быть видна на текущей странице
        const isStatic = data.static === true;
        const inPage = (typeof pages !== 'undefined' && pages[currentPage]) ? pages[currentPage].includes(id) : true;
        
        const isVisible = isStatic || inPage;
        
        if (el) el.classList.toggle('hidden', !isVisible);
        if (label) label.classList.toggle('hidden', !isVisible);
    });
}

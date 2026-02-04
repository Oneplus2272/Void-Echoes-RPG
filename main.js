let currentPage = 1;

function showMenu() {
    document.getElementById('selection-screen').style.display = 'none';
    const menuScreen = document.getElementById('menu-screen'); 
    menuScreen.style.display = 'block'; 
    setTimeout(() => menuScreen.style.opacity = '1', 50);
    
    if (currentHeroId && heroesData[currentHeroId]) {
        document.getElementById('menu-avatar').src = heroesData[currentHeroId].face;
        document.getElementById('p-name-display').textContent = heroesData[currentHeroId].name;
    }
    buildDynamicUI();
}

function buildDynamicUI() {
    const layer = document.getElementById('ui-dynamic-layer');
    if (!layer) return;
    layer.innerHTML = '';
    const bg = document.createElement('div');
    bg.id = 'bottom-panel-main'; bg.className = 'bottom-panel-bg';
    Object.assign(bg.style, { left: config.panel.x+'px', top: config.panel.y+'px', width: config.panel.w+'px', height: config.panel.h+'px' });
    
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

    Object.keys(config.layout).forEach(id => {
        const d = config.layout[id];
        const icon = document.createElement('div');
        icon.id = 'icon-' + id; icon.className = 'game-icon';
        Object.assign(icon.style, { width: d.s+'px', height: d.s+'px', left: d.x+'px', top: d.y+'px' });
        icon.innerHTML = `<img src="icon_${id}.png" style="width:100%; height:100%;">`;
        icon.onclick = () => { 
            if(id === 'inventory') openInventory(); 
            else alert(`Функция: ${iconNames[id]}`);
        };
        layer.appendChild(icon);
        
        const label = document.createElement('div');
        label.id = 'label-' + id;
        label.textContent = iconNames[id] || id;
        label.className = 'icon-label';
        const textPos = textPositions[id] || {x: d.x + (d.s / 2), y: d.y + d.s + 5};
        Object.assign(label.style, { top: textPos.y + 'px', left: textPos.x + 'px', transform: 'translateX(-50%)' });
        layer.appendChild(label);
    });
    updateIconVisibility();
}

function updateIconVisibility() {
    Object.keys(config.layout).forEach(id => {
        const el = document.getElementById('icon-' + id);
        const label = document.getElementById('label-' + id);
        const data = config.layout[id];
        const isVisible = data.static || pages[currentPage].includes(id);
        if (el) el.classList.toggle('hidden', !isVisible);
        if (label) label.classList.toggle('hidden', !isVisible);
    });
}

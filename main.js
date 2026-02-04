class MenuScreen {
    static init() {
        // Обработчики кликов
        document.getElementById('avatar-btn').addEventListener('click', () => {
            game.openInventory();
        });
        
        document.getElementById('vip-btn').addEventListener('click', () => {
            alert('VIP функция активирована!');
        });
        
        // Создаем динамический интерфейс
        MenuScreen.createDynamicUI();
    }

    static createDynamicUI() {
        const layer = document.getElementById('ui-dynamic-layer');
        if (!layer) return;
        
        layer.innerHTML = '';
        
        // Фон панели
        const bg = document.createElement('div');
        bg.className = 'bottom-panel-bg';
        bg.style.left = GameConfig.layout.panel.x + 'px';
        bg.style.top = GameConfig.layout.panel.y + 'px';
        bg.style.width = GameConfig.layout.panel.w + 'px';
        bg.style.height = GameConfig.layout.panel.h + 'px';
        
        // Стрелка переключения
        const arrow = document.createElement('div');
        arrow.className = 'nav-arrow-custom';
        arrow.addEventListener('click', MenuScreen.togglePage);
        bg.appendChild(arrow);
        
        layer.appendChild(bg);
        
        // Создаем иконки
        Object.keys(GameConfig.layout.layout).forEach(iconId => {
            const data = GameConfig.layout.layout[iconId];
            
            // Иконка
            const icon = document.createElement('div');
            icon.id = 'icon-' + iconId;
            icon.className = 'game-icon';
            icon.style.width = data.s + 'px';
            icon.style.height = data.s + 'px';
            icon.style.left = data.x + 'px';
            icon.style.top = data.y + 'px';
            
            const iconInfo = GameConfig.menuIcons[iconId];
            if (iconInfo) {
                icon.innerHTML = `<img src="${iconInfo.icon}" alt="${iconInfo.name}">`;
                icon.addEventListener('click', () => {
                    if (iconId === 'inventory') {
                        game.openInventory();
                    } else {
                        alert(`${iconInfo.name} - функция в разработке`);
                    }
                });
            }
            
            layer.appendChild(icon);
            
            // Подпись
            const label = document.createElement('div');
            label.id = 'label-' + iconId;
            label.className = 'icon-label';
            label.textContent = iconInfo ? iconInfo.name : iconId;
            
            const textPos = GameConfig.textPositions[iconId] || {
                x: data.x + (data.s / 2),
                y: data.y + data.s + 5
            };
            
            label.style.top = textPos.y + 'px';
            label.style.left = textPos.x + 'px';
            
            layer.appendChild(label);
        });
        
        // Обновляем видимость
        MenuScreen.currentPage = 1;
        MenuScreen.updateIconVisibility();
    }

    static togglePage() {
        MenuScreen.currentPage = MenuScreen.currentPage === 1 ? 2 : 1;
        
        const bg = document.querySelector('.bottom-panel-bg');
        const arrow = document.querySelector('.nav-arrow-custom');
        
        if (MenuScreen.currentPage === 2) {
            bg.classList.add('page2');
            arrow.classList.add('flip');
        } else {
            bg.classList.remove('page2');
            arrow.classList.remove('flip');
        }
        
        MenuScreen.updateIconVisibility();
    }

    static updateIconVisibility() {
        Object.keys(GameConfig.layout.layout).forEach(iconId => {
            const icon = document.getElementById('icon-' + iconId);
            const label = document.getElementById('label-' + iconId);
            const data = GameConfig.layout.layout[iconId];
            
            if (data.static) {
                if (icon) icon.classList.remove('hidden');
                if (label) label.classList.remove('hidden');
            } else {
                const isVisible = GameConfig.pages[MenuScreen.currentPage].includes(iconId);
                if (icon) icon.classList.toggle('hidden', !isVisible);
                if (label) label.classList.toggle('hidden', !isVisible);
            }
        });
    }
}

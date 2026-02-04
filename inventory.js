class InventoryScreen {
    static init() {
        // Обработчик закрытия
        document.getElementById('close-inv').addEventListener('click', () => {
            ScreenManager.switchTo('menu');
        });
        
        // Создаем слоты экипировки
        InventoryScreen.createEquipmentSlots();
        
        // Обновляем позиции
        InventoryScreen.updatePositions();
    }

    static createEquipmentSlots() {
        const grid = document.getElementById('equipment-grid');
        if (!grid) return;
        
        grid.innerHTML = '';
        
        GameConfig.equipment.forEach(item => {
            const slot = document.createElement('div');
            slot.className = 'inv-slot';
            slot.id = item.slot;
            
            slot.innerHTML = `<img src="${item.icon}" alt="${item.name}">`;
            slot.addEventListener('click', () => {
                alert(`Выбрано: ${item.name}`);
            });
            
            grid.appendChild(slot);
        });
    }

    static updatePositions() {
        const isMobile = window.innerWidth <= 599;
        const positions = isMobile ? GameConfig.inventoryPositions.phone : GameConfig.inventoryPositions.tablet;
        
        Object.keys(positions).forEach(slotId => {
            const slot = document.getElementById(slotId);
            if (slot) {
                const pos = positions[slotId];
                slot.style.left = pos.x + '%';
                slot.style.top = pos.y + '%';
                slot.style.width = pos.width + 'px';
                slot.style.height = pos.height + 'px';
            }
        });
    }
}

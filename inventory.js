const tabletPositions = {
    'helmet-slot': { x: 14.21, y: 26.51, width: 235, height: 235 },
    'chestplate-slot': { x: 13.98, y: 37.87, width: 235, height: 235 },
    'hammer-slot': { x: 15.24, y: 47.98, width: 235, height: 235 },
    'ring-slot': { x: 15.68, y: 57.19, width: 235, height: 235 },
    'bracers-slot': { x: 55.51, y: 26.39, width: 235, height: 235 },
    'boots-slot': { x: 55.28, y: 36.96, width: 235, height: 235 },
    'hammer2-slot': { x: 55.78, y: 47.74, width: 235, height: 235 },
    'ring2-slot': { x: 55.96, y: 57.14, width: 235, height: 235 }
};

const phonePositions = {
    'helmet-slot': { x: 5.23, y: 28.63, width: 144, height: 144 },
    'chestplate-slot': { x: 5.55, y: 40.42, width: 144, height: 144 },
    'hammer-slot': { x: 6.80, y: 50.75, width: 144, height: 144 },
    'ring-slot': { x: 7.22, y: 59.82, width: 144, height: 144 },
    'bracers-slot': { x: 60.00, y: 27.90, width: 144, height: 144 },
    'boots-slot': { x: 59.86, y: 39.20, width: 144, height: 144 },
    'hammer2-slot': { x: 60.00, y: 50.64, width: 144, height: 144 },
    'ring2-slot': { x: 60.00, y: 59.33, width: 144, height: 144 }
};

function initInventory() {
    const isMobile = window.innerWidth <= 599;
    const positions = isMobile ? phonePositions : tabletPositions;
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

function openInventory() { 
    const inv = document.getElementById('inventory-screen'); 
    inv.style.display = 'block'; 
    setTimeout(() => { inv.style.opacity = '1'; initInventory(); }, 50); 
}

function closeInventory() { 
    const inv = document.getElementById('inventory-screen');
    inv.style.opacity = '0';
    setTimeout(() => inv.style.display = 'none', 400);
}

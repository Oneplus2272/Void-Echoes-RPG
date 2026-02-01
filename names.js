// --- ОБЪЕКТ ПУТЕЙ К КАРТИНКАМ ИМЕН ---
const nameLogos = {
    warrior: { 
        male: 'text_name_thorn_gold.png', 
        female: 'text_name_freya_gold.png' 
    },
    mage: { 
        male: 'text_name_andrian_purple.png', 
        female: 'text_name_elissa_purple.png' 
    },
    archer: { 
        male: 'text_name_killian_green.png', 
        female: 'text_name_nari_green.png' 
    }
};

/**
 * Функция отрисовки имени поверх фона героя
 */
function updateHeroNameLogo() {
    // Находим контейнер, где отображается герой и фон (Character_preview)
    const previewContainer = document.querySelector('.character-preview'); 
    
    if (previewContainer && window.currentHeroKey && window.currentGender) {
        // Проверяем, существует ли уже блок для имени, если нет — создаем
        let nameOverlay = document.getElementById('hero-name-overlay');
        if (!nameOverlay) {
            nameOverlay = document.createElement('div');
            nameOverlay.id = 'hero-name-overlay';
            // Стили для позиционирования поверх фона
            Object.assign(nameOverlay.style, {
                position: 'absolute',
                top: '10%', // Дистанция от верхнего края
                left: '50%',
                transform: 'translateX(-50%)',
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                pointerEvents: 'none', // Чтобы не мешал кликам
                zIndex: '100'
            });
            previewContainer.appendChild(nameOverlay);
        }

        const logoPath = nameLogos[window.currentHeroKey][window.currentGender];
        
        // Вставляем картинку с эффектом свечения
        nameOverlay.innerHTML = `
            <img src="${logoPath}" alt="Name" 
                 style="max-width: 250px; height: auto; 
                        filter: drop-shadow(0 0 15px rgba(0,0,0,0.8));">
        `;
    }
}

/**
 * Перехват стандартных функций выбора
 */
const backupSelectHero = window.selectHero;
window.selectHero = function(key) {
    if (typeof backupSelectHero === 'function') backupSelectHero(key);
    updateHeroNameLogo();
};

const backupSetGender = window.setGender;
window.setGender = function(g) {
    if (typeof backupSetGender === 'function') backupSetGender(g);
    updateHeroNameLogo();
};

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(updateHeroNameLogo, 300);
});

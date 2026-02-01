// Объект путей к картинкам имен
const nameLogos = {
    warrior: { male: 'text_name_thorn_gold.png', female: 'text_name_freya_gold.png' },
    mage: { male: 'text_name_andrian_purple.png', female: 'text_name_elissa_purple.png' },
    archer: { male: 'text_name_killian_green.png', female: 'text_name_nari_green.png' }
};

/**
 * Отрисовка имени ПОВЕРХ фона над персонажем
 */
function updateHeroNameLogo() {
    // Ищем основной контейнер превью
    const previewContainer = document.querySelector('.character-preview') || document.getElementById('character-preview-container');
    
    if (previewContainer && window.currentHeroKey && window.currentGender) {
        // Проверяем, есть ли уже слой для имени, если нет — создаем
        let nameOverlay = document.getElementById('hero-name-layer');
        if (!nameOverlay) {
            nameOverlay = document.createElement('div');
            nameOverlay.id = 'hero-name-layer';
            // Стили для наложения поверх фона (абсолютное позиционирование)
            Object.assign(nameOverlay.style, {
                position: 'absolute',
                top: '12%', // Высота — как раз под свод арки
                left: '50%',
                transform: 'translateX(-50%)',
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                pointerEvents: 'none', // Чтобы не мешал кликам по инвентарю
                zIndex: '20' // Выше фона, но ниже всплывающих окон
            });
            previewContainer.style.position = 'relative'; // Контейнер должен быть родителем
            previewContainer.appendChild(nameOverlay);
        }

        const logoPath = nameLogos[window.currentHeroKey][window.currentGender];
        
        // Обновляем картинку
        nameOverlay.innerHTML = `
            <img src="${logoPath}" alt="Name" 
                 style="max-width: 260px; height: auto; 
                        filter: drop-shadow(0 0 20px rgba(0,0,0,0.9));">
        `;
    }
}

// Перехват функций смены героя и пола
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

// Запуск при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(updateHeroNameLogo, 400);
});

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
 * Функция отрисовки имени над героем
 */
function updateHeroNameLogo() {
    // Ищем элемент заголовка. Если у тебя в HTML другой ID для этого места, замени 'class-title'
    const titleElement = document.getElementById('class-title');
    
    if (titleElement && window.currentHeroKey && window.currentGender) {
        const logoPath = nameLogos[window.currentHeroKey][window.currentGender];
        
        // Формируем HTML с картинкой
        // Стили: max-width подгоняет размер, margin центрирует, filter добавляет свечение для читаемости
        titleElement.innerHTML = `
            <div style="width: 100%; display: flex; justify-content: center; margin-bottom: 20px;">
                <img src="${logoPath}" alt="Hero Name" 
                     style="max-width: 280px; height: auto; 
                            filter: drop-shadow(0 0 15px rgba(0,0,0,0.9)) drop-shadow(0 0 5px rgba(255,255,255,0.2));
                            z-index: 10;">
            </div>
        `;
    }
}

/**
 * Перехват функций выбора, чтобы имя менялось мгновенно
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

// Авто-запуск при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    // Небольшая задержка, чтобы основные скрипты успели определить героя по умолчанию
    setTimeout(updateHeroNameLogo, 300);
});

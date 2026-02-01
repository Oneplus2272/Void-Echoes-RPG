// --- СЮДА ВПИСЫВАЮТСЯ НАЗВАНИЯ ФАЙЛОВ КАРТИНКИ ---
const nameLogos = {
    warrior: { 
        male: 'text_name_thorn_gold.png',    // Имя для Мужчины-Воина
        female: 'text_name_freya_gold.png'   // Имя для Женщины-Воина
    },
    mage: { 
        male: 'text_name_andrian_purple.png', // Имя для Мужчины-Мага
        female: 'text_name_elissa_purple.png' // Имя для Женщины-Мага
    },
    archer: { 
        male: 'text_name_killian_green.png',  // Имя для Мужчины-Лучника
        female: 'text_name_nari_green.png'    // Имя для Женщины-Лучника
    }
};

/**
 * Функция, которая берет путь из объекта выше и вставляет <img> в блок заголовка
 */
function updateHeroNameLogo() {
    const titleElement = document.getElementById('class-title');
    
    // Проверяем, что переменные выбора героя и пола существуют в глобальном коде
    if (titleElement && window.currentHeroKey && window.currentGender) {
        const logoPath = nameLogos[window.currentHeroKey][window.currentGender];
        
        // Вставляем картинку вместо текста
        titleElement.innerHTML = `<img src="${logoPath}" style="max-width: 210px; height: auto; display: block; margin: 0 auto; filter: drop-shadow(0 0 10px rgba(0,0,0,0.6));">`;
    }
}

/**
 * Эти обработчики "слушают" когда ты тыкаешь на иконки классов или пол
 * и запускают обновление картинки, не ломая основную логику в HTML
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

// Запуск при старте, чтобы имя подгрузилось сразу после загрузки страницы
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(updateHeroNameLogo, 200);
});

// Объект с путями к картинкам имен
const nameLogos = {
    warrior: { male: 'text_name_thorn_gold.png', female: 'text_name_freya_gold.png' },
    mage: { male: 'text_name_andrian_purple.png', female: 'text_name_elissa_purple.png' },
    archer: { male: 'text_name_killian_green.png', female: 'text_name_nari_green.png' }
};

/**
 * Функция, которая рисует имя ПОВЕРХ фона персонажа
 */
function drawNameOnBackground() {
    // Ищем блок, у которого в стилях прописан твой фон character_preview.png
    const previewBox = document.querySelector('[style*="character_preview.png"]') || document.querySelector('.character-preview');

    if (previewBox) {
        // Проверяем, есть ли уже внутри картинка с именем, если нет - создаем контейнер
        let nameContainer = document.getElementById('name-image-overlay');
        if (!nameContainer) {
            nameContainer = document.createElement('div');
            nameContainer.id = 'name-image-overlay';
            // Позиционируем строго по центру в верхней части фона
            Object.assign(nameContainer.style, {
                position: 'absolute',
                top: '50px',
                left: '0',
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                zIndex: '50',
                pointerEvents: 'none'
            });
            previewBox.style.position = 'relative'; // Чтобы имя не улетело за пределы фона
            previewBox.appendChild(nameContainer);
        }

        // Берем нужный файл из конфига выше
        const currentImg = nameLogos[window.currentHeroKey || 'warrior'][window.currentGender || 'male'];
        
        // Вставляем саму картинку
        nameContainer.innerHTML = `<img src="${currentImg}" style="max-width: 250px; height: auto; filter: drop-shadow(0 0 10px #000);">`;
    }
}

// Заменяем старые функции, чтобы при клике всё обновлялось
const oldSelect = window.selectHero;
window.selectHero = function(key) {
    if (typeof oldSelect === 'function') oldSelect(key);
    drawNameOnBackground();
};

const oldGender = window.setGender;
window.setGender = function(g) {
    if (typeof oldGender === 'function') oldGender(g);
    drawNameOnBackground();
};

// Запуск при загрузке страницы
window.onload = () => {
    setTimeout(drawNameOnBackground, 500);
};

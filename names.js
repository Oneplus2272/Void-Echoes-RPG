// Названия файлов, которые ты скачал и переименовал
const nameLogos = {
    warrior: { male: 'text_name_thorn_gold.png', female: 'text_name_freya_gold.png' },
    mage: { male: 'text_name_andrian_purple.png', female: 'text_name_elissa_purple.png' },
    archer: { male: 'text_name_killian_green.png', female: 'text_name_nari_green.png' }
};

// Функция замены текста на картинку-имя
function refreshNameDisplay() {
    const titleContainer = document.getElementById('class-title');
    if (titleContainer) {
        const logo = nameLogos[currentHeroKey][currentGender];
        titleContainer.innerHTML = `<img src="${logo}" style="max-height: 50px; width: auto; filter: drop-shadow(0 0 10px rgba(0,0,0,0.7));">`;
    }
}

// Инъекция в существующие функции выбора
const originalSelectHero = selectHero;
selectHero = function(key) {
    originalSelectHero(key);
    refreshNameDisplay();
};

const originalSetGender = setGender;
setGender = function(g) {
    originalSetGender(g);
    refreshNameDisplay();
};

// Запуск при первой загрузке
setTimeout(refreshNameDisplay, 100);

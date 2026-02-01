// Логика подмены текстового заголовка на графические имена
(function() {
    const nameLogos = {
        warrior: { male: 'text_name_thorn_gold.png', female: 'text_name_freya_gold.png' },
        mage: { male: 'text_name_andrian_purple.png', female: 'text_name_elissa_purple.png' },
        archer: { male: 'text_name_killian_green.png', female: 'text_name_nari_green.png' }
    };

    function updateNameImage() {
        const title = document.getElementById('class-title');
        if (title) {
            const imgPath = nameLogos[currentHeroKey][currentGender];
            title.innerHTML = `<img src="${imgPath}" style="max-width: 200px; height: auto; display: block; margin: 0 auto;">`;
        }
    }

    // Внедряемся в твои функции
    const coreSelect = window.selectHero;
    window.selectHero = function(key) {
        if (coreSelect) coreSelect(key);
        updateNameImage();
    };

    const coreGender = window.setGender;
    window.setGender = function(g) {
        if (coreGender) coreGender(g);
        updateNameImage();
    };
})();

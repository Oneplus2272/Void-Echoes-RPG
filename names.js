(function() {
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
        try {
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

                // Проверяем наличие глобальных переменных, чтобы не вызывать ошибку
                const heroKey = window.currentHeroKey || 'warrior';
                const gender = window.currentGender || 'male';
                
                if (nameLogos[heroKey] && nameLogos[heroKey][gender]) {
                    const currentImg = nameLogos[heroKey][gender];
                    // Вставляем саму картинку
                    nameContainer.innerHTML = `<img src="${currentImg}" style="max-width: 250px; height: auto; filter: drop-shadow(0 0 10px #000);">`;
                }
            }
        } catch (e) {
            console.warn("Ошибка при отрисовке имени: ", e);
        }
    }

    // Безопасная подмена функций выбора героя
    const safeHook = (fnName, callback) => {
        const original = window[fnName];
        window[fnName] = function(...args) {
            if (typeof original === 'function') {
                try {
                    original.apply(this, args);
                } catch (err) {
                    console.error(`Ошибка в оригинальной функции ${fnName}:`, err);
                }
            }
            callback();
        };
    };

    // Ожидаем готовности документа
    const initOverlay = () => {
        safeHook('selectHero', drawNameOnBackground);
        safeHook('setGender', drawNameOnBackground);
        drawNameOnBackground();
    };

    if (document.readyState === 'complete') {
        initOverlay();
    } else {
        window.addEventListener('load', initOverlay);
    }
})();

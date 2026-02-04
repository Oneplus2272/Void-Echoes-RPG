let currentHeroId = null;

function selectHero(name, heroId) {
    console.log('Выбран герой:', name, heroId);
    
    // Снимаем выделение со всех карточек
    document.querySelectorAll('.hero-card').forEach(card => {
        card.classList.remove('active');
    });
    
    // Выделяем выбранную карточку
    const selectedCard = document.getElementById('c-' + heroId);
    if (selectedCard) {
        selectedCard.classList.add('active');
    }
    
    // Сохраняем выбор
    currentHeroId = heroId;
    
    // Активируем кнопку подтверждения
    const confirmBtn = document.getElementById('final-confirm-btn');
    if (confirmBtn) {
        confirmBtn.disabled = false;
        confirmBtn.textContent = `ПОДТВЕРДИТЬ: ${name}`;
    }
    
    // Показываем выбранного героя в инвентаре
    const invHeroImg = document.getElementById('inv-hero-img');
    if (invHeroImg && heroesData[heroId]) {
        invHeroImg.src = heroesData[heroId].image;
    }
}

async function confirmHeroSelection() {
    if (!currentHeroId) {
        alert('Пожалуйста, выберите героя!');
        return;
    }
    
    const tg = window.Telegram?.WebApp;
    const userId = tg?.initDataUnsafe?.user?.id || 12345;
    const SERVER_URL = 'https://void-echoes-rpg.onrender.com';
    
    const confirmBtn = document.getElementById('final-confirm-btn');
    if (confirmBtn) {
        confirmBtn.textContent = 'ЗАГРУЗКА...';
        confirmBtn.disabled = true;
    }
    
    try { 
        // Отправка данных на твой сервер Render
        await fetch(`${SERVER_URL}/set_hero/${userId}/${currentHeroId}`, { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        }); 
        showMenu(); 
    } catch (e) { 
        console.error('Ошибка сохранения героя на сервере:', e);
        // Даже если сервер недоступен, пускаем в игру для теста фронтенда
        showMenu(); 
    }
}

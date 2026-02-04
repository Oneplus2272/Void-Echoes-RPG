class SelectionScreen {
    static init() {
        const container = document.getElementById('heroes-container');
        if (!container) return;
        
        container.innerHTML = '';
        
        // Создаем карточки героев
        Object.values(GameConfig.heroes).forEach(hero => {
            const card = document.createElement('div');
            card.className = 'hero-card';
            card.id = `hero-${hero.id}`;
            
            card.innerHTML = `
                <div class="hero-image">
                    <img src="${hero.image}" alt="${hero.name}">
                </div>
                <div class="hero-name">${hero.name}</div>
                <div class="hero-description">${hero.description}</div>
                <button class="select-btn" data-hero-id="${hero.id}">
                    Выбрать
                </button>
            `;
            
            // Обработчик выбора
            const btn = card.querySelector('.select-btn');
            btn.addEventListener('click', () => {
                SelectionScreen.selectHero(hero.id);
            });
            
            container.appendChild(card);
        });
        
        // Кнопка подтверждения
        const confirmBtn = document.getElementById('confirm-btn');
        confirmBtn.addEventListener('click', () => {
            game.confirmHero();
        });
    }

    static selectHero(heroId) {
        // Убираем выделение
        document.querySelectorAll('.hero-card').forEach(card => {
            card.classList.remove('active');
        });
        
        // Выделяем выбранную
        const card = document.getElementById(`hero-${heroId}`);
        if (card) {
            card.classList.add('active');
        }
        
        // Сохраняем выбор
        game.selectHero(heroId);
        
        // Активируем кнопку подтверждения
        const confirmBtn = document.getElementById('confirm-btn');
        confirmBtn.disabled = false;
        confirmBtn.textContent = `ПОДТВЕРДИТЬ: ${GameConfig.heroes[heroId].name}`;
    }
}

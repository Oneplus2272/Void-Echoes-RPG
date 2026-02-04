// Логика экрана выбора героя
class SelectionScreen {
    constructor() {
        this.heroesContainer = document.getElementById('heroes-container');
        this.init();
    }

    init() {
        this.renderHeroes();
    }

    renderHeroes() {
        this.heroesContainer.innerHTML = '';
        
        Object.values(GameConfig.heroes).forEach(hero => {
            const heroCard = this.createHeroCard(hero);
            this.heroesContainer.appendChild(heroCard);
        });
    }

    createHeroCard(hero) {
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

        // Добавляем обработчик выбора
        const selectBtn = card.querySelector('.select-btn');
        selectBtn.addEventListener('click', () => {
            this.selectHero(hero.id);
        });

        return card;
    }

    selectHero(heroId) {
        // Снимаем выделение со всех карточек
        document.querySelectorAll('.hero-card').forEach(card => {
            card.classList.remove('active');
        });

        // Выделяем выбранную карточку
        const selectedCard = document.getElementById(`hero-${heroId}`);
        if (selectedCard) {
            selectedCard.classList.add('active');
        }

        // Устанавливаем выбранного героя в игре
        game.setCurrentHero(heroId);
    }
}

// Инициализируем экран выбора
const selectionScreen = new SelectionScreen();

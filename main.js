// Основной файл игры
class Game {
    constructor() {
        this.currentHero = null;
        this.currentScreen = 'loading';
        this.resources = {
            gold: 1500,
            crystals: 50
        };
        this.init();
    }

    init() {
        console.log('Игра инициализирована');
        this.setupEventListeners();
        
        // Инициализируем Telegram Web App
        if (window.Telegram?.WebApp) {
            window.Telegram.WebApp.ready();
            window.Telegram.WebApp.expand();
        }
    }

    setupEventListeners() {
        // Кнопка подтверждения выбора героя
        document.getElementById('confirm-btn').addEventListener('click', () => {
            this.confirmHeroSelection();
        });

        // Кнопка закрытия инвентаря
        document.getElementById('close-inv').addEventListener('click', () => {
            this.closeInventory();
        });

        // Клик на аватарку для открытия инвентаря
        document.getElementById('avatar-btn').addEventListener('click', () => {
            this.openInventory();
        });

        // VIP кнопка
        document.getElementById('vip-btn').addEventListener('click', () => {
            alert('VIP функция активирована!');
        });
    }

    switchScreen(screenName) {
        // Скрываем все экраны
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });

        // Показываем нужный экран
        const screen = document.getElementById(screenName + '-screen');
        if (screen) {
            screen.classList.add('active');
            this.currentScreen = screenName;
            console.log('Переключен экран:', screenName);
        }
    }

    confirmHeroSelection() {
        if (!this.currentHero) {
            alert('Сначала выберите героя!');
            return;
        }

        const confirmBtn = document.getElementById('confirm-btn');
        confirmBtn.textContent = 'ЗАГРУЗКА...';
        confirmBtn.disabled = true;

        // Сохраняем выбор
        this.saveHeroSelection().then(() => {
            this.showMainMenu();
        }).catch(error => {
            console.error('Ошибка сохранения:', error);
            this.showMainMenu();
        });
    }

    async saveHeroSelection() {
        // Здесь будет сохранение на сервер
        console.log('Сохранен герой:', this.currentHero);
        return Promise.resolve();
    }

    showMainMenu() {
        // Обновляем аватарку
        if (this.currentHero) {
            const heroData = GameConfig.heroes[this.currentHero];
            document.getElementById('menu-avatar').src = heroData.face;
            document.getElementById('player-name').textContent = heroData.name;
        }

        // Обновляем ресурсы
        document.getElementById('gold-value').textContent = this.resources.gold;
        document.getElementById('crystal-value').textContent = this.resources.crystals;

        // Переключаем экран
        this.switchScreen('menu');
    }

    openInventory() {
        if (this.currentHero) {
            const heroData = GameConfig.heroes[this.currentHero];
            document.getElementById('inv-hero-img').src = heroData.image;
        }
        this.switchScreen('inventory');
    }

    closeInventory() {
        this.switchScreen('menu');
    }

    setCurrentHero(heroId) {
        this.currentHero = heroId;
        const confirmBtn = document.getElementById('confirm-btn');
        confirmBtn.disabled = false;
        confirmBtn.textContent = `ПОДТВЕРДИТЬ: ${GameConfig.heroes[heroId].name}`;
    }
}

// Создаем экземпляр игры
const game = new Game();

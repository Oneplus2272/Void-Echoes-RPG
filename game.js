class Game {
    constructor() {
        this.currentHero = null;
        this.playerData = null;
        this.isOnline = true;
        this.init();
    }

    async init() {
        console.log('Game initializing...');
        
        // Инициализируем Telegram
        if (window.Telegram?.WebApp) {
            const tg = window.Telegram.WebApp;
            tg.ready();
            tg.expand();
            console.log('Telegram WebApp ready');
        }
        
        // Проверяем соединение
        this.isOnline = await gameAPI.checkConnection();
        console.log('Server connection:', this.isOnline ? 'Online' : 'Offline');
        
        // Загружаем данные
        await this.loadPlayerData();
        
        // Начинаем загрузку
        LoadingScreen.start();
    }

    async loadPlayerData() {
        if (this.isOnline) {
            this.playerData = await gameAPI.getPlayer();
        } else {
            this.playerData = gameAPI.getDefaultPlayer();
        }
        
        // Если есть сохраненный герой, идем в меню
        if (this.playerData.hero) {
            this.currentHero = this.playerData.hero;
            console.log('Player has hero:', this.currentHero);
        }
    }

    async selectHero(heroId) {
        this.currentHero = heroId;
        console.log('Hero selected:', heroId);
    }

    async confirmHero() {
        if (!this.currentHero) {
            alert('Выберите героя!');
            return;
        }

        const btn = document.getElementById('confirm-btn');
        btn.textContent = 'СОХРАНЕНИЕ...';
        btn.disabled = true;

        try {
            if (this.isOnline) {
                await gameAPI.saveHero(this.currentHero);
            }
            
            // Сохраняем локально
            this.playerData.hero = this.currentHero;
            localStorage.setItem('void_echoes_hero', this.currentHero);
            
            // Показываем меню
            this.showMenu();
            
        } catch (error) {
            alert('Ошибка сохранения, попробуйте снова');
            btn.textContent = 'ПОДТВЕРДИТЬ ВЫБОР';
            btn.disabled = false;
        }
    }

    showMenu() {
        // Обновляем аватарку
        if (this.currentHero) {
            const hero = GameConfig.heroes[this.currentHero];
            const avatar = document.getElementById('menu-avatar');
            avatar.src = hero.face;
            
            document.getElementById('player-name').textContent = hero.name;
        }
        
        // Обновляем ресурсы
        document.getElementById('gold-value').textContent = this.playerData.gold;
        document.getElementById('crystal-value').textContent = this.playerData.crystals;
        
        // Переключаем экран
        ScreenManager.switchTo('menu');
        
        // Инициализируем меню
        MenuScreen.init();
    }

    openInventory() {
        if (this.currentHero) {
            const hero = GameConfig.heroes[this.currentHero];
            document.getElementById('inv-hero-img').src = hero.image;
        }
        ScreenManager.switchTo('inventory');
        InventoryScreen.init();
    }
}

const game = new Game();

// Менеджер экранов
class ScreenManager {
    static switchTo(screenName) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        
        const screen = document.getElementById(screenName + '-screen');
        if (screen) {
            screen.classList.add('active');
            console.log('Switched to screen:', screenName);
        }
    }
}

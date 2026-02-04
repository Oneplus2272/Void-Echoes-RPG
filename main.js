// Основной файл игры с поддержкой сервера
class Game {
    constructor() {
        this.currentHero = null;
        this.currentScreen = 'loading';
        this.playerData = null;
        this.isOnline = true;
        this.init();
    }

    async init() {
        console.log('Игра инициализирована');
        
        // Проверяем соединение с сервером
        this.isOnline = await gameAPI.checkServerConnection();
        console.log('Режим работы:', this.isOnline ? 'онлайн' : 'оффлайн');
        
        // Загружаем данные игрока
        await this.loadPlayerData();
        
        // Настраиваем обработчики
        this.setupEventListeners();
        
        // Инициализируем Telegram
        this.initTelegram();
    }

    initTelegram() {
        if (window.Telegram?.WebApp) {
            const tg = window.Telegram.WebApp;
            tg.ready();
            tg.expand();
            
            // Устанавливаем тему Telegram
            this.setTelegramTheme(tg);
            
            // Обработчик изменения темы
            tg.onEvent('themeChanged', () => {
                this.setTelegramTheme(tg);
            });
        }
    }

    setTelegramTheme(tg) {
        document.documentElement.style.setProperty('--tg-theme-bg-color', tg.themeParams.bg_color || '#000000');
        document.documentElement.style.setProperty('--tg-theme-text-color', tg.themeParams.text_color || '#ffffff');
        document.documentElement.style.setProperty('--tg-theme-hint-color', tg.themeParams.hint_color || '#999999');
        document.documentElement.style.setProperty('--tg-theme-link-color', tg.themeParams.link_color || '#ffd700');
        document.documentElement.style.setProperty('--tg-theme-button-color', tg.themeParams.button_color || '#ffd700');
        document.documentElement.style.setProperty('--tg-theme-button-text-color', tg.themeParams.button_text_color || '#000000');
    }

    async loadPlayerData() {
        try {
            if (this.isOnline) {
                this.playerData = await gameAPI.getPlayerData();
            } else {
                this.playerData = gameAPI.getDefaultPlayerData();
            }
            
            console.log('Данные игрока загружены:', this.playerData);
            
            // Если у игрока уже есть герой, пропускаем выбор
            if (this.playerData.hero) {
                this.currentHero = this.playerData.hero;
                this.showMainMenu();
            }
            
        } catch (error) {
            console.error('Ошибка загрузки данных:', error);
            this.playerData = gameAPI.getDefaultPlayerData();
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
            this.openVIP();
        });

        // Обработка изменения размера окна
        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }

    handleResize() {
        // Обновляем позиции элементов при изменении размера
        if (this.currentScreen === 'inventory') {
            inventoryScreen.updatePositions();
        }
        
        if (this.currentScreen === 'menu') {
            menuScreen.updateLayout();
        }
    }

    async confirmHeroSelection() {
        if (!this.currentHero) {
            this.showNotification('Сначала выберите героя!', 'warning');
            return;
        }

        const confirmBtn = document.getElementById('confirm-btn');
        confirmBtn.textContent = 'СОХРАНЕНИЕ...';
        confirmBtn.disabled = true;

        try {
            if (this.isOnline) {
                await gameAPI.saveHeroSelection(this.currentHero);
            }
            
            // Сохраняем локально
            this.playerData.hero = this.currentHero;
            this.saveToLocalStorage();
            
            this.showMainMenu();
            
        } catch (error) {
            this.showNotification('Ошибка сохранения, пробуем снова...', 'error');
            setTimeout(() => this.confirmHeroSelection(), 2000);
        }
    }

    showMainMenu() {
        // Обновляем аватарку
        if (this.currentHero) {
            const heroData = GameConfig.heroes[this.currentHero];
            const avatarImg = document.getElementById('menu-avatar');
            
            // Загружаем изображение с обработкой ошибок
            avatarImg.onerror = () => {
                avatarImg.src = 'assets/icons/default_avatar.png';
            };
            avatarImg.src = heroData.face;
            
            document.getElementById('player-name').textContent = heroData.name;
        }

        // Обновляем ресурсы
        document.getElementById('gold-value').textContent = this.playerData.gold || 1500;
        document.getElementById('crystal-value').textContent = this.playerData.crystals || 50;

        // Обновляем уровень
        document.getElementById('player-level').textContent = `Уровень: ${this.playerData.level || 1}`;

        // Переключаем экран
        this.switchScreen('menu');
        
        // Инициализируем меню
        menuScreen.init();
    }

    openInventory() {
        if (this.currentHero) {
            const heroData = GameConfig.heroes[this.currentHero];
            const invHeroImg = document.getElementById('inv-hero-img');
            
            invHeroImg.onerror = () => {
                invHeroImg.src = 'assets/icons/default_hero.png';
            };
            invHeroImg.src = heroData.image;
        }
        
        this.switchScreen('inventory');
        
        // Инициализируем инвентарь
        inventoryScreen.init();
    }

    closeInventory() {
        this.switchScreen('menu');
    }

    openVIP() {
        this.showNotification('VIP функция скоро будет доступна!', 'info');
    }

    switchScreen(screenName) {
        // Сохраняем текущий экран
        const previousScreen = this.currentScreen;
        this.currentScreen = screenName;
        
        // Анимация перехода
        document.querySelectorAll('.screen').forEach(screen => {
            if (screen.id === previousScreen + '-screen') {
                screen.style.opacity = '0';
                setTimeout(() => {
                    screen.classList.remove('active');
                }, 400);
            }
            
            if (screen.id === screenName + '-screen') {
                screen.classList.add('active');
                setTimeout(() => {
                    screen.style.opacity = '1';
                }, 50);
            }
        });
        
        console.log('Переключен экран:', screenName);
    }

    setCurrentHero(heroId) {
        this.currentHero = heroId;
        const confirmBtn = document.getElementById('confirm-btn');
        confirmBtn.disabled = false;
        confirmBtn.textContent = `ПОДТВЕРДИТЬ: ${GameConfig.heroes[heroId].name}`;
    }

    showNotification(message, type = 'info') {
        // Создаем уведомление
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                ${message}
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Удаляем через 3 секунды
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    saveToLocalStorage() {
        try {
            localStorage.setItem('void_echoes_player_data', JSON.stringify(this.playerData));
            localStorage.setItem('void_echoes_current_hero', this.currentHero);
        } catch (error) {
            console.error('Ошибка сохранения в localStorage:', error);
        }
    }

    loadFromLocalStorage() {
        try {
            const savedData = localStorage.getItem('void_echoes_player_data');
            const savedHero = localStorage.getItem('void_echoes_current_hero');
            
            if (savedData) {
                this.playerData = JSON.parse(savedData);
            }
            
            if (savedHero) {
                this.currentHero = savedHero;
            }
        } catch (error) {
            console.error('Ошибка загрузки из localStorage:', error);
        }
    }

    // Метод для тестирования API
    async testServerConnection() {
        const result = await gameAPI.checkServerConnection();
        this.showNotification(result ? 'Сервер доступен' : 'Сервер недоступен', result ? 'success' : 'error');
        return result;
    }
}

// Создаем экземпляр игры
const game = new Game();

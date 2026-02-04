/**
 * Файл работы с API сервера
 */
class GameAPI {
    constructor() {
        // Проверяем, как называется переменная конфига (config или GameConfig)
        const serverBase = window.config?.SERVER_URL || window.GameConfig?.SERVER_URL || 'https://void-echoes-rpg.onrender.com';
        this.baseURL = serverBase;
        this.userId = null;
        this.init();
    }

    init() {
        const tg = window.Telegram?.WebApp;
        this.userId = tg?.initDataUnsafe?.user?.id || '12345'; // Используем ID телеграма или тестовый
        console.log('API инициализировано для ID:', this.userId);
    }

    async saveHero(heroId) {
        try {
            const response = await fetch(`${this.baseURL}/set_hero/${this.userId}/${heroId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });
            if (!response.ok) throw new Error('Ошибка сети');
            return await response.json();
        } catch (error) {
            console.error('Ошибка сохранения героя:', error);
            return { success: false, error: error.message };
        }
    }

    async getPlayer() {
        try {
            const response = await fetch(`${this.baseURL}/get_player/${this.userId}`);
            if (!response.ok) throw new Error('Игрок не найден');
            return await response.json();
        } catch (error) {
            console.warn('Игрок не найден на сервере, создаем локальный профиль');
            return this.getDefaultPlayer();
        }
    }

    getDefaultPlayer() {
        return {
            hero: null,
            level: 1,
            gold: 1500,
            crystals: 50,
            equipment: {}
        };
    }

    async checkConnection() {
        try {
            const response = await fetch(`${this.baseURL}/health`);
            return response.ok;
        } catch (error) {
            return false;
        }
    }
}

// Создаем экземпляр API для глобального доступа
const gameAPI = new GameAPI();

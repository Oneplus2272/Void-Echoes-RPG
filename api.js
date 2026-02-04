class GameAPI {
    constructor() {
        this.baseURL = GameConfig.SERVER_URL;
        this.userId = null;
        this.init();
    }

    init() {
        const tg = window.Telegram?.WebApp;
        this.userId = tg?.initDataUnsafe?.user?.id || 'temp_' + Date.now();
    }

    async saveHero(heroId) {
        try {
            const response = await fetch(`${this.baseURL}/set_hero/${this.userId}/${heroId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });
            return await response.json();
        } catch (error) {
            console.log('Ошибка сохранения героя:', error);
            return { success: false, error: error.message };
        }
    }

    async getPlayer() {
        try {
            const response = await fetch(`${this.baseURL}/get_player/${this.userId}`);
            return await response.json();
        } catch (error) {
            console.log('Ошибка загрузки игрока:', error);
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

const gameAPI = new GameAPI();

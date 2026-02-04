/**
 * Файл работы с Python API
 */
class GameAPI {
    constructor() {
        // Убедись, что этот URL ведет на твой Render Python сервер
        this.baseURL = 'https://void-echoes-rpg.onrender.com'; 
        this.userId = null;
        this.init();
    }

    init() {
        const tg = window.Telegram?.WebApp;
        // Получаем реальный ID пользователя из Telegram
        this.userId = tg?.initDataUnsafe?.user?.id || 'test_user';
        console.log('API инициализировано для ID:', this.userId);
    }

    async saveHero(heroId) {
        try {
            const response = await fetch(`${this.baseURL}/set_hero`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: this.userId,
                    hero_id: heroId
                })
            });
            return await response.json();
        } catch (error) {
            console.error('Ошибка сохранения:', error);
            return { success: false };
        }
    }

    async getPlayer() {
        try {
            const response = await fetch(`${this.baseURL}/get_player/${this.userId}`);
            if (!response.ok) throw new Error('New player');
            return await response.json();
        } catch (error) {
            console.log('Данные не найдены, создаем дефолтные');
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
}

const gameAPI = new GameAPI();

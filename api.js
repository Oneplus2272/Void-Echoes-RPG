// API для работы с сервером
class GameAPI {
    constructor() {
        this.baseURL = 'https://void-echoes-rpg.onrender.com';
        this.userId = null;
        this.init();
    }

    init() {
        // Получаем ID пользователя из Telegram или создаем временный
        const tg = window.Telegram?.WebApp;
        this.userId = tg?.initDataUnsafe?.user?.id || this.generateTempId();
    }

    generateTempId() {
        return 'temp_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Сохранение выбора героя
    async saveHeroSelection(heroId) {
        try {
            const response = await fetch(`${this.baseURL}/set_hero/${this.userId}/${heroId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    timestamp: new Date().toISOString(),
                    platform: 'telegram_web'
                })
            });
            
            return await response.json();
        } catch (error) {
            console.error('Ошибка сохранения героя:', error);
            throw error;
        }
    }

    // Получение данных игрока
    async getPlayerData() {
        try {
            const response = await fetch(`${this.baseURL}/get_player/${this.userId}`);
            return await response.json();
        } catch (error) {
            console.error('Ошибка загрузки данных игрока:', error);
            return this.getDefaultPlayerData();
        }
    }

    getDefaultPlayerData() {
        return {
            hero: 'tsar',
            level: 1,
            gold: 1500,
            crystals: 50,
            equipment: {}
        };
    }

    // Сохранение экипировки
    async saveEquipment(equipmentData) {
        try {
            const response = await fetch(`${this.baseURL}/save_equipment/${this.userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(equipmentData)
            });
            
            return await response.json();
        } catch (error) {
            console.error('Ошибка сохранения экипировки:', error);
            throw error;
        }
    }

    // Получение экипировки
    async getEquipment() {
        try {
            const response = await fetch(`${this.baseURL}/get_equipment/${this.userId}`);
            return await response.json();
        } catch (error) {
            console.error('Ошибка загрузки экипировки:', error);
            return {};
        }
    }

    // Обновление ресурсов
    async updateResources(gold, crystals) {
        try {
            const response = await fetch(`${this.baseURL}/update_resources/${this.userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ gold, crystals })
            });
            
            return await response.json();
        } catch (error) {
            console.error('Ошибка обновления ресурсов:', error);
            throw error;
        }
    }

    // Сохранение прогресса
    async saveProgress(progressData) {
        try {
            const response = await fetch(`${this.baseURL}/save_progress/${this.userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(progressData)
            });
            
            return await response.json();
        } catch (error) {
            console.error('Ошибка сохранения прогресса:', error);
            throw error;
        }
    }

    // Проверка связи с сервером
    async checkServerConnection() {
        try {
            const response = await fetch(`${this.baseURL}/health`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            return response.status === 200;
        } catch (error) {
            console.warn('Сервер недоступен, работа в оффлайн режиме');
            return false;
        }
    }
}

// Экспортируем экземпляр API
const gameAPI = new GameAPI();

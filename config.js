// Конфигурация игры
const GameConfig = {
    // Данные героев
    heroes: {
        tsar: {
            id: 'tsar',
            name: 'Царь',
            image: 'assets/heroes/hero_tsar.png',
            face: 'assets/heroes/face_1.png',
            description: 'Могущественный правитель с железной волей'
        },
        sultan: {
            id: 'sultan',
            name: 'Султан',
            image: 'assets/heroes/hero_sultan.png',
            face: 'assets/heroes/face_2.png',
            description: 'Мудрый восточный владыка'
        },
        king: {
            id: 'king',
            name: 'Король',
            image: 'assets/heroes/hero_king.png',
            face: 'assets/heroes/face_3.png',
            description: 'Благородный западный монарх'
        }
    },

    // Координаты инвентаря
    inventoryPositions: {
        tablet: {
            'helmet-slot': { x: 14.21, y: 26.51, width: 235, height: 235 },
            'chestplate-slot': { x: 13.98, y: 37.87, width: 235, height: 235 },
            'hammer-slot': { x: 15.24, y: 47.98, width: 235, height: 235 },
            'ring-slot': { x: 15.68, y: 57.19, width: 235, height: 235 },
            'bracers-slot': { x: 55.51, y: 26.39, width: 235, height: 235 },
            'boots-slot': { x: 55.28, y: 36.96, width: 235, height: 235 },
            'hammer2-slot': { x: 55.78, y: 47.74, width: 235, height: 235 },
            'ring2-slot': { x: 55.96, y: 57.14, width: 235, height: 235 }
        },
        phone: {
            'helmet-slot': { x: 5.23, y: 28.63, width: 144, height: 144 },
            'chestplate-slot': { x: 5.55, y: 40.42, width: 144, height: 144 },
            'hammer-slot': { x: 6.80, y: 50.75, width: 144, height: 144 },
            'ring-slot': { x: 7.22, y: 59.82, width: 144, height: 144 },
            'bracers-slot': { x: 60.00, y: 27.90, width: 144, height: 144 },
            'boots-slot': { x: 59.86, y: 39.20, width: 144, height: 144 },
            'hammer2-slot': { x: 60.00, y: 50.64, width: 144, height: 144 },
            'ring2-slot': { x: 60.00, y: 59.33, width: 144, height: 144 }
        }
    },

    // Оборудование
    equipment: [
        { id: 'helmet', name: 'Шлем', icon: 'assets/equipment/helmet.png' },
        { id: 'chestplate', name: 'Нагрудник', icon: 'assets/equipment/chestplate.png' },
        { id: 'hammer', name: 'Молот', icon: 'assets/equipment/hammer.png' },
        { id: 'ring', name: 'Кольцо', icon: 'assets/equipment/ring.png' },
        { id: 'bracers', name: 'Наручи', icon: 'assets/equipment/bracers.png' },
        { id: 'boots', name: 'Ботинки', icon: 'assets/equipment/boots.png' }
    ],

    // Иконки меню
    menuIcons: {
        quests: { name: 'Задания', icon: 'assets/icons/icon_quests.png' },
        battle: { name: 'Бой', icon: 'assets/icons/icon_battle.png' },
        alliance: { name: 'Союз', icon: 'assets/icons/icon_alliance.png' },
        shop: { name: 'Магазин', icon: 'assets/icons/icon_shop.png' },
        inventory: { name: 'Инвентарь', icon: 'assets/icons/icon_inventory.png' },
        community: { name: 'Сообщество', icon: 'assets/icons/icon_community.png' },
        benchmark: { name: 'Эталон', icon: 'assets/icons/icon_benchmark.png' },
        rating: { name: 'Рейтинг', icon: 'assets/icons/icon_rating.png' },
        profile: { name: 'Профиль', icon: 'assets/icons/icon_profile.png' },
        lotto: { name: 'Лотерея', icon: 'assets/icons/icon_lotto.png' },
        calendar: { name: 'Календарь', icon: 'assets/icons/icon_calendar.png' },
        mail: { name: 'Письмо', icon: 'assets/icons/icon_mail.png' }
    }
};

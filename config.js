const GameConfig = {
    SERVER_URL: 'https://void-echoes-rpg.onrender.com',
    
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

    equipment: [
        { id: 'helmet', name: 'Шлем', icon: 'assets/equipment/helmet.png', slot: 'helmet-slot' },
        { id: 'chestplate', name: 'Нагрудник', icon: 'assets/equipment/chestplate.png', slot: 'chestplate-slot' },
        { id: 'hammer', name: 'Молот', icon: 'assets/equipment/hammer.png', slot: 'hammer-slot' },
        { id: 'ring', name: 'Кольцо', icon: 'assets/equipment/ring.png', slot: 'ring-slot' },
        { id: 'bracers', name: 'Наручи', icon: 'assets/equipment/bracers.png', slot: 'bracers-slot' },
        { id: 'boots', name: 'Ботинки', icon: 'assets/equipment/boots.png', slot: 'boots-slot' },
        { id: 'hammer2', name: 'Молот 2', icon: 'assets/equipment/hammer.png', slot: 'hammer2-slot' },
        { id: 'ring2', name: 'Кольцо 2', icon: 'assets/equipment/ring.png', slot: 'ring2-slot' }
    ],

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
    },

    isTablet: window.innerWidth > 1024 || (window.innerWidth <= 1024 && window.innerHeight > 1024),

    pages: {
        1: ["quests", "battle", "alliance", "shop", "inventory", "community"],
        2: ["benchmark", "rating", "profile", "lotto", "calendar", "mail"]
    },

    textPositions: {
        quests: { x: 59, y: 985 },
        battle: { x: 183, y: 985 },
        profile: { x: 179, y: 986 },
        mail: { x: 41, y: 988 },
        community: { x: 64, y: 234 },
        calendar: { x: 70, y: 583 },
        alliance: { x: 312, y: 988 },
        shop: { x: 438, y: 987 },
        inventory: { x: 565, y: 986 },
        rating: { x: 313, y: 987 },
        lotto: { x: 430, y: 987 },
        benchmark: { x: 565, y: 986 }
    },

    layout: window.innerWidth > 1024 ? {
        panel: { x: -17, y: 880, w: 854, h: 130 },
        layout: {
            quests: { x: -19, y: 877, s: 145 },
            battle: { x: 102, y: 880, s: 160 },
            alliance: { x: 237, y: 882, s: 150 },
            shop: { x: 357, y: 886, s: 152 },
            inventory: { x: 487, y: 872, s: 150 },
            community: { x: -15, y: 127, s: 153, static: true },
            benchmark: { x: 477, y: 868, s: 162 },
            rating: { x: 229, y: 871, s: 162 },
            profile: { x: 99, y: 867, s: 165 },
            lotto: { x: 344, y: 870, s: 167 },
            calendar: { x: -69, y: 414, s: 256, static: true },
            mail: { x: -79, y: 835, s: 243 }
        }
    } : {
        panel: { x: -24, y: 551, w: 448, h: 99 },
        layout: {
            quests: { x: -22, y: 551, s: 106 },
            battle: { x: 59, y: 553, s: 119 },
            alliance: { x: 154, y: 554, s: 110 },
            shop: { x: 246, y: 94, s: 115, static: true },
            inventory: { x: 248, y: 547, s: 112 },
            community: { x: -10, y: 150, s: 114, static: true },
            benchmark: { x: 238, y: 542, s: 127 },
            rating: { x: 57, y: 544, s: 127 },
            profile: { x: -27, y: 543, s: 123 },
            lotto: { x: 143, y: 543, s: 131 },
            calendar: { x: 218, y: 358, s: 188, static: true },
            mail: { x: -47, y: 250, s: 190, static: true }
        }
    }
};

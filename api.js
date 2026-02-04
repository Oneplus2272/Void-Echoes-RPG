const config = {
    SERVER_URL: 'https://void-echoes-rpg.onrender.com',
    panel: { x: 20, y: 550, w: 350, h: 100 },
    layout: {
        profile: { x: 50, y: 570, s: 50, static: true },
        inventory: { x: 120, y: 570, s: 50, static: true },
        quests: { x: 190, y: 570, s: 50, static: false },
        shop: { x: 260, y: 570, s: 50, static: false },
        battle: { x: 190, y: 570, s: 50, static: false },
        rating: { x: 260, y: 570, s: 50, static: false }
    }
};

const iconNames = {
    profile: "Профиль",
    inventory: "Рюкзак",
    quests: "Задания",
    shop: "Лавка",
    battle: "Битва",
    rating: "Рейтинг"
};

const pages = {
    1: ['quests', 'shop'],
    2: ['battle', 'rating']
};

const textPositions = {}; // Авто-расчет в main.js

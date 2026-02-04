const isTablet = window.innerWidth > 1024 || (window.innerWidth <= 1024 && window.innerHeight > 1024);

const heroesData = {
    tsar: { name: "Царь", image: "hero_tsar.png", face: "face_1.png" },
    sultan: { name: "Султан", image: "hero_sultan.png", face: "face_2.png" },
    king: { name: "Король", image: "hero_king.png", face: "face_3.png" }
};

const pages = { 
    1: ["quests", "battle", "alliance", "shop", "inventory", "community"], 
    2: ["benchmark", "rating", "profile", "lotto", "calendar", "mail"] 
};

const iconNames = {
    quests: "Задания", battle: "Бой", community: "Сообщество", mail: "Письмо",
    calendar: "Календарь", alliance: "Союз", shop: "Магазин", inventory: "Инвентарь",
    profile: "Профиль", rating: "Рейтинг", lotto: "Лотерея", benchmark: "Эталон"
};

const textPositions = {
    quests: {x: 59, y: 985}, battle: {x: 183, y: 985}, profile: {x: 179, y: 986},
    mail: {x: 41, y: 988}, community: {x: 64, y: 234}, calendar: {x: 70, y: 583},
    alliance: {x: 312, y: 988}, shop: {x: 438, y: 987}, inventory: {x: 565, y: 986},
    rating: {x: 313, y: 987}, lotto: {x: 430, y: 987}, benchmark: {x: 565, y: 986}
};

const config = isTablet ? {
    panel: { x: -17, y: 880, w: 854, h: 130 },
    layout: {
        quests: {x:-19, y:877, s:145}, battle: {x:102, y:880, s:160}, alliance: {x:237, y:882, s:150},
        shop: {x:357, y:886, s:152}, inventory: {x:487, y:872, s:150}, community: {x:-15, y:127, s:153, static: true},
        benchmark: {x:477, y:868, s:162}, rating: {x:229, y:871, s:162}, profile: {x:99, y:867, s:165},
        lotto: {x:344, y:870, s:167}, calendar: {x:-69, y:414, s:256, static: true}, mail: {x:-79, y:835, s:243}
    }
} : {
    panel: { x: -24, y: 551, w: 448, h: 99 },
    layout: {
        quests: {x:-22, y:551, s:106}, battle: {x:59, y:553, s:119}, alliance: {x:154, y:554, s:110},
        shop: {x:246, y:94, s:115, static: true}, inventory: {x:248, y:547, s:112}, community: {x:-10, y:150, s:114, static: true},
        benchmark: {x:238, y:542, s:127}, rating: {x:57, y:544, s:127}, profile: {x:-27, y:543, s:123},
        lotto: {x:143, y:543, s:131}, calendar: {x:218, y:358, s:188, static: true}, mail: {x:-47, y:250, s:190, static: true}
    }
};

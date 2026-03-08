// app.js - Основные функции WebApp

// Инициализация Telegram WebApp
const tg = window.Telegram.WebApp;
tg.expand();

// Глобальные переменные
let player = {
    id: tg.initDataUnsafe?.user?.id || 123456,
    name: tg.initDataUnsafe?.user?.first_name || 'Игрок',
    level: 1,
    hp: 100,
    maxHp: 100,
    mp: 50,
    maxMp: 50,
    gold: 0,
    exp: 0,
    race: null,
    class: null,
    stats: {},
    created: false
};

// Названия рас
const raceNames = {
    'human': 'Человек',
    'elf': 'Эльф',
    'dwarf': 'Гном',
    'lizard': 'Людоящер',
    'orc': 'Орк',
    'minotaur': 'Минотавр',
    'naga': 'Нага'
};

// Названия классов
const classNames = {
    'warrior': 'Воин',
    'barbarian': 'Варвар',
    'paladin': 'Паладин',
    'wizard': 'Волшебник',
    'warlock': 'Колдун',
    'druid': 'Друид',
    'ranger': 'Следопыт',
    'rogue': 'Плут',
    'monk': 'Монах'
};

// Переключение экранов
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');

    if (screenId === 'menu-screen') {
        updatePlayerStats();
    }
}

// ✅ Обновление шапки меню
function updateMenuHeader() {
    document.getElementById('menu-player-name').textContent = player.name || 'Игрок';
    document.getElementById('menu-race').textContent = raceNames[player.race] || '-';
    document.getElementById('menu-class').textContent = classNames[player.class] || '-';
    document.getElementById('menu-level').textContent = player.level || 1;
}

// Обновление статов игрока
function updatePlayerStats() {
    document.getElementById('player-name').textContent = player.name;
    document.getElementById('player-level').textContent = player.level;
    document.getElementById('hp-current').textContent = player.hp;
    document.getElementById('hp-max').textContent = player.maxHp;
    document.getElementById('mp-current').textContent = player.mp;
    document.getElementById('mp-max').textContent = player.maxMp;
    document.getElementById('gold-value').textContent = player.gold;

    const hpPercent = (player.hp / player.maxHp) * 100;
    const mpPercent = (player.mp / player.maxMp) * 100;
    document.getElementById('hp-bar').style.width = hpPercent + '%';
    document.getElementById('mp-bar').style.width = mpPercent + '%';

    updateMenuHeader();
}

// Загрузка данных игрока
async function loadPlayerData() {
    try {
        const response = await fetch('/api/player/' + player.id);
        if (response.ok) {
            const data = await response.json();
            player = { ...player, ...data };
            if (player.created) {
                updatePlayerStats();
                showScreen('menu-screen');
            }
        }
    } catch (error) {
        console.log('Нет сохранённых данных');
    }
}

// Обработка данных от Telegram
tg.onEvent('mainButtonClicked', function() {
    console.log('Main button clicked');
});

// Инициализация при загрузке
window.addEventListener('load', () => {
    const banner = document.getElementById('game-banner');
    if (banner) {
        banner.onerror = function() {
            document.querySelector('.banner-container').style.display = 'none';
        };
    }
    
    setTimeout(() => {
        showScreen('welcome-screen');
    }, 1500);
});

tg.ready();

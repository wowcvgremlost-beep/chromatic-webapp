// app.js - Основные функции WebApp

// Инициализация Telegram WebApp
const tg = window.Telegram.WebApp;
tg.expand(); // Развернуть на весь экран

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

// Переключение экранов
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');

    // Обновить UI при возврате в меню
    if (screenId === 'menu-screen') {
        updatePlayerStats();
    }
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

    // Обновить полоски
    const hpPercent = (player.hp / player.maxHp) * 100;
    const mpPercent = (player.mp / player.maxMp) * 100;
    document.getElementById('hp-bar').style.width = hpPercent + '%';
    document.getElementById('mp-bar').style.width = mpPercent + '%';
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
    // Проверка, есть ли картинка
    const banner = document.getElementById('game-banner');
    if (banner) {
        banner.onerror = function() {
            // Если картинки нет, скрыть контейнер
            document.querySelector('.banner-container').style.display = 'none';
        };
    }

    setTimeout(() => {
        showScreen('welcome-screen');
    }, 1500);
});

// Готово!
tg.ready();
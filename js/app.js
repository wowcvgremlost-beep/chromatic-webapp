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
    stats: {
        stealth: 10,
        dodge: 5,
        physAtk: 10,
        physDef: 5,
        magAtk: 10,
        magDef: 5
    },
    statPoints: 15,
    inventory: [],
    equipment: {}
};

let tempStats = { ...player.stats };
let selectedRace = null;
let selectedClass = null;

// Переключение экранов
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');

    // Обновить UI
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

// Загрузка данных с сервера
async function loadPlayerData() {
    try {
        const response = await fetch('/api/player/' + player.id);
        if (response.ok) {
            const data = await response.json();
            player = { ...player, ...data };
            updatePlayerStats();
        }
    } catch (error) {
        console.log('Нет сохраненных данных, начинаем с нуля');
    }
}

// Сохранение данных на сервер
async function savePlayerData() {
    try {
        await fetch('/api/player/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(player)
        });
    } catch (error) {
        console.error('Ошибка сохранения:', error);
    }
}

// Инициализация при загрузке
window.addEventListener('load', () => {
    setTimeout(() => {
        showScreen('menu-screen');
        loadPlayerData();
    }, 1500);
});

// Показ уведомления
function showAlert(message) {
    tg.showAlert(message);
}

// Подтверждение
function showConfirm(message, callback) {
    tg.showConfirm(message, callback);
}
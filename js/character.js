// character.js - Логика создания персонажа

// Глобальные переменные
let selectedRace = null;
let selectedClass = null;
let statPoints = 15;

// Базовые статы (уровень 1)
let baseStats = {
    hp: 100,
    maxHp: 100,
    mp: 50,
    maxMp: 50,
    stealth: 10,
    dodge: 5,
    physAtk: 10,
    physDef: 5,
    magAtk: 10,
    magDef: 5
};

// Текущие статы (с учётом бонусов расы и класса)
let currentStats = { ...baseStats };
let tempStatPoints = 15;

// Бонусы рас
const raceBonuses = {
    'human': { statPoints: 5 },
    'elf': { stealth: 2, dodge: 1, magAtk: 2 },
    'dwarf': { physDef: 2, magDef: 2, dodge: 1 },
    'lizard': { stealth: 2, physAtk: 1, magDef: 1, dodge: 1 },
    'orc': { hp: 10, physAtk: 1, physDef: 1 },
    'minotaur': { hp: 20, physDef: 2, magDef: 1 },
    'naga': { magAtk: 3, mp: 10 }
};

// Бонусы классов
const classBonuses = {
    'warrior': { physAtk: 1, physDef: 2, magDef: 2 },
    'barbarian': { hp: 20, stealth: 2, physAtk: 1 },
    'paladin': { hp: 10, physDef: 2, magDef: 2 },
    'wizard': { mp: 15, magAtk: 2 },
    'warlock': { mp: 10, magAtk: 3 },
    'druid': { magAtk: 2, magDef: 2, mp: 5 },
    'ranger': { stealth: 2, dodge: 3 },
    'rogue': { physAtk: 2, stealth: 1, dodge: 2 },
    'monk': { hp: 10, physAtk: 2, physDef: 2 }
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

// Выбор расы
function selectRace(race) {
    selectedRace = race;

    // Визуальное выделение
    document.querySelectorAll('.race-card').forEach(card => {
        card.classList.remove('selected');
    });
    event.currentTarget.classList.add('selected');

    // Обновить сводку
    document.getElementById('summary-race').textContent = raceNames[race];

    // Применить бонусы
    applyBonuses();
}

// Выбор класса
function selectClass(className) {
    selectedClass = className;

    // Визуальное выделение
    document.querySelectorAll('.class-card').forEach(card => {
        card.classList.remove('selected');
    });
    event.currentTarget.classList.add('selected');

    // Обновить сводку
    document.getElementById('summary-class').textContent = classNames[className];

    // Применить бонусы
    applyBonuses();
}

// Применить бонусы расы и класса
function applyBonuses() {
    // Сброс к базовым значениям
    currentStats = { ...baseStats };
    tempStatPoints = 15;

    // Бонусы расы
    if (selectedRace && raceBonuses[selectedRace]) {
        const bonuses = raceBonuses[selectedRace];
        if (bonuses.hp) currentStats.maxHp += bonuses.hp;
        if (bonuses.mp) currentStats.maxMp += bonuses.mp;
        if (bonuses.statPoints) tempStatPoints += bonuses.statPoints;
        if (bonuses.stealth) currentStats.stealth += bonuses.stealth;
        if (bonuses.dodge) currentStats.dodge += bonuses.dodge;
        if (bonuses.physAtk) currentStats.physAtk += bonuses.physAtk;
        if (bonuses.physDef) currentStats.physDef += bonuses.physDef;
        if (bonuses.magAtk) currentStats.magAtk += bonuses.magAtk;
        if (bonuses.magDef) currentStats.magDef += bonuses.magDef;
    }

    // Бонусы класса
    if (selectedClass && classBonuses[selectedClass]) {
        const bonuses = classBonuses[selectedClass];
        if (bonuses.hp) currentStats.maxHp += bonuses.hp;
        if (bonuses.mp) currentStats.maxMp += bonuses.mp;
        if (bonuses.stealth) currentStats.stealth += bonuses.stealth;
        if (bonuses.dodge) currentStats.dodge += bonuses.dodge;
        if (bonuses.physAtk) currentStats.physAtk += bonuses.physAtk;
        if (bonuses.physDef) currentStats.physDef += bonuses.physDef;
        if (bonuses.magAtk) currentStats.magAtk += bonuses.magAtk;
        if (bonuses.magDef) currentStats.magDef += bonuses.magDef;
    }

    // Обновить отображение
    updateStatDisplay();

    // Если выбраны и раса и класс - перейти к статам
    if (selectedRace && selectedClass) {
        showStep(3);
    }
}

// Изменение стата
function changeStat(stat, delta) {
    const costs = {
        'hp': 1,
        'mp': 1,
        'stealth': 1,
        'dodge': 1,
        'phys_atk': 1,
        'phys_def': 1,
        'mag_atk': 1,
        'mag_def': 1
    };

    const statKey = stat === 'hp' ? 'maxHp' :
                    stat === 'mp' ? 'maxMp' :
                    stat === 'phys_atk' ? 'physAtk' :
                    stat === 'phys_def' ? 'physDef' :
                    stat === 'mag_atk' ? 'magAtk' :
                    stat === 'mag_def' ? 'magDef' : stat;

    // Проверка: можно ли изменить
    if (delta > 0 && tempStatPoints <= 0) return;
    if (delta < 0 && currentStats[statKey] <= baseStats[statKey]) return;

    // Изменение
    if (delta > 0) {
        if (stat === 'hp') currentStats.maxHp += 10;
        else if (stat === 'mp') currentStats.maxMp += 5;
        else currentStats[statKey] += 1;
        tempStatPoints--;
    } else {
        if (stat === 'hp') currentStats.maxHp -= 10;
        else if (stat === 'mp') currentStats.maxMp -= 5;
        else currentStats[statKey] -= 1;
        tempStatPoints++;
    }

    updateStatDisplay();
}

// Обновление отображения статов
function updateStatDisplay() {
    document.getElementById('stat-points-left').textContent = tempStatPoints;
    document.getElementById('stat-hp').textContent = currentStats.maxHp;
    document.getElementById('stat-mp').textContent = currentStats.maxMp;
    document.getElementById('stat-stealth').textContent = currentStats.stealth;
    document.getElementById('stat-dodge').textContent = currentStats.dodge;
    document.getElementById('stat-phys-atk').textContent = currentStats.physAtk;
    document.getElementById('stat-phys-def').textContent = currentStats.physDef;
    document.getElementById('stat-mag-atk').textContent = currentStats.magAtk;
    document.getElementById('stat-mag-def').textContent = currentStats.magDef;
}

// Переключение шагов
function showStep(step) {
    document.querySelectorAll('.selection-step').forEach(step => {
        step.classList.remove('active');
    });
    document.querySelectorAll('.progress-step').forEach(step => {
        step.classList.remove('active');
    });

    // Активировать нужный шаг
    const steps = ['race-selection', 'class-selection', 'stat-allocation'];
    document.getElementById(steps[step - 1]).classList.add('active');
    document.querySelector(`.progress-step[data-step="${step}"]`).classList.add('active');
}

// Завершение создания персонажа
async function finishCharacterCreation() {
    if (!selectedRace || !selectedClass) {
        tg.showAlert('Выберите расу и класс!');
        return;
    }

    if (tempStatPoints > 0) {
        const confirm = await new Promise(resolve => {
            tg.showConfirm(`Осталось ${tempStatPoints} нераспределённых очков. Завершить?`, resolve);
        });
        if (!confirm) return;
    }

    // Сохранение данных
    const characterData = {
        race: selectedRace,
        className: selectedClass,
        stats: { ...currentStats },
        statPoints: tempStatPoints
    };

    // Отправка данных боту
    tg.sendData(JSON.stringify(characterData));

    // Показать финальный экран
    showFinalStats(characterData);
}

// Показать финальные статы
function showFinalStats(data) {
    document.querySelectorAll('.selection-step').forEach(step => {
        step.classList.remove('active');
    });
    document.getElementById('character-final').classList.add('active');

    const html = `
        <p><strong>🧬 Раса:</strong> ${raceNames[data.race]}</p>
        <p><strong>⚔️ Класс:</strong> ${classNames[data.className]}</p>
        <p><strong>❤️ HP:</strong> ${data.stats.maxHp}</p>
        <p><strong>💙 MP:</strong> ${data.stats.maxMp}</p>
        <p><strong>🗡️ Скр.Атака:</strong> ${data.stats.stealth}</p>
        <p><strong>🌀 Уклонение:</strong> ${data.stats.dodge}</p>
        <p><strong>⚔️ Физ.Атака:</strong> ${data.stats.physAtk}</p>
        <p><strong>🛡️ Физ.Защита:</strong> ${data.stats.physDef}</p>
        <p><strong>🔮 Маг.Атака:</strong> ${data.stats.magAtk}</p>
        <p><strong>🧿 Маг.Защита:</strong> ${data.stats.magDef}</p>
    `;

    document.getElementById('final-stats').innerHTML = html;
}

// Начать игру
function startGame() {
    showScreen('menu-screen');
}
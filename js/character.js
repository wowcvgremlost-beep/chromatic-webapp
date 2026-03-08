// Выбор расы
function selectRace(race) {
    selectedRace = race;

    // Визуальное выделение
    document.querySelectorAll('.race-btn').forEach(btn => {
        btn.style.borderColor = 'transparent';
    });
    event.currentTarget.style.borderColor = '#ffd700';

    // Если класс уже выбран, показать распределение статов
    if (selectedClass) {
        document.getElementById('stat-allocation').style.display = 'block';
        applyRaceClassBonuses();
    }
}

// Выбор класса
function selectClass(className) {
    selectedClass = className;

    // Визуальное выделение
    document.querySelectorAll('.class-btn').forEach(btn => {
        btn.style.borderColor = 'transparent';
    });
    event.currentTarget.style.borderColor = '#ffd700';

    // Если раса уже выбрана, показать распределение статов
    if (selectedRace) {
        document.getElementById('stat-allocation').style.display = 'block';
        applyRaceClassBonuses();
    }
}

// Применение бонусов расы и класса
function applyRaceClassBonuses() {
    // Сброс к базовым значениям
    tempStats = {
        stealth: 10,
        dodge: 5,
        physAtk: 10,
        physDef: 5,
        magAtk: 10,
        magDef: 5
    };
    player.maxHp = 100;
    player.maxMp = 50;
    player.statPoints = 15;

    // Бонусы расы
    const raceBonuses = {
        'human': { statPoints: 5 },
        'elf': { stealth: 2, dodge: 1, magAtk: 2 },
        'dwarf': { physDef: 2, magDef: 2, dodge: 1 },
        'lizard': { stealth: 2, physAtk: 1, magDef: 1, dodge: 1 },
        'orc': { hp: 10, physAtk: 1, physDef: 1 },
        'minotaur': { hp: 20, physDef: 2, magDef: 1 },
        'naga': { magAtk: 3, mp: 10 }
    };

    // Бонусы класса
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

    // Применить бонусы расы
    if (raceBonuses[selectedRace]) {
        const bonuses = raceBonuses[selectedRace];
        if (bonuses.hp) player.maxHp += bonuses.hp;
        if (bonuses.mp) player.maxMp += bonuses.mp;
        if (bonuses.statPoints) player.statPoints += bonuses.statPoints;
        if (bonuses.stealth) tempStats.stealth += bonuses.stealth;
        if (bonuses.dodge) tempStats.dodge += bonuses.dodge;
        if (bonuses.physAtk) tempStats.physAtk += bonuses.physAtk;
        if (bonuses.physDef) tempStats.physDef += bonuses.physDef;
        if (bonuses.magAtk) tempStats.magAtk += bonuses.magAtk;
        if (bonuses.magDef) tempStats.magDef += bonuses.magDef;
    }

    // Применить бонусы класса
    if (classBonuses[selectedClass]) {
        const bonuses = classBonuses[selectedClass];
        if (bonuses.hp) player.maxHp += bonuses.hp;
        if (bonuses.mp) player.maxMp += bonuses.mp;
        if (bonuses.stealth) tempStats.stealth += bonuses.stealth;
        if (bonuses.dodge) tempStats.dodge += bonuses.dodge;
        if (bonuses.physAtk) tempStats.physAtk += bonuses.physAtk;
        if (bonuses.physDef) tempStats.physDef += bonuses.physDef;
        if (bonuses.magAtk) tempStats.magAtk += bonuses.magAtk;
        if (bonuses.magDef) tempStats.magDef += bonuses.magDef;
    }

    updateStatDisplay();
}

// Изменение стата
function changeStat(stat, delta) {
    if (delta > 0 && player.statPoints <= 0) return;
    if (delta < 0 && tempStats[stat] <= (stat === 'hp' || stat === 'mp' ? 10 : 1)) return;

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

    const statKey = stat === 'hp' ? 'maxHp' : stat === 'mp' ? 'maxMp' :
                    stat === 'phys_atk' ? 'physAtk' : stat === 'phys_def' ? 'physDef' :
                    stat === 'mag_atk' ? 'magAtk' : stat === 'mag_def' ? 'magDef' : stat;

    if (delta > 0) {
        if (stat === 'hp') player.maxHp += 10;
        else if (stat === 'mp') player.maxMp += 5;
        else tempStats[statKey] += 1;
        player.statPoints--;
    } else {
        if (stat === 'hp') player.maxHp -= 10;
        else if (stat === 'mp') player.maxMp -= 5;
        else tempStats[statKey] -= 1;
        player.statPoints++;
    }

    updateStatDisplay();
}

// Обновление отображения статов
function updateStatDisplay() {
    document.getElementById('stat-points').textContent = player.statPoints;
    document.getElementById('stat-hp').textContent = player.maxHp;
    document.getElementById('stat-mp').textContent = player.maxMp;
    document.getElementById('stat-stealth').textContent = tempStats.stealth;
    document.getElementById('stat-dodge').textContent = tempStats.dodge;
    document.getElementById('stat-phys-atk').textContent = tempStats.physAtk;
    document.getElementById('stat-phys-def').textContent = tempStats.physDef;
    document.getElementById('stat-mag-atk').textContent = tempStats.magAtk;
    document.getElementById('stat-mag-def').textContent = tempStats.magDef;
}

// Завершение создания персонажа
async function finishCharacterCreation() {
    if (!selectedRace || !selectedClass) {
        showAlert('Выберите расу и класс!');
        return;
    }

    player.race = selectedRace;
    player.class = selectedClass;
    player.stats = { ...tempStats };
    player.hp = player.maxHp;
    player.mp = player.maxMp;

    // Сохранить на сервер
    await savePlayerData();

    // Показать финальные статы
    showFinalStats();
}

// Показать финальные статы
function showFinalStats() {
    document.getElementById('char-creation').style.display = 'none';
    document.getElementById('char-stats').style.display = 'block';

    const statsHtml = `
        <div class="stats-display">
            <p><strong>Раса:</strong> ${getRaceName(player.race)}</p>
            <p><strong>Класс:</strong> ${getClassName(player.class)}</p>
            <p><strong>HP:</strong> ${player.maxHp}</p>
            <p><strong>MP:</strong> ${player.maxMp}</p>
            <p><strong>Скр.Атака:</strong> ${player.stats.stealth}</p>
            <p><strong>Уклонение:</strong> ${player.stats.dodge}</p>
            <p><strong>Физ.Атака:</strong> ${player.stats.physAtk}</p>
            <p><strong>Физ.Защита:</strong> ${player.stats.physDef}</p>
            <p><strong>Маг.Атака:</strong> ${player.stats.magAtk}</p>
            <p><strong>Маг.Защита:</strong> ${player.stats.magDef}</p>
        </div>
    `;

    document.getElementById('final-stats').innerHTML = statsHtml;
}

// Вспомогательные функции
function getRaceName(race) {
    const names = {
        'human': 'Человек',
        'elf': 'Эльф',
        'dwarf': 'Гном',
        'lizard': 'Людоящер',
        'orc': 'Орк',
        'minotaur': 'Минотавр',
        'naga': 'Нага'
    };
    return names[race] || race;
}

function getClassName(className) {
    const names = {
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
    return names[className] || className;
}
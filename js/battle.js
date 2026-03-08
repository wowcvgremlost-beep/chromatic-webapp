let currentEnemy = null;
let battleInProgress = false;
let playerTurn = true;

// Начать бой
function startBattle(enemy) {
    currentEnemy = {
        name: enemy.name || 'Дикий Гоблин',
        hp: enemy.hp || 20,
        maxHp: enemy.hp || 20,
        stats: enemy.stats || {
            stealth: 8,
            dodge: 12,
            physAtk: 7,
            physDef: 4,
            magAtk: 3,
            magDef: 3
        }
    };

    battleInProgress = true;
    playerTurn = true;

    // Обновить UI
    document.getElementById('enemy-name').textContent = currentEnemy.name;
    updateBattleHP();
    document.getElementById('battle-log').innerHTML = '<div class="log-entry">⚔️ Бой начался!</div>';

    showScreen('battle-screen');

    // Бросок инициативы
    rollInitiative();
}

// Бросок инициативы
function rollInitiative() {
    const playerRoll = Math.floor(Math.random() * 20) + 1;
    const enemyRoll = Math.floor(Math.random() * 20) + 1;

    const playerTotal = player.stats.stealth + playerRoll;
    const enemyTotal = currentEnemy.stats.stealth + enemyRoll;

    addBattleLog(`🎲 Инициатива: Вы ${playerTotal} vs ${currentEnemy.name} ${enemyTotal}`);

    playerTurn = playerTotal >= enemyTotal;

    if (playerTurn) {
        addBattleLog('✅ Ваш ход!');
    } else {
        addBattleLog(`⚠️ ${currentEnemy.name} ходит первым!`);
        setTimeout(enemyTurn, 1500);
    }
}

// Действие в бою
function battleAction(action) {
    if (!battleInProgress || !playerTurn) return;

    switch(action) {
        case 'attack':
            playerAttack('phys');
            break;
        case 'skill':
            useSkill();
            break;
        case 'scroll':
            useScroll();
            break;
        case 'defend':
            playerDefend();
            break;
    }
}

// Атака игрока
function playerAttack(type) {
    const attack = type === 'phys' ? player.stats.physAtk : player.stats.magAtk;
    const defense = type === 'phys' ? currentEnemy.stats.physDef : currentEnemy.stats.magDef;

    const damage = Math.max(1, attack - defense);
    currentEnemy.hp -= damage;

    addBattleLog(`⚔️ Вы нанесли ${damage} урона!`);

    updateBattleHP();

    if (currentEnemy.hp <= 0) {
        winBattle();
    } else {
        playerTurn = false;
        setTimeout(enemyTurn, 1000);
    }
}

// Ход врага
function enemyTurn() {
    if (!battleInProgress) return;

    const attack = currentEnemy.stats.physAtk;
    const defense = player.stats.physDef;

    const damage = Math.max(1, attack - defense);
    player.hp -= damage;

    addBattleLog(`👹 ${currentEnemy.name} нанес ${damage} урона!`);

    updateBattleHP();

    if (player.hp <= 0) {
        loseBattle();
    } else {
        playerTurn = true;
        addBattleLog('✅ Ваш ход!');
    }
}

// Защита
function playerDefend() {
    addBattleLog('🛡️ Вы перешли в защиту (урон снижен на 50%)');
    playerTurn = false;
    setTimeout(enemyTurn, 1000);
}

// Использование навыка
function useSkill() {
    // Здесь будет логика навыков класса
    addBattleLog('✨ Навык класса (в разработке)');
    playerTurn = false;
    setTimeout(enemyTurn, 1000);
}

// Использование свитка
function useScroll() {
    // Здесь будет логика свитков
    addBattleLog('📜 Свиток (в разработке)');
    playerTurn = false;
    setTimeout(enemyTurn, 1000);
}

// Обновление HP в бою
function updateBattleHP() {
    const playerHpPercent = (player.hp / player.maxHp) * 100;
    const enemyHpPercent = (currentEnemy.hp / currentEnemy.maxHp) * 100;

    document.getElementById('battle-player-hp').textContent = `${Math.max(0, player.hp)}/${player.maxHp}`;
    document.getElementById('battle-enemy-hp').textContent = `${Math.max(0, currentEnemy.hp)}/${currentEnemy.maxHp}`;

    document.getElementById('battle-player-hp-bar').style.width = Math.max(0, playerHpPercent) + '%';
    document.getElementById('battle-enemy-hp-bar').style.width = Math.max(0, enemyHpPercent) + '%';
}

// Добавление записи в лог
function addBattleLog(message) {
    const log = document.getElementById('battle-log');
    const entry = document.createElement('div');
    entry.className = 'log-entry';
    entry.textContent = message;
    log.appendChild(entry);
    log.scrollTop = log.scrollHeight;
}

// Победа
function winBattle() {
    battleInProgress = false;
    const expGain = 50;
    const goldGain = 50;

    player.exp += expGain;
    player.gold += goldGain;

    addBattleLog(`🎉 Победа! +${expGain} опыта, +${goldGain} золота`);

    setTimeout(() => {
        showAlert(`Победа!\n+${expGain} опыта\n+${goldGain} золота`);
        savePlayerData();
        showScreen('menu-screen');
    }, 1500);
}

// Поражение
function loseBattle() {
    battleInProgress = false;
    addBattleLog('💀 Вы проиграли...');

    setTimeout(() => {
        showAlert('Вы проиграли бой!\nЗолото потеряно.');
        player.hp = player.maxHp;
        player.gold = 0;
        savePlayerData();
        showScreen('menu-screen');
    }, 1500);
}

// Тестовый бой (для демонстрации)
function startTestBattle() {
    startBattle({
        name: 'Дикий Гоблин',
        hp: 20,
        stats: {
            stealth: 8,
            dodge: 12,
            physAtk: 7,
            physDef: 4,
            magAtk: 3,
            magDef: 3
        }
    });
}
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const livesElement = document.getElementById('lives');
const levelElement = document.getElementById('level');
const nextLevelElement = document.getElementById('nextLevel');
const startScreen = document.getElementById('startScreen');
const gameOverScreen = document.getElementById('gameOverScreen');
const finalScoreElement = document.getElementById('finalScore');
const startButton = document.getElementById('startButton');
const restartButton = document.getElementById('restartButton');
const joystickHandle = document.getElementById('joystickHandle');
const joystickBase = document.getElementById('joystickBase');
const fireButton = document.getElementById('fireButton');
const bossHealthBar = document.getElementById('bossHealthBar');
const bossHealthFill = document.getElementById('bossHealthFill');
const bossName = document.getElementById('bossName');
const bossWarning = document.getElementById('bossWarning');
const bossTimer = document.getElementById('bossTimer');
const bossTimeElement = document.getElementById('bossTime');
const levelUpMessage = document.getElementById('levelUp');
const lifeRegenTimer = document.getElementById('lifeRegenTimer');
const regenTimeElement = document.getElementById('regenTime');
const attackSpeedInfo = document.getElementById('attackSpeedInfo');
const fireRateElement = document.getElementById('fireRate');
const joystickModeToggle = document.getElementById('joystickModeToggle');
const autoFireToggle = document.getElementById('autoFireToggle');
const skillShield = document.getElementById('skillShield');
const skillRapid = document.getElementById('skillRapid');
const cooldownShield = document.getElementById('cooldownShield');
const cooldownRapid = document.getElementById('cooldownRapid');
const achievementNotification = document.getElementById('achievementNotification');
const achievementDesc = document.getElementById('achievementDesc');
const bossRedFlash = document.getElementById('bossRedFlash');
const multiBulletIndicator = document.getElementById('multiBulletIndicator');
const bulletLinesElement = document.getElementById('bulletLines');
const shieldActiveIndicator = document.getElementById('shieldActive');
const rapidActiveIndicator = document.getElementById('rapidActive');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();

let gameRunning = false;
let score = 0;
let lives = 3;
let level = 1;
let nextLevelScore = 100;
let enemySpawnInterval;
let bossSpawnInterval;
let gameLoopId;
let fireInterval;
let isFiring = false;
let fireRate = 200;
let bossActive = false;
let boss = null;
let bossBullets = [];
let bossAttackInterval;
let gameTime = 0;
let timeToNextBoss = 90;
let bossTimerInterval;
let timeToLifeRegen = 60;
let lifeRenTimerId;
let playerHitEffect = 0;
let particles = [];
let explosions = [];
let bulletLines = 1;
let achievements = {
    enemiesKilled: 0,
    survivalTime: 0,
    bossPerfectKill: false
};

let skills = {
    shield: {
        active: false,
        cooldown: 0,
        duration: 0,
        maxCooldown: 450,
        hits: 0
    },
    rapid: {
        active: false,
        cooldown: 0,
        duration: 0,
        maxCooldown: 600,
        originalFireRate: 0
    }
};

const player = {
    x: canvas.width / 2 - 20,
    y: canvas.height - 100,
    width: 40,
    height: 40,
    speed: 5,
    color: '#3498db',
    shield: false,
    invincible: false
};

const joystick = {
    isActive: false,
    baseX: 0,
    baseY: 0,
    handleX: 0,
    handleY: 0,
    maxRadius: 40,
    direction: { x: 0, y: 0 },
    deadZone: 5,
    followMode: false
};

const bosses = [
    {
        name: "毁灭者号",
        width: 150,
        height: 80,
        baseHealth: 50,
        color: '#e74c3c',
        attackSpeed: 1500,
        bulletSpeed: 4,
        baseScore: 500,
        specialAttack: function() {
            for (let i = -1; i <= 1; i++) {
                const dx = (player.x + player.width/2) - (this.x + this.width/2);
                const dy = (player.y + player.height/2) - (this.y + this.height/2);
                const angle = Math.atan2(dy, dx) + (i * 0.3);
                
                const speedX = Math.cos(angle) * this.bulletSpeed;
                const speedY = Math.sin(angle) * this.bulletSpeed;
                
                bossBullets.push({
                    x: this.x + this.width / 2 - 10,
                    y: this.y + this.height / 2 - 10,
                    width: 20,
                    height: 20,
                    speedX: speedX,
                    speedY: speedY,
                    color: '#e74c3c',
                    pulse: true
                });
            }
        }
    },
    {
        name: "死亡之翼",
        width: 180,
        height: 100,
        baseHealth: 70,
        color: '#9b59b6',
        attackSpeed: 1200,
        bulletSpeed: 5,
        baseScore: 700,
        minions: [],
        specialAttack: function() {
            if (this.minions.length < 2 && this.currentHealth < this.health / 2) {
                for (let i = 0; i < 2; i++) {
                    this.minions.push({
                        x: this.x + (i * 50) - 25,
                        y: this.y + this.height,
                        width: 30,
                        height: 30,
                        speed: 2,
                        color: '#3498db',
                        health: 10
                    });
                }
            }
            
            this.minions.forEach(minion => {
                const dx = (player.x + player.width/2) - (minion.x + minion.width/2);
                const dy = (player.y + player.height/2) - (minion.y + minion.height/2);
                const angle = Math.atan2(dy, dx);
                
                const speedX = Math.cos(angle) * this.bulletSpeed;
                const speedY = Math.sin(angle) * this.buletSpeed;
                
                bossBullets.push({
                    x: minion.x + minion.width / 2 - 10,
                    y: minion.y + minion.height / 2 - 10,
                    width: 20,
                    height: 20,
                    speedX: speedX,
                    speedY: speedY,
                    color: '#3498db',
                    pulse: false
                });
            });
        }
    },
    {
        name: "末日战舰",
        width: 200,
        height: 120,
        baseHealth: 100,
        color: '#3498db',
        attackSpeed: 1000,
        bulletSpeed: 6,
        baseScore: 1000,
        specialAttack: function() {
            if (Math.random() < 0.1) {
                bossBullets.push({
                    x: 0,
                    y: canvas.height / 2 - 50,
                    width: canvas.width,
                    height: 100,
                    speedX: 0,
                    speedY: 0,
                    color: 'rgba(231, 76, 60, 0.3)',
                    shockwave: true,
                    duration: 100
                });
            }
        }
    }
];

let bullets = [];
let enemies = [];
let starsNear = [];
let starsMid = [];
let starsFar = [];

function initStars() {
    starsNear = [];
    starsMid = [];
    starsFar = [];
    
    for (let i = 0; i < 50; i++) {
        starsNear.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2 + 1,
            speed: Math.random() * 0.8 + 0.5
        });
    }
    
    for (let i = 0; i < 70; i++) {
        starsMid.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 1.5 + 0.5,
            speed: Math.random() * 0.5 + 0.2
        });
    }
    
    for (let i = 0; i < 100; i++) {
        starsFar.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 1 + 0.2,
            speed: Math.random() * 0.2 + 0.1
        });
    }
}

function drawStars() {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    starsFar.forEach(star => {
        ctx.fillRect(star.x, star.y, star.size, star.size);
        star.y += star.speed;
        if (star.y > canvas.height) {
            star.y = 0;
            star.x = Math.random() * canvas.width;
        }
    });
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    starsMid.forEach(star => {
        ctx.fillRect(star.x, star.y, star.size, star.size);
        star.y += star.speed;
        if (star.y > canvas.height) {
            star.y = 0;
            star.x = Math.random() * canvas.width;
        }
    });
    
    ctx.fillStyle = 'white';
    starsNear.forEach(star => {
        ctx.fillRect(star.x, star.y, star.size, star.size);
        star.y += star.speed;
        if (star.y > canvas.height) {
            star.y = 0;
            star.x = Math.random() * canvas.width;
        }
    });
}

function initGame() {
    score = 0;
    lives = 3;
    level = 1;
    nextLevelScore = 100;
    fireRate = 200;
    bulletLines = 1;
    bullets = [];
    enemies = [];
    bossBullets = [];
    particles = [];
    explosions = [];
    achievements = {
        enemiesKilled: 0,
        survivalTime: 0,
        bossPerfectKill: false
    };
    
    skills = {
        shield: { active: false, cooldown: 0, duration: 0, maxCooldown: 450, hits: 0 },
        rapid: { active: false, cooldown: 0, duration: 0, maxCooldown: 600, originalFireRate: 0 }
    };
    
    updateUI();
    gameRunning = true;
    bossActive = false;
    startScreen.style.display = 'none';
    gameOverScreen.style.display = 'none';
    bossHealthBar.style.display = 'none';
    bossName.style.display = 'none';
    bossTimer.style.display = 'block';
    lifeRegenTimer.style.display = 'block';
    attackSpeedInfo.style.display = 'block';
    multiBulletIndicator.style.display = 'block';
    fireRateElement.textContent = fireRate;
    bulletLinesElement.textContent = bulletLines;
    
    player.x = canvas.width / 2 - player.width / 2;
    player.y = canvas.height - 100;
    player.shield = false;
    player.invincible = false;
    playerHitEffect = 0;
    
    resetJoystick();
    
    initStars();
    
    joystick.followMode = !joystickModeToggle.checked;
    
    if (autoFireToggle.checked) {
        startFiring();
    }
    
    enemySpawnInterval = setInterval(spawnEnemy, 2000);
    
    updateBossTimer();
    bossTimerInterval = setInterval(updateBossTimer, 1000);
    
    bossSpawnInterval = setTimeout(() => {
        if (!bossActive) {
            spawnBoss();
        }
    }, timeToNextBoss * 1000);
    
    updateLifeRegenTimer();
    lifeRegenTimerId = setInterval(updateLifeRegenTimer, 1000);
    
    gameLoopId = requestAnimationFrame(gameLoop);
}

function updateBossTimer() {
    if (!gameRunning || bossActive) return;
    
    timeToNextBoss--;
    bossTimeElement.textContent = timeToNextBoss;
    
    if (timeToNextBoss <= 0) {
        timeToNextBoss = 90;
    }
}

function updateLifeRegenTimer() {
    if (!gameRunning || lives >= 3) {
        lifeRegenTimer.style.display = 'none';
        return;
    }
    
    timeToLifeRegen--;
    regenTimeElement.textContent = timeToLifeRegen;
    
    if (timeToLifeRegen <= 0) {
        lives = Math.min(3, lives + 1);
        timeToLifeRegen = 60;
        updateUI();
        showLifeRegen();
    }
}

function showLifeRegen() {
    const regenMsg = document.createElement('div');
    regenMsg.textContent = '生命值 +1';
    regenMsg.style.position = 'absolute';
    regenMsg.style.top = '50%';
    regenMsg.style.left = '50%';
    regenMsg.style.transform = 'translate(-50%, -50%)';
    regenMsg.style.color = '#2ecc71';
    regenMsg.style.fontSize = '24px';
    regenMsg.style.textShadow = '0 0 5px #000';
    regenMsg.style.animation = 'fadeOut 2s forwards';
    regenMsg.style.zIndex = '15';
    
    document.getElementById('gameContainer').appendChild(regenMsg);
    
    setTimeout(() => {
        regenMsg.remove();
    }, 2000);
}

function resetJoystick() {
    joystickHandle.style.transform = 'translate(0px, 0px)';
    joystick.direction = { x: 0, y: 0 };
}

function spawnBoss() {
    if (!gameRunning || bossActive) return;
    
    bossWarning.style.display = 'block';
    bossRedFlash.style.display = 'block';
    
    setTimeout(() => {
        bossRedFlash.style.display = 'none';
    }, 3000);
    
    setTimeout(() => {
        bossWarning.style.display = 'none';
        
        clearInterval(enemySpawnInterval);
        
        enemies = [];
        
        const bossType = bosses[Math.floor(Math.random() * bosses.length)];
        
        const healthMultiplier = 1 + (level * 0.5);
        const scoreMultiplier = 1 + (level * 0.2);
        
        boss = {
            ...bossType,
            x: canvas.width / 2 - bossType.width / 2,
            y: 50,
            currentHealth: Math.floor(bossType.baseHealth * healthMultiplier),
            health: Math.floor(bossType.baseHealth * healthMultiplier),
            score: Math.floor(bossType.baseScore * scoreMultiplier),
            minions: []
        };
        
        bossHealthBar.style.display = 'block';
        bossName.style.display = 'block';
        bossName.textContent = boss.name;
        updateBossHealth();
        
        bossTimer.style.display = 'none';
        
        bossAttackInterval = setInterval(() => {
            bossAttack();
            if (boss.specialAttack) boss.specialAttack();
        }, boss.attackSpeed);
        
        bossActive = true;
        achievements.bossPerfectKill = true;
        
    }, 3000);
}

function bossAttack() {
    if (!boss || !gameRunning) return;
    
    const dx = (player.x + player.width/2) - (boss.x + boss.width/2);
    const dy = (player.y + player.height/2) - (boss.y + boss.height/2);
    const angle = Math.atan2(dy, dx);
    
    const speedX = Math.cos(angle) * boss.bulletSpeed;
    const speedY = Math.sin(angle) * boss.bulletSpeed;
    
    bossBullets.push({
        x: boss.x + boss.width / 2 - 10,
        y: boss.y + boss.height / 2 - 10,
        width: 20,
        height: 20,
        speedX: speedX,
        speedY: speedY,
        color: '#e74c3c',
        pulse: true
    });
}

function updateBossHealth() {
    if (!boss) return;
    
    const healthPercent = (boss.currentHealth / boss.health) * 100;
    bossHealthFill.style.width = `${healthPercent}%`;
    
    if (healthPercent < 30) {
        bossHealthFill.classList.add('low-health');
    } else {
        bossHealthFill.classList.remove('low-health');
    }
}

function showLevelUp() {
    levelUpMessage.style.display = 'block';
    setTimeout(() => {
        levelUpMessage.style.display = 'none';
    }, 1500);
}

function fireBullet() {
    if (!gameRunning) return;
    
    for (let i = 0; i < bulletLines; i++) {
        let offsetX = 0;
        if (bulletLines > 1) {
            const spacing = 10;
            const totalWidth = (bulletLines - 1) * spacing;
            offsetX = (i * spacing) - (totalWidth / 2);
        }
        
        bullets.push({
            x: player.x + player.width / 2 - 3 + offsetX,
            y: player.y,
            width: 6,
            height: 15,
            speed: 12,
            color: '#f1c40f'
        });
        
        for (let j = 0; j < 3; j++) {
            particles.push({
                x: player.x + player.width / 2 + offsetX,
                y: player.y,
                size: Math.random() * 2 + 1,
                speedX: (Math.random() - 0.5) * 3,
                speedY: -Math.random() * 4 - 2,
                color: '#f1c40f',
                life: 15
            });
        }
    }
}

function startFiring() {
    if (!isFiring) {
        isFiring = true;
        fireBullet();
        fireInterval = setInterval(fireBullet, fireRate);
    }
}

function stopFiring() {
    if (isFiring) {
        isFiring = false;
        clearInterval(fireInterval);
    }
}

function checkLevelUp() {
    if (score >= nextLevelScore) {
        level++;
        
        let multiplier = 1.5;
        if (level > 5 && level <= 10) multiplier = 1.4;
        if (level > 10) multiplier = 1.3;
        
        nextLevelScore = Math.floor(nextLevelScore * multiplier);
        
        fireRate = Math.max(100, fireRate - 20);
        fireRateElement.textContent = fireRate;
        
        if (level % 3 === 0 && bulletLines < 5) {
            bulletLines++;
            bulletLinesElement.textContent = bulletLines;
            
            const bulletUpMsg = document.createElement('div');
            bulletUpMsg.textContent = `弹道+1 (${bulletLines}条)`;
            bulletUpMsg.style.position = 'absolute';
            bulletUpMsg.style.top = '60%';
            bulletUpMsg.style.left = '50%';
            bulletUpMsg.style.transform = 'translate(-50%, -50%)';
            bulletUpMsg.style.color = '#f1c40f';
            bulletUpMsg.style.fontSize = '24px';
            bulletUpMsg.style.textShadow = '0 0 5px #000';
            bulletUpMsg.style.animation = 'fadeOut 2s forwards';
            bulletUpMsg.style.zIndex = '15';
            
            document.getElementById('gameContainer').appendChild(bulletUpMsg);
            
            setTimeout(() => {
                bulletUpMsg.remove();
            }, 2000);
        }
        
        if (isFiring) {
            clearInterval(fireInterval);
            fireInterval = setInterval(fireBullet, fireRate);
        }
        
        showLevelUp();
        
        updateUI();
    }
}

function showAchievement(title, description) {
    achievementDesc.textContent = description;
    achievementNotification.style.display = 'block';
    
    setTimeout(() => {
        achievementNotification.style.display = 'none';
    }, 3000);
}

function createExplosion(x, y, size, color) {
    explosions.push({
        x: x,
        y: y,
        size: size,
        color: color,
        life: 100
    });
    
    for (let i = 0; i < 15; i++) {
        particles.push({
            x: x,
            y: y,
            size: Math.random() * 4 + 2,
            speedX: (Math.random() - 0.5) * 8,
            speedY: (Math.random() - 0.5) * 8,
            color: color,
            life: 30
        });
    }
}

function gameLoop(timestamp) {
    if (!gameRunning) return;
    
    gameTime += 16;
    achievements.survivalTime = Math.floor(gameTime / 1000);
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    drawStars();
    
    updateExplosions();
    drawExplosions();
    
    updateParticles();
    drawParticles();
    
    if (!player.invincible || Math.floor(gameTime / 100) % 2 === 0) {
        updatePlayer();
        drawPlayer();
    }
    
    updateBullets();
    drawBullets();
    
    updateEnemies();
    drawEnemies();
    
    if (bossActive) {
        drawBoss();
        updateBossBullets();
        drawBossBullets();
        
        if (boss.minions) {
            updateMinions();
            drawMinions();
        }
    }
    
    checkCollisions();
    
    checkLevelUp();
    
    updateSkills();
    
    checkAchievements();
    
    gameLoopId = requestAnimationFrame(gameLoop);
}

function updatePlayer() {
    if (joystick.isActive) {
        player.x += joystick.direction.x * player.speed;
        player.y += joystick.direction.y * player.speed;
        
        player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));
        player.y = Math.max(0, Math.min(canvas.height - player.height, player.y));
    }
    
    if (playerHitEffect > 0) {
        playerHitEffect--;
    }
}

function drawPlayer() {
    if (player.invincible && Math.floor(gameTime / 100) % 2 === 0) {
        return;
    }
    
    if (skills.shield.active) {
        ctx.beginPath();
        ctx.arc(player.x + player.width/2, player.y + player.height/2, player.width/1.5, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(52, 152, 219, 0.7)';
        ctx.lineWidth = 3;
        ctx.stroke();
    }
    
    if (playerHitEffect > 0) {
        ctx.fillStyle = `rgba(231, 76, 60, ${0.3 + (playerHitEffect/10)})`;
    } else {
        ctx.fillStyle = player.color;
    }
    
    ctx.beginPath();
    ctx.moveTo(player.x + player.width / 2, player.y);
    ctx.lineTo(player.x, player.y + player.height);
    ctx.lineTo(player.x + player.width, player.y + player.height);
    ctx.closePath();
    ctx.fill();
    
    if (joystick.isActive) {
        const flameLength = 15 + Math.abs(joystick.direction.y) * 10;
        ctx.fillStyle = '#e74c3c';
        ctx.beginPath();
        ctx.moveTo(player.x + player.width / 2 - 8, player.y + player.height);
        ctx.lineTo(player.x + player.width / 2 + 8, player.y + player.height);
        ctx.lineTo(player.x + player.width / 2, player.y + player.height + flameLength);
        ctx.closePath();
        ctx.fill();
        
        if (Math.random() < 0.3) {
            particles.push({
                x: player.x + player.width / 2,
                y: player.y + player.height + flameLength,
                size: Math.random() * 3 + 1,
                speedX: (Math.random() - 0.5) * 2,
                speedY: Math.random() * 3 + 2,
                color: `hsl(${Math.random() * 20 + 20}, 100%, 50%)`,
                life: 20
            });
        }
    }
}

function updateBullets() {
    for (let i = bullets.length - 1; i >= 0; i--) {
        bullets[i].y -= bullets[i].speed;
        
        if (bullets[i].y < -10) {
            bullets.splice(i, 1);
        }
    }
}

function drawBullets() {
    bullets.forEach(bullet => {
        ctx.fillStyle = bullet.color;
        ctx.beginPath();
        ctx.arc(bullet.x + bullet.width/2, bullet.y + bullet.height/2, bullet.width * 1.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'white';
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });
}

function spawnEnemy() {
    if (!gameRunning || bossActive) return;
    
    const enemyType = Math.random() > 0.7 ? (Math.random() > 0.5 ? 'fast' : 'split') : 'normal';
    let enemySize, enemySpeed, enemyHealth, enemyScore;

    const speedMultiplier = 1 + (level * 0.1);
    const healthMultiplier = 1 + (level * 0.5);
    const scoreMultiplier = 1 + (level * 0.1);

    switch (enemyType) {
        case 'fast':
            enemySize = 20;
            enemySpeed = 3 * speedMultiplier;
            enemyHealth = 1;
            enemyScore = 25 * scoreMultiplier;
            break;
        case 'split':
            enemySize = 40;
            enemySpeed = 1.5 * speedMultiplier;
            enemyHealth = 2 * healthMultiplier;
            enemyScore = 20 * scoreMultiplier;
            break;
        default:
            enemySize = 30 + Math.random() * 20;
            enemySpeed = (1 + Math.random()) * speedMultiplier;
            enemyHealth = Math.max(1, Math.floor((level > 3 ? 2 : 1) * healthMultiplier));
            enemyScore = Math.floor(15 * scoreMultiplier);
    }

    enemies.push({
        x: Math.random() * (canvas.width - enemySize),
        y: -enemySize,
        width: enemySize,
        height: enemySize,
        speed: enemySpeed,
        color: `hsl(${Math.random() * 60}, 70%, 50%)`,
        maxHealth: enemyHealth,
        health: enemyHealth,
        score: Math.floor(enemyScore),
        type: enemyType
    });
}

function updateEnemies() {
    for (let i = enemies.length - 1; i >= 0; i--) {
        enemies[i].y += enemies[i].speed;
        
        if (enemies[i].y > canvas.height) {
            enemies.splice(i, 1);
            lives--;
            updateUI();
            
            if (lives <= 0) {
                gameOver();
            }
        }
    }
}

function drawEnemies() {
    enemies.forEach(enemy => {
        ctx.fillStyle = enemy.color;
        
        switch(enemy.type) {
            case 'fast':
                ctx.beginPath();
                ctx.moveTo(enemy.x + enemy.width/2, enemy.y);
                ctx.lineTo(enemy.x, enemy.y + enemy.height);
                ctx.lineTo(enemy.x + enemy.width, enemy.y + enemy.height);
                ctx.closePath();
                ctx.fill();
                break;
            case 'split':
                ctx.beginPath();
                const centerX = enemy.x + enemy.width/2;
                const centerY = enemy.y + enemy.height/2;
                const radius = enemy.width/2;
                for (let i = 0; i < 6; i++) {
                    const angle = i * (Math.PI * 2 / 6);
                    const x = centerX + Math.cos(angle) * radius;
                    const y = centerY + Math.sin(angle) * radius;
                    if (i === 0) {
                        ctx.moveTo(x, y);
                    } else {
                        ctx.lineTo(x, y);
                    }
                }
                ctx.closePath();
                ctx.fill();
                break;
            default:
                ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
        }

        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.fillRect(enemy.x, enemy.y - 15, enemy.width, 6);

        const healthPercent = (enemy.health / enemy.maxHealth) * 100;
        ctx.fillStyle = '#2ecc71';
        ctx.fillRect(enemy.x, enemy.y - 15, enemy.width * (healthPercent / 100), 6);

        ctx.font = '10px Arial';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.fillText(`${Math.round(healthPercent)}%`, enemy.x + enemy.width / 2, enemy.y - 17);
    });
}

function updateMinions() {
    for (let i = boss.minions.length - 1; i >= 0; i--) {
        const minion = boss.minions[i];
        
        minion.x = boss.x + (i * 50) - 25;
        minion.y = boss.y + boss.height;

        for (let j = bullets.length - 1; j >= 0; j--) {
            if (isColliding(bullets[j], minion)) {
                minion.health--;
                bullets.splice(j, 1);
                
                if (minion.health <= 0) {
                    boss.minions.splice(i, 1);
                    createExplosion(minion.x + minion.width/2, minion.y + minion.height/2, 30, '#3498db');
                    score += 50;
                    updateUI();
                }
                break;
            }
        }
    }
}

function drawMinions() {
    boss.minions.forEach(minion => {
        ctx.fillStyle = minion.color;
        ctx.beginPath();
        ctx.arc(minion.x + minion.width/2, minion.y + minion.height/2, minion.width/2, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.fillRect(minion.x, minion.y - 10, minion.width, 4);

        ctx.fillStyle = '#3498db';
        ctx.fillRect(minion.x, minion.y - 10, minion.width * (minion.health / 10), 4);
    });
}

function drawBoss() {
    if (!boss) return;
    
    ctx.fillStyle = boss.color;
    ctx.beginPath();
    ctx.moveTo(boss.x, boss.y + boss.height / 2);
    ctx.lineTo(boss.x + boss.width / 2, boss.y);
    ctx.lineTo(boss.x + boss.width, boss.y + boss.height / 2);
    ctx.lineTo(boss.x + boss.width / 2, boss.y + boss.height);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#000';
    ctx.fillRect(boss.x + boss.width / 2 - 15, boss.y + boss.height / 2 - 5, 30, 10);

    if (boss.damageTaken > 0) {
        const damagePopup = document.createElement('div');
        damagePopup.className = 'damage-popup';
        damagePopup.textContent = `-${boss.damageTaken}`;
        damagePopup.style.left = `${boss.x + boss.width/2}px`;
        damagePopup.style.top = `${boss.y - 20}px`;
        document.getElementById('gameContainer').appendChild(damagePopup);
        
        setTimeout(() => {
            damagePopup.remove();
        }, 1000);
        
        boss.damageTaken = 0;
    }
}

function updateBossBullets() {
    for (let i = bossBullets.length - 1; i >= 0; i--) {
        const bullet = bossBullets[i];
        
        if (bullet.shockwave) {
            bullet.duration--;
            if (bullet.duration <= 0) {
                bossBullets.splice(i, 1);
                
                if (isColliding(player, bullet)) {
                    lives--;
                    updateUI();
                    playerHitEffect = 10;
                    
                    if (lives <= 0) {
                        gameOver();
                    }
                }
            }
            continue;
        }

        bullet.x += bullet.speedX;
        bullet.y += bullet.speedY;

        if (bullet.x < -20 || bullet.x > canvas.width + 20 ||
            bullet.y < -20 || bullet.y > canvas.height + 20) {
            bossBullets.splice(i, 1);
        }
    }
}

function drawBossBullets() {
    bossBullets.forEach(bullet => {
        if (bullet.shockwave) {
            ctx.fillStyle = bullet.color;
            ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
            return;
        }
        
        if (bullet.pulse) {
            const pulseSize = 5 + Math.sin(Date.now() / 100) * 3;
            ctx.fillStyle = bullet.color;
            ctx.beginPath();
            ctx.arc(bullet.x + bullet.width/2, bullet.y + bullet.height/2, bullet.width/2 + pulseSize, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.fillStyle = 'white';
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });
}

function updateExplosions() {
    for (let i = explosions.length - 1; i >= 0; i--) {
        explosions[i].life -= 2;

        if (explosions[i].life <= 0) {
            explosions.splice(i, 1);
        }
    }
}

function drawExplosions() {
    explosions.forEach(explosion => {
        const gradient = ctx.createRadialGradient(
            explosion.x, explosion.y, 0,
            explosion.x, explosion.y, explosion.size
        );

        gradient.addColorStop(0, explosion.color);
        gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(explosion.x, explosion.y, explosion.size * (explosion.life / 100), 0, Math.PI * 2);
        ctx.fill();
    });
}

function updateParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].x += particles[i].speedX;
        particles[i].y += particles[i].speedY;
        particles[i].life--;
        
        if (particles[i].life <= 0) {
            particles.splice(i, 1);
        }
    }
}

function drawParticles() {
    particles.forEach(particle => {
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
    });
}

function isColliding(obj1, obj2) {
    return obj1.x < obj2.x + obj2.width &&
           obj1.x + obj1.width > obj2.x &&
           obj1.y < obj2.y + obj2.height &&
           obj1.y + obj1.height > obj2.y;
}

function checkCollisions() {
    for (let i = bullets.length - 1; i >= 0; i--) {
        for (let j = enemies.length - 1; j >= 0; j--) {
            if (isColliding(bullets[i], enemies[j])) {
                enemies[j].health--;
                
                const damagePopup = document.createElement('div');
                damagePopup.className = 'damage-popup';
                damagePopup.textContent = '-1';
                damagePopup.style.left = `${enemies[j].x + enemies[j].width/2}px`;
                damagePopup.style.top = `${enemies[j].y - 10}px`;
                document.getElementById('gameContainer').appendChild(damagePopup);

                setTimeout(() => {
                    damagePopup.remove();
                }, 1000);

                if (enemies[j].health <= 0) {
                    score += enemies[j].score;
                    achievements.enemiesKilled++;
                    
                    createExplosion(
                        enemies[j].x + enemies[j].width/2, 
                        enemies[j].y + enemies[j].height/2, 
                        enemies[j].width, 
                        enemies[j].color
                    );
                    
                    if (enemies[j].type === 'split' && enemies[j].width > 20) {
                        for (let k = 0; k < 2; k++) {
                            enemies.push({
                                x: enemies[j].x + (k * 20) - 10,
                                y: enemies[j].y,
                                width: enemies[j].width / 2,
                                height: enemies[j].height / 2,
                                speed: enemies[j].speed * 1.2,
                                color: enemies[j].color,
                                maxHealth: 1,
                                health: 1,
                                score: Math.floor(enemies[j].score * 0.7),
                                type: 'split'
                            });
                        }
                    }
                    
                    enemies.splice(j, 1);
                }

                bullets.splice(i, 1);
                break;
            }
        }

        if (bossActive && boss && isColliding(bullets[i], boss)) {
            boss.currentHealth--;
            boss.damageTaken = (boss.damageTaken || 0) + 1;
            updateBossHealth();

            for (let k = 0; k < 5; k++) {
                particles.push({
                    x: bullets[i].x + bullets[i].width/2,
                    y: bullets[i].y + bullets[i].height/2,
                    size: Math.random() * 3 + 1,
                    speedX: (Math.random() - 0.5) * 3,
                    speedY: (Math.random() - 0.5) * 3,
                    color: '#e74c3c',
                    life: 20
                });
            }

            bullets.splice(i, 1);

            if (boss.currentHealth <= 0) {
                score += boss.score;

                createExplosion(
                    boss.x + boss.width/2,
                    boss.y + boss.height/2,
                    100,
                    boss.color
                );

                bossHealthBar.style.display = 'none';
                bossName.style.display = 'none';

                clearInterval(bossAttackInterval);

                bossBullets = [];

                enemySpawnInterval = setInterval(spawnEnemy, 2000);

                timeToNextBoss = 90;
                bossTimer.style.display = 'block';
                bossTimeElement.textContent = timeToNextBoss;

                bossSpawnInterval = setTimeout(() => {
                    if (!bossActive) {
                        spawnBoss();
                    }
                }, timeToNextBoss * 1000);

                bossActive = false;
                boss = null;
            }

            updateUI();
            break;
        }
    }

    for (let i = enemies.length - 1; i >= 0; i--) {
        if (isColliding(player, enemies[i])) {
            enemies.splice(i, 1);

            if (skills.shield.active) {
                skills.shield.hits++;

                for (let j = 0; j < 10; j++) {
                    particles.push({
                        x: player.x + player.width/2,
                        y: player.y + player.height/2,
                        size: Math.random() * 3 + 2,
                        speedX: (Math.random() - 0.5) * 5,
                        speedY: (Math.random() - 0.5) * 5,
                        color: '#3498db',
                        life: 20
                    });
                }

                if (skills.shield.hits >= 3) {
                    skills.shield.active = false;
                    skills.shield.cooldown = skills.shield.maxCooldown;
                    player.shield = false;
                    shieldActiveIndicator.style.display = 'none';
                    
                    createExplosion(
                        player.x + player.width/2,
                        player.y + player.height/2,
                        50,
                        '#3498db'
                    );
                }
            } else {
                lives--;
                playerHitEffect = 10;

                createExplosion(
                    player.x + player.width/2,
                    player.y + player.height/2,
                    40,
                    '#e74c3c'
                );

                if ('vibrate' in navigator) {
                    navigator.vibrate(200);
                }

                updateUI();

                if (lives <= 0) {
                    gameOver();
                } else {
                    player.invincible = true;
                    setTimeout(() => {
                        player.invincible = false;
                    }, 1000);
                }
            }
            break;
        }
    }

    for (let i = bossBullets.length - 1; i >= 0; i--) {
        if (isColliding(player, bossBullets[i])) {
            bossBullets.splice(i, 1);

            if (skills.shield.active) {
                skills.shield.hits++;

                for (let j = 0; j < 10; j++) {
                    particles.push({
                        x: player.x + player.width/2,
                        y: player.y + player.height/2,
                        size: Math.random() * 3 + 2,
                        speedX: (Math.random() - 0.5) * 5,
                        speedY: (Math.random() - 0.5) * 5,
                        color: '#3498db',
                        life: 20
                    });
                }

                if (skills.shield.hits >= 3) {
                    skills.shield.active = false;
                    skills.shield.cooldown = skills.shield.maxCooldown;
                    player.shield = false;
                    shieldActiveIndicator.style.display = 'none';
                    
                    createExplosion(
                        player.x + player.width/2,
                        player.y + player.height/2,
                        50,
                        '#3498db'
                    );
                }
            } else {
                lives--;
                playerHitEffect = 10;

                createExplosion(
                    player.x + player.width/2,
                    player.y + player.height/2,
                    40,
                    '#e74c3c'
                );

                if ('vibrate' in navigator) {
                    navigator.vibrate(200);
                }

                updateUI();

                if (lives <= 0) {
                    gameOver();
                } else {
                    player.invincible = true;
                    setTimeout(() => {
                        player.invincible = false;
                    }, 1000);
                }
            }
            break;
        }
    }
}

function updateSkills() {
    if (skills.shield.active) {
        skills.shield.duration--;
        shieldActiveIndicator.style.display = 'block';
        
        if (skills.shield.duration <= 0 || skills.shield.hits >= 3) {
            skills.shield.active = false;
            skills.shield.cooldown = skills.shield.maxCooldown;
            player.shield = false;
            shieldActiveIndicator.style.display = 'none';
        }
    } else if (skills.shield.cooldown > 0) {
        skills.shield.cooldown--;
        cooldownShield.textContent = Math.ceil(skills.shield.cooldown / 60);
        cooldownShield.style.display = 'flex';
    } else {
        cooldownShield.style.display = 'none';
    }

    if (skills.rapid.active) {
        skills.rapid.duration--;
        rapidActiveIndicator.style.display = 'block';

        if (skills.rapid.duration <= 0) {
            skills.rapid.active = false;
            skills.rapid.cooldown = skills.rapid.maxCooldown;
            fireRate = skills.rapid.originalFireRate;
            fireRateElement.textContent = fireRate;
            rapidActiveIndicator.style.display = 'none';
            
            if (isFiring) {
                clearInterval(fireInterval);
                fireInterval = setInterval(fireBullet, fireRate);
            }
        }
    } else if (skills.rapid.cooldown > 0) {
        skills.rapid.cooldown--;
        cooldownRapid.textContent = Math.ceil(skills.rapid.cooldown / 60);
        cooldownRapid.style.display = 'flex';
    } else {
        cooldownRapid.style.display = 'none';
    }
}

function checkAchievements() {
    if (achievements.enemiesKilled >= 100) {
        showAchievement("百人斩", "击败100个敌人!");
        achievements.enemiesKilled = -999;
    }
    
    if (achievements.survivalTime >= 300) {
        showAchievement("生存专家", "存活5分钟!");
        achievements.survivalTime = -999;
    }

    if (bossActive === false && achievements.bossPerfectKill) {
        showAchievement("完美击杀", "无伤击败BOSS!");
        achievements.bossPerfectKill = false;
    }
}

function updateUI() {
    scoreElement.textContent = score;
    livesElement.textContent = lives;
    levelElement.textContent = level;
    nextLevelElement.textContent = nextLevelScore;
    fireRateElement.textContent = fireRate;
    
    if (lives < 3) {
        lifeRegenTimer.style.display = 'block';
    } else {
        lifeRegenTimer.style.display = 'none';
    }
}

function gameOver() {
    gameRunning = false;
    clearInterval(enemySpawnInterval);
    clearInterval(bossTimerInterval);
    clearInterval(lifeRegenTimerId);
    if (bossSpawnInterval) clearTimeout(bossSpawnInterval);
    if (bossAttackInterval) clearInterval(bossAttackInterval);
    stopFiring();
    cancelAnimationFrame(gameLoopId);
    
    finalScoreElement.textContent = score;
    gameOverScreen.style.display = 'flex';

    createExplosion(
        player.x + player.width/2,
        player.y + player.height/2,
        80,
        '#e74c3c'
    );

    if ('vibrate' in navigator) {
        navigator.vibrate([100, 50, 100]);
    }
}

function setupJoystick() {
    const joystickArea = document.getElementById('joystickArea');
    const baseRect = joystickBase.getBoundingClientRect();
    
    joystick.baseX = baseRect.left + baseRect.width / 2;
    joystick.baseY = baseRect.top + baseRect.height / 2;

    joystickArea.addEventListener('touchstart', handleTouchStart);
    joystickArea.addEventListener('touchmove', handleTouchMove);
    joystickArea.addEventListener('touchend', handleTouchEnd);

    joystickArea.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
}

function handleTouchStart(e) {
    e.preventDefault();
    joystick.isActive = true;
    
    if (joystick.followMode) {
        const touch = e.touches[0];
        const rect = joystickArea.getBoundingClientRect();
        joystick.baseX = touch.clientX;
        joystick.baseY = touch.clientY;
        
        joystick.baseX = Math.max(rect.left + 40, Math.min(rect.right - 40, joystick.baseX));
        joystick.baseY = Math.max(rect.top + 40, Math.min(rect.bottom - 40, joystick.baseY));
        
        joystickBase.style.left = `${joystick.baseX - rect.left - 40}px`;
        joystickBase.style.top = `${joystick.baseY - rect.top - 40}px`;
    }

    updateJoystickPosition(e.touches[0].clientX, e.touches[0].clientY);
}

function handleTouchMove(e) {
    e.preventDefault();
    if (joystick.isActive) {
        updateJoystickPosition(e.touches[0].clientX, e.touches[0].clientY);
    }
}

function handleTouchEnd() {
    joystick.isActive = false;
    resetJoystick();
}

function handleMouseDown(e) {
    joystick.isActive = true;
    updateJoystickPosition(e.clientX, e.clientY);
}

function handleMouseMove(e) {
    if (joystick.isActive) {
        updateJoystickPosition(e.clientX, e.clientY);
    }
}

function handleMouseUp() {
    joystick.isActive = false;
    resetJoystick();
}

function updateJoystickPosition(clientX, clientY) {
    const dx = clientX - joystick.baseX;
    const dy = clientY - joystick.baseY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance < joystick.deadZone) {
        joystickHandle.style.transform = 'translate(0px, 0px)';
        joystick.direction = { x: 0, y: 0 };
        return;
    }

    if (distance > joystick.maxRadius) {
        const angle = Math.atan2(dy, dx);
        const limitedX = Math.cos(angle) * joystick.maxRadius;
        const limitedY = Math.sin(angle) * joystick.maxRadius;
        
        joystickHandle.style.transform = `translate(${limitedX}px, ${limitedY}px)`;
        joystick.direction.x = limitedX / joystick.maxRadius;
        joystick.direction.y = limitedY / joystick.maxRadius;
    } else {
        joystickHandle.style.transform = `translate(${dx}px, ${dy}px)`;
        joystick.direction.x = dx / joystick.maxRadius;
        joystick.direction.y = dy / joystick.maxRadius;
    }
}

function setupFireButton() {
    fireButton.addEventListener('touchstart', (e) => {
        e.preventDefault();
        if (!autoFireToggle.checked) {
            startFiring();
        }
    });
    
    fireButton.addEventListener('touchend', (e) => {
        e.preventDefault();
        if (!autoFireToggle.checked) {
            stopFiring();
        }
    });

    fireButton.addEventListener('touchcancel', (e) => {
        e.preventDefault();
        if (!autoFireToggle.checked) {
            stopFiring();
        }
    });

    fireButton.addEventListener('mousedown', () => {
        if (!autoFireToggle.checked) {
            startFiring();
        }
    });

    fireButton.addEventListener('mouseup', () => {
        if (!autoFireToggle.checked) {
            stopFiring();
        }
    });

    fireButton.addEventListener('mouseleave', () => {
        if (!autoFireToggle.checked) {
            stopFiring();
        }
    });
}

function setupSkillButtons() {
    skillShield.addEventListener('touchstart', (e) => {
        e.preventDefault();
        if (!skills.shield.active && skills.shield.cooldown <= 0) {
            activateShield();
        }
    });
    
    skillShield.addEventListener('mousedown', () => {
        if (!skills.shield.active && skills.shield.cooldown <= 0) {
            activateShield();
        }
    });

    skillRapid.addEventListener('touchstart', (e) => {
        e.preventDefault();
        if (!skills.rapid.active && skills.rapid.cooldown <= 0) {
            activateRapidFire();
        }
    });

    skillRapid.addEventListener('mousedown', () => {
        if (!skills.rapid.active && skills.rapid.cooldown <= 0) {
            activateRapidFire();
        }
    });
}

function activateShield() {
    skills.shield.active = true;
    skills.shield.duration = 200;
    skills.shield.hits = 0;
    player.shield = true;
    
    for (let i = 0; i < 30; i++) {
        particles.push({
            x: player.x + player.width/2,
            y: player.y + player.height/2,
            size: Math.random() * 3 + 2,
            speedX: (Math.random() - 0.5) * 4,
            speedY: (Math.random() - 0.5) * 4,
            color: '#3498db',
            life: 30
        });
    }
}

function activateRapidFire() {
    skills.rapid.active = true;
    skills.rapid.duration = 120;
    skills.rapid.originalFireRate = fireRate;
    fireRate = Math.max(50, fireRate / 3);
    fireRateElement.textContent = fireRate;
    
    for (let i = 0; i < 20; i++) {
        particles.push({
            x: player.x + player.width/2,
            y: player.y,
            size: Math.random() * 2 + 1,
            speedX: (Math.random() - 0.5) * 3,
            speedY: -Math.random() * 8 - 4,
            color: '#f1c40f',
            life: 20
        });
    }

    if (isFiring) {
        clearInterval(fireInterval);
        fireInterval = setInterval(fireBullet, fireRate);
    }
}

function initEventListeners() {
    setupJoystick();
    setupFireButton();
    setupSkillButtons();
    
    startButton.addEventListener('click', initGame);
    restartButton.addEventListener('click', initGame);

    window.addEventListener('resize', () => {
        resizeCanvas();
        
        player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));
        player.y = Math.max(0, Math.min(canvas.height - player.height, player.y));
    });

    joystickModeToggle.addEventListener('change', () => {
        joystick.followMode = !joystickModeToggle.checked;
    });

    autoFireToggle.addEventListener('change', () => {
        if (!autoFireToggle.checked && isFiring) {
            stopFiring();
        } else if (autoFireToggle.checked && gameRunning) {
            startFiring();
        }
    });
}

initEventListeners();
initStars();

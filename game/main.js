/* Mouse Bro - Super Cheese Adventure
 * HTML5 Canvas + vanilla JS platformer engine
 *
 * Loads sprite PNGs, builds tilemap from level.js, simulates physics
 * (gravity, AABB collisions, jumping), spawns enemies/coins, scrolls
 * the camera, and renders pixel-art crisp.
 */

(() => {
'use strict';

// ----------------------------------------------------------------------
// Asset loader
// ----------------------------------------------------------------------
const SPRITE_DIR = '../assets/sprites/';
const SPRITES = {};
const SPRITE_LIST = [
    'player_idle_1', 'player_idle_2_blink', 'player_idle_3_tail', 'player_idle_4_tail',
    'player_walk_1', 'player_walk_2', 'player_jump', 'player_hurt',
    'enemy_walk_1', 'enemy_walk_2', 'enemy_squash',
    'coin_1', 'coin_2', 'coin_3', 'coin_4',
    'brick', 'question_block', 'used_block', 'pipe_top', 'pipe_body', 'flag',
    'cloud', 'hill', 'bush', 'ground',
];

function loadSprites() {
    return Promise.all(SPRITE_LIST.map(name => new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => { SPRITES[name] = img; resolve(); };
        img.onerror = () => reject(new Error('Failed to load ' + name));
        img.src = SPRITE_DIR + name + '.png';
    })));
}

// ----------------------------------------------------------------------
// World / Constants
// ----------------------------------------------------------------------
const VIEW_W = 960;
const VIEW_H = 540;
const GRAVITY = 0.55;
const MAX_FALL = 14;
const RUN_ACC = 0.55;
const WALK_MAX = 3.4;
const RUN_MAX  = 5.4;
const FRICTION = 0.78;
const AIR_FRICTION = 0.94;
const JUMP_VEL = 11.5;
const JUMP_HOLD_BOOST = 0.42;
const JUMP_HOLD_MAX_FRAMES = 14;
const ENEMY_SPEED = 0.9;
const COIN_SCORE = 100;
const STOMP_SCORE = 200;
const FLAG_SCORE = 5000;

const ROWS = LEVEL_DATA.length;
const COLS = LEVEL_DATA[0].length;
const WORLD_W = COLS * TILE;
const WORLD_H = ROWS * TILE;

// ----------------------------------------------------------------------
// Tilemap (parsed from LEVEL_DATA)
// ----------------------------------------------------------------------
// tileGrid[y][x] = type code letter, '' if empty/decorative
// Solid types: 'G', 'B', '?', 'U', 'p' (pipe), 'P' (pipe-top)
function buildTilemap() {
    const grid = [];
    const decorations = []; // { type, x, y }  -- not collidable
    const coins = [];       // { x, y, taken, frame }
    const enemies = [];     // { x, y, vx, alive, squashTimer, ... }
    let flagPos = null;

    for (let y = 0; y < ROWS; y++) {
        const row = [];
        for (let x = 0; x < COLS; x++) {
            const ch = LEVEL_DATA[y][x] || '.';
            switch (ch) {
                case 'G': case 'B': case '?': case 'U':
                    row.push(ch);
                    break;
                case 'o':
                    coins.push({ x: x * TILE, y: y * TILE, taken: false, frame: Math.floor(Math.random() * 4) });
                    row.push('');
                    break;
                case 'E':
                    enemies.push(makeEnemy(x * TILE, y * TILE));
                    row.push('');
                    break;
                case 'F':
                    if (!flagPos) flagPos = { x: x * TILE, y: y * TILE };
                    row.push('');
                    break;
                case 'c':
                    decorations.push({ type: 'cloud', x: x * TILE, y: y * TILE });
                    row.push('');
                    break;
                case 'h':
                    decorations.push({ type: 'hill', x: x * TILE, y: y * TILE });
                    row.push('');
                    break;
                case 'b':
                    decorations.push({ type: 'bush', x: x * TILE, y: y * TILE });
                    row.push('');
                    break;
                default:
                    row.push('');
            }
        }
        grid.push(row);
    }

    // Place pipes (each pipe is 2 tiles wide)
    PIPES.forEach(([cx, cy, h]) => {
        for (let dy = 0; dy < h; dy++) {
            for (let dx = 0; dx < 2; dx++) {
                if (cy + dy < ROWS && cx + dx < COLS) {
                    grid[cy + dy][cx + dx] = (dy === 0) ? 'P' : 'p';
                }
            }
        }
    });

    return { grid, decorations, coins, enemies, flagPos };
}

function makeEnemy(x, y) {
    return {
        x, y,
        w: 24, h: 24,
        vx: -ENEMY_SPEED, vy: 0,
        alive: true,
        squashTimer: 0,
        frame: 0,
        frameTimer: 0,
        sprX: 24, sprY: 24,
    };
}

const SOLID = new Set(['G', 'B', '?', 'U', 'P', 'p']);

// ----------------------------------------------------------------------
// Player
// ----------------------------------------------------------------------
function makePlayer(x, y) {
    return {
        x, y,
        w: 22, h: 32,
        vx: 0, vy: 0,
        facing: 1,        // 1 right, -1 left
        onGround: false,
        jumpHeld: false,
        jumpHoldFrames: 0,
        running: false,
        anim: 'idle',     // idle | walk | jump | hurt
        frame: 0,
        frameTimer: 0,
        blinkTimer: 60,
        idleTimer: 0,
        invuln: 0,
        dead: false,
        deadTimer: 0,
    };
}

// ----------------------------------------------------------------------
// Game state
// ----------------------------------------------------------------------
const state = {
    map: null,
    player: null,
    camera: { x: 0, y: 0 },
    score: 0,
    coins: 0,
    lives: 3,
    time: LEVEL_TIME,
    timeAccumulator: 0,
    coinAnimFrame: 0,
    coinAnimTimer: 0,
    particles: [],
    won: false,
    winTimer: 0,
    started: false,
    paused: false,
    gameOver: false,
};

// Input
const keys = {};
const keyAliases = {
    'ArrowLeft': 'left', 'a': 'left', 'A': 'left',
    'ArrowRight': 'right', 'd': 'right', 'D': 'right',
    'ArrowUp': 'jump', 'w': 'jump', 'W': 'jump', ' ': 'jump',
    'Shift': 'run',
};
function isDown(action) {
    return Object.entries(keyAliases).some(([k, a]) => a === action && keys[k]);
}

window.addEventListener('keydown', e => {
    if (e.key in keyAliases) e.preventDefault();
    keys[e.key] = true;
});
window.addEventListener('keyup', e => {
    keys[e.key] = false;
});

// Touch control bindings
document.querySelectorAll('.touch-btn').forEach(btn => {
    const k = btn.dataset.key;
    const press = (e) => { e.preventDefault(); keys[k] = true; };
    const release = (e) => { e.preventDefault(); keys[k] = false; };
    btn.addEventListener('touchstart', press, { passive: false });
    btn.addEventListener('touchend', release, { passive: false });
    btn.addEventListener('touchcancel', release, { passive: false });
    btn.addEventListener('mousedown', press);
    btn.addEventListener('mouseup', release);
    btn.addEventListener('mouseleave', release);
});

// ----------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------
function tileAt(col, row) {
    if (row < 0 || row >= ROWS || col < 0 || col >= COLS) return '';
    return state.map.grid[row][col];
}

function isSolid(col, row) {
    return SOLID.has(tileAt(col, row));
}

function aabb(a, b) {
    return a.x < b.x + b.w && a.x + a.w > b.x &&
           a.y < b.y + b.h && a.y + a.h > b.y;
}

function spawnParticles(x, y, color, count = 8) {
    for (let i = 0; i < count; i++) {
        state.particles.push({
            x, y,
            vx: (Math.random() - 0.5) * 4,
            vy: -Math.random() * 4 - 2,
            life: 30 + Math.random() * 20,
            color,
            size: 2 + Math.random() * 2,
        });
    }
}

function spawnFloatScore(x, y, value) {
    state.particles.push({
        x, y, vx: 0, vy: -1.4, life: 50,
        text: '+' + value,
        color: '#fff8c8',
        size: 14,
    });
}

// ----------------------------------------------------------------------
// Player physics & collision
// ----------------------------------------------------------------------
function moveAxis(entity, dx, dy) {
    // Sweep movement to avoid tunneling
    const steps = Math.ceil(Math.max(Math.abs(dx), Math.abs(dy)));
    const sx = dx / Math.max(1, steps);
    const sy = dy / Math.max(1, steps);
    let collidedX = false, collidedY = false;
    for (let i = 0; i < steps; i++) {
        // X axis
        entity.x += sx;
        if (collideTiles(entity, true)) collidedX = true;
        // Y axis
        entity.y += sy;
        if (collideTiles(entity, false)) collidedY = true;
    }
    return { collidedX, collidedY };
}

function collideTiles(e, axisX) {
    let hit = false;
    const left   = Math.floor(e.x / TILE);
    const right  = Math.floor((e.x + e.w - 1) / TILE);
    const top    = Math.floor(e.y / TILE);
    const bottom = Math.floor((e.y + e.h - 1) / TILE);

    for (let cy = top; cy <= bottom; cy++) {
        for (let cx = left; cx <= right; cx++) {
            if (!isSolid(cx, cy)) continue;
            const tx = cx * TILE, ty = cy * TILE;
            if (axisX) {
                // resolve along x
                if (e.vx > 0) e.x = tx - e.w;
                else if (e.vx < 0) e.x = tx + TILE;
                e.vx = 0;
                hit = true;
            } else {
                if (e.vy > 0) {
                    e.y = ty - e.h;
                    e.onGround = true;
                    // Bumping head only happens on upward y - not here
                } else if (e.vy < 0) {
                    e.y = ty + TILE;
                    // Hit a question block from below -> spawn coin
                    if (tileAt(cx, cy) === '?') {
                        state.map.grid[cy][cx] = 'U';
                        state.score += COIN_SCORE;
                        state.coins++;
                        spawnFloatScore(tx + TILE / 2, ty - 6, COIN_SCORE);
                        spawnParticles(tx + TILE / 2, ty + TILE / 2, '#ffd158', 10);
                    } else if (tileAt(cx, cy) === 'B') {
                        // Brick bump -> tiny particle
                        spawnParticles(tx + TILE / 2, ty + TILE / 2, '#a05a2c', 4);
                    }
                }
                e.vy = 0;
                hit = true;
            }
        }
    }
    return hit;
}

function updatePlayer() {
    const p = state.player;
    if (p.dead) {
        p.deadTimer++;
        p.vy += GRAVITY;
        if (p.vy > MAX_FALL) p.vy = MAX_FALL;
        p.y += p.vy;
        if (p.deadTimer > 90) {
            state.lives--;
            if (state.lives <= 0) {
                state.gameOver = true;
                showOverlay('GAME OVER', 'Press START to retry', true);
            } else {
                resetLevel(false);
            }
        }
        return;
    }

    // Horizontal input
    const left = isDown('left');
    const right = isDown('right');
    p.running = isDown('run');
    const maxSpeed = p.running ? RUN_MAX : WALK_MAX;

    if (left && !right) {
        p.vx -= RUN_ACC;
        p.facing = -1;
    } else if (right && !left) {
        p.vx += RUN_ACC;
        p.facing = 1;
    } else {
        p.vx *= p.onGround ? FRICTION : AIR_FRICTION;
        if (Math.abs(p.vx) < 0.05) p.vx = 0;
    }
    if (p.vx > maxSpeed) p.vx = maxSpeed;
    if (p.vx < -maxSpeed) p.vx = -maxSpeed;

    // Jump
    const jump = isDown('jump');
    if (jump && p.onGround && !p.jumpHeld) {
        p.vy = -JUMP_VEL;
        p.onGround = false;
        p.jumpHoldFrames = 0;
        playJump();
    }
    if (jump && !p.onGround && p.jumpHoldFrames < JUMP_HOLD_MAX_FRAMES && p.vy < 0) {
        p.vy -= JUMP_HOLD_BOOST;
        p.jumpHoldFrames++;
    }
    p.jumpHeld = jump;

    // Gravity
    p.vy += GRAVITY;
    if (p.vy > MAX_FALL) p.vy = MAX_FALL;

    // Move
    p.onGround = false;
    moveAxis(p, p.vx, 0);
    moveAxis(p, 0, p.vy);

    // Death by falling
    if (p.y > WORLD_H + 64) {
        killPlayer();
    }

    // Animation state
    if (!p.onGround) {
        p.anim = 'jump';
    } else if (Math.abs(p.vx) > 0.2) {
        p.anim = 'walk';
    } else {
        p.anim = 'idle';
    }

    p.frameTimer++;
    if (p.anim === 'walk') {
        const tickSpeed = p.running ? 4 : 7;
        if (p.frameTimer >= tickSpeed) {
            p.frame = (p.frame + 1) % 2;
            p.frameTimer = 0;
        }
    } else if (p.anim === 'idle') {
        p.idleTimer++;
        // Tail wag rotation every ~12 frames; blink every ~2-3 seconds
        if (p.frameTimer >= 14) {
            p.frame = (p.frame + 1) % 4;
            p.frameTimer = 0;
        }
        p.blinkTimer--;
    } else {
        p.frame = 0;
    }

    if (p.invuln > 0) p.invuln--;

    // Coin pickup
    state.map.coins.forEach(coin => {
        if (coin.taken) return;
        const cb = { x: coin.x + 4, y: coin.y + 4, w: 24, h: 24 };
        if (aabb(p, cb)) {
            coin.taken = true;
            state.coins++;
            state.score += COIN_SCORE;
            spawnFloatScore(coin.x + 8, coin.y, COIN_SCORE);
            spawnParticles(coin.x + 8, coin.y + 8, '#ffd158', 8);
            playCoin();
        }
    });

    // Enemy interaction
    state.map.enemies.forEach(e => {
        if (!e.alive) return;
        const ebox = { x: e.x, y: e.y, w: e.w, h: e.h };
        if (aabb(p, ebox)) {
            // Stomped if player is descending and is mostly above the enemy
            if (p.vy > 0.5 && (p.y + p.h - 8) < e.y + 8) {
                e.alive = false;
                e.squashTimer = 30;
                p.vy = -8.0;
                state.score += STOMP_SCORE;
                spawnFloatScore(e.x + e.w / 2, e.y - 8, STOMP_SCORE);
                spawnParticles(e.x + e.w / 2, e.y + e.h / 2, '#f0af3c', 8);
                playStomp();
            } else if (p.invuln <= 0) {
                damagePlayer();
            }
        }
    });

    // Flag (goal)
    if (state.map.flagPos && !state.won) {
        const flagBox = { x: state.map.flagPos.x + 8, y: state.map.flagPos.y, w: 16, h: 32 * 8 };
        if (aabb(p, flagBox)) {
            triggerWin();
        }
    }
}

function damagePlayer() {
    killPlayer();
}

function killPlayer() {
    const p = state.player;
    if (p.dead) return;
    p.dead = true;
    p.vy = -10;
    p.deadTimer = 0;
    playHurt();
}

function triggerWin() {
    state.won = true;
    state.score += FLAG_SCORE;
    spawnFloatScore(state.player.x, state.player.y - 8, FLAG_SCORE);
    state.player.vx = 0;
    state.winTimer = 0;
    playWin();
    showOverlay('CLEAR!', `점수: ${formatScore(state.score)}\n다시 플레이하려면 START를 누르세요`, false);
}

// ----------------------------------------------------------------------
// Enemies
// ----------------------------------------------------------------------
function updateEnemies() {
    state.map.enemies.forEach(e => {
        if (!e.alive) {
            if (e.squashTimer > 0) e.squashTimer--;
            return;
        }
        // Cull update if far from camera
        if (Math.abs(e.x - state.camera.x) > VIEW_W + 200) return;

        // Gravity
        e.vy += GRAVITY;
        if (e.vy > MAX_FALL) e.vy = MAX_FALL;

        // X
        e.x += e.vx;
        if (collideTilesEnemy(e, true)) {
            e.vx = -e.vx;
        }
        // Y
        e.y += e.vy;
        collideTilesEnemy(e, false);

        // Edge detection - turn around at platform edges
        if (e.onGround) {
            const aheadX = (e.vx > 0) ? e.x + e.w + 1 : e.x - 1;
            const belowY = e.y + e.h + 1;
            const aheadCol = Math.floor(aheadX / TILE);
            const belowRow = Math.floor(belowY / TILE);
            if (!isSolid(aheadCol, belowRow)) {
                e.vx = -e.vx;
            }
        }

        // Animation
        e.frameTimer++;
        if (e.frameTimer >= 18) {
            e.frame = (e.frame + 1) % 2;
            e.frameTimer = 0;
        }
    });
}

function collideTilesEnemy(e, axisX) {
    let hit = false;
    e.onGround = e.onGround || false;
    const left   = Math.floor(e.x / TILE);
    const right  = Math.floor((e.x + e.w - 1) / TILE);
    const top    = Math.floor(e.y / TILE);
    const bottom = Math.floor((e.y + e.h - 1) / TILE);

    for (let cy = top; cy <= bottom; cy++) {
        for (let cx = left; cx <= right; cx++) {
            if (!isSolid(cx, cy)) continue;
            const tx = cx * TILE, ty = cy * TILE;
            if (axisX) {
                if (e.vx > 0) e.x = tx - e.w;
                else if (e.vx < 0) e.x = tx + TILE;
                hit = true;
            } else {
                if (e.vy > 0) {
                    e.y = ty - e.h;
                    e.onGround = true;
                } else if (e.vy < 0) {
                    e.y = ty + TILE;
                }
                e.vy = 0;
                hit = true;
            }
        }
    }
    if (axisX === false && !hit) {
        // Falling with nothing below
    }
    return hit;
}

// ----------------------------------------------------------------------
// Particles
// ----------------------------------------------------------------------
function updateParticles() {
    for (let i = state.particles.length - 1; i >= 0; i--) {
        const p = state.particles[i];
        p.life--;
        p.x += p.vx;
        p.y += p.vy;
        if (!p.text) p.vy += 0.18;
        if (p.life <= 0) state.particles.splice(i, 1);
    }
}

// ----------------------------------------------------------------------
// Camera
// ----------------------------------------------------------------------
function updateCamera() {
    const p = state.player;
    const target = p.x + p.w / 2 - VIEW_W * 0.42;
    state.camera.x += (target - state.camera.x) * 0.12;
    if (state.camera.x < 0) state.camera.x = 0;
    if (state.camera.x > WORLD_W - VIEW_W) state.camera.x = WORLD_W - VIEW_W;

    // Vertical follow only if player is high or falling
    const targetY = p.y + p.h / 2 - VIEW_H * 0.55;
    state.camera.y += (targetY - state.camera.y) * 0.08;
    if (state.camera.y < 0) state.camera.y = 0;
    if (state.camera.y > WORLD_H - VIEW_H) state.camera.y = WORLD_H - VIEW_H;
}

// ----------------------------------------------------------------------
// Rendering
// ----------------------------------------------------------------------
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;

function drawSky() {
    // Vertical gradient sky
    const grd = ctx.createLinearGradient(0, 0, 0, VIEW_H);
    grd.addColorStop(0, '#7fb8ff');
    grd.addColorStop(0.55, '#a8d4ff');
    grd.addColorStop(1, '#fde9b3');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, VIEW_W, VIEW_H);
}

function drawDecorations() {
    state.map.decorations.forEach(d => {
        const sx = d.x - state.camera.x * 0.5; // parallax
        const sy = d.y - state.camera.y * 0.7;
        let img;
        switch (d.type) {
            case 'cloud': img = SPRITES.cloud; break;
            case 'hill':  img = SPRITES.hill; break;
            case 'bush':  img = SPRITES.bush; break;
        }
        if (img) ctx.drawImage(img, Math.floor(sx), Math.floor(sy));
    });
}

function drawTiles() {
    const cx = state.camera.x;
    const cy = state.camera.y;
    const startCol = Math.floor(cx / TILE) - 1;
    const endCol   = Math.floor((cx + VIEW_W) / TILE) + 1;
    const startRow = Math.floor(cy / TILE) - 1;
    const endRow   = Math.floor((cy + VIEW_H) / TILE) + 1;

    for (let y = Math.max(0, startRow); y <= Math.min(ROWS - 1, endRow); y++) {
        for (let x = Math.max(0, startCol); x <= Math.min(COLS - 1, endCol); x++) {
            const t = state.map.grid[y][x];
            if (!t) continue;
            const px = Math.floor(x * TILE - cx);
            const py = Math.floor(y * TILE - cy);
            switch (t) {
                case 'G': ctx.drawImage(SPRITES.ground, px, py); break;
                case 'B': ctx.drawImage(SPRITES.brick, px, py); break;
                case '?': ctx.drawImage(SPRITES.question_block, px, py); break;
                case 'U': ctx.drawImage(SPRITES.used_block, px, py); break;
                case 'P': // pipe top - draw lip
                case 'p': // pipe body - skipped here, drawn by separate pass
                    break;
            }
        }
    }
}

function drawCoins() {
    state.map.coins.forEach(coin => {
        if (coin.taken) return;
        const sx = Math.floor(coin.x - state.camera.x);
        const sy = Math.floor(coin.y - state.camera.y) + Math.sin((Date.now() / 350) + coin.x * 0.1) * 2;
        const frame = (state.coinAnimFrame + coin.frame) % 4;
        const sprite = SPRITES['coin_' + (frame + 1)];
        if (sprite) ctx.drawImage(sprite, sx, sy);
    });
}

function drawEnemies() {
    state.map.enemies.forEach(e => {
        const sx = Math.floor(e.x - state.camera.x);
        const sy = Math.floor(e.y - state.camera.y);
        let sprite;
        if (!e.alive) {
            sprite = SPRITES.enemy_squash;
            if (e.squashTimer > 0) {
                ctx.drawImage(sprite, sx - 12, sy);
            }
        } else {
            sprite = (e.frame === 0) ? SPRITES.enemy_walk_1 : SPRITES.enemy_walk_2;
            ctx.drawImage(sprite, sx - 12, sy);
        }
    });
}

function drawPipes() {
    PIPES.forEach(([cx, cy, h]) => {
        const px = Math.floor(cx * TILE - state.camera.x);
        const py = Math.floor(cy * TILE - state.camera.y);
        // Top lip
        ctx.drawImage(SPRITES.pipe_top, px, py);
        // Body sections
        for (let i = 1; i < h; i++) {
            ctx.drawImage(SPRITES.pipe_body, px, py + i * TILE);
        }
    });
}

function drawFlag() {
    if (!state.map.flagPos) return;
    const f = state.map.flagPos;
    // Anchor flag bottom to ground (row 15 is ground top)
    const groundY = 15 * TILE;
    const flagH = SPRITES.flag.height;
    const sx = Math.floor(f.x - state.camera.x) - 4;
    const sy = Math.floor(groundY - flagH - state.camera.y);
    ctx.drawImage(SPRITES.flag, sx, sy);
}

function drawPlayer() {
    const p = state.player;
    if (p.invuln > 0 && Math.floor(p.invuln / 4) % 2 === 0) return;

    let sprite;
    if (p.dead) {
        sprite = SPRITES.player_hurt;
    } else if (p.anim === 'jump') {
        sprite = SPRITES.player_jump;
    } else if (p.anim === 'walk') {
        sprite = (p.frame === 0) ? SPRITES.player_walk_1 : SPRITES.player_walk_2;
    } else {
        const blink = p.blinkTimer <= 0;
        if (blink) {
            sprite = SPRITES.player_idle_2_blink;
            if (p.blinkTimer < -8) p.blinkTimer = 90 + Math.floor(Math.random() * 80);
        } else if (p.frame === 0) sprite = SPRITES.player_idle_1;
        else if (p.frame === 1) sprite = SPRITES.player_idle_3_tail;
        else if (p.frame === 2) sprite = SPRITES.player_idle_1;
        else sprite = SPRITES.player_idle_4_tail;
    }

    const sx = Math.floor(p.x - state.camera.x);
    const sy = Math.floor(p.y - state.camera.y);
    // Sprite is 32x36; player hitbox is 22x32, so center horizontally with 5px offset
    const offX = -5;
    const offY = -4;
    ctx.save();
    if (p.facing === -1) {
        ctx.translate(sx + sprite.width + offX * 2, sy + offY);
        ctx.scale(-1, 1);
        ctx.drawImage(sprite, 0, 0);
    } else {
        ctx.drawImage(sprite, sx + offX, sy + offY);
    }
    ctx.restore();
}

function drawParticles() {
    state.particles.forEach(p => {
        if (p.text) {
            ctx.font = `bold ${p.size}px monospace`;
            ctx.textAlign = 'center';
            ctx.fillStyle = p.color;
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 3;
            ctx.strokeText(p.text, p.x - state.camera.x, p.y - state.camera.y);
            ctx.fillText(p.text, p.x - state.camera.x, p.y - state.camera.y);
        } else {
            ctx.fillStyle = p.color;
            const alpha = Math.min(1, p.life / 30);
            ctx.globalAlpha = alpha;
            ctx.fillRect(p.x - state.camera.x, p.y - state.camera.y, p.size, p.size);
            ctx.globalAlpha = 1;
        }
    });
}

function render() {
    drawSky();
    drawDecorations();
    drawTiles();
    drawPipes();
    drawCoins();
    drawFlag();
    drawEnemies();
    drawPlayer();
    drawParticles();
}

// ----------------------------------------------------------------------
// HUD
// ----------------------------------------------------------------------
function formatScore(n) { return String(n).padStart(6, '0'); }
function formatCoins(n) { return 'x ' + String(n).padStart(2, '0'); }
function updateHUD() {
    document.getElementById('hud-score').textContent = formatScore(state.score);
    document.getElementById('hud-coins').textContent = formatCoins(state.coins);
    document.getElementById('hud-time').textContent = String(Math.max(0, Math.floor(state.time))).padStart(3, '0');
    document.getElementById('hud-lives').textContent = 'x ' + state.lives;
}

// ----------------------------------------------------------------------
// Audio (simple WebAudio chiptune blips)
// ----------------------------------------------------------------------
let audioCtx = null;
function ensureAudio() {
    if (!audioCtx) {
        try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch (_) {}
    }
}
function blip(freq = 440, type = 'square', dur = 0.12, gain = 0.18, slide = 0) {
    if (!audioCtx) return;
    const t = audioCtx.currentTime;
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    if (slide) o.frequency.exponentialRampToValueAtTime(freq + slide, t + dur);
    g.gain.setValueAtTime(gain, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(audioCtx.destination);
    o.start(t);
    o.stop(t + dur);
}
function playJump()  { blip(620, 'square', 0.12, 0.16, 240); }
function playCoin()  { blip(1040, 'square', 0.06, 0.14); setTimeout(() => blip(1500, 'square', 0.10, 0.14), 60); }
function playStomp() { blip(180, 'sawtooth', 0.16, 0.18, -80); }
function playHurt()  { blip(220, 'sawtooth', 0.5, 0.22, -120); }
function playWin()   {
    [523, 659, 784, 1046].forEach((f, i) => setTimeout(() => blip(f, 'square', 0.18, 0.18), i * 130));
}

// ----------------------------------------------------------------------
// Game loop
// ----------------------------------------------------------------------
let lastTime = 0;
function tick(now) {
    requestAnimationFrame(tick);
    const dt = Math.min(33, now - lastTime || 16);
    lastTime = now;

    if (!state.started || state.gameOver || state.paused) return;

    // Update coin animation (global)
    state.coinAnimTimer++;
    if (state.coinAnimTimer >= 8) {
        state.coinAnimFrame = (state.coinAnimFrame + 1) % 4;
        state.coinAnimTimer = 0;
    }

    if (!state.won) {
        updatePlayer();
        updateEnemies();

        // Time
        state.timeAccumulator += dt;
        if (state.timeAccumulator >= 400) {  // game time runs faster than wall-clock
            state.time -= 1;
            state.timeAccumulator -= 400;
            if (state.time <= 0) {
                state.time = 0;
                killPlayer();
            }
        }
    } else {
        state.winTimer++;
    }

    updateParticles();
    updateCamera();
    render();
    updateHUD();
}

// ----------------------------------------------------------------------
// State management
// ----------------------------------------------------------------------
function resetLevel(full = true) {
    state.map = buildTilemap();
    state.player = makePlayer(2 * TILE, 13 * TILE);
    state.player.invuln = 60;
    state.camera.x = 0;
    state.camera.y = 0;
    state.particles = [];
    state.won = false;
    state.winTimer = 0;
    state.time = LEVEL_TIME;
    state.timeAccumulator = 0;
    if (full) {
        state.score = 0;
        state.coins = 0;
        state.lives = 3;
    }
    state.gameOver = false;
    state.started = true;
}

function showOverlay(line1, line2, allowRestart) {
    const ov = document.getElementById('overlay');
    ov.innerHTML = `
        <div class="title">
            <span class="title-line1">${line1}</span>
            ${line2 ? `<span class="title-line2">${line2.replace(/\n/g, '<br>')}</span>` : ''}
        </div>
        <button id="start-btn">${allowRestart ? 'RESTART' : 'PLAY AGAIN'}</button>
    `;
    ov.classList.add('show');
    document.getElementById('start-btn').addEventListener('click', startGame);
}

function hideOverlay() {
    document.getElementById('overlay').classList.remove('show');
}

function startGame() {
    ensureAudio();
    if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
    hideOverlay();
    resetLevel(true);
}

// ----------------------------------------------------------------------
// Boot
// ----------------------------------------------------------------------
loadSprites().then(() => {
    document.getElementById('start-btn').addEventListener('click', startGame);
    // Pre-render a static background so the title screen is not boring
    state.map = buildTilemap();
    state.player = makePlayer(2 * TILE, 13 * TILE);
    render();
    requestAnimationFrame(tick);
}).catch(err => {
    console.error('Failed to load sprites:', err);
    document.getElementById('overlay').innerHTML =
        '<div class="title"><span class="title-line1">ERROR</span><span class="title-line2">Sprites failed to load</span></div>';
});

})();

// Headless browser smoke test for the game.
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1024, height: 720 } });
  const page = await ctx.newPage();

  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push('CONSOLE: ' + msg.text());
  });
  page.on('pageerror', err => errors.push('PAGE: ' + err.message));

  await page.goto('http://localhost:8765/game/index.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'assets/preview/game_title.png' });

  // Click START
  await page.click('#start-btn');
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'assets/preview/game_start.png' });

  // Cheat: jump to a far position to inspect mid-level + flag
  // We do this by holding right + jumping over time.
  const recordTimes = [
    { ms: 1500, name: 'game_mid1' },
    { ms: 1500, name: 'game_mid2' },
    { ms: 1500, name: 'game_mid3' },
    { ms: 2000, name: 'game_end' },
  ];

  await page.keyboard.down('Shift'); // run

  for (const step of recordTimes) {
    await page.keyboard.down('ArrowRight');
    // Periodic jumps
    let elapsed = 0;
    while (elapsed < step.ms) {
      await page.keyboard.down(' ');
      await page.waitForTimeout(140);
      await page.keyboard.up(' ');
      await page.waitForTimeout(380);
      elapsed += 520;
    }
    await page.screenshot({ path: `assets/preview/${step.name}.png` });
  }

  await page.keyboard.up('ArrowRight');
  await page.keyboard.up('Shift');

  // Inspect HUD via DOM
  const hud = await page.evaluate(() => ({
    score:  document.getElementById('hud-score').textContent,
    coins:  document.getElementById('hud-coins').textContent,
    time:   document.getElementById('hud-time').textContent,
    lives:  document.getElementById('hud-lives').textContent,
    overlay: document.getElementById('overlay').classList.contains('show'),
  }));

  console.log('HUD:', hud);
  if (errors.length) {
    console.log('\nERRORS:');
    errors.forEach(e => console.log('  ' + e));
  } else {
    console.log('No JS errors.');
  }

  await browser.close();
})();

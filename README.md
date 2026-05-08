# Mouse Bro - Super Cheese Adventure

A Super Mario-style platformer starring a cute white mouse with round glasses
and a blue tie. Built with HTML5 Canvas + vanilla JavaScript, with all sprites
hand-crafted as pixel-art templates.

## Play

```bash
# Serve the project (any static server works)
python3 -m http.server 8765
# then open: http://localhost:8765/game/index.html
```

### Controls

| Key | Action |
| --- | --- |
| `← →` or `A D` | Move |
| `Space` / `↑` / `W` | Jump (hold for higher jump) |
| `Shift` | Run |

Touch controls appear automatically on mobile devices.

## Project layout

```
ssamG/
├── README.md
├── assets/
│   ├── sprites/        # Generated PNGs (player, enemy, blocks, etc.)
│   └── preview/        # 4x scaled previews + game screenshots
├── scripts/
│   ├── generate_sprites.py   # Pixel-art sprite generator
│   └── test_game.js          # Playwright smoke test
└── game/
    ├── index.html
    ├── style.css
    ├── level.js
    └── main.js
```

## Sprite pipeline

The repository's sprites are produced by `scripts/generate_sprites.py`, which
follows the deterministic post-processing approach championed by
[agent-sprite-forge](https://github.com/0x0funky/agent-sprite-forge):
sprites are defined as 2D character grids with a fixed palette, then rasterized
to PNG with no anti-aliasing — preserving clean pixel-art edges.

Regenerate everything with:

```bash
pip install -r requirements.txt   # Pillow + numpy
python3 scripts/generate_sprites.py
```

The character (a glasses-wearing white mouse with blue tie and pink curly
tail) is replicated across idle / blink / tail-wag / walk / jump / hurt
frames. Coins are cheese-themed, and enemies are squashable cheese cubes
fitting the mouse's culinary obsession.

## Game features

- **Side-scrolling platformer** — 3,840 px world, 960×540 viewport
- **Physics**: gravity, AABB tile collision, variable-height jump (hold-to-fly)
- **Coin pickups** with floating "+100" score popups & sparkle particles
- **Enemy AI** — patrolling cheese mobs that turn at edges and on walls
- **Stomp combat** — jump on top of enemies to defeat them, get bounced back
- **Question blocks** that release coins when bumped from below
- **Goal flag** that triggers the level-clear sequence
- **Parallax decorations** (clouds, hills, bushes)
- **Touch controls** for mobile play
- **Chiptune SFX** generated live with WebAudio (jump, coin, stomp, etc.)

## Testing

```bash
NODE_PATH=/opt/node22/lib/node_modules node scripts/test_game.js
```

Captures screenshots into `assets/preview/`.

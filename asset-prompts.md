# Asset Prompts

The raw visual assets were generated with built-in image generation and then processed with `agent-sprite-forge` scripts copied into `vendor/agent-sprite-forge`.

## Mouse Run Sheet

2x3 side-view running animation sprite sheet for the attached white mouse character. Identity lock: cream-white body, large coral-pink ears, round black glasses, tiny red mouth/nose, coral tail, blue necktie. Style: crisp premium Korean educational pixel art matching the attached platformer screenshot. Background: solid `#FF00FF`. No text, labels, borders, or cell dividers.

Processor:

```bash
python3 vendor/agent-sprite-forge/skills/generate2dsprite/scripts/generate2dsprite.py process \
  --input assets/raw/mouse-run-raw.png --target asset --mode run \
  --rows 2 --cols 3 --label-prefix mouse-run \
  --output-dir assets/sprites/mouse-run --cell-size 192 \
  --fit-scale 0.86 --align feet --shared-scale \
  --component-mode largest --component-padding 10 --min-component-area 64
```

## Mouse Jump Sheet

2x2 side-view jump animation sheet for the same mouse character. Frames: crouch/start, rising, falling, landing. Style and constraints match the run sheet.

## Sprout Turtle Enemy

2x2 side-view walking animation sheet for a small green sprout turtle enemy with lime head, leaf sprout, bead eyes, brown shell, short legs. Style matches the attached platformer screenshot.

## Prop Pack

3x3 compact prop pack: coin, star, carrot, blue paw block, cracked stone block, wooden arrow sign, red finish flag, flower cluster, timer clock. Style: crisp saturated pixel-art props with warm outlines, no text or numbers.

## Cheese Collectible

Single cheese collectible icon generated to replace the flower collectible: bright golden-yellow wedge of cheese with holes, warm brown outline, glossy pixel highlights, transparent-ready magenta background, resized and saved as `assets/props/cheese.png`.

## Platform Strip

1x3 wide platform strip: left cap, repeatable grassy dirt middle, right cap. Extracted with `generate2dmap/scripts/extract_prop_pack.py` to preserve wide platform dimensions.

## Background

Scenery-only side-scroller background plate, inspired by the attached screenshot: blue sky, soft clouds, layered mountains, distant forest, river depth. Exclusions: no player, enemies, UI, text, coins, signs, flags, foreground platforms, or collision-bearing objects. Normalized to `1536x864`.

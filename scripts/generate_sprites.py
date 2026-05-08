"""Hand-crafted pixel-art sprite generator for the cute glasses-mouse character.

Each sprite is defined as a 2D grid where every character maps to a palette color.
This produces clean, deliberate pixel art (no anti-aliasing artifacts) that closely
matches the reference: white mouse with round pink ears, round black glasses,
blue tie, pink curly tail, kawaii proportions.
"""

from PIL import Image
from pathlib import Path

OUT = Path(__file__).resolve().parent.parent / "assets" / "sprites"
OUT.mkdir(parents=True, exist_ok=True)

# ------- Palette -------
PALETTE = {
    " ": (0, 0, 0, 0),
    ".": (255, 250, 238, 255),    # body cream
    ",": (235, 220, 195, 255),    # body shadow
    ";": (250, 235, 215, 255),    # body mid
    "#": (88, 56, 38, 255),       # warm dark outline
    "+": (140, 92, 64, 255),      # outline highlight
    "p": (255, 180, 197, 255),    # ear/tail pink
    "P": (228, 132, 156, 255),    # ear/tail shadow
    "q": (255, 210, 220, 255),    # ear inner light
    "g": (38, 30, 28, 255),       # glasses frame
    "e": (28, 22, 22, 255),       # eye black
    "w": (255, 255, 255, 255),    # eye white / highlight
    "n": (216, 60, 70, 255),      # nose red
    "N": (160, 36, 50, 255),      # nose shadow
    "t": (40, 95, 215, 255),      # tie blue
    "T": (24, 60, 150, 255),      # tie dark
    "h": (110, 165, 245, 255),    # tie highlight
    "c": (255, 195, 210, 255),    # cheek blush
    "k": (45, 35, 30, 255),       # mouth/dark line
    "y": (255, 222, 110, 255),    # accent yellow (coins)
    "o": (240, 175, 60, 255),     # accent orange
    "r": (220, 60, 70, 255),
    "u": (130, 200, 90, 255),     # bush green
    "U": (90, 165, 60, 255),      # bush dark
    "d": (160, 90, 45, 255),      # dirt brown
    "D": (110, 60, 30, 255),      # dirt dark
    "s": (110, 220, 255, 255),    # sky highlight
    "L": (50, 175, 95, 255),      # leaf green
    "M": (35, 130, 70, 255),      # leaf dark green
    "z": (160, 110, 70, 255),     # log brown
    "Z": (110, 70, 40, 255),
    "B": (255, 240, 180, 255),    # cheese light
    "v": (245, 90, 100, 255),     # tomato
}


def render(grid_lines, scale=1, name="sprite"):
    rows = [r for r in grid_lines if r != ""]
    h = len(rows)
    w = max(len(r) for r in rows)
    rows = [r.ljust(w) for r in rows]
    img = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    px = img.load()
    for y, row in enumerate(rows):
        for x, ch in enumerate(row):
            color = PALETTE.get(ch, (0, 0, 0, 0))
            if color[3] != 0:
                px[x, y] = color
    if scale > 1:
        img = img.resize((w * scale, h * scale), Image.NEAREST)
    if name:
        img.save(OUT / f"{name}.png")
    return img


# ============================================================
# PLAYER: 32 wide x 36 tall - more vertical room for full body
# ============================================================

# IDLE FRAME 1 - eyes open, friendly smile
PLAYER_IDLE = [
    "                                ",  # 0
    "    ###             ###         ",  # 1
    "   #pPp#           #pPp#        ",  # 2
    "  #pPqPp#         #pPqPp#       ",  # 3
    "  #pqqqp#         #pqqqp#       ",  # 4
    "  #pqqqp#         #pqqqp#       ",  # 5
    "  #pPpp###       ###ppPp#       ",  # 6
    "   #pp########  ########pp#     ",  # 7
    "    #;;;;;;;;####;;;;;;;;#      ",  # 8
    "   #;;;;;;;;;;;;;;;;;;;;;;#     ",  # 9
    "  #;;..;;;;;;;;;;;;;;;;;..;;#   ",  # 10
    "  #;..;;;;;;;;;;;;;;;;;;;..;#   ",  # 11
    " #;..;;;ggggg;;;;;ggggg;;;..;#  ",  # 12
    " #;..;;gwwwwwg;;;gwwwwwg;;..;#  ",  # 13 glasses tops
    " #;;c;gwweeewg;g;gwweeewg;c;;#  ",  # 14 eyes inside glasses
    " #;;cgwweeewg;g;gwweeewgc;;;#   ",  # 15
    "  #;;gwwwwwwg;;;gwwwwwwg;;;#    ",  # 16
    "  #;;;ggggggg;;;ggggggg;;;;#    ",  # 17 glasses bottoms
    "  #;;;;;;;;;;nNn;;;;;;;;;;;#    ",  # 18 nose
    "   #;;;;;;;;;NNn;;;;;;;;;;#     ",  # 19
    "    #;;;;;;;;;k;;;;;;;;;;#      ",  # 20 mouth
    "    #;;;;;;;kwwwk;;;;;;;#       ",  # 21 smile
    "     #;;;;;;;kkk;;;;;;;#        ",  # 22
    "      #;;;;;;;;;;;;;;;#         ",  # 23
    "      ###;;;;;;;;;;;###         ",  # 24
    "        #;;hTTTTTh;;#           ",  # 25 tie knot
    "        #ttttttttttt#           ",  # 26
    "      #;;.tThhhhTt.;;#          ",  # 27 chest top
    "     #;..;tThhhhTt;..;#         ",  # 28
    "     #;..;tTTTTTTT;..;#       p ",  # 29
    "     #;..;;tTTTTT;;..;#      pP ",  # 30 tail
    "      #;,,;;tTTT;;,,;#      Pp  ",  # 31
    "      #;,,#;;;;;;#,,;#     pP   ",  # 32
    "      ##  ##    ##  ##     P    ",  # 33 feet
    "                                ",  # 34
    "                                ",  # 35
]


def derive(base, changes):
    out = list(base)
    for row, val in changes.items():
        out[row] = val
    return out


# IDLE FRAME 2 - eyes closed (blink) - row 14, 15 closed eyes
PLAYER_IDLE_BLINK = derive(
    PLAYER_IDLE,
    {
        13: " #;..;;gkkkkkg;;;gkkkkkg;;..;#  ",
        14: " #;;c;gkkkkkkg;g;gkkkkkkg;c;;#  ",
        15: " #;;cgwwwwwwwg;g;gwwwwwwwgc;;;#  ",
    }
)

# IDLE FRAME 3 - tail wag right
PLAYER_IDLE_TAIL_R = derive(
    PLAYER_IDLE,
    {
        29: "     #;..;tTTTTTTT;..;#         ",
        30: "     #;..;;tTTTTT;;..;#       p ",
        31: "      #;,,;;tTTT;;,,;#       pP ",
        32: "      #;,,#;;;;;;#,,;#        Pp",
        33: "      ##  ##    ##  ##         #",
    }
)

# IDLE FRAME 4 - tail wag up
PLAYER_IDLE_TAIL_U = derive(
    PLAYER_IDLE,
    {
        27: "      #;;.tThhhhTt.;;#       Pp ",
        28: "     #;..;tThhhhTt;..;#      pP ",
        29: "     #;..;tTTTTTTT;..;#     Pp  ",
        30: "     #;..;;tTTTTT;;..;#     P   ",
        31: "      #;,,;;tTTT;;,,;#          ",
        32: "      #;,,#;;;;;;#,,;#          ",
        33: "      ##  ##    ##  ##          ",
    }
)

# WALK 1 - left foot forward (small body bounce -1)
PLAYER_WALK_1 = [
    "                                ",
    "    ###             ###         ",
    "   #pPp#           #pPp#        ",
    "  #pPqPp#         #pPqPp#       ",
    "  #pqqqp#         #pqqqp#       ",
    "  #pqqqp###      ###pqqqp#      ",
    "  #pPpp########  ########Pp#    ",
    "   #pp########  ########pp#     ",
    "    #;;;;;;;;####;;;;;;;;#      ",
    "   #;;;;;;;;;;;;;;;;;;;;;;#     ",
    "  #;;..;;;;;;;;;;;;;;;;;..;;#   ",
    "  #;..;;;;;;;;;;;;;;;;;;;..;#   ",
    " #;..;;;ggggg;;;;;ggggg;;;..;#  ",
    " #;..;;gwwwwwg;;;gwwwwwg;;..;#  ",
    " #;;c;gwweeewg;g;gwweeewg;c;;#  ",
    " #;;cgwweeewg;g;gwweeewgc;;;#   ",
    "  #;;gwwwwwwg;;;gwwwwwwg;;;#    ",
    "  #;;;ggggggg;;;ggggggg;;;;#    ",
    "  #;;;;;;;;;;nNn;;;;;;;;;;;#    ",
    "   #;;;;;;;;;NNn;;;;;;;;;;#     ",
    "    #;;;;;;;;;k;;;;;;;;;;#      ",
    "    #;;;;;;;kwwwk;;;;;;;#       ",
    "     #;;;;;;;kkk;;;;;;;#        ",
    "      #;;;;;;;;;;;;;;;#         ",
    "      ###;;;;;;;;;;;###         ",
    "        #;;hTTTTTh;;#           ",
    "        #ttttttttttt#           ",
    "      #;;.tThhhhTt.;;#          ",
    "     #;..;tThhhhTt;..;#         ",
    "     #;..;tTTTTTTT;..;#       p ",
    "     #;..;;tTTTTT;;..;#      pP ",
    "      #;,,;;tTTT;;,,;#      Pp  ",
    "      #;,##;;;;;;##,#      pP   ",
    "    #..#  ##    ##  #          ",
    "    ####          ####          ",
    "                                ",
]

PLAYER_WALK_2 = derive(
    PLAYER_WALK_1,
    {
        33: "      ##,;;;;;;;;;;;,##         ",
        34: "       #            #           ",
        35: "      ####        ####          ",
    }
)

# JUMP - both feet up, slight stretch
PLAYER_JUMP = [
    "                                ",
    "    ###             ###         ",
    "   #pPp#           #pPp#        ",
    "  #pPqPp#         #pPqPp#       ",
    "  #pqqqp#         #pqqqp#       ",
    "  #pqqqp#         #pqqqp#       ",
    "  #pPpp###       ###ppPp#       ",
    "   #pp########  ########pp#     ",
    "    #;;;;;;;;####;;;;;;;;#      ",
    "   #;;;;;;;;;;;;;;;;;;;;;;#     ",
    "  #;;..;;;;;;;;;;;;;;;;;..;;#   ",
    "  #;..;;;;;;;;;;;;;;;;;;;..;#   ",
    " #;..;;;ggggg;;;;;ggggg;;;..;#  ",
    " #;..;;gwwwwwg;;;gwwwwwg;;..;#  ",
    " #;;c;gwweeewg;g;gwweeewg;c;;#  ",
    " #;;cgwweeewg;g;gwweeewgc;;;#   ",
    "  #;;gwwwwwwg;;;gwwwwwwg;;;#    ",
    "  #;;;ggggggg;;;ggggggg;;;;#    ",
    "  #;;;;;;;;;;nNn;;;;;;;;;;;#    ",
    "   #;;;;;;;;;NNn;;;;;;;;;;#     ",
    "    #;;;;;;;wkkkw;;;;;;;;#      ",
    "    #;;;;;;;kkkkk;;;;;;;#       ",
    "     #;;;;;;wkkkw;;;;;;#        ",
    "      #;;;;;;;;;;;;;;;#         ",
    "      ###;;;;;;;;;;;###         ",
    "        #;;hTTTTTh;;#         pP",
    "        #ttttttttttt#        Pp ",
    "      #;;.tThhhhTt.;;#      pP  ",
    "     #;..;tThhhhTt;..;#    Pp   ",
    "     #;..;tTTTTTTT;..;#   pP    ",
    "     #;..;;tTTTTT;;..;#  Pp     ",
    "    ##;,,;;tTTT;;;,,##  P       ",
    "   #..#;,;;;;;;;;,;#..#         ",
    "  #....##         ##....#       ",
    "  ########       ########       ",
    "                                ",
    "                                ",
]

# HURT - eyes X, sideways
PLAYER_HURT = derive(
    PLAYER_IDLE,
    {
        14: " #;;c;gXwwXwg;g;gXwwXwg;c;;#  ".replace("X", "k"),
        15: " #;;cgwXwwXg;g;gwXwwXg;wc;;;#  ".replace("X", "k"),
        21: "    #;;;;;;;wkkkw;;;;;;;#       ",
    }
)

# ============================================================
# ENEMY: chubby cheese cube (mouse's foe!)
# 24 wide x 24 tall, walking
# ============================================================
ENEMY_CHEESE_1 = [
    "                        ",
    "                        ",
    "       ###########      ",
    "      #yyyyyyyyyyy#     ",
    "     #yByyyyooyyyyy#    ",
    "    #yByyyyyyyyyyooy#   ",
    "    #yyyooyyyyyByyyy#   ",
    "   #yyyyyyyyyByyyyooy#  ",
    "   #yyyByyyyyyyByyyyy#  ",
    "   #yyyyyyooyyyyyyooy#  ",
    "   #yy##############yy# ",
    "   #y#wweeegg#g#geewwg#g#",
    "   #y#wweeegg#g#geewwg#g#",
    "   #y############y####g#",
    "   #yyyyy##nn##yyyyyy#  ",
    "   #yyyy#kwwwk#yyyyy#   ",
    "    #yyy#kkkkk#yyyy#    ",
    "    #yyyyy###yyyyyy#    ",
    "     #yyyyyyyyyyyy#     ",
    "      #ooyyyyyyooy#     ",
    "      ##############    ",
    "       ## ##  ## ##     ",
    "       ##      ##       ",
    "                        ",
]

ENEMY_CHEESE_2 = derive(
    ENEMY_CHEESE_1,
    {
        21: "       ##  ##  ## ##    ",
        22: "       ##  ##           ",
    }
)

ENEMY_CHEESE_SQUASH = [
    "                        ",
    "                        ",
    "                        ",
    "                        ",
    "                        ",
    "                        ",
    "                        ",
    "                        ",
    "                        ",
    "                        ",
    "                        ",
    "      ###############   ",
    "    #yyooyyyyyByyooyy#  ",
    "   #yy##wweeegg#geewg##y#",
    "   #yyyy##kkkkkkk##yyyyy#",
    "   #yooyyyyyyyyooyyyyoo#",
    "    ####################",
    "                        ",
    "                        ",
    "                        ",
    "                        ",
    "                        ",
    "                        ",
    "                        ",
]

# ============================================================
# COIN - cheese wheel rotating (16x16)
# ============================================================
def coin_frames():
    base = [
        "                ",
        "    ########    ",
        "   #yyyyyyyy#   ",
        "  #yByByyyyyy#  ",
        " #yyyyByByyyyy# ",
        " #yByyyyyyyooy# ",
        "#yyyyByyByyyyyy#",
        "#yByyyyyyyyyByy#",
        "#yyByyyyyooyyyy#",
        "#yyyyyByyyyyByy#",
        "#yByyyyyyyyyyyo#",
        " #yyByyByyByyy# ",
        " #yyyyyyyyyByy# ",
        "  #yByyByByyy#  ",
        "   #yyyyyyyy#   ",
        "    ########    ",
    ]
    side1 = [
        "                ",
        "      #####     ",
        "     #yyyyy#    ",
        "     #yByyy#    ",
        "    #yyyyByy#   ",
        "    #yByyyyy#   ",
        "    #yyByyyy#   ",
        "    #yyyByyy#   ",
        "    #yyyyByy#   ",
        "    #yByyyyy#   ",
        "    #yyByyyy#   ",
        "    #yyyyByy#   ",
        "    #yByyyyy#   ",
        "     #yyByyy#   ",
        "      #####     ",
        "                ",
    ]
    thin = [
        "                ",
        "                ",
        "                ",
        "       ###      ",
        "      #yyy#     ",
        "      #yBy#     ",
        "      #yyy#     ",
        "      #yyy#     ",
        "      #yyy#     ",
        "      #yyy#     ",
        "      #yBy#     ",
        "      #yyy#     ",
        "       ###      ",
        "                ",
        "                ",
        "                ",
    ]
    side2 = [
        "                ",
        "      #####     ",
        "     #yyyyy#    ",
        "     #yyyByy#   ",
        "     #yyByyy#   ",
        "     #yByyyy#   ",
        "     #yyyByy#   ",
        "     #yyByyy#   ",
        "     #yByyyy#   ",
        "     #yyyByy#   ",
        "     #yyByyy#   ",
        "     #yByyyy#   ",
        "     #yyyByy#   ",
        "     #yyyyy#    ",
        "      #####     ",
        "                ",
    ]
    return [base, side1, thin, side2]


# ============================================================
# Brick block (32x32) - clean Mario-style
# ============================================================
BRICK = [
    "################################",
    "#dddddddddddddddddddddddddddddd#",
    "#dDDDDDDDDDDDDDDDDDDDDDDDDDDDDD#",
    "#dD###############D############",
    "#dD#ooooooooooooo#D#ooooooooo##",
    "#dD#ooooooooooooo#D#ooooooooo##",
    "#dD#ooooooooooooo#D#ooooooooo##",
    "#dD#ooooooooooooo#D#ooooooooo##",
    "#dD#ooooooooooooo#D#ooooooooo##",
    "#dD###############D############",
    "#dDDDDDDDDDDDDDDDDDDDDDDDDDDDDD#",
    "#dddddddddddddddddddddddddddddd#",
    "#dDDDDDDDDDDDDDDDDDDDDDDDDDDDDD#",
    "#dD####D############D##########",
    "#dD#ooD#ooooooooooo#D#ooooooo##",
    "#dD#ooD#ooooooooooo#D#ooooooo##",
    "#dD#ooD#ooooooooooo#D#ooooooo##",
    "#dD#ooD#ooooooooooo#D#ooooooo##",
    "#dD#ooD#ooooooooooo#D#ooooooo##",
    "#dD####D############D##########",
    "#dDDDDDDDDDDDDDDDDDDDDDDDDDDDDD#",
    "#dddddddddddddddddddddddddddddd#",
    "#dDDDDDDDDDDDDDDDDDDDDDDDDDDDDD#",
    "#dD###############D############",
    "#dD#ooooooooooooo#D#ooooooooo##",
    "#dD#ooooooooooooo#D#ooooooooo##",
    "#dD#ooooooooooooo#D#ooooooooo##",
    "#dD#ooooooooooooo#D#ooooooooo##",
    "#dD#ooooooooooooo#D#ooooooooo##",
    "#dD###############D############",
    "#dDDDDDDDDDDDDDDDDDDDDDDDDDDDDD#",
    "################################",
]

# Question block (32x32) - golden with question mark
QUESTION = [
    "################################",
    "#yyyyyyyyyyyyyyyyyyyyyyyyyyyyyy#",
    "#y############################y#",
    "#yo##########################oy#",
    "#yo###########yyyyyy##########oy#",
    "#yo#########yyyyyyyyyy########oy#",
    "#yo########yyy######yyy#######oy#",
    "#yo########yy##oooo##yy#######oy#",
    "#yo########yy#oo##oo#yy#######oy#",
    "#yo###########oo##oo#yy#######oy#",
    "#yo###############oo#yy#######oy#",
    "#yo##############oo##yy#######oy#",
    "#yo#############oo###yy#######oy#",
    "#yo############oo####yy#######oy#",
    "#yo###########oo#####yy#######oy#",
    "#yo###########oo####yy########oy#",
    "#yo###########oo####yy########oy#",
    "#yo##############yyyy#########oy#",
    "#yo###########################oy#",
    "#yo############yyyy###########oy#",
    "#yo###########yyyyyy##########oy#",
    "#yo###########yyyyyy##########oy#",
    "#yo############yyyy###########oy#",
    "#yo###########################oy#",
    "#yo###########################oy#",
    "#y############################y#",
    "#yyyyyyyyyyyyyyyyyyyyyyyyyyyyyy#",
    "################################",
    "                                ",
    "                                ",
    "                                ",
    "                                ",
]

# Empty/used block
USED_BLOCK = [
    "################################",
    "#++++++++++++++++++++++++++++++#",
    "#+############################+#",
    "#+#oooooooooooooooooooooooooo#+#",
    "#+#oooooooooooooooooooooooooo#+#",
    "#+#oooooooooooooooooooooooooo#+#",
    "#+#oooooooooooooooooooooooooo#+#",
    "#+#oooooooooooooooooooooooooo#+#",
    "#+#oooooooooooooooooooooooooo#+#",
    "#+#oooooooooooooooooooooooooo#+#",
    "#+#oooooooooooooooooooooooooo#+#",
    "#+#oooooooooooooooooooooooooo#+#",
    "#+#oooooooooooooooooooooooooo#+#",
    "#+#oooooooooooooooooooooooooo#+#",
    "#+#oooooooooooooooooooooooooo#+#",
    "#+#oooooooooooooooooooooooooo#+#",
    "#+#oooooooooooooooooooooooooo#+#",
    "#+#oooooooooooooooooooooooooo#+#",
    "#+#oooooooooooooooooooooooooo#+#",
    "#+#oooooooooooooooooooooooooo#+#",
    "#+#oooooooooooooooooooooooooo#+#",
    "#+#oooooooooooooooooooooooooo#+#",
    "#+#oooooooooooooooooooooooooo#+#",
    "#+#oooooooooooooooooooooooooo#+#",
    "#+############################+#",
    "#++++++++++++++++++++++++++++++#",
    "################################",
    "                                ",
    "                                ",
    "                                ",
    "                                ",
    "                                ",
]

# Pipe top (lip): 64w x 32h. Pipe is themed as a giant green cheese drainpipe.
PIPE_TOP = [
    "################################################################",
    "#LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL#",
    "#LuuuLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLuuLM#",
    "#LuuuLLLuMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMuLLuuLM#",
    "#LuuuLLLuMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMuLLuuLM#",
    "#LuuuLLLuMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMuLLuuLM#",
    "#LuuuLLLuMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMuLLuuLM#",
    "#LuuuLLLuMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMuLLuuLM#",
    "#LuuuLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLuuLM#",
    "#LuuuLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLuuLM#",
    "#LuuuLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLuuLM#",
    "#LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLM#",
    "################################################################",
    "################################################################",
    "  ############################################################  ",
    "  #LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLM  ",
    "  #LuuuLLuMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMuuuLM  ",
    "  #LuuuLLuMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMuuuLM  ",
    "  #LuuuLLuMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMuuuLM  ",
    "  #LuuuLLuMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMuuuLM  ",
    "  #LuuuLLuMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMuuuLM  ",
    "  #LuuuLLuMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMuuuLM  ",
    "  #LuuuLLuMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMuuuLM  ",
    "  #LuuuLLuMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMuuuLM  ",
    "  #LuuuLLuMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMuuuLM  ",
    "  #LuuuLLuMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMuuuLM  ",
    "  #LuuuLLuMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMuuuLM  ",
    "  #LuuuLLuMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMuuuLM  ",
    "  #LuuuLLuMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMuuuLM  ",
    "  #LuuuLLuMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMuuuLM  ",
    "  #LuuuLLuMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMuuuLM  ",
    "  #LuuuLLuMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMuuuLM  ",
]

# Pipe body: 60w x 32h (narrower section that goes underground)
PIPE_BODY = [
    "  ############################################################  ",
    "  #LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLM  ",
    "  #LuuuLLuMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMuuuLM  ",
    "  #LuuuLLuMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMuuuLM  ",
    "  #LuuuLLuMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMuuuLM  ",
    "  #LuuuLLuMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMuuuLM  ",
    "  #LuuuLLuMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMuuuLM  ",
    "  #LuuuLLuMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMuuuLM  ",
    "  #LuuuLLuMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMuuuLM  ",
    "  #LuuuLLuMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMuuuLM  ",
    "  #LuuuLLuMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMuuuLM  ",
    "  #LuuuLLuMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMuuuLM  ",
    "  #LuuuLLuMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMuuuLM  ",
    "  #LuuuLLuMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMuuuLM  ",
    "  #LuuuLLuMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMuuuLM  ",
    "  #LuuuLLuMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMuuuLM  ",
    "  #LuuuLLuMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMuuuLM  ",
    "  #LuuuLLuMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMuuuLM  ",
    "  #LuuuLLuMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMuuuLM  ",
    "  #LuuuLLuMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMuuuLM  ",
    "  #LuuuLLuMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMuuuLM  ",
    "  #LuuuLLuMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMuuuLM  ",
    "  #LuuuLLuMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMuuuLM  ",
    "  #LuuuLLuMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMuuuLM  ",
    "  #LuuuLLuMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMuuuLM  ",
    "  #LuuuLLuMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMuuuLM  ",
    "  #LuuuLLuMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMuuuLM  ",
    "  #LuuuLLuMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMuuuLM  ",
    "  #LuuuLLuMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMuuuLM  ",
    "  #LuuuLLuMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMuuuLM  ",
    "  #LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLM  ",
    "  ############################################################  ",
]

# Goal flag - tall pole 16x80 height
FLAG = [
    "      yyyyyy    ",
    "      yyByyy    ",
    "       yyyy     ",
    "        yy      ",
    "        oo      ",
    "       oooo     ",
    "       o##o#### ",
    "       o##oppp##",
    "       o##oppppp",
    "       o##opPPpp",
    "       o##opPPpp",
    "       o##oppppp",
    "       o##oppp##",
    "       o##oppp# ",
    "       o##op##  ",
    "       o##o     ",
    "       o##o     ",
    "       o##o     ",
    "       o##o     ",
    "       o##o     ",
    "       o##o     ",
    "       o##o     ",
    "       o##o     ",
    "       o##o     ",
    "       o##o     ",
    "       o##o     ",
    "       o##o     ",
    "       o##o     ",
    "       o##o     ",
    "       o##o     ",
    "       o##o     ",
    "       o##o     ",
    "       o##o     ",
    "       o##o     ",
    "       o##o     ",
    "       o##o     ",
    "       o##o     ",
    "       o##o     ",
    "       o##o     ",
    "       o##o     ",
    "       o##o     ",
    "       o##o     ",
    "       o##o     ",
    "       o##o     ",
    "       o##o     ",
    "       o##o     ",
    "       o##o     ",
    "       o##o     ",
    "       o##o     ",
    "       o##o     ",
    "       o##o     ",
    "       o##o     ",
    "       o##o     ",
    "       o##o     ",
    "       o##o     ",
    "       o##o     ",
    "       o##o     ",
    "       o##o     ",
    "       o##o     ",
    "       o##o     ",
    "       o##o     ",
    "       o##o     ",
    "       o##o     ",
    "       o##o     ",
    "       o##o     ",
    "       o##o     ",
    "       o##o     ",
    "       o##o     ",
    "       o##o     ",
    "       o##o     ",
    "       o##o     ",
    "       o##o     ",
    "       o##o     ",
    "       o##o     ",
    "       o##o     ",
    "       o##o     ",
    "      oo##oo    ",
    "     ooo##ooo   ",
    "    oooooooooo  ",
    "   oooooooooooo ",
]

# Cloud (decorative) 96x40
CLOUD = [
    "                                                                                                ",
    "                                                                                                ",
    "                                                                                                ",
    "                  ##############                                                                ",
    "              ####wwwwwwwwwwwwww####                ###############                             ",
    "            ##wwwwwwwwwwwwwwwwwwwwww##           ###wwwwwwwwwwwwwww####                        ",
    "          ##wwwwwwwwwwwwwwwwwwwwwwwwww##        #wwwwwwwwwwwwwwwwwwwww##                       ",
    "        ##wwwwwwwwwwwwwwwwwwwwwwwwwwwwwww##    #wwwwwwwwwwwwwwwwwwwwwwww##                     ",
    "      ##wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww####wwwwwwwwwwwwwwwwwwwwwwwwww##                   ",
    "    ##wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww##                ",
    "   #wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww#              ",
    "  #wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww#             ",
    " #wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww#            ",
    " #wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww#            ",
    " #wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww#            ",
    " #wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww#            ",
    "  ##################################################################################           ",
    "                                                                                                ",
    "                                                                                                ",
    "                                                                                                ",
]

# Hill background 96x40 - rolling hill
HILL = [
    "                                                                                                ",
    "                                                                                                ",
    "                                                                                                ",
    "                                                                                                ",
    "                                                                                                ",
    "                                                                                                ",
    "                              ##########                                                        ",
    "                            ##LLLLLLLLLL##                                                      ",
    "                           #LLLLLLLLLLLLLL#                                                     ",
    "                          #LLLLLLLLLLLLLLLL#                                                    ",
    "                         #LLLLLLMLLLLLLLLLLL#                                                   ",
    "                        #LLLLLLLLLLLLLLLLLLLL#                                                  ",
    "                       #LLLLLLLLLLLLLMLLLLLLLL#                                                 ",
    "                      #LLLLLLLLLLLLLLLLLLLLLLLL#                                                ",
    "                     #LLLLMLLLLLLLLLLLLLLLLLLLLL#                                               ",
    "                    #LLLLLLLLLLLLLLLLLLLLLLLLLLLL#                                              ",
    "                   #LLLLLLLLLLLLLLLLLLLLMLLLLLLLLL#                                             ",
    "                  #LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL#                                            ",
    "                 #LLLLLLLMLLLLLLLLLLLLLLLLLLLLLLLLLL#                                           ",
    "                #LLLLLLLLLLLLLLLLLLLLLLLLLMLLLLLLLLLL#                                          ",
    "               #LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL#                                         ",
    "              #LLLLLLLLLLLMLLLLLLLLLLLLLLLLLLLLLLLLLLLL#                                        ",
    "             #LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLMLLLL#                                       ",
    "            #LLLLLLLLLLLLLLLLLLLLLLLLMLLLLLLLLLLLLLLLLLLL#                                      ",
    "           #LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL#                                     ",
    "          #LLLLLLLLLLMLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL#                                    ",
    "         #LLLLLLLLLLLLLLLLLLLLLLLLLLLMLLLLLLLLLLLLLLLLLLLLLL#                                   ",
    "        #LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLMLLLLLL#                                  ",
    "       #LLLLLLLLLLLLLLMLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL#                                 ",
    "      #LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLMLLLLLLLLLLLLLLLLLLLL#                                ",
    "     #LLLLLLLLLLLLLLLLLLLLLLLMLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL#                                ",
    "    #LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL#                               ",
    "   #LLLLLLLLLMLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLMLLLLLLLLLLLLLLLLLL#                              ",
    "  #LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL#                             ",
    " #LLLLLLLLLLLLLLLLLLLMLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLMLLLLLLLLL#                            ",
    "#LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLMLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL#                           ",
    "####################################################################                           ",
    "                                                                                                ",
    "                                                                                                ",
    "                                                                                                ",
]

# Bush 48x16
BUSH = [
    "                                                ",
    "                                                ",
    "          ###       ###      ###                ",
    "        ##LLL##   ##LLL##  ##LLL##              ",
    "       #LLuLLLL###LLLuLLLL#LLLLLLL#              ",
    "     ##LLLLLLLLLLLLLLLLLLLLLLLLLLLL##           ",
    "    #LLuLLLLLuLLLLLLLLLLLLLLuLLLLLLLL#          ",
    "    #LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL#          ",
    "    #LLLLLuLLLLLLuLLLLLLLLLLLLLLuLLLL#          ",
    "    #LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL#          ",
    "    #MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM#          ",
    "    ######################################      ",
    "                                                ",
    "                                                ",
    "                                                ",
    "                                                ",
]

# Ground tile 32x32 - grass top + dirt
GROUND = [
    "uuuLuuLLLuuuuLLuuLLuuuLLuuuuLLuu",
    "LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL",
    "MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM",
    "ddddddddddddddddddddddddddddddDD",
    "dDddddDdddddddDdddDdddddDddDddDD",
    "dddDddddDDdddddDddddddDdddDdDdDD",
    "DddddDdddDdDddDddDddDdDdddDdDdDD",
    "dDdDDddddDddDddddDddDdDdDDddDdDD",
    "dDdddDdDdDdDdDdDdDdDdDdDdDdDdDDD",
    "dDdDdDdDdDdDdDdDdDdDdDdDdDdDdDDD",
    "DdDdDdDdDdDdDdDdDdDdDdDdDdDdDDDD",
    "dDdDdDdDdDdDdDdDdDdDdDdDdDdDdDDD",
    "dDdDDdDdDdDdDDdDdDdDdDdDDdDdDdDD",
    "dDdDdDdDdDDdDdDdDdDDdDdDdDdDdDDD",
    "DdDdDDdDdDdDdDdDDdDdDdDdDDdDdDDD",
    "dDdDdDdDDdDdDdDdDdDdDDdDdDdDdDDD",
    "dDdDdDdDdDdDdDDdDdDdDdDdDDdDdDDD",
    "DdDdDdDdDdDdDdDdDdDdDdDdDdDDdDDD",
    "dDdDdDdDDdDdDdDdDdDDdDdDdDdDdDDD",
    "dDdDdDdDdDdDdDDdDdDdDdDdDDdDdDDD",
    "DdDdDdDdDdDdDdDdDdDdDdDdDdDdDDDD",
    "dDdDdDdDdDDdDdDdDdDdDDdDdDdDdDDD",
    "dDdDdDdDdDdDdDdDdDDdDdDdDdDdDDDD",
    "DdDdDdDdDdDdDdDdDdDdDdDdDdDdDDDD",
    "dDdDdDdDDdDdDdDdDdDdDdDdDdDdDDDD",
    "dDdDdDdDdDdDdDDdDdDdDdDdDdDdDDDD",
    "DdDdDdDdDdDdDdDdDdDdDdDdDdDdDDDD",
    "dDdDdDdDdDdDdDDdDdDdDdDdDdDdDdDD",
    "dDdDdDdDDdDdDdDdDdDDdDdDdDdDdDDD",
    "dDdDdDdDdDdDdDdDdDdDdDDdDdDdDdDD",
    "DdDdDdDdDdDdDdDDdDdDdDdDdDdDdDDD",
    "DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD",
]


if __name__ == "__main__":
    render(PLAYER_IDLE,        name="player_idle_1")
    render(PLAYER_IDLE_BLINK,  name="player_idle_2_blink")
    render(PLAYER_IDLE_TAIL_R, name="player_idle_3_tail")
    render(PLAYER_IDLE_TAIL_U, name="player_idle_4_tail")
    render(PLAYER_WALK_1,      name="player_walk_1")
    render(PLAYER_WALK_2,      name="player_walk_2")
    render(PLAYER_JUMP,        name="player_jump")
    render(PLAYER_HURT,        name="player_hurt")

    render(ENEMY_CHEESE_1,       name="enemy_walk_1")
    render(ENEMY_CHEESE_2,       name="enemy_walk_2")
    render(ENEMY_CHEESE_SQUASH,  name="enemy_squash")

    for i, frame in enumerate(coin_frames(), 1):
        render(frame, name=f"coin_{i}")

    render(BRICK,       name="brick")
    render(QUESTION,    name="question_block")
    render(USED_BLOCK,  name="used_block")
    render(PIPE_TOP,    name="pipe_top")
    render(PIPE_BODY,   name="pipe_body")
    render(FLAG,        name="flag")
    render(CLOUD,       name="cloud")
    render(HILL,        name="hill")
    render(BUSH,        name="bush")
    render(GROUND,      name="ground")

    print("Generated all sprites in", OUT)

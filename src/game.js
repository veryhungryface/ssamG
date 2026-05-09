const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const gameShell = document.querySelector(".game-shell");
const startButton = document.getElementById("startButton");
const continueButton = document.getElementById("continueButton");
const homeButton = document.getElementById("homeButton");
const codexButton = document.getElementById("codexButton");
const screenActions = document.getElementById("screenActions");
const leaderboardList = document.getElementById("leaderboardList");
const leaderboardStatus = document.getElementById("leaderboardStatus");
const scoreModal = document.getElementById("scoreModal");
const scoreForm = document.getElementById("scoreForm");
const playerNameInput = document.getElementById("playerName");
const scoreModalScore = document.getElementById("scoreModalScore");
const scoreModalStatus = document.getElementById("scoreModalStatus");
const scoreSkipButton = document.getElementById("scoreSkipButton");
const aiboxModal = document.getElementById("aiboxModal");
const aiboxModalKicker = document.querySelector(".aibox-modal-kicker");
const aiboxModalImage = document.getElementById("aiboxModalImage");
const aiboxModalTitle = document.getElementById("aiboxModalTitle");
const aiboxModalDescription = document.getElementById("aiboxModalDescription");
const aiboxModalClose = document.getElementById("aiboxModalClose");
const codexModal = document.getElementById("codexModal");
const codexModalTitle = document.getElementById("codexModalTitle");
const codexCardList = document.getElementById("codexCardList");
const codexCardDetail = document.getElementById("codexCardDetail");
const codexModalClose = document.getElementById("codexModalClose");
const introBgm = document.getElementById("introBgm");
const bgm = document.getElementById("bgm");

ctx.imageSmoothingEnabled = false;

const VIEW_W = 1280;
const VIEW_H = 720;
const TOUCH_PERFORMANCE_MODE = window.matchMedia?.("(pointer: coarse), (any-pointer: coarse)").matches ?? false;
const MOBILE_FRAME_INTERVAL = TOUCH_PERFORMANCE_MODE ? 1000 / 45 : 0;
const SUPABASE_URL = "https://pacvofregyprqnunlsyi.supabase.co";
const SUPABASE_PUBLIC_KEY = "sb_publishable_My-5-811CjFD-McH8IfrKA_dHsJwcGb";
const LEADERBOARD_LIMIT = 10;
const PLAYER_NAME_STORAGE_KEY = "saengjwi_player_name";
const SAVE_STORAGE_KEY = "saengjwi_adventure_save_v1";
const PROGRESS_STORAGE_KEY = "saengjwi_adventure_progress_v1";
const CODEX_STORAGE_KEY = "saengjwi_aibox_codex_v1";
const GRAVITY = 2450;
const MOVE_SPEED = 440;
const BOOST_SPEED = 560;
const JUMP_SPEED = 965;
const STOMP_BOUNCE_SPEED = 650;
const STOMP_JUMP_BOUNCE_MULTIPLIER = 1.5;
const STOMP_JUMP_GRACE_TIME = 0.18;
const DIALOGUE_DISMISS_GRACE = 0.62;
const COYOTE_TIME = 0.12;
const JUMP_BUFFER_TIME = 0.14;
const PLAYER_FOOT_SINK = 22;
const PLAYER_DRAW_SIZE = 166;
const PLAYER_SPRITE_FOOT_OFFSET = 68;
const PLAYER_COLLISION_INSET_X = 11;
const PLAYER_COLLISION_TOP_INSET = 8;
const ENEMY_FOOT_SINK = 12;
const WORLD_FLOOR = 760;
const AIBOX_ASSET_ROOT = "assets/aibox";

const AIBOX_ITEM_DEFS = [
  {
    id: "parent_message_helper",
    title: "학부모 메시지 도우미",
    description: "어려운 학부모 답변을 따뜻하게 정리해줘요.",
    icon: "items/aibox_icons/parent_message_helper.png",
    card: "items/aibox_cards/parent_message_helper.png",
    fx: "fx/message_soften.png"
  },
  {
    id: "pdf_toolbox",
    title: "PDF 도구 모음",
    description: "복잡한 PDF 문서를 빠르게 다룰 수 있어요.",
    icon: "items/aibox_icons/pdf_toolbox.png",
    card: "items/aibox_cards/pdf_toolbox.png",
    fx: "fx/document_cleanse.png"
  },
  {
    id: "hwp_studio",
    title: "HWP Studio",
    description: "공문과 문서를 HWP 형식으로 빠르게 만들고 정리해요.",
    icon: "items/aibox_icons/hwp_studio.png",
    card: "items/aibox_cards/hwp_studio.png",
    fx: "fx/document_cleanse.png"
  },
  {
    id: "meeting_recorder",
    title: "회의록 녹음기",
    description: "회의 내용을 기록하고 정리하는 데 도움을 줘요.",
    icon: "items/aibox_icons/meeting_recorder.png",
    card: "items/aibox_cards/meeting_recorder.png",
    fx: "fx/record_wave_absorb.png"
  },
  {
    id: "quiz_generator",
    title: "퀴즈 생성기",
    description: "수업용 퀴즈를 빠르게 만들 수 있어요.",
    icon: "items/aibox_icons/quiz_generator.png",
    card: "items/aibox_cards/quiz_generator.png",
    fx: "fx/quiz_burst.png"
  },
  {
    id: "image_style_converter",
    title: "이미지 스타일 변환기",
    description: "수업 이미지를 원하는 분위기로 바꿔줘요.",
    icon: "items/aibox_icons/image_style_converter.png",
    card: "items/aibox_cards/image_style_converter.png",
    fx: "fx/style_transform.png"
  },
  {
    id: "book_protagonist",
    title: "책 속 주인공 되기",
    description: "책 내용을 체험형 활동으로 바꿔줘요.",
    icon: "items/aibox_icons/book_protagonist.png",
    card: "items/aibox_cards/book_protagonist.png",
    fx: "fx/storybook_portal.png"
  },
  {
    id: "infographic_generator",
    title: "인포그래픽 생성기",
    description: "수업 자료를 한눈에 보이는 그림 자료로 정리해줘요.",
    icon: "items/aibox_icons/infographic_generator.png",
    card: "items/aibox_cards/infographic_generator.png",
    fx: "fx/infographic_reveal.png"
  },
  {
    id: "online_assessment_solver",
    title: "온라인 평가지 풀기",
    description: "온라인 평가 문항을 빠르게 점검할 수 있어요.",
    icon: "items/aibox_icons/online_assessment_solver.png",
    card: "items/aibox_cards/online_assessment_solver.png"
  },
  {
    id: "aibox_blue_cube",
    title: "AI Box 블루 큐브",
    description: "민감한 정보를 차분히 확인하도록 도와줘요.",
    icon: "items/aibox_icons/aibox_blue_cube.png",
    card: "items/aibox_cards/aibox_blue_cube.png"
  }
];

const AIBOX_ITEMS_BY_ID = Object.fromEntries(AIBOX_ITEM_DEFS.map((item) => [item.id, item]));

const AIBOX_BOSS_DEFS = [
  {
    id: "gongmun_monster",
    title: "공문괴물",
    line: "공문 더미에 파묻혀라!",
    weakTo: ["hwp_studio"],
    reward: "hwp_studio",
    sprite: "enemies/gongmun_monster.png",
    color: "#ffd166"
  },
  {
    id: "counseling_ghost",
    title: "상담귀신",
    line: "이 말, 어떻게 답할 수 있겠어?",
    weakTo: ["parent_message_helper"],
    reward: "parent_message_helper",
    sprite: "enemies/counseling_ghost.png",
    color: "#97e7ff"
  },
  {
    id: "lessonprep_zombie",
    title: "수업준비좀비",
    line: "내일 수업 준비는 끝났나?",
    weakTo: ["infographic_generator", "image_style_converter"],
    reward: "infographic_generator",
    sprite: "enemies/lessonprep_zombie.png",
    color: "#9dff8b"
  },
  {
    id: "minutes_wraith",
    title: "회의록망령",
    line: "방금 한 말, 전부 기록해야지!",
    weakTo: ["meeting_recorder"],
    reward: "meeting_recorder",
    sprite: "enemies/minutes_wraith.png",
    color: "#c59cff"
  },
  {
    id: "quiz_bug",
    title: "퀴즈버그",
    line: "문제는 끝없이 늘어난다!",
    weakTo: ["quiz_generator", "online_assessment_solver"],
    reward: "quiz_generator",
    sprite: "enemies/quiz_bug.png",
    color: "#ffdb5c"
  },
  {
    id: "privacy_slime",
    title: "개인정보슬라임",
    line: "혹시 중요한 정보가 새고 있지 않을까?",
    weakTo: ["aibox_blue_cube"],
    reward: "aibox_blue_cube",
    sprite: "enemies/privacy_slime.png",
    color: "#72f5d1"
  }
];

const AIBOX_BOSSES_BY_ID = Object.fromEntries(AIBOX_BOSS_DEFS.map((boss) => [boss.id, boss]));

const aiboxAssetPaths = {
  ...Object.fromEntries(AIBOX_ITEM_DEFS.flatMap((item) => [
    [`aiboxIcon_${item.id}`, `${AIBOX_ASSET_ROOT}/${item.icon}`],
    [`aiboxCard_${item.id}`, `${AIBOX_ASSET_ROOT}/${item.card}`],
    ...(item.fx ? [[`aiboxFx_${item.id}`, `${AIBOX_ASSET_ROOT}/${item.fx}`]] : [])
  ])),
  ...Object.fromEntries(AIBOX_BOSS_DEFS.map((boss) => [`aiboxBoss_${boss.id}`, `${AIBOX_ASSET_ROOT}/${boss.sprite}`]))
};

const assetPaths = {
  background: "assets/map/saengjwi-background-1536x864.png",
  runSheet: "assets/sprites/mouse-run/sheet-transparent.png",
  jumpSheet: "assets/sprites/mouse-jump/sheet-transparent.png",
  turtleSheet: "assets/sprites/sprout-turtle/sheet-transparent.png",
  coin: "assets/props/coin.png",
  star: "assets/props/star.png",
  carrot: "assets/props/carrot.png",
  pawBlock: "assets/props/paw-block.png",
  stoneBlock: "assets/props/stone-block.png",
  sign: "assets/props/arrow-sign.png",
  flag: "assets/props/finish-flag.png",
  cheese: "assets/props/cheese.png",
  timer: "assets/props/timer.png",
  titleBadge: "assets/ui/saengjwi-title-badge.png",
  generatedWordmark: "assets/ui/saengjwi-wordmark-exact.png",
  userTitleLogo: "assets/ui/user-title-logo.png",
  introMouseBadge: "assets/ui/intro-mouse-badge.png",
  bat: "assets/generated/bat-sheet.png",
  frog: "assets/generated/frog-sheet.png?v=20260510-frog-refresh",
  mole: "assets/generated/mole-sheet.png",
  boar: "assets/generated/boar-sheet.png",
  crow: "assets/generated/crow-sheet.png",
  goblin: "assets/generated/goblin-sheet.png",
  bear: "assets/generated/bear-sheet.png",
  catboss: "assets/generated/catboss-sheet.png",
  shield: "assets/generated/shield.png",
  magnet: "assets/generated/magnet.png",
  clock: "assets/generated/clock.png",
  bolt: "assets/generated/bolt.png",
  spike: "assets/generated/spike.png",
  water: "assets/generated/water.png",
  fadePlatform: "assets/generated/fade-platform.png",
  movingPlatform: "assets/generated/moving-platform.png",
  platformLeft: "assets/props/platform-strip/platform-left/prop.png",
  platformMid: "assets/props/platform-strip/platform-mid/prop.png",
  platformRight: "assets/props/platform-strip/platform-right/prop.png",
  ...aiboxAssetPaths
};

const soundPaths = {
  jump: "assets/sound/jump.MP3",
  coin: "assets/sound/coin.MP3",
  cheese: "assets/sound/cheese.MP3",
  complete: "assets/sound/complete.MP3",
  die: "assets/sound/die.MP3",
  hit: "assets/sound/hit.MP3",
  button: "assets/sound/button.MP3",
  boss: "assets/sound/boss.MP3",
  getitem: "assets/sound/getitem.MP3",
  openDogam: "assets/sound/open-dogam.MP3",
  click: "assets/sound/click.MP3",
  gameover: "assets/sound/gameover.MP3"
};

const fallbackLevel = {
  world: { width: 3620, height: 720 },
  spawn: { x: 128, y: 472 },
  goal: { x: 3404, y: 514, w: 86, h: 118 },
  platforms: [
    { x: -120, y: 610, w: 850, h: 92 },
    { x: 760, y: 552, w: 500, h: 86 },
    { x: 1325, y: 484, w: 470, h: 82 },
    { x: 1890, y: 402, w: 540, h: 82 },
    { x: 2490, y: 512, w: 430, h: 84 },
    { x: 2980, y: 610, w: 760, h: 92 }
  ],
  blocks: [
    { x: 520, y: 462, type: "stone" }, { x: 594, y: 462, type: "stone" },
    { x: 668, y: 462, type: "paw" }, { x: 742, y: 462, type: "stone" },
    { x: 2072, y: 520, type: "paw" }, { x: 2148, y: 520, type: "star" },
    { x: 2224, y: 520, type: "carrot" }
  ],
  coins: [{ x: 372, y: 498 }, { x: 468, y: 488 }],
  cheeses: [{ x: 170, y: 545 }],
  stars: [{ x: 704, y: 372 }],
  carrots: [{ x: 2260, y: 432 }],
  signs: [{ x: 126, y: 512 }],
  enemies: [{ x: 912, y: 494, minX: 810, maxX: 1185, speed: 58 }],
  goal: { x: 3404, y: 514, w: 86, h: 118 }
};

const state = {
  mode: "ready",
  levelIndex: 0,
  time: 283,
  score: 0,
  coins: 0,
  cheeses: 0,
  lives: 3,
  cameraX: 0,
  message: "",
  boost: 0,
  jumpBoost: 0,
  invincible: 0,
  magnet: 0,
  timeStop: 0,
  shield: 0,
  level: null,
  player: null,
  particles: [],
  enemies: [],
  projectiles: [],
  aiboxInventory: new Set(),
  aiboxCards: new Set(),
  newCodexThisLevel: [],
  activeCard: null,
  cardTimer: 0,
  pickupHint: null,
  pickupHintLine: "",
  pickupHintTimer: 0,
  cardModalOpen: false,
  cardModalItem: null,
  codexModalOpen: false,
  selectedCodexCard: null,
  notice: "",
  noticeTimer: 0,
  bossCutin: null,
  bossCutinTimer: 0,
  dialogueLock: null,
  dialogueDismissDelay: 0,
  pauseTimer: 0,
  scorePrompted: false,
  scoreSubmitted: false
};

const leaderboard = {
  scores: [],
  loading: true,
  error: ""
};

const input = {
  left: false,
  right: false,
  jump: false,
  jumpPressed: false
};

const keys = new Map([
  ["ArrowLeft", "left"], ["KeyA", "left"],
  ["ArrowRight", "right"], ["KeyD", "right"],
  ["ArrowUp", "jump"], ["KeyW", "jump"], ["Space", "jump"]
]);

const images = await loadImages(assetPaths);
const sounds = loadSounds(soundPaths);
const levelsData = await loadLevels();
resetGame(readInitialLevelIndex());
restorePersistentCodex();
setStartVisible(true);
requestAnimationFrame(loop);
renderLeaderboard();
void fetchLeaderboard();

startButton.addEventListener("click", () => {
  playSfx("button", 0.42);
  handlePrimaryAction();
});

continueButton?.addEventListener("click", () => {
  playSfx("button", 0.42);
  continueSavedGame();
});

homeButton?.addEventListener("click", () => {
  playSfx("button", 0.42);
  returnToTitle();
});

codexButton?.addEventListener("click", () => {
  playSfx("button", 0.36);
  openCodexModal();
});

scoreForm?.addEventListener("submit", (event) => {
  playSfx("button", 0.36);
  void handleScoreSubmit(event);
});
scoreSkipButton?.addEventListener("click", () => {
  playSfx("button", 0.36);
  hideScoreModal();
  returnToTitle();
});

aiboxModalClose?.addEventListener("click", () => {
  playSfx("button", 0.36);
  hideAiboxCardModal();
});

codexModalClose?.addEventListener("click", () => {
  playSfx("button", 0.36);
  hideCodexModal();
});

canvas.addEventListener("pointerdown", (event) => {
  if (dismissActiveDialogue()) {
    event.preventDefault();
    return;
  }
  maybeResumeIntro(event);
});

document.addEventListener("selectstart", suppressGameSelection, { capture: true });
document.addEventListener("dragstart", suppressGameSelection, { capture: true });
document.addEventListener("contextmenu", suppressGameSelection, { capture: true });

window.addEventListener("keydown", (event) => {
  if (state.codexModalOpen) {
    event.preventDefault();
    if (event.code === "Escape" || event.code === "Space" || event.code === "Enter") {
      playSfx("button", 0.3);
      hideCodexModal();
    }
    return;
  }
  if (state.cardModalOpen) {
    event.preventDefault();
    if (event.code === "Escape" || event.code === "Space" || event.code === "Enter") {
      playSfx("button", 0.3);
      hideAiboxCardModal();
    }
    return;
  }
  if (dismissActiveDialogue()) {
    event.preventDefault();
    return;
  }
  maybeResumeIntro(event);
  if (state.mode !== "playing" && (event.code === "Space" || event.code === "Enter")) {
    event.preventDefault();
    playSfx("button", 0.42);
    handlePrimaryAction();
    return;
  }
  const key = keys.get(event.code);
  if (!key) return;
  event.preventDefault();
  if (key === "jump" && !input.jump) input.jumpPressed = true;
  input[key] = true;
});

window.addEventListener("keyup", (event) => {
  const key = keys.get(event.code);
  if (!key) return;
  input[key] = false;
});

document.querySelectorAll(".touch-controls button").forEach((button) => {
  const key = button.dataset.key;
  const press = (event) => {
    event.preventDefault();
    if (event.pointerId != null) button.setPointerCapture?.(event.pointerId);
    if (dismissActiveDialogue()) return;
    if (state.mode !== "playing") handlePrimaryAction();
    if (key === "jump" && !input.jump) input.jumpPressed = true;
    input[key] = true;
  };
  const release = (event) => {
    event.preventDefault();
    input[key] = false;
    try {
      if (event.pointerId != null && button.hasPointerCapture?.(event.pointerId)) button.releasePointerCapture(event.pointerId);
    } catch {}
  };
  button.addEventListener("pointerdown", press, { passive: false });
  button.addEventListener("pointerup", release, { passive: false });
  button.addEventListener("pointercancel", release, { passive: false });
  button.addEventListener("lostpointercapture", release, { passive: false });
});

document.querySelector(".touch-controls")?.addEventListener("touchmove", (event) => {
  event.preventDefault();
}, { passive: false });
document.querySelector(".touch-controls")?.addEventListener("touchstart", (event) => {
  event.preventDefault();
}, { passive: false });

function suppressGameSelection(event) {
  const target = event.target;
  if (!(target instanceof Element)) return;
  if (target.closest("input, textarea, select, [contenteditable='true']")) return;
  if (target === canvas || target.closest(".touch-controls") || target.closest(".game-shell")) {
    event.preventDefault();
  }
}

function maybeResumeIntro(event) {
  if (state.mode !== "ready") return;
  if (event.target === startButton) return;
  if (event.type === "keydown" && (event.code === "Space" || event.code === "Enter")) return;
  playIntro();
}

function dismissActiveDialogue() {
  if (state.mode !== "playing" || !state.dialogueLock) return false;
  if (state.dialogueDismissDelay > 0) return true;
  const lock = state.dialogueLock;
  state.dialogueLock = null;
  state.dialogueDismissDelay = 0;
  state.pauseTimer = 0;
  if (lock === "boss") {
    state.bossCutin = null;
    state.bossCutinTimer = 0;
    fadeOutSound("boss", 0.55);
  }
  if (lock === "pickup") {
    state.pickupHint = null;
    state.pickupHintLine = "";
    state.pickupHintTimer = 0;
  }
  return true;
}

async function loadImages(paths) {
  const entries = await Promise.all(Object.entries(paths).map(([name, src]) => new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve([name, image]);
    image.onerror = () => reject(new Error(`Failed to load ${src}`));
    image.src = src;
  })));
  return Object.fromEntries(entries);
}

function loadSounds(paths) {
  return Object.fromEntries(Object.entries(paths).map(([name, src]) => {
    const sound = new Audio(src);
    sound.preload = "auto";
    sound.volume = name === "gameover" ? 0.62 : 0.48;
    return [name, sound];
  }));
}

async function loadLevels() {
  try {
    const response = await fetch("data/levels.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const levels = await response.json();
    return Array.isArray(levels) ? levels : [levels];
  } catch {
    return [structuredClone(fallbackLevel)];
  }
}

function leaderboardHeaders(extra = {}) {
  return {
    apikey: SUPABASE_PUBLIC_KEY,
    ...extra
  };
}

function leaderboardUrl(query) {
  return `${SUPABASE_URL}/rest/v1/best_scores?${query}`;
}

async function fetchLeaderboard() {
  leaderboard.loading = true;
  leaderboard.error = "";
  renderLeaderboard();
  try {
    const query = `select=player_name,score,level,created_at&order=score.desc,created_at.asc&limit=${LEADERBOARD_LIMIT}`;
    const response = await fetch(leaderboardUrl(query), {
      headers: leaderboardHeaders(),
      cache: "no-store"
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const scores = await response.json();
    leaderboard.scores = Array.isArray(scores) ? scores : [];
  } catch (error) {
    leaderboard.error = "랭킹 연결 실패";
    console.warn("Leaderboard fetch failed", error);
  } finally {
    leaderboard.loading = false;
    renderLeaderboard();
  }
}

function renderLeaderboard() {
  if (!leaderboardList || !leaderboardStatus) return;
  leaderboardList.replaceChildren();

  if (leaderboard.loading) {
    appendLeaderboardMessage("불러오는 중");
    leaderboardStatus.textContent = "";
    return;
  }

  if (leaderboard.error) {
    appendLeaderboardMessage("기록 대기");
    leaderboardStatus.textContent = leaderboard.error;
    return;
  }

  if (!leaderboard.scores.length) {
    appendLeaderboardMessage("첫 기록을 기다리는 중");
    leaderboardStatus.textContent = "";
    return;
  }

  leaderboard.scores.slice(0, LEADERBOARD_LIMIT).forEach((entry, index) => {
    const row = document.createElement("li");
    const rank = document.createElement("span");
    const name = document.createElement("span");
    const score = document.createElement("span");
    rank.textContent = `${index + 1}`;
    name.textContent = normalizePlayerName(entry.player_name);
    score.textContent = String(Number(entry.score) || 0).padStart(6, "0");
    name.className = "rank-name";
    score.className = "rank-score";
    row.append(rank, name, score);
    leaderboardList.append(row);
  });
  leaderboardStatus.textContent = "";
}

function appendLeaderboardMessage(text) {
  const row = document.createElement("li");
  row.className = "leaderboard-empty";
  row.textContent = text;
  leaderboardList.append(row);
}

function normalizePlayerName(name) {
  return String(name || "쌤쥐").trim().slice(0, 12) || "쌤쥐";
}

async function handleScoreSubmit(event) {
  event.preventDefault();
  if (!scoreForm || !playerNameInput || !scoreModalStatus) return;
  const playerName = normalizePlayerName(playerNameInput.value);
  if (!playerName) {
    scoreModalStatus.textContent = "이름을 입력하세요";
    return;
  }

  setScoreFormBusy(true);
  scoreModalStatus.textContent = "저장 중";
  try {
    await submitScore(playerName);
    localStorage.setItem(PLAYER_NAME_STORAGE_KEY, playerName);
    state.scoreSubmitted = true;
    scoreModalStatus.textContent = "저장 완료";
    hideScoreModal();
    await fetchLeaderboard();
    returnToTitle();
  } catch (error) {
    scoreModalStatus.textContent = "저장 실패";
    console.warn("Score submit failed", error);
  } finally {
    setScoreFormBusy(false);
  }
}

async function submitScore(playerName) {
  const payload = {
    player_name: playerName,
    score: Math.max(0, Math.floor(state.score)),
    level: Math.max(1, state.levelIndex + 1)
  };
  const response = await fetch(`${SUPABASE_URL}/rest/v1/best_scores`, {
    method: "POST",
    headers: leaderboardHeaders({
      "Content-Type": "application/json",
      Prefer: "return=minimal"
    }),
    body: JSON.stringify(payload)
  });
  if (!response.ok) throw new Error(await response.text());
}

function setScoreFormBusy(busy) {
  scoreForm?.querySelectorAll("button, input").forEach((control) => {
    control.disabled = busy;
  });
}

async function maybePromptScoreSubmission() {
  if (!scoreModal || state.scorePrompted || state.scoreSubmitted || state.score <= 0) return false;
  if (leaderboard.loading || leaderboard.error) await fetchLeaderboard();
  if (!isTopTenScore(state.score)) return false;
  state.scorePrompted = true;
  scoreModalScore.textContent = String(Math.max(0, Math.floor(state.score))).padStart(6, "0");
  playerNameInput.value = localStorage.getItem(PLAYER_NAME_STORAGE_KEY) || "";
  scoreModalStatus.textContent = "";
  screenActions.classList.add("hidden");
  if (gameShell) gameShell.dataset.scoreModal = "open";
  scoreModal.classList.remove("hidden");
  setTimeout(() => playerNameInput?.focus(), 80);
  return true;
}

function isTopTenScore(score) {
  const current = Math.max(0, Math.floor(Number(score) || 0));
  if (current <= 0 || leaderboard.error) return false;
  const scores = leaderboard.scores.map((entry) => Number(entry.score) || 0).sort((a, b) => b - a);
  return scores.length < LEADERBOARD_LIMIT || current > scores[LEADERBOARD_LIMIT - 1];
}

function hideScoreModal() {
  scoreModal?.classList.add("hidden");
  if (gameShell) delete gameShell.dataset.scoreModal;
}

function readInitialLevelIndex() {
  const queryLevel = Number(new URLSearchParams(window.location.search).get("level"));
  return Number.isFinite(queryLevel) && queryLevel > 0 ? clamp(Math.floor(queryLevel) - 1, 0, levelsData.length - 1) : 0;
}

function resetGame(levelIndex = 0) {
  setupLevel(levelIndex, { mode: "ready", keepStats: false });
}

function setupLevel(levelIndex, { mode = "ready", keepStats = false } = {}) {
  const previousScore = state.score;
  const previousCoins = state.coins;
  const previousLives = state.lives;
  const previousAiboxInventory = state.aiboxInventory;
  const previousAiboxCards = state.aiboxCards;
  const safeIndex = clamp(levelIndex, 0, levelsData.length - 1);
  const level = structuredClone(levelsData[safeIndex] || fallbackLevel);
  state.level = level;
  state.levelIndex = safeIndex;
  state.mode = mode;
  state.time = level.time ?? 283;
  state.score = keepStats ? previousScore : 0;
  state.coins = keepStats ? previousCoins : 0;
  state.cheeses = 0;
  state.lives = keepStats ? previousLives : 3;
  state.boost = 0;
  state.jumpBoost = 0;
  state.invincible = 0;
  state.magnet = 0;
  state.timeStop = 0;
  state.shield = keepStats ? state.shield : 0;
  state.aiboxInventory = keepStats ? previousAiboxInventory : new Set();
  state.aiboxCards = keepStats ? previousAiboxCards : new Set();
  state.newCodexThisLevel = [];
  state.activeCard = null;
  state.cardTimer = 0;
  state.pickupHint = null;
  state.pickupHintLine = "";
  state.pickupHintTimer = 0;
  state.cardModalOpen = false;
  state.cardModalItem = null;
  state.codexModalOpen = false;
  state.selectedCodexCard = null;
  hideAiboxCardModal(false);
  hideCodexModal(false);
  state.notice = "";
  state.noticeTimer = 0;
  state.bossCutin = null;
  state.bossCutinTimer = 0;
  state.dialogueLock = null;
  state.dialogueDismissDelay = 0;
  state.pauseTimer = 0;
  stopSound("boss");
  state.cameraX = 0;
  state.message = "";
  state.particles = [];
  state.projectiles = [];
  if (!keepStats) {
    state.scorePrompted = false;
    state.scoreSubmitted = false;
  }
  for (const list of ["coins", "cheeses", "stars", "carrots", "boosts", "shields", "magnets", "clocks", "aiboxItems", "hazards", "signs"]) {
    level[list] ||= [];
  }
  level.enemies ||= [];
  level.blocks ||= [];
  level.platforms ||= [];
  state.enemies = level.enemies.map((enemy, index) => ({
    ...enemyDefaults(enemy.type),
    ...enemy,
    id: index,
    baseX: enemy.x,
    baseY: enemy.y,
    dir: index % 2 === 0 ? 1 : -1,
    hp: enemy.hp ?? enemyDefaults(enemy.type).hp,
    maxHp: enemy.hp ?? enemyDefaults(enemy.type).hp,
    cooldown: enemy.cooldown ?? 0.8 + index * 0.31,
    leapCooldown: enemy.leapCooldown ?? 0.5 + index * 0.12,
    attackCooldown: enemy.attackCooldown ?? 0.7 + index * 0.17,
    damageCooldown: 0,
    hitStun: 0,
    knockbackVx: 0,
    recoilTimer: 0,
    recoilDir: 0,
    vy: 0,
    introShown: false,
    dead: false,
    frame: 0
  }));
  state.player = {
    x: level.spawn.x,
    y: level.spawn.y,
    w: 58,
    h: 74,
    vx: 0,
    vy: 0,
    dir: 1,
    onGround: false,
    coyote: 0,
    jumpBuffer: 0,
    stompBoostTimer: 0,
    invincible: 0,
    frameTime: 0,
    runFrame: 0,
    jumpFrame: 0
  };
  for (const list of ["coins", "cheeses", "stars", "carrots", "boosts", "shields", "magnets", "clocks", "aiboxItems"]) {
    level[list] = level[list].map((item, index) => ({ ...item, id: index, taken: false, pulse: index * 0.37 }));
  }
  level.blocks = level.blocks.map((block, index) => ({
    ...block,
    id: index,
    w: block.w ?? 68,
    h: block.h ?? 68,
    used: false,
    revealed: !block.hidden,
    bump: 0
  }));
  level.platforms = level.platforms.map((platform, index) => ({
    kind: "normal",
    ...platform,
    id: index,
    baseX: platform.x,
    baseY: platform.y,
    dir: platform.dir ?? 1,
    stepped: false,
    fadeTimer: 0,
    hidden: false
  }));
  setStartVisible(mode !== "playing");
  if (mode === "ready") playIntro();
}

function readSavedGame() {
  const data = readStorageJson(SAVE_STORAGE_KEY, null);
  const progress = readProgress();
  if (!data || data.version !== 1) {
    return progress ? createFallbackSave(progress.highestLevelIndex) : null;
  }
  const savedLevelIndex = Number(data.levelIndex) || 0;
  const levelIndex = clamp(Math.max(savedLevelIndex, progress?.highestLevelIndex ?? 0), 0, levelsData.length - 1);
  return {
    ...data,
    levelIndex,
    score: Math.max(0, Math.floor(Number(data.score) || 0)),
    coins: Math.max(0, Math.floor(Number(data.coins) || 0)),
    lives: clamp(Math.floor(Number(data.lives) || 3), 1, 3),
    shield: Math.max(0, Math.floor(Number(data.shield) || 0)),
    aiboxInventory: filterKnownAiboxIds(data.aiboxInventory),
    aiboxCards: filterKnownAiboxIds(data.aiboxCards)
  };
}

function createFallbackSave(levelIndex) {
  return {
    version: 1,
    levelIndex: clamp(levelIndex, 0, levelsData.length - 1),
    score: 0,
    coins: 0,
    lives: 3,
    shield: 0,
    aiboxInventory: [],
    aiboxCards: readSavedCodexIds()
  };
}

function hasSavedGame() {
  return Boolean(readSavedGame());
}

function saveGame({ levelIndex = state.levelIndex, resetStats = false } = {}) {
  if (!state.level) return;
  const safeLevelIndex = clamp(levelIndex, 0, levelsData.length - 1);
  const codexCards = mergeCodexIds(state.aiboxCards);
  const saved = readStorageJson(SAVE_STORAGE_KEY, null);
  const aiboxInventory = filterKnownAiboxIds([
    ...(Array.isArray(saved?.aiboxInventory) ? saved.aiboxInventory : []),
    ...Array.from(state.aiboxInventory)
  ]);
  const payload = {
    version: 1,
    levelIndex: safeLevelIndex,
    score: resetStats ? 0 : Math.max(0, Math.floor(state.score)),
    coins: resetStats ? 0 : Math.max(0, Math.floor(state.coins)),
    lives: resetStats ? 3 : clamp(Math.floor(state.lives || 3), 1, 3),
    shield: resetStats ? 0 : Math.max(0, Math.floor(state.shield || 0)),
    aiboxInventory,
    aiboxCards: codexCards,
    updatedAt: new Date().toISOString()
  };
  state.aiboxCards = new Set(codexCards);
  saveProgress(safeLevelIndex);
  localStorage.setItem(SAVE_STORAGE_KEY, JSON.stringify(payload));
  saveCodex();
  if (state.mode !== "playing") setStartVisible(true);
}

function restoreSavedStats(saved) {
  state.score = saved.score;
  state.coins = saved.coins;
  state.lives = saved.lives;
  state.shield = saved.shield;
  state.aiboxInventory = new Set(saved.aiboxInventory);
  state.aiboxCards = new Set([...readSavedCodexIds(), ...saved.aiboxCards]);
  state.newCodexThisLevel = [];
  state.scorePrompted = false;
  state.scoreSubmitted = false;
}

function restorePersistentCodex() {
  state.aiboxCards = new Set(readSavedCodexIds());
}

function saveCodex() {
  const cards = mergeCodexIds(state.aiboxCards);
  state.aiboxCards = new Set(cards);
  localStorage.setItem(CODEX_STORAGE_KEY, JSON.stringify(cards));
}

function readSavedCodexIds() {
  const saved = readStorageJson(CODEX_STORAGE_KEY, []);
  const game = readStorageJson(SAVE_STORAGE_KEY, null);
  return filterKnownAiboxIds([
    ...(Array.isArray(saved) ? saved : []),
    ...(Array.isArray(game?.aiboxCards) ? game.aiboxCards : [])
  ]);
}

function mergeCodexIds(ids = []) {
  return filterKnownAiboxIds([
    ...readSavedCodexIds(),
    ...(Array.isArray(ids) ? ids : Array.from(ids || []))
  ]);
}

function readProgress() {
  const progress = readStorageJson(PROGRESS_STORAGE_KEY, null);
  if (!progress || progress.version !== 1) return null;
  return {
    version: 1,
    highestLevelIndex: clamp(Number(progress.highestLevelIndex) || 0, 0, levelsData.length - 1),
    updatedAt: progress.updatedAt || ""
  };
}

function saveProgress(levelIndex) {
  const previous = readProgress();
  const highestLevelIndex = Math.max(previous?.highestLevelIndex ?? 0, clamp(levelIndex, 0, levelsData.length - 1));
  localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify({
    version: 1,
    highestLevelIndex,
    updatedAt: new Date().toISOString()
  }));
}

function filterKnownAiboxIds(ids) {
  return [...new Set((Array.isArray(ids) ? ids : []).filter((id) => AIBOX_ITEMS_BY_ID[id]))];
}

function readStorageJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function clearLocalProgress() {
  localStorage.removeItem(SAVE_STORAGE_KEY);
  localStorage.removeItem(PROGRESS_STORAGE_KEY);
  localStorage.removeItem(CODEX_STORAGE_KEY);
  state.aiboxInventory = new Set();
  state.aiboxCards = new Set();
  state.newCodexThisLevel = [];
  state.selectedCodexCard = null;
}

function handlePrimaryAction() {
  if (state.mode === "ready" || state.mode === "win" || state.mode === "lose") {
    startFreshGame();
    return;
  }
  if (state.mode === "level-clear") {
    startNextLevel();
    return;
  }
}

function startFreshGame() {
  clearLocalProgress();
  if (state.mode === "win" || state.mode === "lose") resetGame();
  setupLevel(0, { mode: "playing", keepStats: false });
  state.scorePrompted = false;
  state.scoreSubmitted = false;
  saveGame();
  setStartVisible(false);
  hideScoreModal();
  pauseIntro();
  playBgm();
}

function startNextLevel() {
  setupLevel(state.levelIndex + 1, { mode: "playing", keepStats: true });
  state.mode = "playing";
  saveGame();
  setStartVisible(false);
  hideScoreModal();
  pauseIntro();
  playBgm();
}

function continueSavedGame() {
  const saved = readSavedGame();
  if (!saved) {
    showNotice("이어할 기록이 없어요.", 1.4);
    setStartVisible(true);
    return;
  }
  setupLevel(saved.levelIndex, { mode: "playing", keepStats: false });
  restoreSavedStats(saved);
  state.mode = "playing";
  saveGame({ levelIndex: saved.levelIndex });
  setStartVisible(false);
  hideScoreModal();
  pauseIntro();
  playBgm();
}

function returnToTitle() {
  hideScoreModal();
  hideAiboxCardModal();
  hideCodexModal();
  pauseBgm();
  resetGame(0);
  restorePersistentCodex();
  state.mode = "ready";
  setStartVisible(true);
  playIntro();
}

function setStartVisible(visible) {
  if (gameShell) gameShell.dataset.mode = state.mode;
  screenActions.classList.toggle("hidden", !visible);
  startButton.textContent =
    state.mode === "ready" ? "새로시작" :
    state.mode === "level-clear" ? "다음 레벨" :
    state.mode === "win" ? "처음부터" : "다시 도전";
  continueButton?.classList.toggle("hidden", !(visible && state.mode === "ready" && hasSavedGame()));
  homeButton?.classList.toggle("hidden", !(visible && state.mode === "lose"));
  codexButton?.classList.toggle("hidden", !(visible && state.mode !== "level-clear"));
}

let previous = performance.now();
function loop(now) {
  if (MOBILE_FRAME_INTERVAL && now - previous < MOBILE_FRAME_INTERVAL) {
    requestAnimationFrame(loop);
    return;
  }
  const dt = Math.min(0.033, (now - previous) / 1000);
  previous = now;
  update(dt);
  render();
  input.jumpPressed = false;
  requestAnimationFrame(loop);
}

function update(dt) {
  updatePresentationTimers(dt);
  if (state.codexModalOpen) {
    updateParticles(dt);
    return;
  }
  if (state.mode === "playing" && state.cardModalOpen) {
    updateParticles(dt);
    return;
  }
  if (state.mode !== "playing") {
    animateIdle(dt);
    return;
  }

  if (state.pauseTimer > 0) {
    updateParticles(dt);
    return;
  }

  const frozen = state.timeStop > 0;
  state.time -= frozen ? 0 : dt;
  if (state.time <= 0) endGame(false, "시간 종료");
  state.boost = Math.max(0, state.boost - dt);
  state.jumpBoost = Math.max(0, state.jumpBoost - dt);
  state.invincible = Math.max(0, state.invincible - dt);
  state.magnet = Math.max(0, state.magnet - dt);
  state.timeStop = Math.max(0, state.timeStop - dt);
  state.player.invincible = Math.max(0, state.player.invincible - dt);

  updatePlatforms(frozen ? 0 : dt);
  updatePlayer(dt);
  maybeTriggerBossCutin();
  if (state.pauseTimer > 0) {
    updateParticles(dt);
    return;
  }
  updateAiboxItems(dt);
  updateEnemies(frozen ? 0 : dt);
  updateProjectiles(frozen ? 0 : dt);
  collectItems();
  if (state.pauseTimer > 0) {
    updateParticles(dt);
    return;
  }
  checkHazards();
  updateParticles(dt);

  const goal = state.level.goal;
  if (overlap(rectPlayer(), goal)) {
    if (hasAliveAiboxBoss()) {
      showNotice("중간보스를 먼저 해결해야 해!", 1.6);
      return;
    }
    const perfect = state.cheeses >= state.level.cheeses.length;
    completeLevel(perfect);
  }
}

function updatePresentationTimers(dt) {
  state.cardTimer = Math.max(0, state.cardTimer - dt);
  if (state.cardTimer <= 0) state.activeCard = null;
  state.pickupHintTimer = Math.max(0, state.pickupHintTimer - dt);
  if (state.pickupHintTimer <= 0) {
    state.pickupHint = null;
    state.pickupHintLine = "";
  }
  state.noticeTimer = Math.max(0, state.noticeTimer - dt);
  if (state.noticeTimer <= 0) state.notice = "";
  state.bossCutinTimer = Math.max(0, state.bossCutinTimer - dt);
  if (state.bossCutinTimer <= 0) state.bossCutin = null;
  state.dialogueDismissDelay = Math.max(0, state.dialogueDismissDelay - dt);
  state.pauseTimer = Math.max(0, state.pauseTimer - dt);
}

function animateIdle(dt) {
  updateParticles(dt);
  state.player.frameTime += dt;
  if (state.player.frameTime > 0.12) {
    state.player.frameTime = 0;
    state.player.runFrame = (state.player.runFrame + 1) % 6;
  }
}

function updatePlatforms(dt) {
  const pr = rectPlayer();
  for (const platform of state.level.platforms) {
    platform.prevX = platform.x;
    platform.prevY = platform.y;
    if (platform.kind === "moving" && dt > 0) {
      platform.x += (platform.speed ?? 86) * platform.dir * dt;
      if (platform.x < platform.minX || platform.x > platform.maxX) {
        platform.x = clamp(platform.x, platform.minX ?? platform.baseX, platform.maxX ?? platform.baseX);
        platform.dir *= -1;
      }
      const dx = platform.x - platform.prevX;
      const standing =
        state.player.onGround &&
        Math.abs(pr.y + pr.h - platform.y) < 8 &&
        pr.x + pr.w > platform.prevX &&
        pr.x < platform.prevX + platform.w;
      if (standing) state.player.x += dx;
    }
    if (platform.kind === "fade") {
      const standing =
        !platform.hidden &&
        Math.abs(pr.y + pr.h - platform.y) < 8 &&
        pr.x + pr.w > platform.x &&
        pr.x < platform.x + platform.w;
      if (standing) platform.stepped = true;
      if (platform.stepped) platform.fadeTimer += dt;
      if (platform.fadeTimer > (platform.fadeAfter ?? 5)) platform.hidden = true;
    }
  }
}

function updatePlayer(dt) {
  const p = state.player;
  const speed = state.boost > 0 ? BOOST_SPEED : MOVE_SPEED;
  const desired = (input.right ? 1 : 0) - (input.left ? 1 : 0);
  p.vx = approach(p.vx, desired * speed, (desired ? 3200 : 3900) * dt);
  if (desired !== 0) p.dir = desired;

  if (input.jumpPressed) p.jumpBuffer = JUMP_BUFFER_TIME;
  else p.jumpBuffer = Math.max(0, p.jumpBuffer - dt);
  p.coyote = p.onGround ? COYOTE_TIME : Math.max(0, p.coyote - dt);

  if (p.stompBoostTimer > 0) {
    if (input.jump || input.jumpPressed || p.jumpBuffer > 0) {
      applyStompBounce(true, p.x + p.w / 2, p.y + p.h);
      p.jumpBuffer = 0;
    } else {
      p.stompBoostTimer = Math.max(0, p.stompBoostTimer - dt);
    }
  }

  if (p.jumpBuffer > 0 && p.coyote > 0) {
    p.vy = -(state.jumpBoost > 0 ? JUMP_SPEED * 1.55 : JUMP_SPEED);
    p.onGround = false;
    p.coyote = 0;
    p.jumpBuffer = 0;
    burst(p.x + p.w / 2, p.y + p.h, "#fff7d6", 8, 110);
    playSfx("jump", 0.5);
  }

  p.vy += GRAVITY * dt;
  moveAxis("x", p.vx * dt);
  moveAxis("y", p.vy * dt);

  p.x = clamp(p.x, 20, state.level.world.width - 80);
  if (p.y > WORLD_FLOOR) damagePlayer(true);

  p.frameTime += dt;
  if (p.onGround && Math.abs(p.vx) > 20) {
    if (p.frameTime > 0.075) {
      p.frameTime = 0;
      p.runFrame = (p.runFrame + 1) % 6;
      if (Math.random() < 0.55) dust(p.x + p.w * 0.5, p.y + p.h - 4);
    }
  } else if (!p.onGround) {
    p.jumpFrame = p.vy < -180 ? 1 : p.vy > 220 ? 2 : 3;
  } else {
    p.runFrame = 1;
  }

  state.cameraX = approach(
    state.cameraX,
    clamp(p.x - VIEW_W * 0.38, 0, state.level.world.width - VIEW_W),
    5200 * dt
  );
}

function moveAxis(axis, amount) {
  const p = state.player;
  const previousY = p.y;
  if (axis === "x") p.x += amount;
  else {
    p.y += amount;
    p.onGround = false;
  }

  for (const solid of solids()) {
    const pr = rectPlayer();
    if (!overlap(pr, solid)) continue;
    if (axis === "x") {
      if (amount > 0) p.x = solid.x - p.w + PLAYER_COLLISION_INSET_X;
      if (amount < 0) p.x = solid.x + solid.w - PLAYER_COLLISION_INSET_X;
      p.vx = 0;
    } else if (amount > 0) {
      p.y = solid.y - p.h;
      p.vy = 0;
      p.onGround = true;
      p.coyote = COYOTE_TIME;
    } else if (amount < 0) {
      p.y = solid.y + solid.h - PLAYER_COLLISION_TOP_INSET;
      p.vy = 0;
      bumpBlock(solid);
    }
  }
  if (axis === "y" && amount < 0) revealSecretBlock(previousY);
}

function solids() {
  const blockRects = state.level.blocks
    .filter((block) => !block.hidden || block.revealed)
    .map((block) => ({
      x: block.x,
      y: block.y,
      w: block.w,
      h: block.h,
      block
    }));
  return [...state.level.platforms.filter((platform) => !platform.hidden), ...blockRects];
}

function revealSecretBlock(previousY) {
  const p = state.player;
  const pr = rectPlayer();
  const previousTop = previousY + PLAYER_COLLISION_TOP_INSET;
  for (const block of state.level.blocks) {
    if (!block.hidden || block.revealed) continue;
    const bottom = block.y + block.h;
    const horizontal = pr.x + pr.w > block.x + 8 && pr.x < block.x + block.w - 8;
    const crossed = pr.y <= bottom && previousTop >= bottom - 10;
    if (!horizontal || !crossed) continue;
    block.revealed = true;
    block.used = true;
    block.bump = 0.16;
    p.y = bottom - PLAYER_COLLISION_TOP_INSET;
    p.vy = 0;
    if (block.type === "aibox") revealAiboxFromBlock(block);
    burst(block.x + block.w / 2, block.y + block.h / 2, "#9be8ff", 16, 190);
    playSfx("coin", 0.42);
    break;
  }
}

function bumpBlock(solid) {
  if (!solid.block || solid.block.used) return;
  const block = solid.block;
  block.used = true;
  burst(block.x + 34, block.y + 20, "#fff0a6", 10, 150);
  if (block.type === "paw") {
    state.level.coins.push({ x: block.x + 10, y: block.y - 64, id: state.level.coins.length, taken: false, pulse: 0 });
    playSfx("coin", 0.45);
  } else if (block.type === "star") {
    state.level.stars.push({ x: block.x + 8, y: block.y - 70, id: state.level.stars.length, taken: false, pulse: 0 });
    tone(860, 0.08);
  } else if (block.type === "carrot") {
    state.level.carrots.push({ x: block.x + 8, y: block.y - 72, id: state.level.carrots.length, taken: false, pulse: 0 });
    tone(680, 0.08);
  } else if (block.type === "aibox") {
    block.revealed = true;
    revealAiboxFromBlock(block);
  }
}

function revealAiboxFromBlock(block) {
  const itemId = block.itemId || block.item || "aibox_blue_cube";
  const item = AIBOX_ITEMS_BY_ID[itemId] ? itemId : "aibox_blue_cube";
  state.level.aiboxItems.push({
    x: block.x + 7,
    y: block.y - 28,
    targetY: block.y - 72,
    vy: -285,
    itemId: item,
    id: state.level.aiboxItems.length,
    taken: false,
    pulse: 0
  });
}

function updateAiboxItems(dt) {
  for (const item of state.level.aiboxItems) {
    if (item.taken || item.vy == null) continue;
    item.y += item.vy * dt;
    item.vy += 980 * dt;
    if (item.y >= item.targetY) {
      item.y = item.targetY;
      item.vy = null;
    }
  }
}

function updateEnemies(dt) {
  for (const enemy of state.enemies) {
    if (enemy.dead) continue;
    enemy.frame += dt * (enemy.animSpeed ?? 7);
    if (enemy.type === "aiboxBoss") {
      updateAiboxBoss(enemy, dt);
    } else if (enemy.type === "frog") {
      enemy.x += enemy.dir * (enemy.speed ?? 32) * dt;
      if (enemy.x < enemy.minX || enemy.x > enemy.maxX) enemy.dir *= -1;
      const hop = Math.max(0, Math.sin(enemy.frame * 2.1));
      enemy.y = enemy.baseY - hop * 72;
    } else if (enemy.type === "bat" || enemy.type === "crow") {
      if (enemy.type === "crow") {
        const playerCenter = state.player.x + state.player.w / 2;
        const enemyCenter = enemy.x + enemy.w / 2;
        if (Math.abs(playerCenter - enemyCenter) < 520) enemy.dir = playerCenter > enemyCenter ? 1 : -1;
      }
      enemy.x += enemy.dir * (enemy.speed ?? 92) * dt;
      if (enemy.x < enemy.minX || enemy.x > enemy.maxX) enemy.dir *= -1;
      enemy.y = enemy.baseY + Math.sin(enemy.frame * 2.4) * (enemy.amp ?? 18);
    } else if (enemy.type === "mole") {
      enemy.active = Math.sin(enemy.frame * 2.5) > -0.2;
      enemy.y = enemy.baseY + (enemy.active ? 0 : 42);
    } else if (enemy.type === "boar") {
      const playerCenter = state.player.x + state.player.w / 2;
      const enemyCenter = enemy.x + enemy.w / 2;
      const distance = playerCenter - enemyCenter;
      if (Math.abs(distance) < (enemy.detectRange ?? 520)) enemy.activated = true;
      if (enemy.activated) enemy.dir = distance > 0 ? 1 : -1;

      enemy.leapCooldown = Math.max(0, (enemy.leapCooldown ?? 0) - dt);
      const grounded = Math.abs(enemy.y - enemy.baseY) < 1;
      if (enemy.activated && grounded && enemy.leapCooldown <= 0) {
        enemy.vy = -(enemy.leapPower ?? 760);
        enemy.vx = (enemy.jumpDrift ?? 36) * (distance > 0 ? 1 : -1);
        enemy.leapCooldown = enemy.leapDelay ?? 1.05;
        enemy.frame = 1;
        burst(enemy.x + enemy.w / 2, enemy.y + enemy.h + 2, "#d89148", 12, 170);
      }
      if (!enemy.activated && grounded) {
        enemy.x += enemy.dir * (enemy.speed ?? 24) * dt;
      } else {
        enemy.x += (enemy.vx ?? 0) * dt;
        enemy.vx = approach(enemy.vx ?? 0, 0, 120 * dt);
      }
      if (enemy.x < enemy.minX) {
        enemy.x = enemy.minX;
        enemy.dir = 1;
        enemy.vx = Math.abs(enemy.vx ?? 0) * 0.3;
      }
      if (enemy.x > enemy.maxX) {
        enemy.x = enemy.maxX;
        enemy.dir = -1;
        enemy.vx = -Math.abs(enemy.vx ?? 0) * 0.3;
      }
      enemy.vy += GRAVITY * 0.78 * dt;
      enemy.y += enemy.vy * dt;
      if (enemy.y > enemy.baseY) {
        enemy.y = enemy.baseY;
        enemy.vy = 0;
      }
    } else if (enemy.type === "goblin") {
      enemy.cooldown -= dt;
      if (enemy.cooldown <= 0) {
        enemy.cooldown = Math.max(1.05, 2.1 - state.levelIndex * 0.08);
        const targetX = state.player.x + state.player.w / 2;
        const dir = targetX > enemy.x ? 1 : -1;
        state.projectiles.push({
          x: enemy.x + enemy.w / 2,
          y: enemy.y + 18,
          vx: dir * (230 + state.levelIndex * 10),
          vy: -285,
          life: 4.2,
          size: 18,
          color: "#82c85a"
        });
      }
    } else if (enemy.type === "bear") {
      const playerCenter = state.player.x + state.player.w / 2;
      const enemyCenter = enemy.x + enemy.w / 2;
      const distance = playerCenter - enemyCenter;
      const alert = Math.abs(distance) < (enemy.detectRange ?? 560);
      if (alert) enemy.dir = distance > 0 ? 1 : -1;
      const speed = alert ? (enemy.chargeSpeed ?? 190) : (enemy.speed ?? 58);
      enemy.x += enemy.dir * speed * dt;
      if (enemy.x < enemy.minX) {
        enemy.x = enemy.minX;
        enemy.dir = 1;
      }
      if (enemy.x > enemy.maxX) {
        enemy.x = enemy.maxX;
        enemy.dir = -1;
      }

      enemy.leapCooldown = Math.max(0, (enemy.leapCooldown ?? 0) - dt);
      const grounded = Math.abs(enemy.y - enemy.baseY) < 1;
      if (alert && grounded && enemy.leapCooldown <= 0 && Math.abs(distance) > 80 && Math.abs(distance) < 430) {
        enemy.vy = -(enemy.leapPower ?? 560);
        enemy.leapCooldown = enemy.leapDelay ?? 1.05;
        burst(enemy.x + enemy.w / 2, enemy.y + enemy.h, "#8ee96b", 8, 150);
      }
      enemy.vy += GRAVITY * 0.82 * dt;
      enemy.y += enemy.vy * dt;
      if (enemy.y > enemy.baseY) {
        enemy.y = enemy.baseY;
        enemy.vy = 0;
      }
    } else {
      enemy.x += enemy.dir * enemy.speed * dt;
      if (enemy.x < enemy.minX || enemy.x > enemy.maxX) enemy.dir *= -1;
    }

    if (enemy.type === "mole" && !enemy.active) continue;
    const er = enemyRect(enemy);
    const pr = rectPlayer();
    if (!overlap(pr, er)) continue;
    if (enemy.type === "aiboxBoss") {
      if ((enemy.hitStun ?? 0) > 0 || (enemy.recoilTimer ?? 0) > 0) continue;
      handleAiboxBossCollision(enemy, dt, pr, er);
      continue;
    }
    if (state.invincible > 0) {
      enemy.dead = true;
      state.score += 300;
      burst(enemy.x + enemy.w / 2, enemy.y + enemy.h / 2, "#ffe966", 18, 260);
      playSfx("hit", 0.48);
      continue;
    }
    if (state.player.vy > 160 && pr.y + pr.h - state.player.vy * dt <= er.y + 20) {
      enemy.hp -= 1;
      if (enemy.hp <= 0) enemy.dead = true;
      const boosted = input.jump || input.jumpPressed || state.player.jumpBuffer > 0;
      applyStompBounce(boosted, enemy.x + enemy.w / 2, enemy.y + 28);
      if (boosted) state.player.jumpBuffer = 0;
      state.score += enemy.dead ? 400 : 150;
      playSfx("hit", 0.52);
    } else {
      damagePlayer(false);
    }
  }
}

function updateAiboxBoss(enemy, dt) {
  const boss = getAiboxBoss(enemy.bossId);
  enemy.damageCooldown = Math.max(0, (enemy.damageCooldown ?? 0) - dt);
  if (enemy.hitStun > 0) {
    enemy.hitStun = Math.max(0, enemy.hitStun - dt);
    enemy.x += (enemy.knockbackVx ?? 0) * dt;
    enemy.knockbackVx = approach(enemy.knockbackVx ?? 0, 0, 900 * dt);
    if (enemy.x < enemy.minX) {
      enemy.x = enemy.minX;
      enemy.knockbackVx = Math.abs(enemy.knockbackVx ?? 0) * 0.35;
    }
    if (enemy.x > enemy.maxX) {
      enemy.x = enemy.maxX;
      enemy.knockbackVx = -Math.abs(enemy.knockbackVx ?? 0) * 0.35;
    }
    enemy.y = enemy.baseY + Math.sin(enemy.frame * 5.8) * 6;
    return;
  }

  if ((enemy.recoilTimer ?? 0) > 0) {
    enemy.recoilTimer = Math.max(0, enemy.recoilTimer - dt);
    enemy.x += (enemy.recoilDir || enemy.dir || 1) * (enemy.evadeSpeed ?? 330) * dt;
    if (enemy.x < enemy.minX) {
      enemy.x = enemy.minX;
      enemy.recoilDir = 1;
    }
    if (enemy.x > enemy.maxX) {
      enemy.x = enemy.maxX;
      enemy.recoilDir = -1;
    }
    enemy.dir = enemy.recoilDir || enemy.dir;
    enemy.y = enemy.baseY + Math.sin(enemy.frame * 4.2) * 7;
    return;
  }

  const playerCenter = state.player.x + state.player.w / 2;
  const enemyCenter = enemy.x + enemy.w / 2;
  const distance = playerCenter - enemyCenter;
  const alert = Math.abs(distance) < (enemy.detectRange ?? 760);
  if (alert) enemy.dir = distance > 0 ? 1 : -1;
  const pace = alert ? (enemy.chargeSpeed ?? enemy.speed * 1.35) : enemy.speed;
  enemy.x += enemy.dir * pace * dt;
  if (enemy.x < enemy.minX) {
    enemy.x = enemy.minX;
    enemy.dir = 1;
  }
  if (enemy.x > enemy.maxX) {
    enemy.x = enemy.maxX;
    enemy.dir = -1;
  }
  enemy.y = enemy.baseY + Math.sin(enemy.frame * 1.9) * (enemy.floatAmp ?? 8);

  enemy.attackCooldown = Math.max(0, enemy.attackCooldown - dt);
  if (alert && enemy.attackCooldown <= 0) {
    enemy.attackCooldown = enemy.attackDelay ?? 1.25;
    const dir = distance > 0 ? 1 : -1;
    state.projectiles.push({
      x: enemy.x + enemy.w / 2 + dir * 38,
      y: enemy.y + enemy.h * 0.38,
      vx: dir * (enemy.projectileSpeed ?? 260),
      vy: -210,
      life: 3.2,
      size: 18,
      color: boss.color
    });
  }
}

function handleAiboxBossCollision(enemy, dt, pr, er) {
  const stomp = state.player.vy > 160 && pr.y + pr.h - state.player.vy * dt <= er.y + 28;
  const hasWeakItem = hasBossWeakItem(enemy);
  if (!stomp) {
    if (state.invincible > 0) {
      damageAiboxBoss(enemy, getAiboxBossDamage(enemy, hasWeakItem), true, hasWeakItem);
      if (!hasWeakItem) showNotice("AI Box 없이도 아주 조금 닳아!", 1.5);
    }
    else damagePlayer(false);
    return;
  }

  const boosted = input.jump || input.jumpPressed || state.player.jumpBuffer > 0;
  applyStompBounce(boosted, enemy.x + enemy.w / 2, enemy.y + 18);
  if (boosted) state.player.jumpBuffer = 0;
  knockAiboxBossAside(enemy);

  damageAiboxBoss(enemy, getAiboxBossDamage(enemy, hasWeakItem), false, hasWeakItem);
  if (!hasWeakItem) showNotice("AI Box 없이도 1/100씩 닳아. 아이템이 있으면 1/3!", 2.1);
}

function getAiboxBossDamage(enemy, hasWeakItem) {
  const maxHp = enemy.maxHp || enemy.hp || 1;
  return maxHp * (hasWeakItem ? 1 / 3 : 1 / 100);
}

function knockAiboxBossAside(enemy) {
  const playerCenter = state.player.x + state.player.w / 2;
  const enemyCenter = enemy.x + enemy.w / 2;
  const dir = playerCenter < enemyCenter ? 1 : -1;
  enemy.x = clamp(enemy.x + dir * 132, enemy.minX, enemy.maxX);
  enemy.dir = dir;
  enemy.hitStun = 0.62;
  enemy.recoilTimer = 0.82;
  enemy.recoilDir = dir;
  enemy.damageCooldown = Math.max(enemy.damageCooldown ?? 0, 0.36);
  enemy.knockbackVx = dir * 860;
  burst(enemy.x + enemy.w / 2, enemy.y + 24, "#fff06b", 16, 240);
}

function damageAiboxBoss(enemy, amount, contact, strong) {
  if ((enemy.damageCooldown ?? 0) > 0 && contact) return;
  const boss = getAiboxBoss(enemy.bossId);
  const before = enemy.hp;
  enemy.hp -= amount;
  if (enemy.hp <= (enemy.maxHp || 1) * 0.001) enemy.hp = 0;
  enemy.hp = Math.max(0, enemy.hp);
  enemy.damageCooldown = strong ? 0.18 : 0.12;
  state.score += enemy.hp <= 0 ? 1600 : strong ? 300 : 25;
  burst(enemy.x + enemy.w / 2, enemy.y + enemy.h * 0.45, strong ? boss.color : "#ff7868", contact ? 22 : strong ? 18 : 10, strong ? 260 : 150);
  playSfx("hit", strong ? 0.58 : 0.38);
  if (!strong && before > 0) tone(210, 0.07);
  if (enemy.hp <= 0) defeatAiboxBoss(enemy);
}

function defeatAiboxBoss(enemy) {
  const boss = getAiboxBoss(enemy.bossId);
  enemy.dead = true;
  const reward = boss.reward || boss.weakTo[0];
  unlockAiboxItem(reward, "boss");
  showNotice(`${boss.title} 해결! 선생님 업무가 가벼워졌어요.`, 2.8);
  const fx = getAiboxFxImage(reward);
  if (fx) state.projectiles.push({ x: enemy.x + enemy.w / 2, y: enemy.y + enemy.h / 2, vx: 0, vy: -12, life: 0.42, size: 74, color: boss.color, image: fx, friendly: true });
  burst(enemy.x + enemy.w / 2, enemy.y + enemy.h / 2, boss.color, 36, 360);
}

function hasBossWeakItem(enemy) {
  return getAiboxBoss(enemy.bossId).weakTo.some((itemId) => state.aiboxInventory.has(itemId));
}

function hasAliveAiboxBoss() {
  return state.enemies.some((enemy) => enemy.type === "aiboxBoss" && !enemy.dead);
}

function getAiboxBoss(bossId) {
  return AIBOX_BOSSES_BY_ID[bossId] || AIBOX_BOSSES_BY_ID.gongmun_monster;
}

function maybeTriggerBossCutin() {
  for (const enemy of state.enemies) {
    if (enemy.dead || enemy.type !== "aiboxBoss" || enemy.introShown) continue;
    if (!isEnemyClearlyOnScreen(enemy)) continue;
    const boss = getAiboxBoss(enemy.bossId);
    enemy.introShown = true;
    state.bossCutin = { bossId: boss.id };
    state.bossCutinTimer = Infinity;
    state.dialogueLock = "boss";
    state.dialogueDismissDelay = DIALOGUE_DISMISS_GRACE;
    state.pauseTimer = Infinity;
    playLoopingSfx("boss", 0.62);
    break;
  }
}

function isEnemyClearlyOnScreen(enemy) {
  const left = enemy.x + enemy.w * 0.28;
  const right = enemy.x + enemy.w * 0.72;
  return right > state.cameraX + 48 && left < state.cameraX + VIEW_W - 48;
}

function applyStompBounce(boosted, x, y) {
  const p = state.player;
  const multiplier = boosted ? STOMP_JUMP_BOUNCE_MULTIPLIER : 1;
  p.vy = Math.min(p.vy, -STOMP_BOUNCE_SPEED * multiplier);
  p.onGround = false;
  p.coyote = 0;
  p.stompBoostTimer = boosted ? 0 : STOMP_JUMP_GRACE_TIME;
  burst(x, y, boosted ? "#fff06b" : "#c9ff6b", boosted ? 24 : 16, boosted ? 280 : 210);
}

function updateProjectiles(dt) {
  for (const projectile of state.projectiles) {
    projectile.life -= dt;
    projectile.x += projectile.vx * dt;
    projectile.y += projectile.vy * dt;
    projectile.vy += 420 * dt;
    const r = { x: projectile.x - projectile.size / 2, y: projectile.y - projectile.size / 2, w: projectile.size, h: projectile.size };
    if (!projectile.friendly && overlap(rectPlayer(), r)) {
      projectile.life = 0;
      damagePlayer(false);
    }
  }
  state.projectiles = state.projectiles.filter((projectile) => projectile.life > 0 && projectile.y < WORLD_FLOOR);
}

function checkHazards() {
  const pr = rectPlayer();
  for (const hazard of state.level.hazards) {
    const rect = { x: hazard.x, y: hazard.y, w: hazard.w, h: hazard.h };
    if (overlap(pr, rect)) {
      damagePlayer(true);
      return;
    }
  }
}

function collectItems() {
  collectList("coins", images.coin, 42, 100, () => {
    state.coins += 1;
    playSfx("coin", 0.5);
  });
  collectList("stars", images.star, 48, 700, () => {
    state.invincible = 10;
    burst(state.player.x + 36, state.player.y + 18, "#ffe966", 22, 260);
    tone(1040, 0.12);
  });
  collectList("carrots", images.carrot, 46, 350, () => {
    state.boost = 5;
    burst(state.player.x + 36, state.player.y + 26, "#ff9d31", 18, 230);
    tone(620, 0.12);
  });
  collectList("boosts", images.bolt, 46, 500, () => {
    state.jumpBoost = 5;
    burst(state.player.x + 35, state.player.y + 20, "#fff050", 20, 260);
    tone(760, 0.14);
  });
  collectList("shields", images.shield, 48, 450, () => {
    state.shield += 1;
    burst(state.player.x + 35, state.player.y + 20, "#7ee8ff", 18, 230);
    tone(520, 0.13);
  });
  collectList("magnets", images.magnet, 48, 450, () => {
    state.magnet = 9;
    burst(state.player.x + 35, state.player.y + 20, "#ff6b6b", 18, 230);
    tone(480, 0.13);
  });
  collectList("clocks", images.clock, 48, 450, () => {
    state.timeStop = 5;
    burst(state.player.x + 35, state.player.y + 20, "#e7fbff", 22, 260);
    tone(420, 0.16);
  });
  collectList("cheeses", images.cheese, 48, 1000, () => {
    state.cheeses += 1;
    burst(state.player.x + 35, state.player.y + 24, "#ffd34b", 18, 250);
    playSfx("cheese", 0.54);
  });
  collectAiboxItems();
  if (state.magnet > 0) magnetizeCoins();
}

function collectList(listName, _image, size, score, effect) {
  const pr = rectPlayer();
  for (const item of state.level[listName]) {
    if (item.taken) continue;
    const rect = { x: item.x, y: item.y, w: size, h: size };
    if (overlap(pr, rect)) {
      item.taken = true;
      state.score += score;
      effect(item);
    }
  }
}

function collectAiboxItems() {
  const pr = rectPlayer();
  for (const item of state.level.aiboxItems) {
    if (item.taken) continue;
    const rect = { x: item.x, y: item.y, w: 54, h: 54 };
    if (!overlap(pr, rect)) continue;
    item.taken = true;
    state.score += 650;
    unlockAiboxItem(item.itemId, "pickup");
    const fx = getAiboxFxImage(item.itemId);
    burst(item.x + 27, item.y + 27, "#8fe9ff", 22, 260);
    if (fx) state.projectiles.push({ x: item.x + 27, y: item.y + 20, vx: 0, vy: -20, life: 0.42, size: 46, color: "#8fe9ff", image: fx, friendly: true });
    playSfx("getitem", 0.6);
  }
}

function unlockAiboxItem(itemId, source = "pickup") {
  const def = getAiboxItem(itemId);
  state.aiboxInventory.add(def.id);
  if (source === "boss") {
    const isNewCard = !state.aiboxCards.has(def.id);
    state.aiboxCards.add(def.id);
    if (isNewCard && !state.newCodexThisLevel.includes(def.id)) state.newCodexThisLevel.push(def.id);
    state.activeCard = null;
    state.cardTimer = 0;
    state.pickupHint = null;
    state.pickupHintLine = "";
    state.pickupHintTimer = 0;
    saveCodex();
    saveGame();
  } else {
    state.activeCard = null;
    state.cardTimer = 0;
    state.pickupHint = def.id;
    state.pickupHintLine = createAiboxMysteryLine(def.id);
    state.pickupHintTimer = Infinity;
    state.dialogueLock = "pickup";
    state.dialogueDismissDelay = DIALOGUE_DISMISS_GRACE;
    state.pauseTimer = Infinity;
    saveGame();
  }
}

function getAiboxItem(itemId) {
  return AIBOX_ITEMS_BY_ID[itemId] || AIBOX_ITEMS_BY_ID.aibox_blue_cube;
}

function getAiboxIconImage(itemId) {
  return images[`aiboxIcon_${getAiboxItem(itemId).id}`];
}

function getAiboxCardImage(itemId) {
  return images[`aiboxCard_${getAiboxItem(itemId).id}`];
}

function getAiboxFxImage(itemId) {
  return images[`aiboxFx_${getAiboxItem(itemId).id}`];
}

function showAiboxCardModal(itemId, { kicker = "도감이 열렸습니다" } = {}) {
  const def = getAiboxItem(itemId);
  state.cardModalOpen = true;
  state.cardModalItem = def.id;
  if (!aiboxModal || !aiboxModalImage || !aiboxModalTitle || !aiboxModalDescription) return;
  if (aiboxModalKicker) aiboxModalKicker.textContent = kicker;
  aiboxModalImage.src = `${AIBOX_ASSET_ROOT}/${def.card}`;
  aiboxModalImage.alt = `${def.title} 도감 카드`;
  aiboxModalTitle.textContent = def.title;
  aiboxModalDescription.textContent = getAiboxDetail(def.id);
  aiboxModal.classList.remove("hidden");
  setTimeout(() => aiboxModalClose?.focus(), 80);
}

function hideAiboxCardModal(resetState = true) {
  aiboxModal?.classList.add("hidden");
  if (aiboxModalKicker) aiboxModalKicker.textContent = "도감이 열렸습니다";
  if (!resetState) return;
  state.cardModalOpen = false;
  state.cardModalItem = null;
}

function openCodexModal(preferredId = state.selectedCodexCard) {
  restorePersistentCodex();
  state.codexModalOpen = true;
  const cards = Array.from(state.aiboxCards).filter((id) => AIBOX_ITEMS_BY_ID[id]);
  const selected = cards.includes(preferredId) ? preferredId : cards[0] || null;
  state.selectedCodexCard = selected;
  renderCodexModal(selected);
  codexModal?.classList.remove("hidden");
}

function hideCodexModal(resetState = true) {
  codexModal?.classList.add("hidden");
  if (!resetState) return;
  state.codexModalOpen = false;
}

function renderCodexModal(selectedId) {
  if (!codexCardList || !codexCardDetail) return;
  codexCardList.replaceChildren();
  codexCardDetail.replaceChildren();
  const unlocked = new Set(Array.from(state.aiboxCards).filter((id) => AIBOX_ITEMS_BY_ID[id]));
  const allIds = AIBOX_ITEM_DEFS.map((item) => item.id);
  const unlockedIds = allIds.filter((id) => unlocked.has(id));
  const activeId = unlocked.has(selectedId) ? selectedId : unlockedIds[0] || null;
  if (codexModalTitle) codexModalTitle.textContent = `획득한 도감 ${unlockedIds.length} / ${allIds.length}`;

  allIds.forEach((id, index) => {
    const def = getAiboxItem(id);
    const isUnlocked = unlocked.has(id);
    const button = document.createElement("button");
    button.type = "button";
    button.className = `codex-card-button${isUnlocked ? "" : " locked"}`;
    button.setAttribute("aria-selected", String(id === activeId));
    button.disabled = !isUnlocked;
    const icon = isUnlocked ? document.createElement("img") : document.createElement("span");
    if (isUnlocked) {
      icon.src = `${AIBOX_ASSET_ROOT}/${def.icon}`;
      icon.alt = "";
    } else {
      icon.className = "codex-card-unknown";
      icon.textContent = "?";
    }
    const label = document.createElement("span");
    label.textContent = isUnlocked ? def.title : `미발견 도감 ${index + 1}`;
    button.append(icon, label);
    if (isUnlocked) {
      button.addEventListener("click", () => {
        playSfx("button", 0.3);
        state.selectedCodexCard = id;
        renderCodexModal(id);
      });
    }
    codexCardList.append(button);
  });

  if (!activeId) {
    codexCardDetail.className = "codex-card-detail empty";
    codexCardDetail.innerHTML = `<strong>? / ${allIds.length}</strong><span>중간보스를 해결하면 도감 카드가 열려요.</span>`;
    return;
  }

  state.selectedCodexCard = activeId;
  codexCardDetail.className = "codex-card-detail";
  const def = getAiboxItem(activeId);
  const image = document.createElement("img");
  image.src = `${AIBOX_ASSET_ROOT}/${def.card}`;
  image.alt = `${def.title} 도감 카드`;
  const title = document.createElement("h3");
  title.textContent = def.title;
  const label = document.createElement("strong");
  label.className = "codex-detail-label";
  label.textContent = "기능 설명";
  const description = document.createElement("p");
  description.textContent = getAiboxDetail(def.id);
  codexCardDetail.append(image, title, label, description);
}

function getAiboxDetail(itemId) {
  const details = {
    hwp_studio: "공문괴물이 던지는 문서 업무를 정리하는 핵심 아이템이에요. 공문 초안, 안내문, HWP 형식 문서를 빠르게 만들고 다듬어 선생님의 문서 부담을 줄여줘요.",
    parent_message_helper: "학부모 상담이나 민감한 답변을 부드러운 말투로 정리해줘요. 선생님이 마음을 지키면서도 따뜻하게 소통할 수 있게 도와줘요.",
    meeting_recorder: "회의 내용을 놓치지 않게 기록하고 핵심만 정리해줘요. 반복되는 회의록 작성 시간을 줄이고 다음 할 일을 빠르게 확인하게 해줘요.",
    quiz_generator: "수업 목표에 맞는 퀴즈와 평가 문항을 빠르게 만들어줘요. 퀴즈버그처럼 끝없이 늘어나는 문제 제작 부담을 줄이는 데 좋아요.",
    infographic_generator: "복잡한 수업 내용을 표, 흐름도, 그림 자료처럼 한눈에 보이게 바꿔줘요. 수업준비좀비가 늘어놓은 자료 더미를 정리할 수 있어요.",
    image_style_converter: "수업 이미지를 원하는 분위기와 활동 목적에 맞게 바꿔줘요. 자료 제작 시간을 줄이고 같은 내용도 더 보기 좋게 전달하게 해줘요.",
    book_protagonist: "책 내용을 학생이 직접 체험하는 활동으로 바꿔줘요. 읽기 수업을 더 몰입감 있는 역할 놀이와 이야기 활동으로 확장할 수 있어요.",
    online_assessment_solver: "온라인 평가지 문항을 점검하고 풀이 흐름을 확인하는 데 도움을 줘요. 평가 준비 중 생기는 실수와 반복 확인을 줄여줘요.",
    aibox_blue_cube: "민감한 이름, 번호, 문서 정보를 다시 확인하도록 도와주는 안전 아이템이에요. 개인정보슬라임이 만드는 불안을 차분히 줄여줘요.",
    pdf_toolbox: "PDF 문서를 정리하고 필요한 자료를 빠르게 다룰 수 있게 도와줘요. 복잡한 파일 작업을 수업 준비에 쓰기 쉬운 형태로 바꿔줘요."
  };
  return details[itemId] || getAiboxItem(itemId).description;
}

function showNotice(text, duration = 1.8) {
  state.notice = text;
  state.noticeTimer = duration;
}

function magnetizeCoins() {
  const p = state.player;
  for (const coin of state.level.coins) {
    if (coin.taken) continue;
    const visible = coin.x > state.cameraX - 80 && coin.x < state.cameraX + VIEW_W + 80;
    if (!visible) continue;
    const dx = p.x + p.w / 2 - coin.x;
    const dy = p.y + p.h / 2 - coin.y;
    if (Math.hypot(dx, dy) < 520) {
      coin.taken = true;
      state.coins += 1;
      state.score += 100;
      playSfx("coin", 0.32);
    }
  }
}

function damagePlayer(fell) {
  const p = state.player;
  if (state.invincible > 0 || (!fell && p.invincible > 0)) return;
  if (!fell && state.shield > 0) {
    state.shield -= 1;
    p.invincible = 0.9;
    burst(p.x + p.w / 2, p.y + p.h / 2, "#7ee8ff", 18, 220);
    playSfx("hit", 0.45);
    return;
  }
  state.lives -= 1;
  p.invincible = 1.35;
  burst(p.x + p.w / 2, p.y + p.h / 2, "#ff7868", 18, 240);
  playSfx("die", 0.6);
  if (state.lives <= 0) {
    endGame(false, "다시 도전!");
    return;
  }
  p.x = Math.max(state.level.spawn.x, p.x - 160);
  p.y = state.level.spawn.y;
  p.vx = 0;
  p.vy = 0;
}

function completeLevel(perfect) {
  state.score += perfect ? 1500 : 600;
  playSfx("complete", 0.68);
  const newCodexCard = consumeLevelCodexReward();
  if (state.levelIndex >= levelsData.length - 1) {
    saveCodex();
    localStorage.removeItem(SAVE_STORAGE_KEY);
    endGame(true, perfect ? "최종 완벽 클리어!" : "최종 클리어!");
    if (newCodexCard) showNewCodexReward(newCodexCard);
    return;
  }
  state.mode = "level-clear";
  state.message = `Lv.${state.levelIndex + 1} 클리어!`;
  saveGame({ levelIndex: state.levelIndex + 1 });
  setStartVisible(true);
  if (newCodexCard) showNewCodexReward(newCodexCard);
}

function consumeLevelCodexReward() {
  const cardId = state.newCodexThisLevel.at(-1) || null;
  state.newCodexThisLevel = [];
  return cardId;
}

function showNewCodexReward(itemId) {
  playSfx("openDogam", 0.68);
  showAiboxCardModal(itemId, { kicker: "새로운 도감이 열렸다!" });
}

function endGame(won, message) {
  if (!won) saveGame({ levelIndex: state.levelIndex, resetStats: true });
  state.mode = won ? "win" : "lose";
  state.message = message;
  setStartVisible(won);
  pauseIntro();
  pauseBgm();
  saveCodex();
  if (won) burst(state.player.x + state.player.w / 2, state.player.y + 20, "#fff06b", 26, 280);
  else playSfx("gameover", 0.66);
  void handleEndGameScoreFlow(won);
}

async function handleEndGameScoreFlow(won) {
  const prompted = await maybePromptScoreSubmission();
  if (!won && !prompted) returnToTitle();
}

function updateParticles(dt) {
  for (const p of state.particles) {
    p.life -= dt;
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.vy += 520 * dt;
  }
  state.particles = state.particles.filter((p) => p.life > 0);
}

function render() {
  ctx.clearRect(0, 0, VIEW_W, VIEW_H);
  drawBackground();
  ctx.save();
  ctx.translate(-Math.round(state.cameraX), 0);
  drawWorld();
  drawParticles();
  drawPlayer();
  ctx.restore();
  if (state.mode !== "ready") drawHud();
  if (state.mode !== "playing") drawOverlay();
  drawRuntimeOverlays();
}

function drawBackground() {
  const img = images.background;
  const scale = VIEW_H / img.height;
  const w = img.width * scale;
  const slowX = -((state.cameraX * 0.22) % w);
  for (let x = slowX - w; x < VIEW_W + w; x += w) {
    ctx.drawImage(img, Math.round(x), 0, Math.ceil(w), VIEW_H);
  }

  ctx.globalAlpha = 0.22;
  ctx.fillStyle = "#73e7ff";
  for (let i = 0; i < 9; i += 1) {
    const x = ((i * 380 - state.cameraX * 0.08) % 1800) - 220;
    ctx.beginPath();
    ctx.ellipse(x, 118 + (i % 3) * 42, 92, 24, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function drawWorld() {
  for (const platform of state.level.platforms) drawPlatform(platform);
  drawBlocks();
  drawHazards();
  drawDecor();
  drawCollectibles();
  drawEnemies();
  drawProjectiles();
  drawGoal();
}

function isWorldRectVisible(x, w, margin = 140) {
  const left = state.cameraX - margin;
  const right = state.cameraX + VIEW_W + margin;
  return x + w >= left && x <= right;
}

function drawPlatform(platform) {
  if (platform.hidden) return;
  if (!isWorldRectVisible(platform.x, platform.w, 220)) return;
  if (platform.kind === "moving") {
    drawImageCentered(images.movingPlatform, platform.x + platform.w / 2, platform.y + platform.h / 2 + 2, platform.w, platform.h + 34);
    return;
  }
  if (platform.kind === "fade") {
    ctx.save();
    ctx.globalAlpha = clamp(1 - platform.fadeTimer / (platform.fadeAfter ?? 5), 0.24, 1);
    drawImageCentered(images.fadePlatform, platform.x + platform.w / 2, platform.y + platform.h / 2, platform.w, platform.h + 28);
    ctx.restore();
    return;
  }
  const left = images.platformLeft;
  const mid = images.platformMid;
  const right = images.platformRight;
  const drawY = platform.y - 20;
  const drawH = Math.max(92, platform.h + 48);
  const capW = Math.min(112, platform.w * 0.28);
  if (isWorldRectVisible(platform.x - 10, capW + 28, 120)) ctx.drawImage(left, platform.x - 10, drawY, capW + 28, drawH);
  const midStart = platform.x + capW - 12;
  const midEnd = platform.x + platform.w - capW + 16;
  const tileW = 126;
  const visibleLeft = state.cameraX - 160;
  const visibleRight = state.cameraX + VIEW_W + 160;
  const firstTile = midStart + Math.max(0, Math.floor((visibleLeft - midStart) / tileW)) * tileW;
  for (let x = firstTile; x < midEnd && x < visibleRight; x += tileW) {
    const width = Math.min(138, midEnd - x + 4);
    ctx.drawImage(mid, x, drawY + 4, width, drawH - 8);
  }
  const rightX = platform.x + platform.w - capW - 12;
  if (isWorldRectVisible(rightX, capW + 28, 120)) ctx.drawImage(right, rightX, drawY, capW + 28, drawH);
}

function drawBlocks() {
  for (const block of state.level.blocks) {
    if (block.hidden && !block.revealed) continue;
    if (!isWorldRectVisible(block.x, block.w ?? 68, 120)) continue;
    const img = block.type === "stone" || block.used ? images.stoneBlock : block.type === "carrot" ? images.carrot : block.type === "star" ? images.star : images.pawBlock;
    const bump = block.bump > 0 ? Math.sin(block.bump * Math.PI * 10) * -5 : 0;
    block.bump = Math.max(0, block.bump - 0.016);
    const y = block.y + (block.used ? 4 : Math.sin(performance.now() / 180 + block.id) * 1.5) + bump;
    drawImageCentered(img, block.x + 34, y + 34, block.type === "carrot" || block.type === "star" ? 56 : 68, 68);
    if (block.type === "aibox") drawImageCentered(getAiboxIconImage(block.itemId), block.x + 34, y + 31, 40, 40);
  }
}

function drawHazards() {
  for (const hazard of state.level.hazards) {
    if (!isWorldRectVisible(hazard.x, hazard.w, 160)) continue;
    if (hazard.type === "water") {
      const step = 96;
      const start = hazard.x + Math.max(0, Math.floor((state.cameraX - 160 - hazard.x) / step)) * step;
      const end = Math.min(hazard.x + hazard.w, state.cameraX + VIEW_W + 180);
      for (let x = start; x < end; x += step) {
        ctx.drawImage(images.water, x, hazard.y - 12, Math.min(112, hazard.x + hazard.w - x + 16), hazard.h + 28);
      }
    } else {
      const step = 46;
      const start = hazard.x + Math.max(0, Math.floor((state.cameraX - 160 - hazard.x) / step)) * step;
      const end = Math.min(hazard.x + hazard.w, state.cameraX + VIEW_W + 180);
      for (let x = start; x < end; x += step) {
        ctx.drawImage(images.spike, x - 4, hazard.y - 42, 58, hazard.h + 48);
      }
    }
  }
}

function drawDecor() {
  for (const sign of state.level.signs) {
    if (isWorldRectVisible(sign.x - 63, 126, 120)) drawImageCentered(images.sign, sign.x, sign.y, 126, 84);
  }
}

function drawCollectibles() {
  drawItemList(state.level.coins, images.coin, 48, 0.09);
  drawItemList(state.level.stars, images.star, 52, 0.13);
  drawItemList(state.level.carrots, images.carrot, 52, 0.1);
  drawItemList(state.level.boosts, images.bolt, 52, 0.12);
  drawItemList(state.level.shields, images.shield, 52, 0.1);
  drawItemList(state.level.magnets, images.magnet, 52, 0.1);
  drawItemList(state.level.clocks, images.clock, 52, 0.1);
  drawItemList(state.level.cheeses, images.cheese, 54, 0.07);
  drawAiboxItems();
}

function drawItemList(items, image, size, bob) {
  const now = performance.now() / 1000;
  for (const item of items) {
    if (item.taken) continue;
    if (!isWorldRectVisible(item.x, size, 110)) continue;
    const y = item.y + Math.sin(now * 4 + item.pulse) * (bob * 40);
    drawImageCentered(image, item.x + size / 2, y + size / 2, size, size);
  }
}

function drawAiboxItems() {
  const now = performance.now() / 1000;
  for (const item of state.level.aiboxItems) {
    if (item.taken) continue;
    if (!isWorldRectVisible(item.x, 62, 120)) continue;
    const icon = getAiboxIconImage(item.itemId);
    const y = item.y + Math.sin(now * 4.4 + item.pulse) * 4;
    ctx.save();
    ctx.globalAlpha = 0.72;
    ctx.fillStyle = "#102b66";
    ctx.strokeStyle = "#fff6ce";
    ctx.lineWidth = 3;
    roundRect(item.x - 4, y - 4, 62, 62, 8);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    drawImageCentered(icon, item.x + 27, y + 27, 54, 54);
  }
}

function drawEnemies() {
  const sheet = images.turtleSheet;
  for (const enemy of state.enemies) {
    if (enemy.dead) continue;
    if (!isWorldRectVisible(enemy.x, enemy.w, 220)) continue;
    if (enemy.type === "aiboxBoss") {
      drawAiboxBoss(enemy);
      continue;
    }
    if (enemy.type !== "turtle") {
      if (enemy.type === "mole" && !enemy.active) {
        ctx.save();
        ctx.fillStyle = "rgba(57, 32, 21, 0.62)";
        ctx.beginPath();
        ctx.ellipse(enemy.x + enemy.w / 2, enemy.baseY + enemy.h - 4, 30, 8, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        continue;
      }
      const image = images[enemy.type] || images.turtleSheet;
      const frames = enemySpriteFrames(enemy.type);
      const sourceW = image.width / frames;
      const sourceH = image.height;
      let frame = Math.floor(enemy.frame) % frames;
      if (enemy.type === "boar") {
        if (enemy.y < enemy.baseY - 36) frame = enemy.vy < 0 ? 1 : 2;
        else if (enemy.activated && (enemy.leapCooldown ?? 0) < 0.18) frame = 3;
        else frame = 0;
      }
      const meta = enemyDrawMeta(enemy.type);
      const drawW = enemy.w * meta.w;
      const drawH = enemy.h * meta.h;
      const drawX = enemy.x + enemy.w / 2 - drawW / 2;
      const drawY = meta.fly
        ? enemy.y + enemy.h / 2 - drawH / 2
        : enemy.y + enemy.h - drawH + meta.foot;
      if (!meta.fly) {
        ctx.save();
        ctx.globalAlpha = 0.22;
        ctx.fillStyle = "#2f221b";
        ctx.beginPath();
        ctx.ellipse(enemy.x + enemy.w / 2, enemy.y + enemy.h + 6, enemy.w * 0.43, 6, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      ctx.save();
      if (enemy.dir < 0 && enemy.type !== "goblin") {
        ctx.translate(drawX + drawW, drawY);
        ctx.scale(-1, 1);
        ctx.drawImage(image, frame * sourceW, 0, sourceW, sourceH, 0, 0, drawW, drawH);
      } else {
        ctx.drawImage(image, frame * sourceW, 0, sourceW, sourceH, drawX, drawY, drawW, drawH);
      }
      ctx.restore();
      if (enemy.hp > 1) {
        ctx.save();
        ctx.fillStyle = "rgba(7, 16, 31, 0.72)";
        roundRect(enemy.x + 10, enemy.y - 12, enemy.w - 20, 8, 4);
        ctx.fill();
        ctx.fillStyle = "#ffcf46";
        roundRect(enemy.x + 11, enemy.y - 11, (enemy.w - 22) * (enemy.hp / (enemy.maxHp || enemy.hp)), 6, 3);
        ctx.fill();
        ctx.restore();
      }
      continue;
    }
    const frame = Math.floor(enemy.frame) % 4;
    const sx = (frame % 2) * 160;
    const sy = Math.floor(frame / 2) * 160;
    const drawY = enemy.y - 42 + ENEMY_FOOT_SINK;
    const shadowY = enemy.y + enemy.h + ENEMY_FOOT_SINK - 1;
    ctx.save();
    ctx.globalAlpha = 0.22;
    ctx.fillStyle = "#3b2a1d";
    ctx.beginPath();
    ctx.ellipse(enemy.x + enemy.w / 2, shadowY, 24, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    ctx.save();
    if (enemy.dir > 0) {
      ctx.translate(enemy.x + enemy.w, enemy.y);
      ctx.scale(-1, 1);
      ctx.drawImage(sheet, sx, sy, 160, 160, -18, -42 + ENEMY_FOOT_SINK, 112, 112);
    } else {
      ctx.drawImage(sheet, sx, sy, 160, 160, enemy.x - 18, drawY, 112, 112);
    }
    ctx.restore();
  }
}

function drawAiboxBoss(enemy) {
  const boss = getAiboxBoss(enemy.bossId);
  const image = images[`aiboxBoss_${boss.id}`];
  const drawW = enemy.drawW ?? enemy.w * 1.28;
  const drawH = enemy.drawH ?? enemy.h * 1.32;
  const drawX = enemy.x + enemy.w / 2 - drawW / 2;
  const drawY = enemy.y + enemy.h - drawH + 10;
  ctx.save();
  ctx.globalAlpha = 0.28;
  ctx.fillStyle = "#1d1b24";
  ctx.beginPath();
  ctx.ellipse(enemy.x + enemy.w / 2, enemy.y + enemy.h + 8, enemy.w * 0.48, 9, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.save();
  if (enemy.dir < 0) {
    ctx.translate(drawX + drawW, drawY);
    ctx.scale(-1, 1);
    ctx.drawImage(image, 0, 0, drawW, drawH);
  } else {
    ctx.drawImage(image, drawX, drawY, drawW, drawH);
  }
  ctx.restore();

  ctx.save();
  ctx.fillStyle = "rgba(7, 16, 31, 0.78)";
  roundRect(enemy.x + 8, enemy.y - 20, enemy.w - 16, 12, 5);
  ctx.fill();
  ctx.fillStyle = hasBossWeakItem(enemy) ? "#70f0a6" : "#ffcf46";
  roundRect(enemy.x + 10, enemy.y - 18, (enemy.w - 20) * Math.max(0, enemy.hp / (enemy.maxHp || enemy.hp)), 8, 4);
  ctx.fill();
  ctx.fillStyle = "#fff8df";
  ctx.strokeStyle = "#06122c";
  ctx.lineWidth = 3;
  ctx.font = "900 15px 'Apple SD Gothic Neo', sans-serif";
  ctx.textAlign = "center";
  ctx.strokeText(boss.title, enemy.x + enemy.w / 2, enemy.y - 28);
  ctx.fillText(boss.title, enemy.x + enemy.w / 2, enemy.y - 28);
  ctx.restore();
}

function drawProjectiles() {
  for (const projectile of state.projectiles) {
    if (!isWorldRectVisible(projectile.x - projectile.size, projectile.size * 2, 120)) continue;
    if (projectile.image) {
      ctx.save();
      ctx.globalAlpha = clamp(projectile.life / 0.42, 0, 1);
      drawImageCentered(projectile.image, projectile.x, projectile.y, projectile.size * 1.9, projectile.size * 1.9);
      ctx.restore();
      continue;
    }
    ctx.save();
    ctx.fillStyle = projectile.color;
    ctx.strokeStyle = "#3f2a16";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(projectile.x, projectile.y, projectile.size, projectile.size * 0.65, 0.35, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }
}

function drawGoal() {
  const goal = state.level.goal;
  if (!isWorldRectVisible(goal.x, goal.w, 160)) return;
  drawImageCentered(images.flag, goal.x + goal.w / 2, goal.y + goal.h / 2, 112, 142);
}

function drawPlayer() {
  const p = state.player;
  const useJump = !p.onGround;
  const sheet = useJump ? images.jumpSheet : images.runSheet;
  const cell = useJump ? 192 : 192;
  const cols = useJump ? 2 : 3;
  const frame = useJump ? clamp(p.jumpFrame, 0, 3) : p.runFrame;
  const sx = (frame % cols) * cell;
  const sy = Math.floor(frame / cols) * cell;
  const flicker = (p.invincible > 0 || state.invincible > 0) && Math.floor(performance.now() / 60) % 2 === 0;
  if (flicker) ctx.globalAlpha = 0.55;
  ctx.save();
  const drawW = PLAYER_DRAW_SIZE;
  const drawH = PLAYER_DRAW_SIZE;
  const drawX = Math.round(p.x + p.w / 2);
  const drawY = Math.round(p.y + p.h + PLAYER_FOOT_SINK - PLAYER_SPRITE_FOOT_OFFSET);
  if (p.onGround) {
    ctx.save();
    ctx.globalAlpha = flicker ? 0.18 : 0.26;
    ctx.fillStyle = "#3b2a1d";
    ctx.beginPath();
    ctx.ellipse(drawX, Math.round(p.y + p.h + PLAYER_FOOT_SINK - 2), 31, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  if (p.dir < 0) {
    ctx.translate(drawX, drawY);
    ctx.scale(-1, 1);
    ctx.drawImage(sheet, sx, sy, cell, cell, -drawW / 2, -drawH / 2, drawW, drawH);
  } else {
    ctx.drawImage(sheet, sx, sy, cell, cell, drawX - drawW / 2, drawY - drawH / 2, drawW, drawH);
  }
  ctx.restore();
  ctx.globalAlpha = 1;
}

function drawParticles() {
  for (const p of state.particles) {
    ctx.globalAlpha = Math.max(0, p.life / p.maxLife);
    ctx.fillStyle = p.color;
    ctx.fillRect(Math.round(p.x), Math.round(p.y), p.size, p.size);
  }
  ctx.globalAlpha = 1;
}

function drawHud() {
  drawLogo();
  drawPanel(276, 22, 344, 76);
  drawPanel(658, 22, 334, 76);
  drawPanel(1008, 22, 244, 76);

  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = "#fff7e7";
  ctx.strokeStyle = "#06122c";
  ctx.lineWidth = 5;
  ctx.font = "900 22px 'Apple SD Gothic Neo', sans-serif";
  strokeFill("SCORE", 316, 52);
  ctx.font = "900 34px 'Apple SD Gothic Neo', sans-serif";
  strokeFill(String(state.score).padStart(6, "0"), 316, 86);
  ctx.textAlign = "right";
  ctx.font = "900 18px 'Apple SD Gothic Neo', sans-serif";
  ctx.fillStyle = "#8fe9ff";
  strokeFill(`LV.${String(state.levelIndex + 1).padStart(2, "0")}`, 586, 52);
  ctx.fillStyle = "#fff8df";
  strokeFill(state.level.name, 586, 84);
  ctx.textAlign = "left";

  drawImageCentered(images.coin, 694, 60, 48, 48);
  strokeFill(`x ${String(state.coins).padStart(2, "0")}`, 730, 74);
  drawImageCentered(images.cheese, 826, 60, 48, 48);
  strokeFill(`x ${state.cheeses}/${state.level.cheeses.length}`, 862, 74);

  drawImageCentered(images.timer, 1048, 60, 44, 44);
  strokeFill(String(Math.max(0, Math.ceil(state.time))).padStart(3, "0"), 1081, 74);
  drawLives(1164, 61);
  drawAiboxHud();
}

function drawAiboxHud() {
  const ids = Array.from(state.aiboxInventory).slice(-6);
  if (!ids.length) return;
  ctx.save();
  ctx.globalAlpha = 0.96;
  const x = 1010;
  const y = 108;
  const w = Math.max(54, ids.length * 31 + 18);
  const h = 46;
  ctx.fillStyle = "rgba(7, 20, 48, 0.72)";
  ctx.strokeStyle = "rgba(255, 246, 206, 0.68)";
  ctx.lineWidth = 2;
  roundRect(x, y, w, h, 8);
  ctx.fill();
  ctx.stroke();
  ids.forEach((id, index) => {
    drawImageCentered(getAiboxIconImage(id), x + 27 + index * 31, y + 23, 28, 28);
  });
  ctx.restore();
}

function drawLives(x, y) {
  for (let i = 0; i < 3; i += 1) drawHeart(x + i * 30, y, 24, i < state.lives);
}

function drawHeart(cx, cy, size, filled) {
  const s = size / 24;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(s, s);
  ctx.beginPath();
  ctx.moveTo(0, 9);
  ctx.bezierCurveTo(-15, -1, -10, -13, -2, -8);
  ctx.bezierCurveTo(2, -16, 15, -10, 10, 2);
  ctx.bezierCurveTo(8, 6, 3, 10, 0, 13);
  ctx.bezierCurveTo(-3, 10, -8, 6, -10, 2);
  ctx.closePath();
  ctx.fillStyle = filled ? "#f34252" : "rgba(15, 32, 68, 0.78)";
  ctx.strokeStyle = "#fff7cf";
  ctx.lineWidth = filled ? 3 : 2.5;
  ctx.shadowColor = "rgba(0, 0, 0, 0.42)";
  ctx.shadowOffsetY = 3;
  ctx.shadowBlur = 0;
  ctx.fill();
  ctx.stroke();
  if (filled) {
    ctx.shadowColor = "transparent";
    ctx.fillStyle = "rgba(255, 255, 255, 0.64)";
    ctx.fillRect(-5, -5, 4, 3);
  }
  ctx.restore();
}

function drawLogo() {
  ctx.save();
  ctx.shadowColor = "rgba(0, 0, 0, 0.32)";
  ctx.shadowOffsetX = 4;
  ctx.shadowOffsetY = 5;
  ctx.shadowBlur = 0;
  drawGeneratedImage(images.userTitleLogo, 14, 8, 238, 190);
  ctx.restore();
}

function drawMissionPanel(x, y, w, h) {
  ctx.save();
  ctx.fillStyle = "rgba(5, 16, 38, 0.94)";
  ctx.strokeStyle = "#61411b";
  ctx.lineWidth = 7;
  roundRect(x, y, w, h, 8);
  ctx.fill();
  ctx.stroke();
  ctx.strokeStyle = "#f7d26f";
  ctx.lineWidth = 3;
  roundRect(x + 7, y + 7, w - 14, h - 14, 5);
  ctx.stroke();
  ctx.fillStyle = "rgba(255, 219, 89, 0.08)";
  ctx.fillRect(x + 12, y + 10, w - 24, 8);
  ctx.restore();
}

function drawPanel(x, y, w, h) {
  ctx.fillStyle = "rgba(8, 25, 57, 0.92)";
  ctx.strokeStyle = "#07132f";
  ctx.lineWidth = 6;
  roundRect(x, y, w, h, 8);
  ctx.fill();
  ctx.stroke();
  ctx.strokeStyle = "rgba(135, 183, 255, 0.45)";
  ctx.lineWidth = 2;
  roundRect(x + 6, y + 6, w - 12, h - 12, 4);
  ctx.stroke();
}

function drawOverlay() {
  if (state.mode === "ready") {
    drawTitleScreen();
    return;
  }
  ctx.fillStyle = "rgba(6, 16, 38, 0.24)";
  ctx.fillRect(0, 0, VIEW_W, VIEW_H);
  ctx.save();
  ctx.textAlign = "center";
  ctx.lineJoin = "round";
  ctx.lineWidth = 10;
  ctx.strokeStyle = "#552915";
  ctx.fillStyle = state.mode === "lose" ? "#ffb0a3" : "#fff06b";
  ctx.font = "900 60px 'Apple SD Gothic Neo', sans-serif";
  const text = state.mode === "ready" ? "쌤쥐 어드벤처" : state.message;
  ctx.strokeText(text, VIEW_W / 2, 284);
  ctx.fillText(text, VIEW_W / 2, 284);
  if (state.mode !== "ready") {
    ctx.font = "900 28px 'Apple SD Gothic Neo', sans-serif";
    ctx.fillStyle = "#fff8df";
    ctx.strokeText(`SCORE ${String(state.score).padStart(6, "0")}`, VIEW_W / 2, 330);
    ctx.fillText(`SCORE ${String(state.score).padStart(6, "0")}`, VIEW_W / 2, 330);
  }
  ctx.restore();
}

function drawRuntimeOverlays() {
  if (state.noticeTimer > 0 && state.notice) drawNotice();
  if (state.pickupHint && state.pickupHintTimer > 0) drawAiboxPickupHint(state.pickupHint);
  if (state.activeCard && state.cardTimer > 0) drawAiboxCardPopup(state.activeCard);
  if (state.bossCutin && state.bossCutinTimer > 0) drawBossCutin(state.bossCutin.bossId);
}

function drawNotice() {
  const alpha = clamp(state.noticeTimer / 0.28, 0, 1);
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const w = Math.min(760, 280 + state.notice.length * 18);
  const x = VIEW_W / 2 - w / 2;
  const y = 118;
  ctx.fillStyle = "rgba(6, 18, 45, 0.88)";
  ctx.strokeStyle = "#fff0a6";
  ctx.lineWidth = 4;
  roundRect(x, y, w, 54, 10);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#fff8df";
  ctx.strokeStyle = "#06122c";
  ctx.lineWidth = 4;
  ctx.font = "900 24px 'Apple SD Gothic Neo', sans-serif";
  strokeFill(state.notice, VIEW_W / 2, y + 30);
  ctx.restore();
}

function drawAiboxCardPopup(itemId) {
  const def = getAiboxItem(itemId);
  const card = getAiboxCardImage(itemId);
  const appear = clamp((state.cardTimer > 0 ? 1 : 0) * Math.min(1, (4.8 - state.cardTimer) / 0.2), 0, 1);
  ctx.save();
  ctx.globalAlpha = clamp(state.cardTimer / 0.4, 0, 1);
  const x = 42;
  const y = 372 - (1 - appear) * 18;
  const w = 510;
  const h = 186;
  ctx.fillStyle = "rgba(7, 22, 55, 0.92)";
  ctx.strokeStyle = "#f7d26f";
  ctx.lineWidth = 5;
  roundRect(x, y, w, h, 10);
  ctx.fill();
  ctx.stroke();
  ctx.strokeStyle = "rgba(143, 233, 255, 0.6)";
  ctx.lineWidth = 2;
  roundRect(x + 8, y + 8, w - 16, h - 16, 7);
  ctx.stroke();
  drawGeneratedImage(card, x + 22, y + 22, 142, 142);
  ctx.fillStyle = "#8fe9ff";
  ctx.strokeStyle = "#06122c";
  ctx.lineWidth = 4;
  ctx.textAlign = "left";
  ctx.font = "900 20px 'Apple SD Gothic Neo', sans-serif";
  strokeFill("도감 열림", x + 184, y + 47);
  ctx.fillStyle = "#fff06b";
  ctx.font = "900 31px 'Apple SD Gothic Neo', sans-serif";
  strokeFill(def.title, x + 184, y + 88);
  ctx.fillStyle = "#fff8df";
  ctx.font = "900 19px 'Apple SD Gothic Neo', sans-serif";
  wrapText(def.description, x + 184, y + 124, 286, 27);
  ctx.restore();
}

function drawAiboxPickupHint(itemId) {
  const def = getAiboxItem(itemId);
  const alpha = clamp(state.pickupHintTimer / 0.28, 0, 1);
  drawVisualNovelDialogue({
    alpha,
    side: "left",
    speaker: "쌤쥐",
    message: state.pickupHintLine || createAiboxMysteryLine(def.id),
    accent: "#fff06b",
    icon: getAiboxIconImage(itemId),
    portrait: "samjwi"
  });
}

function createAiboxMysteryLine(itemId) {
  const name = getAiboxMysteryName(itemId);
  const lines = [
    `${name}? 이건 뭐지? 분명 쓸 데가 있을 거야!`,
    `${name}? 먹는 건 아니겠지? 일단 챙겨두자!`,
    `${name}? 무슨 기능인지 감은 안 오는데... 꽤 쓸모있겠지?`,
    `${name}? 선생님을 도울 물건 같은데? 어디에 쓰는 걸까?`,
    `${name}? 수상하지만 좋아 보여. 나중에 꼭 필요할지도 몰라!`,
    `${name}? 이름부터 어렵네. 그래도 뭔가 해결해줄 것 같아!`,
    `${name}? 이 작은 상자가 무슨 일을 하는지 한번 지켜보자!`,
    `${name}? 지금은 몰라도, 분명 딱 맞는 순간이 올 거야!`
  ];
  return lines[Math.floor(Math.random() * lines.length)];
}

function getAiboxMysteryName(itemId) {
  if (itemId === "hwp_studio") return "HWP 스튜디오";
  return getAiboxItem(itemId).title;
}

function drawBossCutin(bossId) {
  const boss = getAiboxBoss(bossId);
  const image = images[`aiboxBoss_${boss.id}`];
  const needed = boss.weakTo.map((itemId) => getAiboxItem(itemId).title).join(" / ");
  const alpha = clamp(state.bossCutinTimer / 0.35, 0, 1);
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = "rgba(4, 12, 31, 0.72)";
  ctx.fillRect(0, 0, VIEW_W, VIEW_H);
  ctx.restore();
  drawVisualNovelDialogue({
    alpha,
    side: "right",
    speaker: boss.title,
    message: boss.line,
    subline: `필요한 아이템: ${needed}`,
    accent: boss.color,
    portraitImage: image,
    flipPortrait: true,
    villain: true
  });
}

function drawVisualNovelDialogue({ alpha = 1, side, speaker, message, subline = "", accent = "#fff06b", icon = null, portrait = "", portraitImage = null, flipPortrait = false, villain = false }) {
  const leftSide = side === "left";
  const barX = 24;
  const barY = 492;
  const barW = VIEW_W - 48;
  const barH = 196;
  const textX = 58;
  const textMax = leftSide ? 1128 : 820;
  const nameX = leftSide ? 54 : VIEW_W - 462;

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = leftSide ? "rgba(32, 185, 255, 0.12)" : "rgba(255, 75, 75, 0.13)";
  ctx.beginPath();
  ctx.moveTo(leftSide ? 0 : VIEW_W, 188);
  ctx.lineTo(leftSide ? 650 : 620, 120);
  ctx.lineTo(leftSide ? 500 : 820, 508);
  ctx.lineTo(leftSide ? 0 : VIEW_W, 558);
  ctx.closePath();
  ctx.fill();

  if (portrait === "samjwi") drawSamjwiDialoguePortrait(18, 238, 360, 360);
  if (portraitImage) drawBossDialoguePortrait(portraitImage, VIEW_W - 392, 146, 344, 344, flipPortrait, accent);

  ctx.shadowColor = "rgba(0, 0, 0, 0.42)";
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 8;
  ctx.shadowBlur = 0;
  ctx.fillStyle = "rgba(4, 15, 42, 0.95)";
  ctx.strokeStyle = "#fff0a6";
  ctx.lineWidth = 6;
  roundRect(barX, barY, barW, barH, 10);
  ctx.fill();
  ctx.stroke();
  ctx.shadowColor = "transparent";

  ctx.strokeStyle = "rgba(143, 233, 255, 0.62)";
  ctx.lineWidth = 2;
  roundRect(barX + 10, barY + 10, barW - 20, barH - 20, 7);
  ctx.stroke();

  ctx.fillStyle = "#0b2a55";
  ctx.strokeStyle = "#fff0a6";
  ctx.lineWidth = 4;
  roundRect(nameX, barY - 30, 318, 52, 8);
  ctx.fill();
  ctx.stroke();

  if (icon) {
    ctx.fillStyle = "#fff8df";
    roundRect(nameX + 12, barY - 22, 42, 42, 7);
    ctx.fill();
    drawImageCentered(icon, nameX + 33, barY - 1, 36, 36);
  }

  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.lineJoin = "round";
  ctx.strokeStyle = "#06122c";
  ctx.lineWidth = 6;
  ctx.fillStyle = villain ? "#ffed9d" : "#fff8df";
  ctx.font = "900 28px 'Apple SD Gothic Neo', sans-serif";
  strokeFill(speaker, nameX + (icon ? 68 : 28), barY + 5);

  ctx.strokeStyle = "#06122c";
  ctx.lineWidth = 7;
  ctx.fillStyle = villain ? "#fff6cf" : accent;
  ctx.font = "900 40px 'Apple SD Gothic Neo', sans-serif";
  wrapText(message, textX, barY + 82, textMax, 48);

  if (subline) {
    ctx.lineWidth = 5;
    ctx.fillStyle = "#8fe9ff";
    ctx.font = "900 25px 'Apple SD Gothic Neo', sans-serif";
    wrapText(subline, textX, barY + 148, textMax, 30);
  }

  ctx.textAlign = "right";
  ctx.lineWidth = 4;
  ctx.fillStyle = "#fff8df";
  ctx.font = "900 22px 'Apple SD Gothic Neo', sans-serif";
  strokeFill("Press any button..", barX + barW - 30, barY + barH - 22);
  ctx.restore();
}

function drawSamjwiDialoguePortrait(x, y, w, h) {
  ctx.save();
  ctx.shadowColor = "rgba(0, 0, 0, 0.34)";
  ctx.shadowOffsetX = 9;
  ctx.shadowOffsetY = 13;
  ctx.shadowBlur = 0;
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(images.runSheet, 0, 0, 192, 192, Math.round(x), Math.round(y), Math.round(w), Math.round(h));
  ctx.restore();
}

function drawBossDialoguePortrait(image, x, y, w, h, flip, accent) {
  ctx.save();
  ctx.fillStyle = "rgba(255, 248, 223, 0.88)";
  ctx.strokeStyle = accent;
  ctx.lineWidth = 6;
  roundRect(x + 34, y + 34, w - 68, h - 58, 18);
  ctx.fill();
  ctx.stroke();
  ctx.shadowColor = "rgba(0, 0, 0, 0.42)";
  ctx.shadowOffsetX = -10;
  ctx.shadowOffsetY = 13;
  ctx.shadowBlur = 0;
  if (flip) drawGeneratedImageFlipped(image, x, y, w, h);
  else drawGeneratedImage(image, x, y, w, h);
  ctx.restore();
}

function drawTitleScreen() {
  const shade = ctx.createLinearGradient(0, 0, 0, VIEW_H);
  shade.addColorStop(0, "rgba(4, 28, 74, 0.06)");
  shade.addColorStop(0.42, "rgba(5, 22, 58, 0.34)");
  shade.addColorStop(1, "rgba(4, 12, 32, 0.72)");
  ctx.fillStyle = shade;
  ctx.fillRect(0, 0, VIEW_W, VIEW_H);

  ctx.save();
  ctx.globalAlpha = 0.42;
  ctx.fillStyle = "#fff3a8";
  for (let i = 0; i < 18; i += 1) {
    const angle = (i / 18) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(875, 286);
    ctx.lineTo(875 + Math.cos(angle - 0.026) * 700, 286 + Math.sin(angle - 0.026) * 410);
    ctx.lineTo(875 + Math.cos(angle + 0.026) * 700, 286 + Math.sin(angle + 0.026) * 410);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();

  ctx.save();
  ctx.globalAlpha = 0.9;
  drawImageCentered(images.coin, 212, 442, 44, 44);
  drawImageCentered(images.coin, 300, 510, 36, 36);
  drawImageCentered(images.cheese, 504, 468, 52, 52);
  drawImageCentered(images.star, 610, 178, 42, 42);
  drawImageCentered(images.coin, 1110, 492, 42, 42);
  drawImageCentered(images.cheese, 1162, 192, 54, 54);
  ctx.restore();

  ctx.save();
  ctx.shadowColor = "rgba(0, 0, 0, 0.32)";
  ctx.shadowOffsetX = 8;
  ctx.shadowOffsetY = 12;
  ctx.shadowBlur = 0;
  drawGeneratedImage(images.userTitleLogo, 54, 74, 610, 486);
  ctx.restore();

  ctx.save();
  ctx.shadowColor = "rgba(0, 0, 0, 0.34)";
  ctx.shadowOffsetX = 9;
  ctx.shadowOffsetY = 13;
  ctx.shadowBlur = 0;
  drawGeneratedImage(images.introMouseBadge, 640, 48, 510, 510);
  ctx.restore();
}

function drawReferenceLogo(x, y, scale) {
  ctx.save();
  ctx.translate(x, y);
  ctx.lineJoin = "round";
  ctx.shadowColor = "rgba(32, 13, 6, 0.38)";
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 5 * scale;
  ctx.shadowOffsetY = 7 * scale;
  drawLogoBackplate(scale);
  ctx.shadowColor = "transparent";
  drawLogoMouse(172 * scale, -16 * scale, 112 * scale, 112 * scale);
  drawGeneratedImage(images.generatedWordmark, 2 * scale, -8 * scale, 238 * scale, 122 * scale);
  ctx.restore();
}

function drawLogoBackplate(scale) {
  ctx.save();
  ctx.fillStyle = "#fff8df";
  ctx.strokeStyle = "#603018";
  ctx.lineWidth = 8 * scale;
  ctx.beginPath();
  ctx.moveTo(13 * scale, 38 * scale);
  ctx.bezierCurveTo(-10 * scale, 12 * scale, 38 * scale, -13 * scale, 85 * scale, 4 * scale);
  ctx.bezierCurveTo(113 * scale, -19 * scale, 168 * scale, -8 * scale, 194 * scale, 13 * scale);
  ctx.bezierCurveTo(247 * scale, 0, 278 * scale, 39 * scale, 254 * scale, 75 * scale);
  ctx.bezierCurveTo(276 * scale, 105 * scale, 218 * scale, 130 * scale, 169 * scale, 115 * scale);
  ctx.bezierCurveTo(118 * scale, 137 * scale, 47 * scale, 130 * scale, 30 * scale, 103 * scale);
  ctx.bezierCurveTo(-11 * scale, 104 * scale, -17 * scale, 61 * scale, 13 * scale, 38 * scale);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.strokeStyle = "rgba(255, 255, 255, 0.78)";
  ctx.lineWidth = 3 * scale;
  ctx.stroke();
  ctx.restore();
}

function drawLogoMouse(x, y, w, h) {
  ctx.save();
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(images.runSheet, 36, 25, 124, 124, Math.round(x), Math.round(y), Math.round(w), Math.round(h));
  ctx.restore();
}

function drawAdventureWordmark(x, y, scale, align = "center") {
  ctx.save();
  ctx.textAlign = align;
  ctx.textBaseline = "alphabetic";
  ctx.lineJoin = "round";

  const firstSize = Math.round(56 * scale);
  const secondSize = Math.round(54 * scale);
  const firstY = y + 48 * scale;
  const secondY = y + 104 * scale;
  const firstFill = ctx.createLinearGradient(0, firstY - firstSize, 0, firstY + 6);
  firstFill.addColorStop(0, "#fff47a");
  firstFill.addColorStop(0.48, "#ffd342");
  firstFill.addColorStop(1, "#ff9a20");
  const secondFill = ctx.createLinearGradient(0, secondY - secondSize, 0, secondY + 8);
  secondFill.addColorStop(0, "#e7fbff");
  secondFill.addColorStop(0.48, "#55d7ff");
  secondFill.addColorStop(1, "#1488e6");

  drawOutlinedText("쌤쥐", x, firstY, firstSize, firstFill, scale);
  drawOutlinedText("어드벤처", x, secondY, secondSize, secondFill, scale);
  ctx.restore();
}

function drawOutlinedText(text, x, y, size, fill, scale) {
  ctx.font = `900 ${Math.round(size)}px 'Apple SD Gothic Neo', sans-serif`;
  ctx.strokeStyle = "#2a160b";
  ctx.lineWidth = Math.max(6, Math.round(18 * scale));
  ctx.strokeText(text, x + Math.round(3 * scale), y + Math.round(5 * scale));
  ctx.strokeStyle = "#fff6ce";
  ctx.lineWidth = Math.max(4, Math.round(15 * scale));
  ctx.strokeText(text, x, y);
  ctx.strokeStyle = "#5b2c16";
  ctx.lineWidth = Math.max(3, Math.round(9.5 * scale));
  ctx.strokeText(text, x, y);
  ctx.fillStyle = fill;
  ctx.fillText(text, x, y);
}

function drawGeneratedImage(image, x, y, w, h) {
  ctx.save();
  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(image, Math.round(x), Math.round(y), Math.round(w), Math.round(h));
  ctx.restore();
}

function drawGeneratedImageFlipped(image, x, y, w, h) {
  ctx.save();
  ctx.imageSmoothingEnabled = true;
  ctx.translate(Math.round(x + w), Math.round(y));
  ctx.scale(-1, 1);
  ctx.drawImage(image, 0, 0, Math.round(w), Math.round(h));
  ctx.restore();
}

function drawImageCentered(image, cx, cy, w, h = w) {
  ctx.drawImage(image, Math.round(cx - w / 2), Math.round(cy - h / 2), Math.round(w), Math.round(h));
}

function strokeFill(text, x, y) {
  ctx.strokeText(text, x, y);
  ctx.fillText(text, x, y);
}

function wrapText(text, x, y, maxWidth, lineHeight) {
  const words = String(text).split(" ");
  let line = "";
  let lineY = y;
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      strokeFill(line, x, lineY);
      line = word;
      lineY += lineHeight;
    } else {
      line = test;
    }
  }
  if (line) strokeFill(line, x, lineY);
}

function enemyDefaults(type = "turtle") {
  const defaults = {
    turtle: { type: "turtle", w: 72, h: 58, hp: 1, speed: 74 },
    bat: { type: "bat", w: 64, h: 48, hp: 1, speed: 116, amp: 24, animSpeed: 8 },
    frog: { type: "frog", w: 66, h: 54, hp: 2, speed: 52, animSpeed: 2.6 },
    mole: { type: "mole", w: 58, h: 56, hp: 1, speed: 0, animSpeed: 1.8 },
    boar: { type: "boar", w: 96, h: 72, hp: 4, speed: 18, animSpeed: 3.6 },
    crow: { type: "crow", w: 70, h: 48, hp: 2, speed: 185, amp: 14, animSpeed: 8 },
    goblin: { type: "goblin", w: 68, h: 66, hp: 2, speed: 0, animSpeed: 3.2 },
    bear: { type: "bear", w: 116, h: 96, hp: 4, speed: 58, animSpeed: 3 },
    catboss: { type: "catboss", w: 142, h: 118, hp: 8, speed: 92, animSpeed: 3.4 },
    aiboxBoss: { type: "aiboxBoss", w: 190, h: 150, hp: 4, speed: 76, animSpeed: 2.8 }
  };
  return defaults[type] || defaults.turtle;
}

function enemySpriteFrames(type) {
  return ["bat", "frog", "mole", "boar", "crow", "goblin", "bear", "catboss"].includes(type) ? 4 : 1;
}

function enemyDrawMeta(type) {
  const meta = {
    bat: { w: 1.9, h: 2.2, foot: 0, fly: true },
    frog: { w: 1.85, h: 2.05, foot: 18, fly: false },
    mole: { w: 1.85, h: 1.95, foot: 14, fly: false },
    boar: { w: 1.32, h: 1.42, foot: 8, fly: false },
    crow: { w: 1.8, h: 2.15, foot: 0, fly: true },
    goblin: { w: 1.75, h: 1.9, foot: 10, fly: false },
    bear: { w: 1.35, h: 1.45, foot: 10, fly: false },
    catboss: { w: 1.25, h: 1.34, foot: 8, fly: false }
  };
  return meta[type] || { w: 1, h: 1, foot: 0, fly: false };
}

function enemyRect(enemy) {
  if (enemy.type === "aiboxBoss") {
    return {
      x: enemy.x + enemy.w * 0.16,
      y: enemy.y + enemy.h * 0.12,
      w: enemy.w * 0.68,
      h: enemy.h * 0.78
    };
  }
  return {
    x: enemy.x + enemy.w * 0.15,
    y: enemy.y + enemy.h * 0.18,
    w: enemy.w * 0.7,
    h: enemy.h * 0.76
  };
}

function rectPlayer() {
  const p = state.player;
  return {
    x: p.x + PLAYER_COLLISION_INSET_X,
    y: p.y + PLAYER_COLLISION_TOP_INSET,
    w: p.w - PLAYER_COLLISION_INSET_X * 2,
    h: p.h - PLAYER_COLLISION_TOP_INSET
  };
}

function overlap(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function approach(value, target, amount) {
  if (value < target) return Math.min(target, value + amount);
  if (value > target) return Math.max(target, value - amount);
  return target;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function burst(x, y, color, count, force) {
  for (let i = 0; i < count; i += 1) {
    const a = Math.random() * Math.PI * 2;
    const s = Math.random() * force;
    state.particles.push({
      x,
      y,
      vx: Math.cos(a) * s,
      vy: Math.sin(a) * s - 120,
      life: 0.34 + Math.random() * 0.26,
      maxLife: 0.6,
      size: 3 + Math.floor(Math.random() * 4),
      color
    });
  }
}

function dust(x, y) {
  burst(x, y, "#fff8df", 2, 42);
}

let audio;
function playIntro() {
  if (!introBgm || state.mode !== "ready") return;
  pauseBgm();
  introBgm.volume = 0.38;
  const playPromise = introBgm.play();
  if (playPromise && typeof playPromise.catch === "function") {
    playPromise.catch(() => {
      // Browsers may block title music until a user gesture.
    });
  }
}

function pauseIntro() {
  if (!introBgm) return;
  introBgm.pause();
  introBgm.currentTime = 0;
}

function playBgm() {
  if (!bgm) return;
  pauseIntro();
  bgm.volume = 0.32;
  const playPromise = bgm.play();
  if (playPromise && typeof playPromise.catch === "function") {
    playPromise.catch(() => {
      // Browsers may block audio until the next explicit user gesture.
    });
  }
}

function pauseBgm() {
  if (!bgm) return;
  bgm.pause();
}

function playSfx(name, volume) {
  const base = sounds[name];
  if (!base) return;
  const sound = base.cloneNode();
  sound.volume = volume ?? base.volume;
  const playPromise = sound.play();
  if (playPromise && typeof playPromise.catch === "function") {
    playPromise.catch(() => {
      // Effects are optional; browsers may block audio until a user gesture.
    });
  }
}

function playLoopingSfx(name, volume) {
  const sound = sounds[name];
  if (!sound) return;
  if (sound.fadeFrame) cancelAnimationFrame(sound.fadeFrame);
  sound.fadeFrame = null;
  sound.pause();
  sound.currentTime = 0;
  sound.loop = true;
  sound.volume = volume ?? sound.volume;
  const playPromise = sound.play();
  if (playPromise && typeof playPromise.catch === "function") {
    playPromise.catch(() => {
      // Effects are optional; browsers may block audio until a user gesture.
    });
  }
}

function fadeOutSound(name, duration = 0.45) {
  const sound = sounds[name];
  if (!sound || sound.paused) return;
  if (sound.fadeFrame) cancelAnimationFrame(sound.fadeFrame);
  const startVolume = sound.volume;
  const startTime = performance.now();
  const durationMs = Math.max(1, duration * 1000);
  const step = (now) => {
    const progress = clamp((now - startTime) / durationMs, 0, 1);
    sound.volume = startVolume * (1 - progress);
    if (progress < 1) {
      sound.fadeFrame = requestAnimationFrame(step);
      return;
    }
    sound.pause();
    sound.currentTime = 0;
    sound.loop = false;
    sound.volume = startVolume;
    sound.fadeFrame = null;
  };
  sound.fadeFrame = requestAnimationFrame(step);
}

function stopSound(name) {
  const sound = sounds[name];
  if (!sound) return;
  if (sound.fadeFrame) cancelAnimationFrame(sound.fadeFrame);
  sound.fadeFrame = null;
  sound.pause();
  sound.currentTime = 0;
  sound.loop = false;
}

function tone(freq, duration) {
  try {
    audio ||= new AudioContext();
    const osc = audio.createOscillator();
    const gain = audio.createGain();
    osc.type = "square";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.035, audio.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + duration);
    osc.connect(gain);
    gain.connect(audio.destination);
    osc.start();
    osc.stop(audio.currentTime + duration);
  } catch {
    // Audio is optional; some browsers block it until a user gesture.
  }
}

function roundRect(x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
}

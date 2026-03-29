const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const ui = {
  levelName: document.getElementById("levelName"),
  collectStatus: document.getElementById("collectStatus"),
  scoreValue: document.getElementById("scoreValue"),
  bannerTitle: document.getElementById("bannerTitle"),
  bannerSubtitle: document.getElementById("bannerSubtitle"),
  storyText: document.getElementById("storyText"),
  overlay: document.getElementById("overlay"),
  overlayTitle: document.getElementById("overlayTitle"),
  overlayBody: document.getElementById("overlayBody"),
  startButton: document.getElementById("startButton"),
  restartButton: document.getElementById("restartButton"),
  skipButton: document.getElementById("skipButton"),
  audioButton: document.getElementById("audioButton"),
};

const WORLD_HEIGHT = 540;
const GRAVITY = 0.52;
const keys = {
  left: false,
  right: false,
  jump: false,
  down: false,
};

const stages = [
  {
    name: "بوابة القلعة",
    subtitle: "مدخل ملكي وأروقة الحراس",
    story: "ابدأ من البوابة الداخلية لقلعة الملك، واعبر الأروقة الحجرية والمصاعد السرية حتى تصل للباب التالي.",
    mechanicHint: "فكرة المرحلة: مصاعد حجرية وممرات حراسة داخل القلعة.",
    sky: ["#9fd3ff", "#dff5ff"],
    sun: "#fff0a6",
    ground: "#4d86a3",
    accent: "#2a6078",
    deco: "gate",
    worldWidth: 2320,
    playerStart: { x: 80, y: 360 },
    platforms: [
      { x: 0, y: 470, w: 300, h: 70 },
      { x: 360, y: 420, w: 120, h: 20, type: "moving", axis: "y", range: 64, speed: 0.024 },
      { x: 560, y: 365, w: 150, h: 24 },
      { x: 810, y: 330, w: 130, h: 20, type: "moving", axis: "x", range: 90, speed: 0.018 },
      { x: 1040, y: 286, w: 150, h: 24, type: "crumble", fallDelay: 28, respawnDelay: 120 },
      { x: 1280, y: 414, w: 120, h: 20, type: "moving", axis: "y", range: 72, speed: 0.022 },
      { x: 1490, y: 344, w: 150, h: 24 },
      { x: 1705, y: 294, w: 145, h: 24 },
      { x: 1940, y: 350, w: 130, h: 20, type: "moving", axis: "x", range: 95, speed: 0.02 },
      { x: 2120, y: 470, w: 200, h: 70 },
    ],
    collectibles: [
      { x: 390, y: 350, kind: "tea" },
      { x: 620, y: 325, kind: "tea" },
      { x: 1090, y: 246, kind: "tea" },
      { x: 1520, y: 304, kind: "tea" },
      { x: 1980, y: 310, kind: "tea" },
    ],
    enemies: [
      { x: 608, y: 333, minX: 580, maxX: 690, speed: 1.2 },
      { x: 1735, y: 262, minX: 1710, maxX: 1825, speed: 1.45 },
    ],
    goal: { x: 2238, y: 398, w: 44, h: 72 },
    hazards: [
      { x: 1624, y: 430, w: 34, h: 34, kind: "saw", hidden: true, triggerX: 1480 },
    ],
    windZones: [],
  },
  {
    name: "قاعة العرش",
    subtitle: "شرفات، سجاد ملكي، ومناشير خفية",
    story: "داخل قاعة العرش تحرك فوق الشرفات والسجاد المزخرف، وتفادى المناشير المفاجئة للوصول إلى الختم الملكي.",
    mechanicHint: "فكرة المرحلة: ارتداد وشرفات داخل قاعة العرش.",
    sky: ["#ffd49a", "#ffeccd"],
    sun: "#ffb347",
    ground: "#a45835",
    accent: "#7f351d",
    deco: "throne",
    worldWidth: 2400,
    playerStart: { x: 70, y: 360 },
    platforms: [
      { x: 0, y: 470, w: 260, h: 70 },
      { x: 310, y: 438, w: 90, h: 18, type: "bounce" },
      { x: 470, y: 360, w: 140, h: 24 },
      { x: 700, y: 300, w: 110, h: 18, type: "moving", axis: "x", range: 100, speed: 0.022 },
      { x: 880, y: 250, w: 90, h: 18, type: "bounce" },
      { x: 1040, y: 356, w: 140, h: 24, type: "crumble", fallDelay: 24, respawnDelay: 100 },
      { x: 1280, y: 296, w: 110, h: 18, type: "moving", axis: "x", range: 90, speed: 0.026 },
      { x: 1490, y: 240, w: 90, h: 18, type: "bounce" },
      { x: 1660, y: 335, w: 140, h: 24 },
      { x: 1910, y: 280, w: 120, h: 18, type: "moving", axis: "x", range: 80, speed: 0.022 },
      { x: 2130, y: 470, w: 270, h: 70 },
    ],
    collectibles: [
      { x: 500, y: 320, kind: "lantern" },
      { x: 745, y: 260, kind: "lantern" },
      { x: 910, y: 205, kind: "lantern" },
      { x: 1090, y: 316, kind: "lantern" },
      { x: 1325, y: 256, kind: "lantern" },
      { x: 1700, y: 295, kind: "lantern" },
    ],
    enemies: [
      { x: 120, y: 438, minX: 30, maxX: 235, speed: 1.5 },
      { x: 1070, y: 324, minX: 1050, maxX: 1160, speed: 1.8 },
      { x: 1700, y: 303, minX: 1670, maxX: 1785, speed: 1.35 },
    ],
    goal: { x: 2290, y: 398, w: 44, h: 72 },
    hazards: [
      { x: 1192, y: 428, w: 36, h: 36, kind: "saw", hidden: true, triggerX: 980 },
    ],
    windZones: [],
  },
  {
    name: "مكتبة الملك",
    subtitle: "رفوف عالية، جسور خشبية، ونوافذ هواء",
    story: "اصعد بين رفوف المكتبة الملكية واستعمل تيارات الهواء الخارجة من النوافذ العالية لتجاوز المناشير.",
    mechanicHint: "فكرة المرحلة: نوافذ هواء داخل المكتبة تدفعك نحو الممرات.",
    sky: ["#bdd4f5", "#f2f7ff"],
    sun: "#fff6cd",
    ground: "#758399",
    accent: "#4c5f79",
    deco: "library",
    worldWidth: 2500,
    playerStart: { x: 80, y: 360 },
    platforms: [
      { x: 0, y: 470, w: 260, h: 70 },
      { x: 340, y: 420, w: 160, h: 24 },
      { x: 600, y: 380, w: 120, h: 20, type: "moving", axis: "y", range: 80, speed: 0.02 },
      { x: 830, y: 315, w: 140, h: 24 },
      { x: 1080, y: 270, w: 140, h: 24 },
      { x: 1320, y: 220, w: 130, h: 18, type: "moving", axis: "x", range: 100, speed: 0.019 },
      { x: 1570, y: 300, w: 140, h: 24, type: "crumble", fallDelay: 26, respawnDelay: 110 },
      { x: 1800, y: 255, w: 130, h: 24 },
      { x: 2040, y: 205, w: 140, h: 24 },
      { x: 2260, y: 470, w: 240, h: 70 },
    ],
    collectibles: [
      { x: 390, y: 380, kind: "drum" },
      { x: 640, y: 340, kind: "drum" },
      { x: 880, y: 275, kind: "drum" },
      { x: 1110, y: 230, kind: "drum" },
      { x: 1380, y: 180, kind: "drum" },
      { x: 1850, y: 215, kind: "drum" },
      { x: 2090, y: 165, kind: "drum" },
    ],
    enemies: [
      { x: 860, y: 283, minX: 840, maxX: 950, speed: 1.3 },
      { x: 1600, y: 268, minX: 1590, maxX: 1680, speed: 1.4 },
      { x: 2060, y: 173, minX: 2050, maxX: 2160, speed: 1.6 },
    ],
    goal: { x: 2385, y: 398, w: 44, h: 72 },
    hazards: [
      { x: 1715, y: 428, w: 36, h: 36, kind: "saw", hidden: true, triggerX: 1505 },
    ],
    windZones: [
      { x: 500, y: 250, w: 180, h: 180, forceX: 0.2, forceY: -0.08 },
      { x: 1180, y: 120, w: 220, h: 220, forceX: 0.26, forceY: -0.14 },
      { x: 1860, y: 135, w: 180, h: 170, forceX: 0.18, forceY: -0.1 },
    ],
  },
  {
    name: "سراديب القلعة",
    subtitle: "لهب أرضي وممرات مخفية تحت القصر",
    story: "انزل إلى السراديب السفلية حيث تشتعل الأرض بالنار من المواقد، واعبر الممرات السرية والمنصات الخادعة.",
    mechanicHint: "فكرة المرحلة: لهب وممرات مضللة في السراديب.",
    sky: ["#1a2852", "#42305f"],
    sun: "#f8dd8e",
    ground: "#b98447",
    accent: "#774624",
    deco: "dungeon",
    worldWidth: 2600,
    playerStart: { x: 60, y: 360 },
    platforms: [
      { x: 0, y: 470, w: 220, h: 70 },
      { x: 300, y: 410, w: 120, h: 16, type: "moving", axis: "x", range: 70, speed: 0.02 },
      { x: 540, y: 340, w: 110, h: 16, type: "moving", axis: "y", range: 55, speed: 0.022 },
      { x: 740, y: 280, w: 120, h: 16, type: "moving", axis: "x", range: 80, speed: 0.024 },
      { x: 980, y: 350, w: 130, h: 18, type: "bounce" },
      { x: 1180, y: 285, w: 120, h: 16, type: "moving", axis: "x", range: 90, speed: 0.023 },
      { x: 1420, y: 360, w: 130, h: 18, type: "bounce" },
      { x: 1630, y: 295, w: 110, h: 16, type: "moving", axis: "y", range: 70, speed: 0.022 },
      { x: 1860, y: 245, w: 120, h: 16, type: "moving", axis: "x", range: 85, speed: 0.025 },
      { x: 2100, y: 335, w: 130, h: 18, type: "bounce" },
      { x: 2350, y: 470, w: 250, h: 70 },
    ],
    collectibles: [
      { x: 335, y: 370, kind: "star" },
      { x: 570, y: 300, kind: "star" },
      { x: 785, y: 240, kind: "star" },
      { x: 1220, y: 245, kind: "star" },
      { x: 1670, y: 255, kind: "star" },
      { x: 1905, y: 205, kind: "star" },
      { x: 2140, y: 295, kind: "star" },
    ],
    enemies: [
      { x: 95, y: 438, minX: 30, maxX: 180, speed: 1.4 },
      { x: 1460, y: 328, minX: 1430, maxX: 1520, speed: 1.25 },
      { x: 2370, y: 438, minX: 2370, maxX: 2520, speed: 1.65 },
    ],
    goal: { x: 2470, y: 398, w: 44, h: 72 },
    hazards: [
      { x: 250, y: 435, w: 34, h: 35, kind: "flame" },
      { x: 455, y: 435, w: 34, h: 35, kind: "flame" },
      { x: 905, y: 435, w: 34, h: 35, kind: "flame" },
      { x: 1340, y: 435, w: 34, h: 35, kind: "flame" },
      { x: 1800, y: 435, w: 34, h: 35, kind: "flame" },
      { x: 2004, y: 428, w: 36, h: 36, kind: "saw", hidden: true, triggerX: 1860 },
    ],
    windZones: [],
  },
  {
    name: "برج الملك",
    subtitle: "غرف التروس، المفتاح الملكي، والجسر الأخير",
    story: "في أعلى برج الملك، ابحث عن المفتاح الملكي ثم اعبر غرفة التروس والضواغط لتصل إلى منصة التتويج.",
    mechanicHint: "فكرة المرحلة: مفتاح يفتح الجسر الأخير داخل برج القلعة.",
    sky: ["#9ad0e9", "#f4fbff"],
    sun: "#ffe2aa",
    ground: "#5e8094",
    accent: "#345164",
    deco: "tower",
    worldWidth: 2800,
    playerStart: { x: 90, y: 360 },
    platforms: [
      { x: 0, y: 470, w: 300, h: 70 },
      { x: 390, y: 405, w: 140, h: 20, type: "moving", axis: "x", range: 90, speed: 0.022 },
      { x: 630, y: 345, w: 140, h: 24 },
      { x: 860, y: 285, w: 140, h: 20, type: "moving", axis: "y", range: 75, speed: 0.021 },
      { x: 1090, y: 340, w: 140, h: 24 },
      { x: 1330, y: 275, w: 150, h: 20, type: "moving", axis: "x", range: 95, speed: 0.02 },
      { x: 1580, y: 225, w: 150, h: 24 },
      { x: 1815, y: 305, w: 140, h: 20, type: "moving", axis: "y", range: 65, speed: 0.022 },
      { x: 2050, y: 255, w: 140, h: 24, type: "crumble", fallDelay: 22, respawnDelay: 115 },
      { x: 2285, y: 320, w: 120, h: 18, hiddenUntilKey: true },
      { x: 2470, y: 470, w: 330, h: 70 },
    ],
    collectibles: [
      { x: 430, y: 365, kind: "crate" },
      { x: 670, y: 305, kind: "crate" },
      { x: 910, y: 245, kind: "crate" },
      { x: 1125, y: 300, kind: "crate" },
      { x: 1620, y: 185, kind: "crate" },
      { x: 2080, y: 215, kind: "crate" },
      { x: 2520, y: 430, kind: "crate" },
    ],
    enemies: [
      { x: 680, y: 313, minX: 650, maxX: 750, speed: 1.35 },
      { x: 1625, y: 193, minX: 1600, maxX: 1710, speed: 1.45 },
      { x: 2510, y: 438, minX: 2490, maxX: 2700, speed: 1.8 },
    ],
    goal: { x: 2705, y: 398, w: 44, h: 72 },
    keyItem: { x: 1410, y: 230, kind: "key", collected: false },
    goalRequiresKey: true,
    hazards: [
      { x: 330, y: 405, w: 48, h: 65, kind: "crusher" },
      { x: 790, y: 405, w: 48, h: 65, kind: "crusher" },
      { x: 1250, y: 405, w: 48, h: 65, kind: "crusher" },
      { x: 2220, y: 430, w: 36, h: 36, kind: "saw" },
      { x: 2328, y: 428, w: 36, h: 36, kind: "saw", hidden: true, triggerX: 2210 },
    ],
    windZones: [],
  },
];

const game = {
  screen: "start",
  levelIndex: 0,
  score: 0,
  totalCollected: 0,
  cameraX: 0,
  flashTimer: 0,
  player: createPlayer(),
  current: null,
};

const audio = {
  ctx: null,
  enabled: true,
  unlocked: false,
  musicTimer: 0,
  noteIndex: 0,
  melody: [
    { freq: 392, len: 0.32 },
    { freq: 440, len: 0.18 },
    { freq: 494, len: 0.22 },
    { freq: 523.25, len: 0.34 },
    { freq: 494, len: 0.22 },
    { freq: 440, len: 0.2 },
    { freq: 392, len: 0.3 },
    { freq: 349.23, len: 0.18 },
  ],
};

function ensureAudio() {
  if (!audio.enabled) {
    return;
  }

  if (!audio.ctx) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) {
      audio.enabled = false;
      ui.audioButton.textContent = "الصوت: غير مدعوم";
      return;
    }
    audio.ctx = new AudioCtx();
  }

  if (audio.ctx.state === "suspended") {
    audio.ctx.resume();
  }

  audio.unlocked = true;
}

function playTone(freq, duration, type = "triangle", volume = 0.045, when = 0) {
  if (!audio.enabled || !audio.ctx || !audio.unlocked) {
    return;
  }

  const start = audio.ctx.currentTime + when;
  const osc = audio.ctx.createOscillator();
  const gain = audio.ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, start);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(volume, start + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  osc.connect(gain);
  gain.connect(audio.ctx.destination);
  osc.start(start);
  osc.stop(start + duration + 0.03);
}

function playJumpSound() {
  playTone(330, 0.12, "square", 0.03);
  playTone(494, 0.08, "triangle", 0.02, 0.03);
}

function playCollectSound() {
  playTone(659.25, 0.12, "triangle", 0.04);
  playTone(783.99, 0.14, "triangle", 0.035, 0.05);
}

function playHitSound() {
  playTone(180, 0.18, "sawtooth", 0.03);
  playTone(130, 0.22, "square", 0.02, 0.06);
}

function playWinSound() {
  playTone(523.25, 0.14, "triangle", 0.04);
  playTone(659.25, 0.14, "triangle", 0.04, 0.08);
  playTone(783.99, 0.18, "triangle", 0.045, 0.16);
}

function updateMusic(dt) {
  if (!audio.enabled || !audio.unlocked || game.screen !== "playing") {
    return;
  }

  audio.musicTimer -= dt / 60;
  if (audio.musicTimer > 0) {
    return;
  }

  const note = audio.melody[audio.noteIndex];
  const accentByStage = [1, 1.06, 0.94, 0.88, 1.1][game.levelIndex] ?? 1;
  playTone(note.freq * accentByStage, note.len, "triangle", 0.018);
  if (audio.noteIndex % 2 === 0) {
    playTone((note.freq / 2) * accentByStage, note.len * 0.9, "sine", 0.01, 0.02);
  }
  audio.musicTimer = note.len + 0.04;
  audio.noteIndex = (audio.noteIndex + 1) % audio.melody.length;
}

function createPlayer() {
  return {
    x: 0,
    y: 0,
    w: 34,
    h: 46,
    vx: 0,
    vy: 0,
    speed: 3.6,
    jumpForce: 11.8,
    onGround: false,
    supportPlatform: null,
    facing: 1,
    animTime: 0,
    crouching: false,
  };
}

function cloneLevel(level) {
  return {
    ...level,
    platforms: level.platforms.map((p) => ({
      ...p,
      baseX: p.x,
      baseY: p.y,
      phase: p.phase ?? Math.random() * Math.PI * 2,
      prevX: p.x,
      prevY: p.y,
      collapseTimer: 0,
      respawnTimer: 0,
      collapsed: false,
    })),
    collectibles: level.collectibles.map((c) => ({ ...c, collected: false, bob: Math.random() * Math.PI * 2 })),
    enemies: level.enemies.map((e) => ({ ...e, dir: 1, animTime: Math.random() * Math.PI * 2 })),
    goal: { ...level.goal },
    hazards: (level.hazards ?? []).map((h) => ({ ...h, revealed: !h.hidden })),
    windZones: (level.windZones ?? []).map((w) => ({ ...w })),
    keyItem: level.keyItem ? { ...level.keyItem, collected: false } : null,
    keyCollected: false,
  };
}

function loadLevel(index, resetScore = false) {
  if (resetScore) {
    game.score = 0;
    game.totalCollected = 0;
  }

  game.levelIndex = index;
  game.current = cloneLevel(stages[index]);
  game.player = createPlayer();
  game.player.x = game.current.playerStart.x;
  game.player.y = game.current.playerStart.y;
  game.cameraX = 0;
  game.flashTimer = 0;
  audio.musicTimer = 0;
  audio.noteIndex = 0;
  game.screen = "playing";
  syncUi();
  setBanner(game.current.name, game.current.subtitle);
  setOverlay("", "", false);
}

function setBanner(title, subtitle) {
  ui.bannerTitle.textContent = title;
  ui.bannerSubtitle.textContent = subtitle;
}

function setOverlay(title, body, visible = true) {
  ui.overlayTitle.textContent = title;
  ui.overlayBody.textContent = body;
  ui.overlay.style.display = visible ? "grid" : "none";
}

function syncUi() {
  const level = game.current ?? stages[game.levelIndex];
  const collected = game.current ? game.current.collectibles.filter((item) => item.collected).length : 0;
  const total = level.collectibles.length;
  ui.levelName.textContent = `${game.levelIndex + 1} / ${stages.length} - ${level.name}`;
  ui.collectStatus.textContent = `${collected} / ${total}`;
  ui.scoreValue.textContent = String(game.score);
  ui.storyText.textContent = level.story;
}

function getActivePlatforms(level) {
  return level.platforms.filter(
    (platform) => (!platform.hiddenUntilKey || level.keyCollected) && !platform.collapsed
  );
}

function updatePlatforms(level, dt) {
  level.platforms.forEach((platform) => {
    platform.prevX = platform.x;
    platform.prevY = platform.y;

     if (platform.type === "crumble") {
      if (platform.collapseTimer > 0) {
        platform.collapseTimer -= dt;
        if (platform.collapseTimer <= 0) {
          platform.collapsed = true;
          platform.respawnTimer = platform.respawnDelay ?? 110;
        }
      }

      if (platform.collapsed) {
        platform.respawnTimer -= dt;
        if (platform.respawnTimer <= 0) {
          platform.collapsed = false;
          platform.collapseTimer = 0;
        }
      }
    }

    if (platform.type !== "moving") {
      return;
    }

    platform.phase += platform.speed * dt * 3.4;
    if (platform.axis === "x") {
      platform.x = platform.baseX + Math.sin(platform.phase) * platform.range;
    } else {
      platform.y = platform.baseY + Math.sin(platform.phase) * platform.range;
    }
  });

  const support = game.player.supportPlatform;
  if (support) {
    game.player.x += support.x - support.prevX;
    game.player.y += support.y - support.prevY;
  }
}

function updateSurpriseTraps(level, player) {
  level.hazards.forEach((hazard) => {
    if (hazard.hidden && !hazard.revealed && player.x >= hazard.triggerX) {
      hazard.revealed = true;
    }
  });
}

function applyWind(level, player, dt) {
  level.windZones.forEach((zone) => {
    if (isIntersecting(player, zone)) {
      player.vx += zone.forceX * dt * 8;
      player.vy += zone.forceY * dt * 7;
    }
  });
}

function hitHazard(level, player) {
  return level.hazards.some((hazard) => {
    if (hazard.hidden && !hazard.revealed) {
      return false;
    }
    return isIntersecting(player, hazard);
  });
}

function beginGame() {
  loadLevel(0, true);
}

function resetCurrentLevel() {
  if (game.current) {
    const currentIndex = game.levelIndex;
    const collectedInLevel = game.current.collectibles.filter((item) => item.collected).length;
    const keyBonus = game.current.keyCollected ? 15 : 0;
    const scoreBeforeLevel = game.score - collectedInLevel * 10 - keyBonus;
    game.score = Math.max(0, scoreBeforeLevel);
    game.totalCollected = Math.max(0, game.totalCollected - collectedInLevel);
    loadLevel(currentIndex, false);
  } else {
    beginGame();
  }
}

function nextLevel() {
  if (game.levelIndex === stages.length - 1) {
    game.screen = "won";
    setBanner("الاحتفال الكبير", "أكملت الرحلة المغربية كاملة.");
    setOverlay(
      "ربحت اللعبة",
      `جمعت ${game.totalCollected} قطعة تراثية وسجلت ${game.score} نقطة. اضغط "ابدأ المغامرة" لإعادة اللعب.`,
      true
    );
    return;
  }

  const nextIndex = game.levelIndex + 1;
  game.screen = "transition";
  setOverlay(
    `تم إنهاء ${stages[game.levelIndex].name}`,
    `المرحلة التالية: ${stages[nextIndex].name}. اضغط "ابدأ المغامرة" للمتابعة.`,
    true
  );
  ui.startButton.textContent = "ابدأ المرحلة التالية";
}

function skipCurrentLevel() {
  if (game.screen === "start" || game.screen === "won") {
    beginGame();
    return;
  }

  if (game.screen === "transition") {
    loadLevel(game.levelIndex + 1, false);
    return;
  }

  nextLevel();
}

function update(dt) {
  if (game.screen !== "playing") {
    return;
  }

  const level = game.current;
  const player = game.player;
  updatePlatforms(level, dt);
  updateSurpriseTraps(level, player);

  const move = (keys.right ? 1 : 0) - (keys.left ? 1 : 0);
  player.vx = move * player.speed;
  if (move !== 0) {
    player.facing = move > 0 ? 1 : -1;
  }
  player.crouching = keys.down && player.onGround;

  if (player.crouching) {
    player.vx *= 0.45;
  }

  if (keys.jump && player.onGround) {
    player.vy = -player.jumpForce;
    player.onGround = false;
    playJumpSound();
  }

  player.animTime += (Math.abs(player.vx) * 0.16 + 0.04) * dt;

  player.vy += GRAVITY * dt;
  applyWind(level, player, dt);

  player.x += player.vx * dt * 1.1;
  resolvePlatformCollisions("x");

  player.y += player.vy * dt;
  player.onGround = false;
  player.supportPlatform = null;
  resolvePlatformCollisions("y");

  level.enemies.forEach((enemy) => {
    enemy.x += enemy.speed * enemy.dir * dt;
    enemy.animTime += 0.11 * dt * (1 + enemy.speed * 0.2);
    if (enemy.x < enemy.minX || enemy.x + 30 > enemy.maxX) {
      enemy.dir *= -1;
      enemy.x = clamp(enemy.x, enemy.minX, enemy.maxX - 30);
    }
  });

  const hitEnemy = level.enemies.some((enemy) =>
    isIntersecting(player, { x: enemy.x, y: enemy.y, w: 30, h: 32 })
  );
  if (hitEnemy) {
    game.flashTimer = 18;
    playHitSound();
    resetCurrentLevel();
    return;
  }

  level.collectibles.forEach((item) => {
    item.bob += 0.08 * dt;
    if (!item.collected && isIntersecting(player, { x: item.x, y: item.y, w: 26, h: 26 })) {
      item.collected = true;
      game.score += 10;
      game.totalCollected += 1;
      playCollectSound();
      syncUi();
    }
  });

  if (level.keyItem && !level.keyCollected && isIntersecting(player, { x: level.keyItem.x, y: level.keyItem.y, w: 26, h: 26 })) {
    level.keyCollected = true;
    level.keyItem.collected = true;
    game.score += 15;
    playCollectSound();
    syncUi();
  }

  const remaining = level.collectibles.some((item) => !item.collected);
  const goalReady = !remaining && (!level.goalRequiresKey || level.keyCollected);
  if (goalReady && isIntersecting(player, level.goal)) {
    playWinSound();
    nextLevel();
    return;
  }

  if (hitHazard(level, player) || player.y > WORLD_HEIGHT + 140) {
    playHitSound();
    resetCurrentLevel();
    return;
  }

  game.cameraX = clamp(
    player.x - canvas.width / 2 + player.w / 2,
    0,
    level.worldWidth - canvas.width
  );

  if (game.flashTimer > 0) {
    game.flashTimer -= dt;
  }

  updateMusic(dt);
}

function resolvePlatformCollisions(axis) {
  const player = game.player;
  const level = game.current;

  getActivePlatforms(level).forEach((platform) => {
    if (!isIntersecting(player, platform)) {
      return;
    }

    if (axis === "x") {
      if (player.vx > 0) {
        player.x = platform.x - player.w;
      } else if (player.vx < 0) {
        player.x = platform.x + platform.w;
      }
      player.vx = 0;
    } else {
      if (player.vy > 0) {
        player.y = platform.y - player.h;
        if (platform.type === "bounce") {
          player.vy = -15.6;
          player.onGround = false;
          player.supportPlatform = null;
          playJumpSound();
        } else {
          player.vy = 0;
          player.onGround = true;
          player.supportPlatform = platform;
          if (platform.type === "crumble" && platform.collapseTimer <= 0) {
            platform.collapseTimer = platform.fallDelay ?? 24;
          }
        }
      } else if (player.vy < 0) {
        player.y = platform.y + platform.h;
        player.vy = 0;
      }
    }
  });

  player.x = clamp(player.x, 0, level.worldWidth - player.w);
}

function isIntersecting(a, b) {
  return (
    a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.y + a.h > b.y
  );
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function draw() {
  const level = game.current ?? stages[game.levelIndex];
  drawBackground(level);
  ctx.save();
  ctx.translate(-game.cameraX, 0);
  drawHazards(level);
  drawWindZones(level);
  drawPlatforms(level);
  drawGoal(level);
  drawKey(level);
  drawCollectibles(level);
  drawEnemies(level);
  drawPlayer();
  ctx.restore();
  drawHudInCanvas(level);

  if (game.flashTimer > 0) {
    ctx.fillStyle = `rgba(255, 244, 230, ${0.06 * game.flashTimer})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
}

function drawBackground(level) {
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, level.sky[0]);
  gradient.addColorStop(1, level.sky[1]);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawInteriorLights(level);
  drawSceneFrame(level);

  if (level.deco === "gate") {
    drawCastleGate();
  } else if (level.deco === "throne") {
    drawThroneHall();
  } else if (level.deco === "library") {
    drawRoyalLibrary();
  } else if (level.deco === "dungeon") {
    drawDungeonHall();
  } else if (level.deco === "tower") {
    drawRoyalTower();
  }
}

function drawInteriorLights(level) {
  ctx.save();
  ctx.fillStyle = "rgba(39, 25, 16, 0.26)";
  ctx.fillRect(0, 0, canvas.width, 96);
  ctx.fillStyle = "rgba(255, 229, 172, 0.12)";
  for (let i = 0; i < 5; i += 1) {
    const x = 78 + i * 170;
    ctx.beginPath();
    ctx.moveTo(x, 250);
    ctx.lineTo(x, 126);
    ctx.quadraticCurveTo(x + 34, 76, x + 68, 126);
    ctx.lineTo(x + 68, 250);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
}

function drawSceneFrame(level) {
  ctx.save();
  ctx.fillStyle = "rgba(34, 24, 18, 0.12)";
  ctx.fillRect(0, 0, 24, canvas.height);
  ctx.fillRect(canvas.width - 24, 0, 24, canvas.height);
  ctx.fillRect(0, 0, canvas.width, 16);
  ctx.fillStyle = "rgba(255, 240, 211, 0.16)";
  for (let x = 18; x < canvas.width - 18; x += 58) {
    ctx.fillRect(x, 16, 18, 5);
  }
  if (level.deco === "city" || level.deco === "market") {
    ctx.fillStyle = "rgba(118, 67, 31, 0.12)";
    ctx.fillRect(0, canvas.height - 115, canvas.width, 22);
  }
  ctx.restore();
}

function drawCastleGate() {
  ctx.fillStyle = "#7b6953";
  ctx.fillRect(70, 170, 700, 230);
  ctx.fillStyle = "#5c4b39";
  ctx.fillRect(340, 215, 160, 185);
  ctx.fillStyle = "#a68d6a";
  for (let x = 120; x < 720; x += 70) {
    ctx.fillRect(x, 150, 36, 30);
  }
  ctx.fillStyle = "#d3c0a1";
  ctx.fillRect(185, 230, 38, 72);
  ctx.fillRect(620, 230, 38, 72);
}

function drawThroneHall() {
  ctx.fillStyle = "#6a2532";
  ctx.fillRect(90, 165, 660, 235);
  ctx.fillStyle = "#d7b25e";
  ctx.fillRect(360, 205, 120, 120);
  ctx.fillStyle = "#8c1f2d";
  ctx.fillRect(330, 320, 180, 80);
  for (let i = 0; i < 4; i += 1) {
    ctx.fillStyle = "#d9c08a";
    ctx.fillRect(150 + i * 150, 180, 24, 220);
  }
}

function drawRoyalLibrary() {
  ctx.fillStyle = "#5b3f2c";
  for (let i = 0; i < 5; i += 1) {
    const x = 80 + i * 145;
    ctx.fillRect(x, 160, 95, 240);
    ctx.fillStyle = "#c39a56";
    for (let j = 0; j < 5; j += 1) {
      ctx.fillRect(x + 8, 178 + j * 42, 79, 6);
    }
    ctx.fillStyle = "#5b3f2c";
  }
  ctx.fillStyle = "#a9c2d9";
  ctx.fillRect(340, 120, 150, 110);
}

function drawDungeonHall() {
  ctx.fillStyle = "#4a4346";
  ctx.fillRect(70, 170, 700, 240);
  ctx.fillStyle = "#6b5850";
  for (let i = 0; i < 6; i += 1) {
    ctx.fillRect(90 + i * 115, 160, 24, 250);
  }
  ctx.fillStyle = "rgba(255, 158, 63, 0.22)";
  ctx.fillRect(150, 220, 60, 120);
  ctx.fillRect(620, 220, 60, 120);
}

function drawRoyalTower() {
  ctx.fillStyle = "#566172";
  ctx.fillRect(180, 120, 480, 290);
  ctx.fillStyle = "#d7c287";
  ctx.fillRect(385, 150, 70, 120);
  ctx.fillStyle = "#415062";
  for (let i = 0; i < 4; i += 1) {
    ctx.fillRect(230 + i * 100, 200, 36, 210);
  }
  ctx.strokeStyle = "rgba(255,255,255,0.18)";
  ctx.beginPath();
  ctx.arc(420, 320, 72, 0, Math.PI * 2);
  ctx.stroke();
}

function drawPlatforms(level) {
  getActivePlatforms(level).forEach((platform, index) => {
    if (platform.type === "crumble" && platform.collapseTimer > 0) {
      ctx.globalAlpha = 0.5 + Math.abs(Math.sin(performance.now() / 45)) * 0.35;
    }
    if (platform.type === "bounce") {
      ctx.fillStyle = "#db6b3d";
    } else if (platform.type === "crumble") {
      ctx.fillStyle = "#8b6554";
    } else if (platform.type === "moving") {
      ctx.fillStyle = "#2b7f78";
    } else {
      ctx.fillStyle = index % 2 === 0 ? level.ground : level.accent;
    }
    const radius = 12;
    roundRect(platform.x, platform.y, platform.w, platform.h, radius);
    ctx.fill();
    if (platform.type === "bounce") {
      ctx.fillStyle = "#ffe1a0";
      for (let x = platform.x + 10; x < platform.x + platform.w - 10; x += 18) {
        ctx.fillRect(x, platform.y + 6, 10, 4);
      }
    } else if (platform.type === "crumble") {
      ctx.fillStyle = "rgba(255, 226, 210, 0.22)";
      for (let x = platform.x + 8; x < platform.x + platform.w - 8; x += 16) {
        ctx.fillRect(x, platform.y + 6, 8, 4);
      }
    } else {
      ctx.fillStyle = "rgba(255,255,255,0.14)";
      ctx.fillRect(platform.x + 10, platform.y + 7, platform.w - 20, 4);
    }
    ctx.globalAlpha = 1;
  });
}

function drawHazards(level) {
  level.hazards.forEach((hazard) => {
    if (hazard.hidden && !hazard.revealed) {
      ctx.fillStyle = "rgba(109, 62, 44, 0.22)";
      ctx.fillRect(hazard.x, hazard.y + hazard.h - 5, hazard.w, 5);
      return;
    }

    if (hazard.kind === "saw") {
      const cx = hazard.x + hazard.w / 2;
      const cy = hazard.y + hazard.h / 2;
      drawStar(cx, cy, 10, hazard.w / 2, hazard.w / 3.2);
      ctx.fillStyle = "#a9b3bf";
      ctx.fill();
      ctx.fillStyle = "#5f6975";
      ctx.beginPath();
      ctx.arc(cx, cy, hazard.w / 7, 0, Math.PI * 2);
      ctx.fill();
    } else if (hazard.kind === "flame") {
      ctx.fillStyle = "#5c3924";
      ctx.fillRect(hazard.x + 10, hazard.y + 23, 14, 12);
      ctx.fillStyle = "#ff8e35";
      ctx.beginPath();
      ctx.moveTo(hazard.x + 17, hazard.y);
      ctx.quadraticCurveTo(hazard.x - 2, hazard.y + 18, hazard.x + 12, hazard.y + 34);
      ctx.quadraticCurveTo(hazard.x + 17, hazard.y + 11, hazard.x + 24, hazard.y + 34);
      ctx.quadraticCurveTo(hazard.x + 38, hazard.y + 18, hazard.x + 17, hazard.y);
      ctx.fill();
      ctx.fillStyle = "#ffe27f";
      ctx.beginPath();
      ctx.moveTo(hazard.x + 17, hazard.y + 7);
      ctx.quadraticCurveTo(hazard.x + 8, hazard.y + 20, hazard.x + 15, hazard.y + 28);
      ctx.quadraticCurveTo(hazard.x + 20, hazard.y + 18, hazard.x + 23, hazard.y + 29);
      ctx.quadraticCurveTo(hazard.x + 29, hazard.y + 17, hazard.x + 17, hazard.y + 7);
      ctx.fill();
    } else if (hazard.kind === "crusher") {
      ctx.fillStyle = "#7c8796";
      roundRect(hazard.x, hazard.y, hazard.w, hazard.h, 8);
      ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.14)";
      for (let y = hazard.y + 10; y < hazard.y + hazard.h - 6; y += 14) {
        ctx.fillRect(hazard.x + 8, y, hazard.w - 16, 4);
      }
    } else if (hazard.kind === "spikes") {
      ctx.fillStyle = "#757b88";
      const width = Math.max(12, hazard.w / Math.max(2, Math.floor(hazard.w / 16)));
      for (let x = hazard.x; x < hazard.x + hazard.w - 1; x += width) {
        ctx.beginPath();
        ctx.moveTo(x, hazard.y + hazard.h);
        ctx.lineTo(x + width / 2, hazard.y);
        ctx.lineTo(x + width, hazard.y + hazard.h);
        ctx.closePath();
        ctx.fill();
      }
    } else {
      ctx.fillStyle = "#4d94b8";
      ctx.fillRect(hazard.x, hazard.y, hazard.w, hazard.h);
      ctx.strokeStyle = "rgba(255,255,255,0.45)";
      for (let x = hazard.x; x < hazard.x + hazard.w; x += 20) {
        ctx.beginPath();
        ctx.moveTo(x, hazard.y + 12);
        ctx.lineTo(x + 12, hazard.y + 7);
        ctx.stroke();
      }
    }
  });
}

function drawWindZones(level) {
  level.windZones.forEach((zone) => {
    ctx.fillStyle = "rgba(220, 245, 255, 0.10)";
    ctx.fillRect(zone.x, zone.y, zone.w, zone.h);
    ctx.strokeStyle = "rgba(255,255,255,0.28)";
    for (let y = zone.y + 20; y < zone.y + zone.h; y += 24) {
      ctx.beginPath();
      ctx.moveTo(zone.x + 10, y);
      ctx.bezierCurveTo(zone.x + 45, y - 8, zone.x + 80, y + 8, zone.x + zone.w - 12, y);
      ctx.stroke();
    }
  });
}

function drawCollectibles(level) {
  level.collectibles.forEach((item) => {
    if (item.collected) {
      return;
    }

    const bobY = Math.sin(item.bob) * 5;
    const x = item.x;
    const y = item.y + bobY;

    if (item.kind === "tea") {
      ctx.fillStyle = "#7fd39a";
      ctx.fillRect(x + 6, y + 10, 14, 12);
      ctx.strokeStyle = "#f8f4d8";
      ctx.lineWidth = 2;
      ctx.strokeRect(x + 6, y + 10, 14, 12);
      ctx.beginPath();
      ctx.arc(x + 22, y + 15, 4, -Math.PI / 3, Math.PI / 2);
      ctx.stroke();
    } else if (item.kind === "lantern") {
      ctx.fillStyle = "#c84836";
      ctx.fillRect(x + 7, y + 8, 12, 14);
      ctx.fillStyle = "#f6d576";
      ctx.fillRect(x + 10, y + 12, 6, 6);
      ctx.strokeStyle = "#8f2b1c";
      ctx.strokeRect(x + 7, y + 8, 12, 14);
    } else if (item.kind === "drum") {
      ctx.fillStyle = "#b56b2d";
      ctx.fillRect(x + 5, y + 8, 16, 14);
      ctx.strokeStyle = "#fff3cf";
      ctx.strokeRect(x + 5, y + 8, 16, 14);
      ctx.beginPath();
      ctx.moveTo(x + 5, y + 8);
      ctx.lineTo(x + 21, y + 22);
      ctx.moveTo(x + 21, y + 8);
      ctx.lineTo(x + 5, y + 22);
      ctx.stroke();
    } else if (item.kind === "star") {
      ctx.fillStyle = "#ffe171";
      drawStar(x + 13, y + 14, 5, 11, 5);
      ctx.fill();
    } else if (item.kind === "crate") {
      ctx.fillStyle = "#d9b053";
      ctx.fillRect(x + 4, y + 6, 18, 18);
      ctx.strokeStyle = "#8b6725";
      ctx.strokeRect(x + 4, y + 6, 18, 18);
      ctx.beginPath();
      ctx.moveTo(x + 4, y + 6);
      ctx.lineTo(x + 22, y + 24);
      ctx.moveTo(x + 22, y + 6);
      ctx.lineTo(x + 4, y + 24);
      ctx.stroke();
    }
  });
}

function drawKey(level) {
  if (!level.keyItem || level.keyCollected) {
    return;
  }

  const x = level.keyItem.x;
  const y = level.keyItem.y + Math.sin(performance.now() / 190) * 4;
  ctx.strokeStyle = "#f5d36c";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(x + 9, y + 13, 6, 0, Math.PI * 2);
  ctx.moveTo(x + 15, y + 13);
  ctx.lineTo(x + 26, y + 13);
  ctx.moveTo(x + 22, y + 13);
  ctx.lineTo(x + 22, y + 18);
  ctx.moveTo(x + 26, y + 13);
  ctx.lineTo(x + 26, y + 16);
  ctx.stroke();
}

function drawEnemies(level) {
  level.enemies.forEach((enemy) => {
    const swing = Math.sin(enemy.animTime) * 3;
    const dir = enemy.dir >= 0 ? 1 : -1;

    ctx.fillStyle = "#d2aa72";
    ctx.beginPath();
    ctx.arc(enemy.x + 15, enemy.y + 12, 9, Math.PI, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#612c21";
    roundRect(enemy.x + 4, enemy.y + 10, 22, 18, 6);
    ctx.fill();

    ctx.fillStyle = "#2a1b14";
    ctx.fillRect(enemy.x + 5, enemy.y + 7, 20, 4);

    ctx.strokeStyle = "#4f2e1d";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(enemy.x + 10, enemy.y + 28);
    ctx.lineTo(enemy.x + 8 - swing, enemy.y + 35);
    ctx.moveTo(enemy.x + 20, enemy.y + 28);
    ctx.lineTo(enemy.x + 22 + swing, enemy.y + 35);
    ctx.moveTo(enemy.x + 5, enemy.y + 16);
    ctx.lineTo(enemy.x - 1 - dir, enemy.y + 22);
    ctx.moveTo(enemy.x + 25, enemy.y + 16);
    ctx.lineTo(enemy.x + 31 + dir, enemy.y + 22);
    ctx.stroke();

    ctx.fillStyle = "#fff";
    ctx.fillRect(enemy.x + 10 + dir, enemy.y + 13, 3, 3);
    ctx.fillRect(enemy.x + 17 + dir, enemy.y + 13, 3, 3);
  });
}

function drawGoal(level) {
  const remaining = level.collectibles.some((item) => !item.collected);
  const lockedByKey = level.goalRequiresKey && !level.keyCollected;
  const isLocked = remaining || lockedByKey;
  ctx.fillStyle = isLocked ? "#8f8a75" : "#d1a11e";
  ctx.fillRect(level.goal.x, level.goal.y, level.goal.w, level.goal.h);
  ctx.fillStyle = isLocked ? "#c8c2ae" : "#ffe8a5";
  ctx.fillRect(level.goal.x + 8, level.goal.y + 10, 28, 50);
  ctx.fillStyle = "#3c2d21";
  ctx.fillRect(level.goal.x + 15, level.goal.y + 26, 6, 6);
}

function drawPlayer() {
  const player = game.player;
  const walkSwing = Math.sin(player.animTime) * 4;
  const isJumping = !player.onGround;
  const dir = player.facing;
  const bodyX = player.x + 6;
  const bodyY = player.crouching ? player.y + 10 : player.y + 6;
  const bodyH = player.crouching ? 18 : 22;
  const headY = player.crouching ? player.y + 6 : player.y;
  const legY = bodyY + bodyH;
  const armY = bodyY + 7;

  ctx.strokeStyle = "#6f4b2e";
  ctx.lineWidth = 3;
  ctx.beginPath();
  if (isJumping) {
    ctx.moveTo(player.x + 14, legY);
    ctx.lineTo(player.x + 9, legY + 8);
    ctx.moveTo(player.x + 20, legY);
    ctx.lineTo(player.x + 25, legY + 8);
  } else {
    ctx.moveTo(player.x + 14, legY);
    ctx.lineTo(player.x + 14 - walkSwing, legY + 10);
    ctx.moveTo(player.x + 20, legY);
    ctx.lineTo(player.x + 20 + walkSwing, legY + 10);
  }
  ctx.moveTo(player.x + 8, armY);
  ctx.lineTo(player.x + 3 - walkSwing * 0.4, armY + 8);
  ctx.moveTo(player.x + 26, armY);
  ctx.lineTo(player.x + 31 + walkSwing * 0.4, armY + 8);
  ctx.stroke();

  ctx.fillStyle = "#3379c6";
  roundRect(bodyX, bodyY, 22, bodyH, 7);
  ctx.fill();

  ctx.fillStyle = "#ff9a49";
  ctx.beginPath();
  ctx.moveTo(player.x + 18, bodyY + 3);
  ctx.lineTo(player.x + 18 + 11 * dir, bodyY + 8);
  ctx.lineTo(player.x + 18 + 3 * dir, bodyY + 13);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#e2ba85";
  ctx.beginPath();
  ctx.arc(player.x + 17, headY + 16, 10, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#332620";
  ctx.beginPath();
  ctx.arc(player.x + 17, headY + 10, 10, Math.PI, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(player.x + 17, headY + 8, 9, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#48a963";
  ctx.fillRect(player.x + 8, headY + 4, 18, 4);
  ctx.fillRect(player.x + 11, headY, 12, 5);

  ctx.strokeStyle = "#24384c";
  ctx.lineWidth = 2;
  ctx.strokeRect(player.x + 9, headY + 12, 7, 5);
  ctx.strokeRect(player.x + 17, headY + 12, 7, 5);
  ctx.beginPath();
  ctx.moveTo(player.x + 16, headY + 14.5);
  ctx.lineTo(player.x + 17, headY + 14.5);
  ctx.stroke();

  ctx.fillStyle = "#2b1c14";
  ctx.fillRect(player.x + 13 + dir * 3, headY + 13, 2, 2);
  ctx.fillRect(player.x + 20 + dir * 3, headY + 13, 2, 2);
  ctx.strokeStyle = "#7b4323";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(player.x + 18 + dir, headY + 20, 4, 0.2, 1.2);
  ctx.stroke();
}

function drawHudInCanvas(level) {
  const remaining = level.collectibles.filter((item) => !item.collected).length;
  ctx.fillStyle = "rgba(21, 18, 15, 0.35)";
  roundRect(14, 14, 360, 96, 18);
  ctx.fill();
  ctx.fillStyle = "#fff7e7";
  ctx.font = "18px Tahoma";
  ctx.fillText(`المتبقي: ${remaining}`, 30, 42);
  ctx.fillText(`النقاط: ${game.score}`, 30, 68);
  ctx.font = "14px Tahoma";
  ctx.fillText(level.mechanicHint ?? "", 30, 92);

  if (level.goalRequiresKey && !level.keyCollected) {
    ctx.fillText("ابحث عن المفتاح لفتح الجسر", 635, 42);
  } else if (remaining > 0) {
    ctx.fillText("اجمع كل القطع لفتح الباب", 640, 42);
  } else {
    ctx.fillText("الباب مفتوح", 760, 42);
  }
}

function roundRect(x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function drawStar(cx, cy, spikes, outerRadius, innerRadius) {
  let rotation = Math.PI / 2 * 3;
  let x = cx;
  let y = cy;
  const step = Math.PI / spikes;

  ctx.beginPath();
  ctx.moveTo(cx, cy - outerRadius);
  for (let i = 0; i < spikes; i += 1) {
    x = cx + Math.cos(rotation) * outerRadius;
    y = cy + Math.sin(rotation) * outerRadius;
    ctx.lineTo(x, y);
    rotation += step;

    x = cx + Math.cos(rotation) * innerRadius;
    y = cy + Math.sin(rotation) * innerRadius;
    ctx.lineTo(x, y);
    rotation += step;
  }
  ctx.lineTo(cx, cy - outerRadius);
  ctx.closePath();
}

let previousTime = performance.now();
function loop(now) {
  const dt = Math.min((now - previousTime) / 16.6667, 1.6);
  previousTime = now;
  update(dt);
  draw();
  requestAnimationFrame(loop);
}

function onKeyChange(event, isDown) {
  const key = event.key.toLowerCase();
  const code = event.code;
  if (["arrowleft", "a"].includes(key) || code === "KeyA") {
    keys.left = isDown;
    event.preventDefault();
  }
  if (["arrowright", "d"].includes(key) || code === "KeyD") {
    keys.right = isDown;
    event.preventDefault();
  }
  if (["arrowdown", "s"].includes(key) || code === "KeyS") {
    keys.down = isDown;
    event.preventDefault();
  }
  if (["arrowup", "w", " "].includes(key) || code === "KeyW" || code === "Space") {
    keys.jump = isDown;
    event.preventDefault();
  }
}

document.addEventListener("keydown", (event) => onKeyChange(event, true));
document.addEventListener("keyup", (event) => onKeyChange(event, false));

if (window.matchMedia("(pointer: coarse)").matches || "ontouchstart" in window || navigator.maxTouchPoints > 0) {
  document.body.classList.add("touch-enabled");
}

document.querySelectorAll(".touch-btn").forEach((button) => {
  const action = button.dataset.key;
  const press = (state) => {
    keys[action] = state;
  };
  button.addEventListener("touchstart", (event) => {
    event.preventDefault();
    press(true);
  }, { passive: false });
  button.addEventListener("touchend", () => press(false));
  button.addEventListener("mousedown", () => press(true));
  button.addEventListener("mouseup", () => press(false));
  button.addEventListener("mouseleave", () => press(false));
});

ui.startButton.addEventListener("click", () => {
  ensureAudio();
  if (game.screen === "start" || game.screen === "won") {
    ui.startButton.textContent = "أعد اللعب من البداية";
    beginGame();
  } else if (game.screen === "transition") {
    ui.startButton.textContent = "أعد اللعب من البداية";
    loadLevel(game.levelIndex + 1, false);
  } else {
    beginGame();
  }
});

ui.restartButton.addEventListener("click", () => {
  ensureAudio();
  resetCurrentLevel();
});

ui.skipButton.addEventListener("click", () => {
  ensureAudio();
  skipCurrentLevel();
});

ui.audioButton.addEventListener("click", () => {
  audio.enabled = !audio.enabled;
  if (audio.enabled) {
    ensureAudio();
  }
  ui.audioButton.textContent = `الصوت: ${audio.enabled ? "شغال" : "مكتوم"}`;
});

setBanner("جاهز للانطلاق", "خمس مراحل داخل قلعة الملك: البوابة، العرش، المكتبة، السراديب، والبرج.");
setOverlay(
  "رحلة نُجْم في المغرب",
  "اللعبة جاهزة. استكشف قلعة الملك، اجمع المقتنيات، وتجاوز العقبات أو استخدم زر تخطي المرحلة إذا رغبت.",
  true
);
syncUi();
requestAnimationFrame(loop);

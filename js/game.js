/*==============================================================================
Init
==============================================================================*/
$.init = function () {
  $.setupStorage();
  $.wrap = document.getElementById("wrap");
  $.cbg1 = document.getElementById("cbg1");
  $.cbg2 = document.getElementById("cbg2");
  $.cbg3 = document.getElementById("cbg3");
  $.cbg4 = document.getElementById("cbg4");
  $.cmg = document.getElementById("cmg");
  $.ctxbg1 = $.cbg1.getContext("2d");
  $.ctxbg2 = $.cbg2.getContext("2d");
  $.ctxbg3 = $.cbg3.getContext("2d");
  $.ctxbg4 = $.cbg4.getContext("2d");
  $.ctxmg = $.cmg.getContext("2d");
  $.cw = 800;
  $.ch = 600;
  $.cmg.width = 800;
  $.cmg.height = 600;
  $.cratio = $.cw / $.ch;
  // $.wrap.style.width = $.cw + "px";
  // $.wrap.style.height = $.ch + "px";
  $.ww = Math.floor($.cw * 2);
  $.wh = Math.floor($.ch * 2);
  $.gameScale = 1;
  $.shouldScale = 0;
  $.cbg1.width = Math.floor($.cw * 1.1);
  $.cbg1.height = Math.floor($.ch * 1.1);
  $.cbg2.width = Math.floor($.cw * 1.15);
  $.cbg2.height = Math.floor($.ch * 1.15);
  $.cbg3.width = Math.floor($.cw * 1.2);
  $.cbg3.height = Math.floor($.ch * 1.2);
  $.cbg4.width = Math.floor($.cw * 1.25);
  $.cbg4.height = Math.floor($.ch * 1.25);

  $.screen = {
    x: ($.ww - $.cw) / -2,
    y: ($.wh - $.ch) / -2,
  };

  $.mute = $.storage["mute"] || false;
  Howler.mute($.mute);

  $.keys = {
    state: {
      up: 0,
      down: 0,
      left: 0,
      right: 0,
      m: 0,
      p: 0,
      f: 0,
      esc: 0,
    },
    pressed: {
      up: 0,
      down: 0,
      left: 0,
      right: 0,
      m: 0,
      p: 0,
      f: 0,
      esc: 0,
    },
  };
  $.okeys = {};
  $.mouse = {
    x: $.ww / 2,
    y: $.wh / 2,
    sx: 0,
    sy: 0,
    ax: window.innerWidth / 2,
    ay: 0,
    down: 0,
  };
  $.buttons = [];

  $.minimap = {
    x: 20,
    y: $.ch - Math.floor($.ch * 0.1) - 20,
    width: Math.floor($.cw * 0.1),
    height: Math.floor($.ch * 0.1),
    scale: Math.floor($.cw * 0.1) / $.ww,
    color: "hsla(0, 0%, 0%, 0.85)",
    strokeColor: "#3a3a3a",
  };
  $.cOffset = {
    left: 0,
    top: 0,
  };

  $.levelCount = $.definitions.levels.length;
  $.states = {};
  $.state = "";
  $.enemies = [];
  $.bullets = [];
  $.explosions = [];
  $.powerups = [];
  $.particleEmitters = [];
  $.textPops = [];
  $.levelPops = [];
  $.powerupTimers = [];

  $.powerupDuration = 300;
  $.slowEnemyDivider = 3;
  $.healthBarParticleEmitterTickMax = 1;
  $.healthBarParticleEmitterTick = $.healthBarParticleEmitterTickMax;

  $.edgeSize = 50;

  $.resizecb();
  $.bindEvents();
  $.setupStates();
  $.renderBackground1();
  $.renderBackground2();
  $.renderBackground3();
  $.renderBackground4();
  $.setState("menu");
  $.loop();
};

/*==============================================================================
Reset
==============================================================================*/
$.reset = function () {
  $.indexGlobal = 0;
  $.dt = 1;
  $.lt = 0;
  $.pt = null;
  $.elapsed = 0;
  $.tick = 0;

  $.gameoverTick = 0;
  $.gameoverTickMax = 200;
  $.gameoverExplosion = 0;

  $.instructionTick = 0;
  $.instructionTickMax = 400;

  $.levelDiffOffset = 0;
  $.enemyOffsetMod = 0;
  $.slow = 0;

  $.screen = {
    x: ($.ww - $.cw) / -2,
    y: ($.wh - $.ch) / -2,
  };
  $.rumble = {
    x: 0,
    y: 0,
    level: 0,
    decay: 0.4,
  };

  $.mouse.down = 0;

  $.level = {
    current: 0,
    kills: 0,
    killsToLevel: $.definitions.levels[0].killsToLevel,
    distribution: $.definitions.levels[0].distribution,
    distributionCount: $.definitions.levels[0].distribution.length,
  };

  $.enemies.length = 0;
  $.bullets.length = 0;
  $.explosions.length = 0;
  $.powerups.length = 0;
  $.particleEmitters.length = 0;
  $.textPops.length = 0;
  $.levelPops.length = 0;
  $.powerupTimers.length = 0;

  for (let i = 0; i < $.definitions.powerups.length; i++) {
    $.powerupTimers.push(0);
  }

  $.kills = 0;
  $.bulletsFired = 0;
  $.powerupsCollected = 0;
  $.score = 0;

  $.hero = new $.Hero();

  $.levelPops.push(
    new $.LevelPop({
      level: 1,
    })
  );
};

/*==============================================================================
Render Backgrounds
==============================================================================*/
$.renderBackground1 = function () {
  let gradient = $.ctxbg1.createRadialGradient(
    $.cbg1.width / 2,
    $.cbg1.height / 2,
    0,
    $.cbg1.width / 2,
    $.cbg1.height / 2,
    $.cbg1.height
  );
  gradient.addColorStop(0, "hsla(0, 0%, 100%, 0.1)");
  gradient.addColorStop(0.65, "hsla(0, 0%, 100%, 0)");
  $.ctxbg1.fillStyle = gradient;
  $.ctxbg1.fillRect(0, 0, $.cbg1.width, $.cbg1.height);

  let i = 2000;
  while (i--) {
    $.util.fillCircle(
      $.ctxbg1,
      $.util.rand(0, $.cbg1.width),
      $.util.rand(0, $.cbg1.height),
      $.util.rand(0.2, 0.5),
      "hsla(0, 0%, 100%, " + $.util.rand(0.05, 0.2) + ")"
    );
  }

  let j = 800;
  while (j--) {
    $.util.fillCircle(
      $.ctxbg1,
      $.util.rand(0, $.cbg1.width),
      $.util.rand(0, $.cbg1.height),
      $.util.rand(0.1, 0.8),
      "hsla(0, 0%, 100%, " + $.util.rand(0.05, 0.5) + ")"
    );
  }
};

$.renderBackground2 = function () {
  let i = 80;
  while (i--) {
    $.util.fillCircle(
      $.ctxbg2,
      $.util.rand(0, $.cbg2.width),
      $.util.rand(0, $.cbg2.height),
      $.util.rand(1, 2),
      "hsla(0, 0%, 100%, " + $.util.rand(0.05, 0.15) + ")"
    );
  }
};

$.renderBackground3 = function () {
  let i = 40;
  while (i--) {
    $.util.fillCircle(
      $.ctxbg3,
      $.util.rand(0, $.cbg3.width),
      $.util.rand(0, $.cbg3.height),
      $.util.rand(1, 2.5),
      "hsla(0, 0%, 100%, " + $.util.rand(0.05, 0.1) + ")"
    );
  }
};

$.renderBackground4 = function () {
  let size = $.edgeSize;
  $.ctxbg4.fillStyle = "hsla(0, 0%, 50%, 0.05)";
  let i = Math.round($.cbg4.height / size);
  while (i--) {
    $.ctxbg4.fillRect(0, i * size + 25, $.cbg4.width, 1);
  }
  i = Math.round($.cbg4.width / size);
  while (i--) {
    $.ctxbg4.fillRect(i * size, 0, 1, $.cbg4.height);
  }
};

$.refreshStaticBackgrounds = function () {
  [$.ctxbg1, $.ctxbg2, $.ctxbg3, $.ctxbg4].forEach((ctx) => {
    ctx.fillStyle = "transparent";
    ctx.fillRect(0, 0, 1, 1);
  });
};

/*==============================================================================
User Interface / UI / GUI / Minimap
==============================================================================*/

$.renderInterface = function () {
  /*==============================================================================
  Powerup Timers
  ==============================================================================*/
  for (let i = 0; i < $.definitions.powerups.length; i++) {
    let powerup = $.definitions.powerups[i];
    let powerupOn = $.powerupTimers[i] > 0;
    $.ctxmg.beginPath();
    let powerupText = $.text({
      ctx: $.ctxmg,
      x: $.minimap.x + $.minimap.width + 90,
      y: $.minimap.y + 4 + i * 12,
      text: powerup.title,
      hspacing: 1,
      vspacing: 1,
      halign: "right",
      valign: "top",
      scale: 1,
      snap: 1,
      render: 1,
    });
    if (powerupOn) {
      $.ctxmg.fillStyle = "hsla(0, 0%, 100%, 1)";
    } else {
      $.ctxmg.fillStyle = "hsla(0, 0%, 100%, 0.25)";
    }
    $.ctxmg.fill();
    if (powerupOn) {
      let powerupBarBack = {
        x: powerupText.ex + 5,
        y: powerupText.sy,
        width: 110,
        height: 5,
      };
      $.ctxmg.fillStyle = "hsla(0, 0%, 100%, 0.25)";
      $.ctxmg.fillRect(
        powerupBarBack.x,
        powerupBarBack.y,
        powerupBarBack.width,
        powerupBarBack.height
      );
      let powerupBar = {
        x: powerupText.ex + 5,
        y: powerupText.sy,
        width: 110,
        height: 5,
      };
      $.ctxmg.fillStyle =
        "hsl(" +
        powerup.hue +
        ", " +
        powerup.saturation +
        "%, " +
        powerup.lightness +
        "%)";
      $.ctxmg.fillRect(
        powerupBar.x,
        powerupBar.y,
        ($.powerupTimers[i] / $.powerupDuration) * powerupBar.width,
        powerupBar.height
      );
    }
  }

  /*==============================================================================
    Instructions
    ==============================================================================*/
  if ($.instructionTick < $.instructionTickMax) {
    $.instructionTick += $.dt;
    $.ctxmg.beginPath();
    $.text({
      ctx: $.ctxmg,
      x: $.cw / 2 - 10,
      y: $.ch - 20,
      text: "MOVE\nAIM/FIRE\nPAUSE\nMUTE",
      hspacing: 1,
      vspacing: 17,
      halign: "right",
      valign: "bottom",
      scale: 2,
      snap: 1,
      render: 1,
    });
    let alpha = 0.5;
    if ($.instructionTick < $.instructionTickMax * 0.25) {
      alpha = ($.instructionTick / ($.instructionTickMax * 0.25)) * 0.5;
    } else if (
      $.instructionTick >
      $.instructionTickMax - $.instructionTickMax * 0.25
    ) {
      alpha =
        (($.instructionTickMax - $.instructionTick) /
          ($.instructionTickMax * 0.25)) *
        0.5;
    }
    alpha = Math.min(1, Math.max(0, alpha));

    $.ctxmg.fillStyle = "hsla(0, 0%, 100%, " + alpha + ")";
    $.ctxmg.fill();

    $.ctxmg.beginPath();
    $.text({
      ctx: $.ctxmg,
      x: $.cw / 2 + 10,
      y: $.ch - 20,
      text: "WASD/ARROWS\nMOUSE\nP/ESC\nM",
      hspacing: 1,
      vspacing: 17,
      halign: "left",
      valign: "bottom",
      scale: 2,
      snap: 1,
      render: 1,
    });
    alpha = 1;
    if ($.instructionTick < $.instructionTickMax * 0.25) {
      alpha = ($.instructionTick / ($.instructionTickMax * 0.25)) * 1;
    } else if (
      $.instructionTick >
      $.instructionTickMax - $.instructionTickMax * 0.25
    ) {
      alpha =
        (($.instructionTickMax - $.instructionTick) /
          ($.instructionTickMax * 0.25)) *
        1;
    }
    alpha = Math.min(1, Math.max(0, alpha));

    $.ctxmg.fillStyle = "hsla(0, 0%, 100%, " + alpha + ")";
    $.ctxmg.fill();
  }

  /*==============================================================================
    Slow Enemies Screen Cover
    ==============================================================================*/
  if ($.powerupTimers[1] > 0) {
    $.ctxmg.fillStyle = "hsla(170, 100%, 20%, 0.1)";
    $.ctxmg.fillRect(0, 0, $.cw, $.ch);
  }

  /*==============================================================================
  Health
  ==============================================================================*/
  $.ctxmg.beginPath();
  let healthText = $.text({
    ctx: $.ctxmg,
    x: 20,
    y: 20,
    text: "HEALTH",
    hspacing: 1,
    vspacing: 1,
    halign: "top",
    valign: "left",
    scale: 2,
    snap: 1,
    render: 1,
  });
  $.ctxmg.fillStyle = "hsla(0, 0%, 100%, 0.5)";
  $.ctxmg.fill();
  let healthBar = {
    x: healthText.ex + 10,
    y: healthText.sy,
    width: 110,
    height: 10,
  };
  $.ctxmg.fillStyle = "hsla(0, 0%, 20%, 1)";
  $.ctxmg.fillRect(healthBar.x, healthBar.y, healthBar.width, healthBar.height);
  $.ctxmg.fillStyle = "hsla(0, 0%, 100%, 0.25)";
  $.ctxmg.fillRect(
    healthBar.x,
    healthBar.y,
    healthBar.width,
    healthBar.height / 2
  );
  $.ctxmg.fillStyle = "hsla(" + $.hero.life * 120 + ", 100%, 40%, 1)";
  $.ctxmg.fillRect(
    healthBar.x,
    healthBar.y,
    $.hero.life * healthBar.width,
    healthBar.height
  );
  $.ctxmg.fillStyle = "hsla(" + $.hero.life * 120 + ", 100%, 75%, 1)";
  $.ctxmg.fillRect(
    healthBar.x,
    healthBar.y,
    $.hero.life * healthBar.width,
    healthBar.height / 2
  );

  if ($.healthBarParticleEmitterTick < $.healthBarParticleEmitterTickMax) {
    $.healthBarParticleEmitterTick += $.dt;
  }

  if (
    $.hero.takingDamage &&
    $.hero.life > 0 &&
    $.healthBarParticleEmitterTick >= $.healthBarParticleEmitterTickMax
  ) {
    $.healthBarParticleEmitterTick = 0;
    $.particleEmitters.push(
      new $.ParticleEmitter({
        x: healthBar.x + $.hero.life * healthBar.width,
        y: healthBar.y,
        count: 1,
        spawnRange: 0,
        friction: 0.85,
        minSpeed: 2,
        maxSpeed: 20,
        minDirection: $.pi / 2 - 0.1,
        maxDirection: $.pi / 2 + 0.1,
        hue: $.hero.life * 120,
        saturation: 100,
        offsetScreen: true,
        offsetRumble: true,
      })
    );
  }

  /*==============================================================================
  Progress
  ==============================================================================*/
  $.ctxmg.beginPath();
  let progressText = $.text({
    ctx: $.ctxmg,
    x: healthBar.x + healthBar.width + 30,
    y: 20,
    text: `LEVEL ${$.util.pad($.level.current + 1, 2)}`,
    hspacing: 1,
    vspacing: 1,
    halign: "top",
    valign: "left",
    scale: 2,
    snap: 1,
    render: 1,
  });
  $.ctxmg.fillStyle = "hsla(0, 0%, 100%, 0.5)";
  $.ctxmg.fill();
  let progressBar = {
    x: progressText.ex + 10,
    y: progressText.sy,
    width: healthBar.width,
    height: healthBar.height,
  };
  $.ctxmg.fillStyle = "hsla(0, 0%, 20%, 1)";
  $.ctxmg.fillRect(
    progressBar.x,
    progressBar.y,
    progressBar.width,
    progressBar.height
  );
  $.ctxmg.fillStyle = "hsla(0, 0%, 100%, 0.25)";
  $.ctxmg.fillRect(
    progressBar.x,
    progressBar.y,
    progressBar.width,
    progressBar.height / 2
  );
  $.ctxmg.fillStyle = "hsla(0, 0%, 50%, 1)";
  $.ctxmg.fillRect(
    progressBar.x,
    progressBar.y,
    ($.level.kills / $.level.killsToLevel) * progressBar.width,
    progressBar.height
  );
  $.ctxmg.fillStyle = "hsla(0, 0%, 100%, 1)";
  $.ctxmg.fillRect(
    progressBar.x,
    progressBar.y,
    ($.level.kills / $.level.killsToLevel) * progressBar.width,
    progressBar.height / 2
  );

  if ($.level.kills == $.level.killsToLevel) {
    $.particleEmitters.push(
      new $.ParticleEmitter({
        x: progressBar.x + progressBar.width,
        y: progressBar.y,
        count: 30,
        spawnRange: 5,
        friction: 0.95,
        minSpeed: 2,
        maxSpeed: 25,
        minDirection: 0,
        minDirection: $.pi / 2 - $.pi / 4,
        maxDirection: $.pi / 2 + $.pi / 4,
        hue: 0,
        saturation: 0,
        offsetScreen: true,
        offsetRumble: true,
      })
    );
  }

  /*==============================================================================
  Score
  ==============================================================================*/
  $.ctxmg.beginPath();
  let scoreLabel = $.text({
    ctx: $.ctxmg,
    x: progressBar.x + progressBar.width + 30,
    y: 20,
    text: "SCORE",
    hspacing: 1,
    vspacing: 1,
    halign: "top",
    valign: "left",
    scale: 2,
    snap: 1,
    render: 1,
  });
  $.ctxmg.fillStyle = "hsla(0, 0%, 100%, 0.5)";
  $.ctxmg.fill();

  $.ctxmg.beginPath();
  let scoreText = $.text({
    ctx: $.ctxmg,
    x: scoreLabel.ex + 10,
    y: 20,
    text: $.util.pad($.score, 6),
    hspacing: 1,
    vspacing: 1,
    halign: "top",
    valign: "left",
    scale: 2,
    snap: 1,
    render: 1,
  });
  $.ctxmg.fillStyle = "hsla(0, 0%, 100%, 1)";
  $.ctxmg.fill();

  $.ctxmg.beginPath();
  let bestLabel = $.text({
    ctx: $.ctxmg,
    x: scoreText.ex + 30,
    y: 20,
    text: "BEST",
    hspacing: 1,
    vspacing: 1,
    halign: "top",
    valign: "left",
    scale: 2,
    snap: 1,
    render: 1,
  });
  $.ctxmg.fillStyle = "hsla(0, 0%, 100%, 0.5)";
  $.ctxmg.fill();

  $.ctxmg.beginPath();
  let bestText = $.text({
    ctx: $.ctxmg,
    x: bestLabel.ex + 10,
    y: 20,
    text: $.util.pad(Math.max($.storage["score"], $.score), 6),
    hspacing: 1,
    vspacing: 1,
    halign: "top",
    valign: "left",
    scale: 2,
    snap: 1,
    render: 1,
  });
  $.ctxmg.fillStyle = "hsla(0, 0%, 100%, 1)";
  $.ctxmg.fill();
};

$.renderMinimap = function () {
  $.ctxmg.fillStyle = $.minimap.color;
  $.ctxmg.fillRect($.minimap.x, $.minimap.y, $.minimap.width, $.minimap.height);

  $.ctxmg.fillStyle = "hsla(0, 0%, 100%, 0.1)";
  $.ctxmg.fillRect(
    $.minimap.x + -$.screen.x * $.minimap.scale,
    $.minimap.y + -$.screen.y * $.minimap.scale,
    $.cw * $.minimap.scale,
    $.ch * $.minimap.scale
  );

  $.ctxmg.beginPath();
  for (let i = 0; i < $.enemies.length; i++) {
    let enemy = $.enemies[i];
    let x = $.minimap.x + enemy.x * $.minimap.scale;
    let y = $.minimap.y + enemy.y * $.minimap.scale;
    if (
      $.util.pointInRect(
        x,
        y,
        $.minimap.x,
        $.minimap.y,
        $.minimap.width,
        $.minimap.height
      )
    ) {
      $.ctxmg.rect(x, y, 2, 2);
    }
  }
  $.ctxmg.fillStyle = "hsl(0, 100%, 60%)";
  $.ctxmg.fill();

  $.ctxmg.beginPath();
  for (let i = 0; i < $.bullets.length; i++) {
    let bullet = $.bullets[i];
    let x = $.minimap.x + bullet.x * $.minimap.scale;
    let y = $.minimap.y + bullet.y * $.minimap.scale;
    $.ctxmg.rect(x, y, 1, 1);
  }
  $.ctxmg.fillStyle = "#fff";
  $.ctxmg.fill();

  $.ctxmg.fillStyle = $.hero.fillStyle;
  $.ctxmg.fillRect(
    $.minimap.x + $.hero.x * $.minimap.scale,
    $.minimap.y + $.hero.y * $.minimap.scale,
    2,
    2
  );

  $.ctxmg.strokeStyle = $.minimap.strokeColor;
  $.ctxmg.strokeRect(
    $.minimap.x - 0.5,
    $.minimap.y - 0.5,
    $.minimap.width + 1,
    $.minimap.height + 1
  );
};

/*==============================================================================
Enemy Spawning
==============================================================================*/
$.getSpawnCoordinates = function (radius) {
  let quadrant = Math.floor($.util.rand(0, 4));
  let x;
  let y;
  let start;

  if (quadrant === 0) {
    x = $.util.rand(0, $.ww);
    y = -radius;
    start = "top";
  } else if (quadrant === 1) {
    x = $.ww + radius;
    y = $.util.rand(0, $.wh);
    start = "right";
  } else if (quadrant === 2) {
    x = $.util.rand(0, $.ww);
    y = $.wh + radius;
    start = "bottom";
  } else {
    x = -radius;
    y = $.util.rand(0, $.wh);
    start = "left";
  }

  return { x: x, y: y, start: start };
};

$.spawnEnemy = function (type) {
  let params = $.definitions.enemies[type];
  let coordinates = $.getSpawnCoordinates(params.radius);
  params.x = coordinates.x;
  params.y = coordinates.y;
  params.start = coordinates.start;
  params.type = type;
  return new $.Enemy(params);
};

$.spawnEnemies = function () {
  for (let i = 0; i < $.level.distributionCount; i++) {
    let timeCheck = $.level.distribution[i].time;
    if ($.levelDiffOffset > 0) {
      timeCheck = Math.max(1, timeCheck - $.levelDiffOffset * 2);
    }
    let timeDiff = Date.now() - $.level.distribution[i].lastSpawn;
    let timeCheckNormalized = timeCheck * (1000 / 60);
    let timeOverflow = Math.min(
      timeCheckNormalized,
      timeDiff - timeCheckNormalized
    );
    if (timeDiff >= timeCheckNormalized) {
      $.level.distribution[i].lastSpawn = Date.now() - timeOverflow;
      $.enemies.push($.spawnEnemy(i));
    }
  }
};

/*==============================================================================
Events
==============================================================================*/
$.mousemovecb = function (e) {
  e.preventDefault();
  $.mouse.ax = e.pageX;
  $.mouse.ay = e.pageY;
  $.mousescreen();
};

$.mousescreen = function () {
  $.mouse.sx = $.mouse.ax - $.cOffset.left;
  $.mouse.sy = $.mouse.ay - $.cOffset.top;
  $.mouse.x = $.mouse.sx / $.gameScale - $.screen.x;
  $.mouse.y = $.mouse.sy / $.gameScale - $.screen.y;
};

$.mousedowncb = function (e) {
  $.mouse.down = 1;
};

$.mouseupcb = function (e) {
  $.mouse.down = 0;
};

$.keydowncb = function (e) {
  e = e.keyCode ? e.keyCode : e.which;
  if (e === 38 || e === 87) {
    $.keys.state.up = 1;
  }
  if (e === 39 || e === 68) {
    $.keys.state.right = 1;
  }
  if (e === 40 || e === 83) {
    $.keys.state.down = 1;
  }
  if (e === 37 || e === 65) {
    $.keys.state.left = 1;
  }
  if (e === 77) {
    $.keys.state.m = 1;
  }
  if (e === 80) {
    $.keys.state.p = 1;
  }
  if (e === 70) {
    $.keys.state.f = 1;
  }
  if (e === 27) {
    $.keys.state.esc = 1;
  }
};

$.keyupcb = function (e) {
  e = e.keyCode ? e.keyCode : e.which;
  if (e === 38 || e === 87) {
    $.keys.state.up = 0;
  }
  if (e === 39 || e === 68) {
    $.keys.state.right = 0;
  }
  if (e === 40 || e === 83) {
    $.keys.state.down = 0;
  }
  if (e === 37 || e === 65) {
    $.keys.state.left = 0;
  }
  if (e === 77) {
    $.keys.state.m = 0;
  }
  if (e === 80) {
    $.keys.state.p = 0;
  }
  if (e === 70) {
    $.keys.state.f = 0;
  }
  if (e === 27) {
    $.keys.state.esc = 0;
  }
};

$.resizecb = function (e) {
  let winWidth = window.innerWidth;
  let winHeight = window.innerHeight;
  let winRatio = winWidth / winHeight;
  if (winRatio > $.cratio) {
    $.gameScale = winHeight / $.ch;
  } else {
    $.gameScale = winWidth / $.cw;
  }
  $.gameScale = $.shouldScale ? $.gameScale : 1;
  $.wrap.style.transform = `scale(${$.gameScale})`;

  window.setTimeout(() => {
    let rect = $.cmg.getBoundingClientRect();
    $.cOffset = {
      left: rect.left,
      top: rect.top,
    };
  }, 0);
};

$.blurcb = function () {
  if ($.state == "play") {
    $.keys.state.up = 0;
    $.keys.state.right = 0;
    $.keys.state.down = 0;
    $.keys.state.left = 0;
    $.setState("pause");
  }
};

$.focuscb = function () {};

$.visibilitychangecb = function () {
  if (document.visibilityState === "visible") {
    $.refreshStaticBackgrounds();
  }
};

$.contextmenucb = function (e) {
  e.preventDefault();
};

$.bindEvents = function () {
  window.addEventListener("mousemove", $.mousemovecb);
  window.addEventListener("mousedown", $.mousedowncb);
  window.addEventListener("mouseup", $.mouseupcb);
  window.addEventListener("keydown", $.keydowncb);
  window.addEventListener("keyup", $.keyupcb);
  window.addEventListener("resize", $.resizecb);
  window.addEventListener("blur", $.blurcb);
  window.addEventListener("focus", $.focuscb);
  document.addEventListener("visibilitychange", $.visibilitychangecb);
  window.addEventListener("contextmenu", $.contextmenucb);
};

/*==============================================================================
Miscellaneous
==============================================================================*/
$.clearScreen = function () {
  $.ctxmg.clearRect(0, 0, $.cw, $.ch);
};

$.updateDelta = function () {
  let now = Date.now();
  $.dt = (now - $.lt) / (1000 / 60);
  $.dt = $.dt < 0 ? 0.001 : $.dt;
  $.dt = $.dt > 10 ? 10 : $.dt;
  $.lt = now;
  $.elapsed += $.dt;
};

$.updateScreen = function () {
  let xModify = 0.5;
  let yModify = 0.5;

  if ($.hero.x < $.cw / 2) {
    xModify = $.hero.x / $.cw;
  } else if ($.hero.x > $.ww - $.cw / 2) {
    xModify = 1 - ($.ww - $.hero.x) / $.cw;
  }

  if ($.hero.y < $.ch / 2) {
    yModify = $.hero.y / $.ch;
  } else if ($.hero.y > $.wh - $.ch / 2) {
    yModify = 1 - ($.wh - $.hero.y) / $.ch;
  }

  $.screen.x +=
    ($.cw * xModify - $.hero.x - $.screen.x) * (1 - Math.exp(-0.05 * $.dt));
  $.screen.y +=
    ($.ch * yModify - $.hero.y - $.screen.y) * (1 - Math.exp(-0.05 * $.dt));

  // update rumble levels, keep X and Y changes consistent, apply rumble
  $.rumble.x = 0;
  $.rumble.y = 0;

  if ($.rumble.level > 0) {
    $.rumble.level -= $.rumble.decay * $.dt;
    $.rumble.level = Math.max(0, $.rumble.level);
    $.rumble.x = $.util.rand(-$.rumble.level, $.rumble.level);
    $.rumble.y = $.util.rand(-$.rumble.level, $.rumble.level);
  }

  // animate background canvases
  let bgs = [$.cbg1, $.cbg2, $.cbg3, $.cbg4];
  for (let i = 0; i < bgs.length; i++) {
    let bg = bgs[i];
    bg.style.transform = `translate3d(${
      -((bg.width - $.cw) / 2) - // half the difference from bg to viewport
      ((bg.width - $.cw) / 2) * // half the diff again, modified by a percentage below
        ((-$.screen.x - ($.ww - $.cw) / 2) / (($.ww - $.cw) / 2)) - // viewport offset applied to bg
      $.rumble.x
    }px, ${
      -((bg.height - $.ch) / 2) -
      ((bg.height - $.ch) / 2) *
        ((-$.screen.y - ($.wh - $.ch) / 2) / (($.wh - $.ch) / 2)) -
      $.rumble.y
    }px, 0)`;
  }

  $.mousescreen();
};

$.updateLevel = function () {
  if ($.level.kills >= $.level.killsToLevel) {
    if ($.level.current + 1 < $.levelCount) {
      $.level.current++;
      $.level.kills = 0;
      $.level.killsToLevel = $.definitions.levels[$.level.current].killsToLevel;
      $.level.distribution = $.definitions.levels[$.level.current].distribution;
      $.level.distributionCount = $.level.distribution.length;
    } else {
      $.level.current++;
      $.level.kills = 0;
    }
    $.levelDiffOffset = $.level.current + 1 - $.levelCount;
    $.levelPops.push(
      new $.LevelPop({
        level: $.level.current + 1,
      })
    );
  }
};

$.updatePowerupTimers = function () {
  // HEALTH
  if ($.powerupTimers[0] > 0) {
    if ($.hero.life < 1) {
      $.hero.life += 0.001 * $.dt;
    }
    if ($.hero.life > 1) {
      $.hero.life = 1;
    }
    $.powerupTimers[0] -= $.dt;
    $.powerupTimers[0] = Math.max($.powerupTimers[0], 0);
  }

  // SLOW ENEMIES
  if ($.powerupTimers[1] > 0) {
    $.slow = 1;
    $.powerupTimers[1] -= $.dt;
    $.powerupTimers[1] = Math.max($.powerupTimers[1], 0);
  } else {
    $.slow = 0;
  }

  // FAST SHOT
  if ($.powerupTimers[2] > 0) {
    $.hero.weapon.fireRateTickMax = 2;
    $.hero.weapon.bullet.speed = 14;
    $.powerupTimers[2] -= $.dt;
    $.powerupTimers[2] = Math.max($.powerupTimers[2], 0);
  } else {
    $.hero.weapon.fireRateTickMax = 5;
    $.hero.weapon.bullet.speed = 10;
  }

  // TRIPLE SHOT
  if ($.powerupTimers[3] > 0) {
    $.hero.weapon.count = 3;
    $.powerupTimers[3] -= $.dt;
    $.powerupTimers[3] = Math.max($.powerupTimers[3], 0);
  } else {
    $.hero.weapon.count = 1;
  }

  // PIERCE SHOT
  if ($.powerupTimers[4] > 0) {
    $.hero.weapon.bullet.piercing = 1;
    $.powerupTimers[4] -= $.dt;
    $.powerupTimers[4] = Math.max($.powerupTimers[4], 0);
  } else {
    $.hero.weapon.bullet.piercing = 0;
  }
};

$.spawnPowerup = function (x, y) {
  let maxPowerups = 10;
  let chance = 0.1;
  let totalPowerupsActive = $.powerupTimers.reduce((acc, curr) => {
    return acc + (curr > 0 ? 1 : 0);
  }, 0);
  chance -= totalPowerupsActive * 0.02;

  if ($.powerups.length < maxPowerups && Math.random() < chance) {
    let min = $.hero.life < 0.9 ? 0 : 1;
    let type = Math.floor($.util.rand(min, $.definitions.powerups.length));
    let params = $.definitions.powerups[type];
    params.type = type;
    params.x = x;
    params.y = y;
    $.powerups.push(new $.Powerup(params));
  }
};

/*==============================================================================
States
==============================================================================*/
$.setState = function (state) {
  // handle clean up between states
  $.buttons.length = 0;

  if (state == "menu") {
    $.mouse.down = 0;
    $.mouse.ax = 0;
    $.mouse.ay = 0;

    $.reset();

    let playButton = new $.Button({
      x: $.cw / 2 + 1,
      // y: $.ch / 2 + 26,
      y: $.ch - 174,
      lockedWidth: 299,
      lockedHeight: 49,
      scale: 3,
      title: "PLAY",
      action: function () {
        $.reset();
        $.audio.play("levelup");
        $.setState("play");
      },
    });
    $.buttons.push(playButton);

    let statsButton = new $.Button({
      x: $.cw / 2 + 1,
      y: playButton.ey + 25,
      lockedWidth: 299,
      lockedHeight: 49,
      scale: 3,
      title: "STATS",
      action: function () {
        $.setState("stats");
      },
    });
    $.buttons.push(statsButton);

    let creditsButton = new $.Button({
      x: $.cw / 2 + 1,
      y: statsButton.ey + 26,
      lockedWidth: 299,
      lockedHeight: 49,
      scale: 3,
      title: "CREDITS",
      action: function () {
        $.setState("credits");
      },
    });
    $.buttons.push(creditsButton);
  }

  if (state == "stats") {
    $.mouse.down = 0;

    let clearButton = new $.Button({
      x: $.cw / 2 + 1,
      y: 426,
      lockedWidth: 299,
      lockedHeight: 49,
      scale: 3,
      title: "CLEAR DATA",
      action: function () {
        $.mouse.down = 0;
        if (
          window.confirm(
            "Are you sure you want to clear all locally stored game data? This cannot be undone."
          )
        ) {
          $.clearStorage();
          $.mouse.down = 0;
        }
      },
    });
    $.buttons.push(clearButton);

    let menuButton = new $.Button({
      x: $.cw / 2 + 1,
      y: clearButton.ey + 25,
      lockedWidth: 299,
      lockedHeight: 49,
      scale: 3,
      title: "MENU",
      action: function () {
        $.setState("menu");
      },
    });
    $.buttons.push(menuButton);
  }

  if (state == "credits") {
    $.mouse.down = 0;

    let js13kButton = new $.Button({
      x: $.cw / 2 + 1,
      y: 476,
      lockedWidth: 299,
      lockedHeight: 49,
      scale: 3,
      title: "JS13KGAMES",
      action: function () {
        window.open("http://js13kgames.com", "_blank").focus();
        $.mouse.down = 0;
      },
    });
    $.buttons.push(js13kButton);

    let menuButton = new $.Button({
      x: $.cw / 2 + 1,
      y: js13kButton.ey + 25,
      lockedWidth: 299,
      lockedHeight: 49,
      scale: 3,
      title: "MENU",
      action: function () {
        $.setState("menu");
      },
    });
    $.buttons.push(menuButton);
  }

  if (state == "pause") {
    $.pt = Date.now();
    $.mouse.down = 0;
    $.screenshot = $.ctxmg.getImageData(0, 0, $.cw, $.ch);
    let resumeButton = new $.Button({
      x: $.cw / 2 + 1,
      y: $.ch / 2 + 26,
      lockedWidth: 299,
      lockedHeight: 49,
      scale: 3,
      title: "RESUME",
      action: function () {
        $.lt = Date.now() + 1000;
        $.setState("play");
      },
    });
    $.buttons.push(resumeButton);

    let menuButton = new $.Button({
      x: $.cw / 2 + 1,
      y: resumeButton.ey + 25,
      lockedWidth: 299,
      lockedHeight: 49,
      scale: 3,
      title: "MENU",
      action: function () {
        $.mouse.down = 0;
        if (
          window.confirm(
            "Are you sure you want to end this game and return to the menu?"
          )
        ) {
          $.mousescreen();
          $.setState("menu");
        }
      },
    });
    $.buttons.push(menuButton);
  }

  if (state == "play") {
    $.lt = Date.now();

    if ($.pt) {
      for (let i = 0; i < $.level.distribution.length; i++) {
        $.level.distribution[i].lastSpawn += Date.now() - $.pt;
      }
    }
  }

  if (state == "gameover") {
    $.mouse.down = 0;

    $.screenshot = $.ctxmg.getImageData(0, 0, $.cw, $.ch);
    let resumeButton = new $.Button({
      x: $.cw / 2 + 1,
      y: 426,
      lockedWidth: 299,
      lockedHeight: 49,
      scale: 3,
      title: "PLAY AGAIN",
      action: function () {
        $.reset();
        $.audio.play("levelup");
        $.setState("play");
      },
    });
    $.buttons.push(resumeButton);

    let menuButton = new $.Button({
      x: $.cw / 2 + 1,
      y: resumeButton.ey + 25,
      lockedWidth: 299,
      lockedHeight: 49,
      scale: 3,
      title: "MENU",
      action: function () {
        $.setState("menu");
      },
    });
    $.buttons.push(menuButton);

    $.storage["score"] = Math.max($.storage["score"], $.score);
    $.storage["level"] = Math.max($.storage["level"], $.level.current);
    $.storage["rounds"] += 1;
    $.storage["kills"] += $.kills;
    $.storage["bullets"] += $.bulletsFired;
    $.storage["powerups"] += $.powerupsCollected;
    $.storage["time"] += Math.floor($.elapsed);
    $.updateStorage();
  }

  // set state
  $.state = state;
};

$.setupStates = function () {
  $.states["menu"] = function () {
    $.clearScreen();
    $.updateScreen();

    let stripeRed = "hsla(0, 100%, 60%, 1)";
    let stripeGreen = "hsla(120, 100%, 60%, 1)";
    let stripeBlue = "hsla(210, 100%, 60%, 1)";
    let stripeWidth = 21;
    let set1h = 125;
    let set1y = 0;
    let set2h = 100;
    let set2y = 275;
    let set3h = 25;
    let set3y = $.ch - set3h;

    $.ctxmg.fillStyle = stripeRed;
    $.ctxmg.fillRect($.cw / 2 - 35, 0, stripeWidth, set1h);

    $.ctxmg.fillStyle = stripeGreen;
    $.ctxmg.fillRect($.cw / 2 - 10, 0, stripeWidth, set1h);

    $.ctxmg.fillStyle = stripeBlue;
    $.ctxmg.fillRect($.cw / 2 + 15, 0, stripeWidth, set1h);

    $.ctxmg.fillStyle = stripeRed;
    $.ctxmg.fillRect($.cw / 2 - 35, set2y, stripeWidth, set2h);

    $.ctxmg.fillStyle = stripeGreen;
    $.ctxmg.fillRect($.cw / 2 - 10, set2y, stripeWidth, set2h);

    $.ctxmg.fillStyle = stripeBlue;
    $.ctxmg.fillRect($.cw / 2 + 15, set2y, stripeWidth, set2h);

    $.ctxmg.fillStyle = stripeRed;
    $.ctxmg.fillRect($.cw / 2 - 35, set3y, stripeWidth, set3h);

    $.ctxmg.fillStyle = stripeGreen;
    $.ctxmg.fillRect($.cw / 2 - 10, set3y, stripeWidth, set3h);

    $.ctxmg.fillStyle = stripeBlue;
    $.ctxmg.fillRect($.cw / 2 + 15, set3y, stripeWidth, set3h);

    let i = $.buttons.length;
    while (i--) {
      $.buttons[i].update(i);
    }
    i = $.buttons.length;
    while (i--) {
      $.buttons[i].render(i);
    }

    $.ctxmg.beginPath();
    let title1 = $.text({
      ctx: $.ctxmg,
      x: $.cw / 2,
      y: $.ch / 2 - 48,
      text: "RADIUS\nRAID",
      hspacing: 4,
      vspacing: 4,
      halign: "center",
      valign: "bottom",
      scale: 10,
      snap: 1,
      render: 1,
    });
    $.ctxmg.fillStyle = "#fff";
    $.ctxmg.fill();
  };

  $.states["stats"] = function () {
    $.clearScreen();

    $.ctxmg.beginPath();
    let statsTitle = $.text({
      ctx: $.ctxmg,
      x: $.cw / 2,
      y: 150,
      text: "STATS",
      hspacing: 4,
      vspacing: 1,
      halign: "center",
      valign: "bottom",
      scale: 10,
      snap: 1,
      render: 1,
    });
    $.ctxmg.fillStyle = "#fff";
    $.ctxmg.fill();

    $.ctxmg.beginPath();
    let statKeys = $.text({
      ctx: $.ctxmg,
      x: $.cw / 2 - 10,
      y: statsTitle.ey + 39,
      text: "BEST SCORE\nBEST LEVEL\nROUNDS PLAYED\nENEMIES KILLED\nBULLETS FIRED\nPOWERUPS COLLECTED\nTIME ELAPSED",
      hspacing: 1,
      vspacing: 17,
      halign: "right",
      valign: "top",
      scale: 2,
      snap: 1,
      render: 1,
    });
    $.ctxmg.fillStyle = "hsla(0, 0%, 100%, 0.5)";
    $.ctxmg.fill();

    $.ctxmg.beginPath();
    let statsValues = $.text({
      ctx: $.ctxmg,
      x: $.cw / 2 + 10,
      y: statsTitle.ey + 39,
      text:
        $.util.commas($.storage["score"]) +
        "\n" +
        ($.storage["level"] + 1) +
        "\n" +
        $.util.commas($.storage["rounds"]) +
        "\n" +
        $.util.commas($.storage["kills"]) +
        "\n" +
        $.util.commas($.storage["bullets"]) +
        "\n" +
        $.util.commas($.storage["powerups"]) +
        "\n" +
        $.util.convertTime(($.storage["time"] * (1000 / 60)) / 1000),
      hspacing: 1,
      vspacing: 17,
      halign: "left",
      valign: "top",
      scale: 2,
      snap: 1,
      render: 1,
    });
    $.ctxmg.fillStyle = "#fff";
    $.ctxmg.fill();

    let i = $.buttons.length;
    while (i--) {
      $.buttons[i].render(i);
    }
    i = $.buttons.length;
    while (i--) {
      $.buttons[i].update(i);
    }

    if ($.keys.pressed.esc) {
      $.setState("menu");
    }
  };

  $.states["credits"] = function () {
    $.clearScreen();

    $.ctxmg.beginPath();
    let creditsTitle = $.text({
      ctx: $.ctxmg,
      x: $.cw / 2,
      y: 100,
      text: "CREDITS",
      hspacing: 4,
      vspacing: 1,
      halign: "center",
      valign: "bottom",
      scale: 10,
      snap: 1,
      render: 1,
    });
    $.ctxmg.fillStyle = "#fff";
    $.ctxmg.fill();

    $.ctxmg.beginPath();
    let creditKeys = $.text({
      ctx: $.ctxmg,
      x: $.cw / 2 - 10,
      y: creditsTitle.ey + 49,
      text: "CREATED BY\nINSPIRATION AND SUPPORT\n\nAUDIO PROCESSING\nGAME INSPIRATION AND IDEAS\n\nHTML5 CANVAS REFERENCE\n\nGAME MATH REFERENCE",
      hspacing: 1,
      vspacing: 17,
      halign: "right",
      valign: "top",
      scale: 2,
      snap: 1,
      render: 1,
    });
    $.ctxmg.fillStyle = "hsla(0, 0%, 100%, 0.5)";
    $.ctxmg.fill();

    $.ctxmg.beginPath();
    let creditValues = $.text({
      ctx: $.ctxmg,
      x: $.cw / 2 + 10,
      y: creditsTitle.ey + 49,
      text: "@JACKRUGILE\n@REZONER, @LOKTAR00, @END3R,\n@AUSTINHALLOCK, @CHANDLERPRALL\nJSFXR BY @MARKUSNEUBRAND\nASTEROIDS, CELL WARFARE,\nSPACE PIPS, AND MANY MORE\nNIHILOGIC HTML5\nCANVAS CHEAT SHEET\nBILLY LAMBERTA FOUNDATION\nHTML5 ANIMATION WITH JAVASCRIPT",
      hspacing: 1,
      vspacing: 17,
      halign: "left",
      valign: "top",
      scale: 2,
      snap: 1,
      render: 1,
    });
    $.ctxmg.fillStyle = "#fff";
    $.ctxmg.fill();

    let i = $.buttons.length;
    while (i--) {
      $.buttons[i].render(i);
    }
    i = $.buttons.length;
    while (i--) {
      $.buttons[i].update(i);
    }

    if ($.keys.pressed.esc) {
      $.setState("menu");
    }
  };

  $.states["play"] = function () {
    $.updateDelta();
    $.updateScreen();
    $.updateLevel();
    $.updatePowerupTimers();
    $.spawnEnemies();
    $.enemyOffsetMod += $.slow ? $.dt / 3 : $.dt;

    // update entities
    let i = $.enemies.length;
    while (i--) {
      $.enemies[i].update(i);
    }
    i = $.explosions.length;
    while (i--) {
      $.explosions[i].update(i);
    }
    i = $.powerups.length;
    while (i--) {
      $.powerups[i].update(i);
    }
    i = $.particleEmitters.length;
    while (i--) {
      $.particleEmitters[i].update(i);
    }
    i = $.textPops.length;
    while (i--) {
      $.textPops[i].update(i);
    }
    i = $.levelPops.length;
    while (i--) {
      $.levelPops[i].update(i);
    }
    i = $.bullets.length;
    while (i--) {
      $.bullets[i].update(i);
    }
    $.hero.update();

    // render entities
    $.clearScreen();
    $.ctxmg.save();
    $.ctxmg.translate($.screen.x - $.rumble.x, $.screen.y - $.rumble.y);
    i = $.enemies.length;
    while (i--) {
      $.enemies[i].render(i);
    }

    $.ctxmg.strokeStyle = `hsla(0, 0%, 0%, 0.75)`;
    $.ctxmg.lineWidth = $.edgeSize * 2;
    $.ctxmg.strokeRect(0, 0, $.ww, $.wh);

    $.ctxmg.strokeStyle = `hsla(0, 0%, 100%, ${
      0.5 + Math.sin($.tick * 0.1) * 0.25
    })`;
    $.ctxmg.lineWidth = 1;
    $.ctxmg.strokeRect(
      $.edgeSize + 0.5,
      $.edgeSize + 0.5,
      $.ww - $.edgeSize * 2 - 1,
      $.wh - $.edgeSize * 2 - 1
    );

    i = $.explosions.length;
    while (i--) {
      $.explosions[i].render(i);
    }
    i = $.powerups.length;
    while (i--) {
      $.powerups[i].render(i);
    }
    i = $.particleEmitters.length;
    while (i--) {
      $.particleEmitters[i].render(i);
    }
    i = $.textPops.length;
    while (i--) {
      $.textPops[i].render(i);
    }
    i = $.bullets.length;
    while (i--) {
      $.bullets[i].render(i);
    }
    $.hero.render();

    $.ctxmg.restore();
    i = $.levelPops.length;
    while (i--) {
      $.levelPops[i].render(i);
    }
    $.renderInterface();
    $.renderMinimap();

    // handle gameover
    if ($.hero.life <= 0) {
      let alpha = ($.gameoverTick / $.gameoverTickMax) * 0.8;
      alpha = Math.min(1, Math.max(0, alpha));
      $.ctxmg.fillStyle = "hsla(0, 100%, 0%, " + alpha + ")";
      $.ctxmg.fillRect(0, 0, $.cw, $.ch);
      if ($.gameoverTick < $.gameoverTickMax) {
        $.gameoverTick += $.dt;
      } else {
        $.setState("gameover");
      }

      if (!$.gameoverExplosion) {
        $.audio.play("death");
        $.rumble.level = 25;
        $.explosions.push(
          new $.Explosion({
            x: $.hero.x,
            y: $.hero.y,
            radius: 100,
            hue: 0,
            saturation: 0,
            tickMax: 120,
          })
        );
        $.particleEmitters.push(
          new $.ParticleEmitter({
            x: $.hero.x,
            y: $.hero.y,
            count: 45,
            spawnRange: 10,
            friction: 0.95,
            minSpeed: 2,
            maxSpeed: 20,
            minDirection: 0,
            maxDirection: $.tau,
            hue: 0,
            saturation: 0,
          })
        );
        for (let i = 0; i < $.powerupTimers.length; i++) {
          $.powerupTimers[i] = 0;
        }
        $.gameoverExplosion = 1;
      }
    }

    // update tick
    $.tick += $.dt;

    // listen for pause
    if ($.keys.pressed.p || $.keys.pressed.esc) {
      $.setState("pause");
    }
  };

  $.states["pause"] = function () {
    $.clearScreen();
    $.ctxmg.putImageData($.screenshot, 0, 0);

    $.ctxmg.fillStyle = "hsla(0, 0%, 0%, 0.4)";
    $.ctxmg.fillRect(0, 0, $.cw, $.ch);

    $.ctxmg.beginPath();
    let pauseText = $.text({
      ctx: $.ctxmg,
      x: $.cw / 2,
      y: $.ch / 2 - 50,
      text: "PAUSED",
      hspacing: 4,
      vspacing: 1,
      halign: "center",
      valign: "bottom",
      scale: 10,
      snap: 1,
      render: 1,
    });
    $.ctxmg.fillStyle = "#fff";
    $.ctxmg.fill();

    let i = $.buttons.length;
    while (i--) {
      $.buttons[i].render(i);
    }
    i = $.buttons.length;
    while (i--) {
      $.buttons[i].update(i);
    }

    if ($.keys.pressed.p) {
      $.setState("play");
    }
  };

  $.states["gameover"] = function () {
    $.clearScreen();
    $.ctxmg.putImageData($.screenshot, 0, 0);

    let i = $.buttons.length;
    while (i--) {
      $.buttons[i].update(i);
    }
    i = $.buttons.length;
    while (i--) {
      $.buttons[i].render(i);
    }

    $.ctxmg.beginPath();
    let gameoverTitle = $.text({
      ctx: $.ctxmg,
      x: $.cw / 2,
      y: 150,
      text: "GAME OVER",
      hspacing: 4,
      vspacing: 1,
      halign: "center",
      valign: "bottom",
      scale: 10,
      snap: 1,
      render: 1,
    });
    $.ctxmg.fillStyle = "hsl(0, 100%, 60%)";
    $.ctxmg.fill();

    $.ctxmg.beginPath();
    let gameoverStatsKeys = $.text({
      ctx: $.ctxmg,
      x: $.cw / 2 - 10,
      y: gameoverTitle.ey + 51,
      text: "SCORE\nLEVEL\nKILLS\nBULLETS\nPOWERUPS\nTIME",
      hspacing: 1,
      vspacing: 17,
      halign: "right",
      valign: "top",
      scale: 2,
      snap: 1,
      render: 1,
    });
    $.ctxmg.fillStyle = "hsla(0, 0%, 100%, 0.5)";
    $.ctxmg.fill();

    $.ctxmg.beginPath();
    let gameoverStatsValues = $.text({
      ctx: $.ctxmg,
      x: $.cw / 2 + 10,
      y: gameoverTitle.ey + 51,
      text:
        $.util.commas($.score) +
        "\n" +
        ($.level.current + 1) +
        "\n" +
        $.util.commas($.kills) +
        "\n" +
        $.util.commas($.bulletsFired) +
        "\n" +
        $.util.commas($.powerupsCollected) +
        "\n" +
        $.util.convertTime(($.elapsed * (1000 / 60)) / 1000),
      hspacing: 1,
      vspacing: 17,
      halign: "left",
      valign: "top",
      scale: 2,
      snap: 1,
      render: 1,
    });
    $.ctxmg.fillStyle = "#fff";
    $.ctxmg.fill();
  };
};

/*==============================================================================
Loop
==============================================================================*/
$.loop = function () {
  window.requestAnimationFrame($.loop);

  // setup the pressed state for all keys
  for (let k in $.keys.state) {
    if ($.keys.state[k] && !$.okeys[k]) {
      $.keys.pressed[k] = 1;
    } else {
      $.keys.pressed[k] = 0;
    }
  }

  // run the current state
  $.states[$.state]();

  // listen for scale
  if ($.keys.pressed.f) {
    $.shouldScale = !$.shouldScale;
    $.resizecb();
  }

  // always listen for mute toggle
  if ($.keys.pressed.m) {
    $.mute = !$.mute;
    Howler.mute($.mute);
    $.storage["mute"] = $.mute;
    $.updateStorage();
  }

  // move current keys into old keys
  $.okeys = {};
  for (let k in $.keys.state) {
    $.okeys[k] = $.keys.state[k];
  }
};

/*==============================================================================
Start Game on Load
==============================================================================*/
window.addEventListener("load", function () {
  document.documentElement.className += " loaded";
  $.init();
});

/*==============================================================================
Init
==============================================================================*/
$.Hero = function () {
  this.x = $.ww / 2;
  this.y = $.wh / 2;
  this.vx = 0;
  this.vy = 0;
  this.vmax = 4;
  this.vmax = 6;
  this.direction = 0;
  this.accel = 0.75;
  this.radius = 10;
  this.life = 1;
  this.particleEmitterTickMax = 1;
  this.particleEmitterTick = this.particleEmitterTickMax;
  this.particleEmitterSpeedTickMax = 1;
  this.particleEmitterSpeedTick = this.particleEmitterSpeedTickMax;
  this.takingDamage = 0;
  this.takingDamageAudioTickMax = 8;
  this.takingDamageAudioTick = this.takingDamageAudioTickMax;
  this.fillStyle = "#fff";
  this.weapon = {
    fireRateTickMax: 5,
    fireRateTick: 5,
    spread: 0.3,
    count: 1,
    bullet: {
      size: 15,
      lineWidth: 2,
      damage: 1,
      speed: 10,
      piercing: 0,
      color: {
        hue: 0,
        saturation: 0,
        lightness: 100,
        value: "hsl(0, 0%, 100%)",
      },
    },
    fireFlag: 0,
  };
};

/*==============================================================================
Update
==============================================================================*/
$.Hero.prototype.update = function () {
  if (this.life <= 0) {
    return;
  }

  /*==============================================================================
  Apply Forces
  ==============================================================================*/
  if ($.keys.state.left) {
    this.vx -= this.accel * $.dt;
    if (this.vx < -this.vmax) {
      this.vx = -this.vmax;
    }
  } else if ($.keys.state.right) {
    this.vx += this.accel * $.dt;
    if (this.vx > this.vmax) {
      this.vx = this.vmax;
    }
  }

  if ($.keys.state.up) {
    this.vy -= this.accel * $.dt;
    if (this.vy < -this.vmax) {
      this.vy = -this.vmax;
    }
  } else if ($.keys.state.down) {
    this.vy += this.accel * $.dt;
    if (this.vy > this.vmax) {
      this.vy = this.vmax;
    }
  }

  this.vx += (0 - this.vx) * (1 - Math.exp(-0.1 * $.dt));
  this.vy += (0 - this.vy) * (1 - Math.exp(-0.1 * $.dt));

  this.x += this.vx * $.dt;
  this.y += this.vy * $.dt;

  /*==============================================================================
  Lock Bounds
  ==============================================================================*/
  let buffer = 5;
  if (this.x >= $.ww - this.radius - $.edgeSize - buffer) {
    this.x = $.ww - this.radius - $.edgeSize - buffer;
    this.vx = 0;
  }
  if (this.x <= this.radius + $.edgeSize + buffer) {
    this.x = this.radius + $.edgeSize + buffer;
    this.vx = 0;
  }
  if (this.y >= $.wh - this.radius - $.edgeSize - buffer) {
    this.y = $.wh - this.radius - $.edgeSize - buffer;
    this.vy = 0;
  }
  if (this.y <= this.radius + $.edgeSize + buffer) {
    this.y = this.radius + $.edgeSize + buffer;
    this.vy = 0;
  }

  /*==============================================================================
  Update Direction
  ==============================================================================*/
  let dx = $.mouse.x - this.x;
  let dy = $.mouse.y - this.y;
  this.direction = Math.atan2(dy, dx);
  if ($.mouse.down) {
    this.vx += (0 - this.vx) * (1 - Math.exp(-0.15 * $.dt));
    this.vy += (0 - this.vy) * (1 - Math.exp(-0.15 * $.dt));
  }

  if (this.particleEmitterSpeedTick < this.particleEmitterSpeedTickMax) {
    this.particleEmitterSpeedTick += $.dt;
  }

  if (!$.mouse.down && (Math.abs(this.vx) > 1 || Math.abs(this.vy) > 1)) {
    let dir = Math.atan2(this.vy, this.vx) + $.pi;
    let max = Math.max(Math.abs(this.vx), Math.abs(this.vy));
    if (this.particleEmitterSpeedTick >= this.particleEmitterSpeedTickMax) {
      this.particleEmitterSpeedTick = 0;
      $.particleEmitters.push(
        new $.ParticleEmitter({
          x: this.x + Math.cos(dir) * this.radius * 2,
          y: this.y + Math.sin(dir) * this.radius * 2,
          count: 2,
          spawnRange: this.radius * 1.25,
          friction: 0.7,
          minSpeed: max * 1,
          maxSpeed: max * 2,
          minDirection: dir - 0.1,
          maxDirection: dir + 0.1,
          hue: 0,
          saturation: 0,
        })
      );
    }
  }

  /*==============================================================================
  Fire Weapon
  ==============================================================================*/
  if (this.weapon.fireRateTick < this.weapon.fireRateTickMax) {
    this.weapon.fireRateTick += $.dt;
  } else {
    if ($.mouse.down) {
      if ($.powerupTimers[2] > 0) {
        $.audio.play("shoot").rate(1 + Math.sin($.tick * 0.4) * 0.3);
      } else {
        $.audio.play("shoot").rate(1 + Math.sin($.tick * 0.2) * 0.3);
      }

      if (
        $.powerupTimers[2] > 0 ||
        $.powerupTimers[3] > 0 ||
        $.powerupTimers[4] > 0
      ) {
        if ($.powerupTimers[2] > 0) {
          $.audio.play("shootAlt").rate(1 + Math.sin($.tick * 0.2) * 0.3);
        } else {
          $.audio.play("shootAlt").rate(1 + Math.sin($.tick * 0.1) * 0.3);
        }
      }

      this.weapon.fireRateTick =
        this.weapon.fireRateTick - this.weapon.fireRateTickMax + $.dt;

      this.weapon.fireFlag = 6;

      let spreadStart = 0;
      let spreadStep = 0;

      if (this.weapon.count > 1) {
        spreadStart = -this.weapon.spread / 2;
        spreadStep = this.weapon.spread / (this.weapon.count - 1);
      }

      let gunX = this.x + Math.cos(this.direction) * this.radius;
      let gunY = this.y + Math.sin(this.direction) * this.radius;

      for (let i = 0; i < this.weapon.count; i++) {
        $.bulletsFired++;
        let color = this.weapon.bullet.color;
        if (
          $.powerupTimers[2] > 0 ||
          $.powerupTimers[3] > 0 ||
          $.powerupTimers[4] > 0
        ) {
          let colors = [];
          if ($.powerupTimers[2] > 0) {
            colors.push({
              hue: $.definitions.powerups[2].hue,
              saturation: $.definitions.powerups[2].saturation,
              lightness: $.definitions.powerups[2].lightness,
              value:
                "hsl(" +
                $.definitions.powerups[2].hue +
                ", " +
                $.definitions.powerups[2].saturation +
                "%, " +
                $.definitions.powerups[2].lightness +
                "%)",
            });
          }
          if ($.powerupTimers[3] > 0) {
            colors.push({
              hue: $.definitions.powerups[3].hue,
              saturation: $.definitions.powerups[3].saturation,
              lightness: $.definitions.powerups[3].lightness,
              value:
                "hsl(" +
                $.definitions.powerups[3].hue +
                ", " +
                $.definitions.powerups[3].saturation +
                "%, " +
                $.definitions.powerups[3].lightness +
                "%)",
            });
          }
          if ($.powerupTimers[4] > 0) {
            colors.push({
              hue: $.definitions.powerups[4].hue,
              saturation: $.definitions.powerups[4].saturation,
              lightness: $.definitions.powerups[4].lightness,
              value:
                "hsl(" +
                $.definitions.powerups[4].hue +
                ", " +
                $.definitions.powerups[4].saturation +
                "%, " +
                $.definitions.powerups[4].lightness +
                "%)",
            });
          }
          color = colors[Math.floor($.util.rand(0, colors.length))];
        }
        $.bullets.push(
          new $.Bullet({
            x: gunX,
            y: gunY,
            speed: this.weapon.bullet.speed,
            direction: this.direction + spreadStart + i * spreadStep,
            damage: this.weapon.bullet.damage,
            size: this.weapon.bullet.size,
            lineWidth: this.weapon.bullet.lineWidth,
            strokeStyle: color.value,
            hue: color.hue,
            saturation: color.saturation,
            lightness: color.lightness,
            piercing: this.weapon.bullet.piercing,
          })
        );
      }
    }
  }

  /*==============================================================================
  Check Collisions
  ==============================================================================*/
  this.takingDamage = 0;
  let ei = $.enemies.length;
  while (ei--) {
    let enemy = $.enemies[ei];
    if (
      enemy.inView &&
      $.util.distance(this.x, this.y, enemy.x, enemy.y) <=
        this.radius + enemy.radius
    ) {
      this.takingDamage = 1;
      break;
    }
  }

  if (this.particleEmitterTick < this.particleEmitterTickMax) {
    this.particleEmitterTick += $.dt;
  }

  if (this.takingDamageAudioTick < this.takingDamageAudioTickMax) {
    this.takingDamageAudioTick += $.dt;
  }

  if (this.takingDamage) {
    $.rumble.level = 4;

    this.life -= 0.0075 * $.dt;

    if (this.particleEmitterTick >= this.particleEmitterTickMax) {
      this.particleEmitterTick = 0;

      $.particleEmitters.push(
        new $.ParticleEmitter({
          x: this.x,
          y: this.y,
          count: 2,
          spawnRange: 0,
          friction: 0.85,
          minSpeed: 2,
          maxSpeed: 15,
          minDirection: 0,
          maxDirection: $.tau,
          hue: 0,
          saturation: 0,
        })
      );
    }

    if (this.takingDamageAudioTick >= this.takingDamageAudioTickMax) {
      this.takingDamageAudioTick = 0;
      $.audio.play("takingDamage").rate($.util.rand(0.8, 1.2));
    }
  }
};

/*==============================================================================
Render
==============================================================================*/
$.Hero.prototype.render = function () {
  if (this.life > 0) {
    let fillStyle = this.fillStyle;

    if (this.takingDamage) {
      fillStyle = "hsla(0, 0%, " + $.util.rand(0, 100) + "%, 1)";
      $.ctxmg.fillStyle = "hsla(0, 100%, 50%, " + $.util.rand(0.05, 0.2) + ")";
      $.ctxmg.fillRect(-$.screen.x, -$.screen.y, $.cw, $.ch);
    } else if (this.weapon.fireFlag > 0) {
      this.weapon.fireFlag -= $.dt;
      if (
        $.powerupTimers[2] > 0 ||
        $.powerupTimers[3] > 0 ||
        $.powerupTimers[4] > 0
      ) {
        fillStyle =
          "hsla(" + $.tick * 30 + ", 100%, " + $.util.rand(50, 80) + "%, 1)";
      } else {
        fillStyle =
          "hsla(" +
          $.util.rand(0, 360) +
          ", 100%, " +
          $.util.rand(20, 80) +
          "%, 1)";
      }
    }

    $.ctxmg.save();
    $.ctxmg.translate(this.x, this.y);
    $.ctxmg.rotate(this.direction - $.pi / 4);
    $.ctxmg.fillStyle = fillStyle;
    $.ctxmg.fillRect(0, 0, this.radius, this.radius);
    $.ctxmg.restore();

    $.ctxmg.save();
    $.ctxmg.translate(this.x, this.y);
    $.ctxmg.rotate(this.direction - $.pi / 4 + $.tau / 3);
    $.ctxmg.fillStyle = fillStyle;
    $.ctxmg.fillRect(0, 0, this.radius, this.radius);
    $.ctxmg.restore();

    $.ctxmg.save();
    $.ctxmg.translate(this.x, this.y);
    $.ctxmg.rotate(this.direction - $.pi / 4 - $.tau / 3);
    $.ctxmg.fillStyle = fillStyle;
    $.ctxmg.fillRect(0, 0, this.radius, this.radius);
    $.ctxmg.restore();

    $.util.fillCircle($.ctxmg, this.x, this.y, this.radius - 3, fillStyle);

    if ($.mouse.down) {
      let sinMult = $.powerupTimers[2] > 0 ? 0.8 : 0.2;
      let spread = $.powerupTimers[3] > 0 ? $.pi / 6 : $.pi / 12;
      let radiusMult = $.powerupTimers[4] > 0 ? 3 : 2;
      let lineWidthMult = $.powerupTimers[4] > 0 ? 3 : 1;

      $.ctxmg.beginPath();
      $.ctxmg.arc(
        this.x,
        this.y,
        this.radius * 2 + Math.sin($.tick * sinMult) * radiusMult,
        this.direction - spread,
        this.direction + spread,
        false
      );
      $.ctxmg.lineWidth = 2 * lineWidthMult;
      $.ctxmg.strokeStyle =
        "hsla(" +
        $.util.rand(0, 359) +
        ", 100%, " +
        $.util.rand(20, 80) +
        "%, 1)";
      $.ctxmg.stroke();
    }
  }
};

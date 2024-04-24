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
  this.takingDamage = 0;
  this.takingDamageAudioTickMax = 8;
  this.takingDamageAudioTick = this.takingDamageAudioTickMax;
  this.fillStyle = "#fff";
  this.weapon = {
    fireRateMax: 5,
    fireRateTick: 5,
    spread: 0.3,
    count: 1,
    bullet: {
      size: 15,
      lineWidth: 2,
      damage: 1,
      speed: 10,
      piercing: 0,
      strokeStyle: "#fff",
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
  if (this.x >= $.ww - this.radius) {
    this.x = $.ww - this.radius;
  }
  if (this.x <= this.radius) {
    this.x = this.radius;
  }
  if (this.y >= $.wh - this.radius) {
    this.y = $.wh - this.radius;
  }
  if (this.y <= this.radius) {
    this.y = this.radius;
  }

  /*==============================================================================
  Update Direction
  ==============================================================================*/
  let dx = $.mouse.x - this.x;
  let dy = $.mouse.y - this.y;
  this.direction = Math.atan2(dy, dx);
  if ($.mouse.down) {
    // this.vx += Math.cos(this.direction) * -0.1 * $.dt;
    // this.vy += Math.sin(this.direction) * -0.1 * $.dt;

    this.vx += (0 - this.vx) * (1 - Math.exp(-0.15 * $.dt));
    this.vy += (0 - this.vy) * (1 - Math.exp(-0.15 * $.dt));
  }

  /*==============================================================================
  Fire Weapon
  ==============================================================================*/
  if (this.weapon.fireRateTick < this.weapon.fireRateMax) {
    this.weapon.fireRateTick += $.dt;
  } else {
    if ($.mouse.down) {
      $.audio.play("shoot");
      if (
        $.powerupTimers[2] > 0 ||
        $.powerupTimers[3] > 0 ||
        $.powerupTimers[4] > 0
      ) {
        $.audio.play("shootAlt");
      }

      this.weapon.fireRateTick =
        this.weapon.fireRateTick - this.weapon.fireRateMax;
      this.weapon.fireFlag = 6;

      let spreadStart = 0;
      let spreadStep = 0;

      if (this.weapon.count > 1) {
        spreadStart = -this.weapon.spread / 2;
        spreadStep = this.weapon.spread / (this.weapon.count - 1);
      }

      let gunX =
        this.x +
        Math.cos(this.direction) * (this.radius + this.weapon.bullet.size);
      let gunY =
        this.y +
        Math.sin(this.direction) * (this.radius + this.weapon.bullet.size);

      for (let i = 0; i < this.weapon.count; i++) {
        $.bulletsFired++;
        let color = this.weapon.bullet.strokeStyle;
        if (
          $.powerupTimers[2] > 0 ||
          $.powerupTimers[3] > 0 ||
          $.powerupTimers[4] > 0
        ) {
          let colors = [];
          if ($.powerupTimers[2] > 0) {
            colors.push(
              "hsl(" +
                $.definitions.powerups[2].hue +
                ", " +
                $.definitions.powerups[2].saturation +
                "%, " +
                $.definitions.powerups[2].lightness +
                "%)"
            );
          }
          if ($.powerupTimers[3] > 0) {
            colors.push(
              "hsl(" +
                $.definitions.powerups[3].hue +
                ", " +
                $.definitions.powerups[3].saturation +
                "%, " +
                $.definitions.powerups[3].lightness +
                "%)"
            );
          }
          if ($.powerupTimers[4] > 0) {
            colors.push(
              "hsl(" +
                $.definitions.powerups[4].hue +
                ", " +
                $.definitions.powerups[4].saturation +
                "%, " +
                $.definitions.powerups[4].lightness +
                "%)"
            );
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
            strokeStyle: color,
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
    $.rumble.level = 6;

    //this.life -= 0.0075;

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
      $.audio.play("takingDamage");
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
      $.ctxmg.fillStyle =
        "hsla(0, 0%, " +
        $.util.rand(0, 100) +
        "%, " +
        $.util.rand(0.01, 0.15) +
        ")";
      $.ctxmg.fillRect(-$.screen.x, -$.screen.y, $.cw, $.ch);
    } else if (this.weapon.fireFlag > 0) {
      this.weapon.fireFlag -= $.dt;
      fillStyle =
        "hsla(" +
        $.util.rand(0, 359) +
        ", 100%, " +
        $.util.rand(20, 80) +
        "%, 1)";
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
        this.radius * 2.5 + Math.sin($.tick * sinMult) * radiusMult,
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
        "%, " +
        $.util.rand(0.5, 1) +
        ")";
      $.ctxmg.stroke();
    }
  }
};

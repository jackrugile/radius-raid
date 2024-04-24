/*==============================================================================
Init
==============================================================================*/
$.Bullet = function (opt) {
  for (let k in opt) {
    this[k] = opt[k];
  }
  this.enemiesHit = [];
  this.inView = 0;
  $.particleEmitters.push(
    new $.ParticleEmitter({
      x: this.x,
      y: this.y,
      count: 2,
      spawnRange: 1,
      friction: 0.75,
      minSpeed: 2,
      maxSpeed: 10,
      minDirection: 0,
      maxDirection: $.tau,
      hue: this.hue,
      saturation: this.saturation,
    })
  );
};

/*==============================================================================
Update
==============================================================================*/
$.Bullet.prototype.update = function (i) {
  /*==============================================================================
  Apply Forces
  ==============================================================================*/
  this.vx = Math.cos(this.direction) * this.speed * $.dt;
  this.vy = Math.sin(this.direction) * this.speed * $.dt;
  this.x += this.vx;
  this.y += this.vy;
  this.ex = this.x + Math.cos(this.direction) * this.size;
  this.ey = this.y + Math.sin(this.direction) * this.size;
  this.ex = Math.min(this.ex, $.ww - $.edgeSize);
  this.ex = Math.max(this.ex, $.edgeSize);
  this.ey = Math.min(this.ey, $.wh - $.edgeSize);
  this.ey = Math.max(this.ey, $.edgeSize);

  /*==============================================================================
  Check Collisions
  ==============================================================================*/
  let ei = $.enemies.length;
  while (ei--) {
    let enemy = $.enemies[ei];
    if (
      $.util.distance(this.x, this.y, enemy.x, enemy.y) <=
        enemy.radius + this.size / 2 ||
      $.util.distance(this.ex, this.ey, enemy.x, enemy.y) <=
        enemy.radius + this.size / 2
    ) {
      if (this.enemiesHit.indexOf(enemy.index) == -1) {
        this.enemiesHit.push(enemy.index);
        enemy.receiveDamage(ei, this.damage);
        $.explosions.push(
          new $.Explosion({
            x: this.x + $.util.rand(-1, 1),
            y: this.y + $.util.rand(-1, 1),
            radius: 1 + $.util.rand(1, 3),
            hue: this.hue,
            saturation: this.saturation,
            noAudio: true,
            tickMax: 10,
          })
        );
      }

      if (!this.piercing) {
        $.bullets.splice(i, 1);
      }
    }
  }

  /*==============================================================================
  Lock Bounds
  ==============================================================================*/

  if (
    !$.util.pointInRect(
      this.x,
      this.y,
      $.edgeSize,
      $.edgeSize,
      $.ww - $.edgeSize * 2,
      $.wh - $.edgeSize * 2
    )
  ) {
    if (this.inView) {
      let dir;
      let dirRange = 0;
      if (this.x <= $.edgeSize || this.x >= $.ww - $.edgeSize) {
        dir = Math.atan2(this.vy, -this.vx);
        dirRange = Math.abs(this.direction - dir);
      }
      if (this.y <= $.edgeSize) {
        dir = Math.atan2(-this.vy, this.vx);
        dirRange = $.pi - Math.abs(this.direction - dir + $.pi);
      }
      if (this.y >= $.wh - $.edgeSize) {
        dir = Math.atan2(-this.vy, this.vx);
        dirRange = $.pi - Math.abs(this.direction - dir - $.pi);
      }

      dirRange *= 0.2;

      $.particleEmitters.push(
        new $.ParticleEmitter({
          x: this.x,
          y: this.y,
          count: 3,
          spawnRange: 0,
          friction: 0.75,
          minSpeed: 2 + this.speed * 0.5,
          maxSpeed: 10 + this.speed * 0.5,
          minDirection: dir - dirRange,
          maxDirection: dir + dirRange,
          hue: this.hue,
          saturation: this.saturation,
        })
      );

      $.audio.play("hit");

      $.explosions.push(
        new $.Explosion({
          x: this.x + $.util.rand(-3, 3),
          y: this.y + $.util.rand(-3, 3),
          radius: 1 + $.util.rand(1, 10),
          hue: this.hue,
          saturation: this.saturation,
          noAudio: true,
          tickMax: 10,
        })
      );
    }
    $.bullets.splice(i, 1);
  }

  /*==============================================================================
  Update View
  ==============================================================================*/
  if (
    $.util.pointInRect(this.ex, this.ey, -$.screen.x, -$.screen.y, $.cw, $.ch)
  ) {
    this.inView = 1;
  } else {
    this.inView = 0;
  }
};

/*==============================================================================
Render
==============================================================================*/
$.Bullet.prototype.render = function (i) {
  if (this.inView) {
    $.ctxmg.beginPath();
    $.ctxmg.moveTo(this.x, this.y);
    $.ctxmg.lineTo(this.ex, this.ey);
    $.ctxmg.lineWidth = this.lineWidth;
    $.ctxmg.strokeStyle = this.strokeStyle;
    $.ctxmg.stroke();
  }
};

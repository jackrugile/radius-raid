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
      hue: 0,
      saturation: 0,
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
  this.x += Math.cos(this.direction) * (this.speed * $.dt);
  this.y += Math.sin(this.direction) * (this.speed * $.dt);
  this.ex = this.x - Math.cos(this.direction) * this.size;
  this.ey = this.y - Math.sin(this.direction) * this.size;

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
        $.particleEmitters.push(
          new $.ParticleEmitter({
            x: this.x,
            y: this.y,
            count: Math.floor($.util.rand(2, 6)),
            spawnRange: 0,
            friction: 0.85,
            minSpeed: 5,
            maxSpeed: 12,
            minDirection: this.direction - $.pi - $.pi / 5,
            maxDirection: this.direction - $.pi + $.pi / 5,
            hue: enemy.hue,
          })
        );

        this.enemiesHit.push(enemy.index);
        enemy.receiveDamage(ei, this.damage);
      }
      if (!this.piercing) {
        $.bullets.splice(i, 1);
      }
    }
  }

  /*==============================================================================
  Lock Bounds
  ==============================================================================*/
  if (!$.util.pointInRect(this.ex, this.ey, 0, 0, $.ww, $.wh)) {
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

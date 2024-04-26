/*==============================================================================
Init
==============================================================================*/
$.Explosion = function (opt) {
  for (let k in opt) {
    this[k] = opt[k];
  }
  this.tick = 0;
  this.tickMax = this.tickMax ? this.tickMax : 30;

  this.vx = this.vx || 0;
  this.vy = this.vy || 0;

  if (!this.noAudio) {
    if ($.slow) {
      $.audio
        .play("explosionAlt")
        .rate(1.25 - 0.75 * (this.radius / 80) + $.util.rand(-0.1, 0.1));
    } else {
      $.audio
        .play("explosion")
        .rate(1.25 - 0.75 * (this.radius / 80) + $.util.rand(-0.1, 0.1));
    }
  }
};

/*==============================================================================
Update
==============================================================================*/
$.Explosion.prototype.update = function (i) {
  this.x += this.vx * $.dt;
  this.y += this.vy * $.dt;

  if (this.tick >= this.tickMax) {
    $.explosions.splice(i, 1);
  } else {
    this.tick += $.dt;
  }
};

/*==============================================================================
Render
==============================================================================*/
$.Explosion.prototype.render = function (i) {
  if (
    $.util.arcInRect(
      this.x,
      this.y,
      this.radius,
      -$.screen.x,
      -$.screen.y,
      $.cw,
      $.ch
    )
  ) {
    let eased = $.ease.outBack(this.tick / this.tickMax, 0, 1, 1);
    let radius = 1 + eased * this.radius;
    let lineWidth = (eased * this.radius) / 8;

    $.util.strokeCircle(
      $.ctxmg,
      this.x,
      this.y,
      radius,
      "hsla(" +
        this.hue +
        ", " +
        this.saturation +
        "%, " +
        $.util.rand(40, 80) +
        "%, " +
        Math.min(1, Math.max(0, 1 - this.tick / this.tickMax)) +
        ")",
      lineWidth
    );

    $.ctxmg.beginPath();
    let size = $.util.rand(1, 1.5);
    for (let i = 0; i < 10; i++) {
      let angle = $.util.rand(0, $.tau);
      let radius2 = $.util.rand(radius - lineWidth, radius + lineWidth);
      let x = this.x + Math.cos(angle) * radius2;
      let y = this.y + Math.sin(angle) * radius2;

      $.ctxmg.rect(x - size / 2, y - size / 2, size, size);
    }
    $.ctxmg.fillStyle =
      "hsla(" +
      this.hue +
      ", " +
      this.saturation +
      "%, " +
      $.util.rand(50, 100) +
      "%, " +
      Math.min(1, Math.max(0, 1.5 - this.tick / this.tickMax)) +
      ")";
    $.ctxmg.fill();
  }
};

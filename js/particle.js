/*==============================================================================
Init
==============================================================================*/
$.Particle = function (opt) {
  for (let k in opt) {
    this[k] = opt[k];
  }
};

/*==============================================================================
Update
==============================================================================*/
$.Particle.prototype.update = function (i) {
  /*==============================================================================
  Apply Forces
  ==============================================================================*/
  this.x += Math.cos(this.direction) * (this.speed * $.dt);
  this.y += Math.sin(this.direction) * (this.speed * $.dt);
  this.ex = this.x + Math.cos(this.direction) * this.speed;
  this.ey = this.y + Math.sin(this.direction) * this.speed;
  this.speed += (0 - this.speed) * (1 - Math.exp(-(1 - this.friction) * $.dt));

  /*==============================================================================
  Lock Bounds
  ==============================================================================*/
  if (
    !$.util.pointInRect(this.ex, this.ey, 0, 0, $.ww, $.wh) ||
    this.speed <= 0.05
  ) {
    this.parent.splice(i, 1);
  }

  /*==============================================================================
  Update View
  ==============================================================================*/
  this.inView = 0;
  if (
    this.offsetScreen &&
    $.util.pointInRect(this.ex, this.ey, 0, 0, $.cw, $.ch)
  ) {
    this.inView = 1;
  } else if (
    $.util.pointInRect(this.ex, this.ey, -$.screen.x, -$.screen.y, $.cw, $.ch)
  ) {
    this.inView = 1;
  }
};

/*==============================================================================
Render
==============================================================================*/
$.Particle.prototype.render = function (i) {
  if (this.inView) {
    $.ctxmg.beginPath();
    let x = this.x;
    let y = this.y;
    let ex = this.ex;
    let ey = this.ey;
    if (this.offsetScreen) {
      x -= $.screen.x;
      y -= $.screen.y;
      ex -= $.screen.x;
      ey -= $.screen.y;
    }
    if (this.offsetRumble) {
      x += $.rumble.x;
      y += $.rumble.y;
      ex += $.rumble.x;
      ey += $.rumble.y;
    }
    $.ctxmg.moveTo(x, y);
    $.ctxmg.lineTo(ex, ey);
    $.ctxmg.lineWidth = this.lineWidth;
    $.ctxmg.strokeStyle = `hsla(${this.hue}, ${this.saturation}%, ${$.util.rand(
      50,
      100
    )}%, 1)`;
    $.ctxmg.stroke();
  }
};

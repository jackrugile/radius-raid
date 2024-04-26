/*==============================================================================
Init
==============================================================================*/
$.Powerup = function (opt) {
  for (let k in opt) {
    this[k] = opt[k];
  }
  let text = $.text({
    ctx: $.ctxmg,
    x: 0,
    y: 0,
    text: this.title,
    hspacing: 1,
    vspacing: 0,
    halign: "top",
    valign: "left",
    scale: 1,
    snap: 0,
    render: 0,
  });
  this.hpadding = 8;
  this.vpadding = 8;
  this.width = text.width + this.hpadding * 2;
  this.height = text.height + this.vpadding * 2;
  this.x = this.x - this.width / 2;
  this.y = this.y - this.height / 2;
  this.vx = 0;
  this.vy = 0;
  this.direction = $.util.rand(0, $.tau);
  this.speed = $.util.rand(0.5, 2);

  this.spawnTime = Date.now();
};

/*==============================================================================
Update
==============================================================================*/
$.Powerup.prototype.update = function (i) {
  /*==============================================================================
  Apply Forces
  ==============================================================================*/
  this.vx = Math.cos(this.direction) * this.speed * $.dt;
  this.vy = Math.sin(this.direction) * this.speed * $.dt;
  this.x += this.vx;
  this.y += this.vy;

  /*==============================================================================
  Check Bounds
  ==============================================================================*/
  if (this.x <= $.edgeSize || this.x >= $.ww - this.width - $.edgeSize) {
    this.x = Math.min(this.x, $.ww - this.width - $.edgeSize);
    this.x = Math.max(this.x, $.edgeSize);
    this.direction = Math.atan2(this.vy, -this.vx);
  }
  if (this.y <= $.edgeSize || this.y >= $.wh - this.height - $.edgeSize) {
    this.y = Math.min(this.y, $.wh - this.height - $.edgeSize);
    this.y = Math.max(this.y, $.edgeSize);
    this.direction = Math.atan2(-this.vy, this.vx);
  }

  /*==============================================================================
  Check Collection Collision
  ==============================================================================*/
  if (
    $.hero.life > 0 &&
    $.util.arcIntersectingRect(
      $.hero.x,
      $.hero.y,
      $.hero.radius + 2,
      this.x,
      this.y,
      this.width,
      this.height
    )
  ) {
    $.audio.play("powerup").rate($.util.rand(0.7, 1.3));
    $.powerupTimers[this.type] = $.powerupDuration;
    $.particleEmitters.push(
      new $.ParticleEmitter({
        x: this.x + this.width / 2,
        y: this.y + this.height / 2,
        count: 15,
        spawnRange: 0,
        friction: 0.85,
        minSpeed: 2,
        maxSpeed: 15,
        minDirection: 0,
        maxDirection: $.tau,
        hue: this.hue,
        saturation: this.saturation,
      })
    );
    $.powerups.splice(i, 1);
    $.powerupsCollected++;
  }
};

/*==============================================================================
Render
==============================================================================*/
$.Powerup.prototype.render = function (i) {
  $.ctxmg.fillStyle = "#000";
  $.ctxmg.fillRect(this.x - 2, this.y - 2, this.width + 4, this.height + 4);
  $.ctxmg.fillStyle =
    "hsla(" +
    this.hue +
    ", " +
    this.saturation +
    "%, " +
    this.lightness +
    "%, " +
    (0.7 + Math.sin(this.spawnTime + $.tick * 0.2) * 0.3) +
    ")";
  $.ctxmg.fillRect(this.x - 1, this.y - 1, this.width + 2, this.height + 2);

  $.ctxmg.fillStyle = "#111";
  $.ctxmg.fillRect(this.x, this.y, this.width, this.height);

  $.ctxmg.beginPath();
  $.text({
    ctx: $.ctxmg,
    x: this.x + this.hpadding,
    y: this.y + this.vpadding + 1,
    text: this.title,
    hspacing: 1,
    vspacing: 0,
    halign: "top",
    valign: "left",
    scale: 1,
    snap: 0,
    render: true,
  });
  $.ctxmg.fillStyle = "#000";
  $.ctxmg.fill();

  $.ctxmg.beginPath();
  $.text({
    ctx: $.ctxmg,
    x: this.x + this.hpadding,
    y: this.y + this.vpadding,
    text: this.title,
    hspacing: 1,
    vspacing: 0,
    halign: "top",
    valign: "left",
    scale: 1,
    snap: 0,
    render: true,
  });
  $.ctxmg.fillStyle =
    "hsl(" + this.hue + ", " + this.saturation + "%, " + this.lightness + "%)";
  $.ctxmg.fill();

  $.ctxmg.fillStyle = "hsla(0, 0%, 100%, 0.2)";
  $.ctxmg.fillRect(this.x, this.y, this.width, this.height / 2);
};

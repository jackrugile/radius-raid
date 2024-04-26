/*==============================================================================
Init
==============================================================================*/
$.TextPop = function (opt) {
  for (let k in opt) {
    this[k] = opt[k];
  }
  this.tick = 0;
  this.tickMax = this.tickMax ? this.tickMax : 30;
  this.alpha = 1;
  this.scale = 2;
};

/*==============================================================================
Update
==============================================================================*/
$.TextPop.prototype.update = function (i) {
  let eased = $.ease.outBack(this.tick / this.tickMax, 0, 1, 1);
  this.scale = eased * 2;
  this.alpha = ((this.tickMax - this.tick) / this.tickMax) * 2;

  if (this.tick >= this.tickMax) {
    $.textPops.splice(i, 1);
  } else {
    this.tick += $.dt;
  }
};

/*==============================================================================
Render
==============================================================================*/
$.TextPop.prototype.render = function (i) {
  $.ctxmg.beginPath();
  $.text({
    ctx: $.ctxmg,
    x: this.x,
    y: this.y,
    text: "" + this.value,
    hspacing: 1,
    vspacing: 0,
    halign: "center",
    valign: "center",
    scale: this.scale,
    snap: 0,
    render: 1,
  });
  $.ctxmg.fillStyle =
    "hsla(" +
    this.hue +
    ", " +
    this.saturation +
    "%, " +
    this.lightness +
    "%, " +
    this.alpha +
    ")";
  $.ctxmg.fill();
};

$.textLine = function (opt) {
  let textLength = opt.text.length;
  let size = 5;
  for (let i = 0; i < textLength; i++) {
    let letter =
      $.definitions.letters[opt.text.charAt(i)] ||
      $.definitions.letters["unknown"];
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        if (letter[y][x] === 1) {
          opt.ctx.rect(
            opt.x + x * opt.scale + (size * opt.scale + opt.hspacing) * i,
            opt.y + y * opt.scale,
            opt.scale,
            opt.scale
          );
        }
      }
    }
  }
};

$.text = function (opt) {
  let size = 5;
  let letterSize = size * opt.scale;
  let lines = opt.text.split("\n");
  let linesCopy = lines.slice(0);
  let lineCount = lines.length;
  let longestLine = linesCopy.sort(function (a, b) {
    return b.length - a.length;
  })[0];
  let textWidth =
    longestLine.length * letterSize + (longestLine.length - 1) * opt.hspacing;
  let textHeight = lineCount * letterSize + (lineCount - 1) * opt.vspacing;

  let sx = opt.x;
  let sy = opt.y;
  let ex = opt.x + textWidth;
  let ey = opt.y + textHeight;

  if (opt.halign == "center") {
    sx = opt.x - textWidth / 2;
    ex = opt.x + textWidth / 2;
  } else if (opt.halign == "right") {
    sx = opt.x - textWidth;
    ex = opt.x;
  }

  if (opt.valign == "center") {
    sy = opt.y - textHeight / 2;
    ey = opt.y + textHeight / 2;
  } else if (opt.valign == "bottom") {
    sy = opt.y - textHeight;
    ey = opt.y;
  }

  let cx = sx + textWidth / 2;
  let cy = sy + textHeight / 2;

  if (opt.render) {
    for (let i = 0; i < lineCount; i++) {
      let line = lines[i];
      let lineWidth =
        line.length * letterSize + (line.length - 1) * opt.hspacing;
      let x = opt.x;
      let y = opt.y + (letterSize + opt.vspacing) * i;

      if (opt.halign == "center") {
        x = opt.x - lineWidth / 2;
      } else if (opt.halign == "right") {
        x = opt.x - lineWidth;
      }

      if (opt.valign == "center") {
        y = y - textHeight / 2;
      } else if (opt.valign == "bottom") {
        y = y - textHeight;
      }

      if (opt.snap) {
        x = Math.floor(x);
        y = Math.floor(y);
      }

      $.textLine({
        ctx: opt.ctx,
        x: x,
        y: y,
        text: line,
        hspacing: opt.hspacing,
        scale: opt.scale,
      });
    }
  }

  return {
    sx: sx,
    sy: sy,
    cx: cx,
    cy: cy,
    ex: ex,
    ey: ey,
    width: textWidth,
    height: textHeight,
  };
};

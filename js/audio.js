$.audio = {
  sounds: {},
  references: [],
  play: async function (sound) {
    if (!$.mute) {
      let audio = $.audio.sounds[sound];
      if (audio.length > 1) {
        audio = $.audio.sounds[sound][Math.floor($.util.rand(0, audio.length))];
      } else {
        audio = $.audio.sounds[sound][0];
      }
      try {
        await audio.pool[audio.tick].play();
      } catch (e) {}
      if (audio.tick < audio.count - 1) {
        audio.tick++;
      } else {
        audio.tick = 0;
      }
    }
  },
};

for (let k in $.definitions.audio) {
  $.audio.sounds[k] = [];

  $.definitions.audio[k].params.forEach(function (elem, index, array) {
    $.audio.sounds[k].push({
      tick: 0,
      count: $.definitions.audio[k].count,
      pool: [],
    });

    for (let i = 0; i < $.definitions.audio[k].count; i++) {
      let audio = new Audio();
      audio.src = jsfxr(elem);
      $.audio.references.push(audio);
      $.audio.sounds[k][index].pool.push(audio);
    }
  });
}

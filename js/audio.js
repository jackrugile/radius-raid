$.audio = {};

$.audio.sounds = {
  click: [new Howl({ src: ["./sounds/click-0.webm", "./sounds/click-0.mp3"] })],
  death: [new Howl({ src: ["./sounds/death-0.webm", "./sounds/death-0.mp3"] })],
  explosion: [
    new Howl({
      src: ["./sounds/explosion-0.webm", "./sounds/explosion-0.mp3"],
      volume: 0.85,
    }),
    new Howl({
      src: ["./sounds/explosion-1.webm", "./sounds/explosion-1.mp3"],
      volume: 0.85,
    }),
  ],
  explosionAlt: [
    new Howl({
      src: ["./sounds/explosionAlt-0.webm", "./sounds/explosionAlt-0.mp3"],
      volume: 0.7,
    }),
  ],
  hit: [
    new Howl({ src: ["./sounds/hit-0.webm", "./sounds/hit-0.mp3"] }),
    new Howl({ src: ["./sounds/hit-1.webm", "./sounds/hit-1.mp3"] }),
    new Howl({ src: ["./sounds/hit-2.webm", "./sounds/hit-2.mp3"] }),
  ],
  hover: [new Howl({ src: ["./sounds/hover-0.webm", "./sounds/hover-0.mp3"] })],
  levelup: [
    new Howl({ src: ["./sounds/levelup-0.webm", "./sounds/levelup-0.mp3"] }),
  ],
  powerup: [
    new Howl({
      src: ["./sounds/powerup-0.webm", "./sounds/powerup-0.mp3"],
      volume: 0.7,
    }),
  ],
  shoot: [
    new Howl({
      src: ["./sounds/shoot-0.webm", "./sounds/shoot-0.mp3"],
    }),
  ],
  shootAlt: [
    new Howl({
      src: ["./sounds/shootAlt-0.webm", "./sounds/shootAlt-0.mp3"],
    }),
  ],
  takingDamage: [
    new Howl({
      src: ["./sounds/takingDamage-0.webm", "./sounds/takingDamage-0.mp3"],
    }),
    new Howl({
      src: ["./sounds/takingDamage-1.webm", "./sounds/takingDamage-1.mp3"],
    }),
    new Howl({
      src: ["./sounds/takingDamage-2.webm", "./sounds/takingDamage-2.mp3"],
    }),
  ],
};

$.audio.play = function (key) {
  let sound = $.audio.sounds[key];
  if (sound.length > 1) {
    sound = $.audio.sounds[key][Math.floor($.util.rand(0, sound.length))];
  } else {
    sound = $.audio.sounds[key][0];
  }

  if (!$.mute) {
    sound.play();
  }

  return sound;
};

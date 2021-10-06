const RES_MOBILE = window.matchMedia("(max-width: 1100px)"); // Mute eat sound on mobile devices.

const introSound = new Audio();
const munchSound = new Audio();
const deathSound = new Audio();
const levelSound = new Audio();
const lostSound = new Audio();
const winSound = new Audio();
const eatPillSound = new Audio();
const eatGhostSound = new Audio();
const extraPacSound = new Audio();

function getSounds() {
  introSound.src = "../sounds/pacman_intro.mp3";
  munchSound.src = "../sounds/pacman_chomp.mp3";
  deathSound.src = "../sounds/pacman_death.mp3";
  levelSound.src = "../sounds/pacman_level.mp3";
  lostSound.src = "../sounds/pacman_lost.mp3";
  winSound.src = "../sounds/pacman_win.mp3";
  eatPillSound.src = "../sounds/pacman_eatpill.mp3";
  eatGhostSound.src = "../sounds/pacman_eatghost.mp3";
  extraPacSound.src = "../sounds/pacman_extrapac.mp3"
}

function unlockSounds() {
  introSound.play();
  introSound.pause();

  munchSound.play();
  munchSound.pause();

  deathSound.play();
  deathSound.pause();

  levelSound.play();
  levelSound.pause();

  lostSound.play();
  lostSound.pause();

  winSound.play();
  winSound.pause();

  eatPillSound.play();
  eatPillSound.pause();
  
  eatGhostSound.play();
  eatGhostSound.pause();

  extraPacSound.play();
  extraPacSound.pause();
}

function optimizeSounds() {
  if (RES_MOBILE.matches) {
    game.optimizeSounds = true;
  }
  return;
}

function soundPlayer(type, state) {
  if (game.mute === false && state === "play") {
    switch (type) {
      case "intro":
        introSound.play();
        break;
      case "munch":
        if (game.optimizeSounds === false) {
          munchSound.play();
        }
        break;
      case "death":
        deathSound.play();
        break;
      case "level":
        levelSound.play();
        break;
      case "lost":
        lostSound.play();
        break;
      case "win":
        winSound.play();
        break;
      case "eatpill":
        eatPillSound.play();
        break;
      case "eatghost":
        eatGhostSound.play();
        break;
      case "extrapac":
        extraPacSound.play();
        break;
      default:
        break;
    }
  } else if (state === "pause") {
    switch (type) {
      case "intro":
        introSound.pause();
        introSound.currentTime = 0;
        break;
      case "munch":
        munchSound.pause();
        munchSound.currentTime = 0;
        break;
      case "death":
        deathSound.pause();
        deathSound.currentTime = 0;
        break;
      case "level":
        levelSound.pause();
        levelSound.currentTime = 0;
        break;
      case "lost":
        lostSound.pause();
        lostSound.currentTime = 0;
        break;
      case "win":
        winSound.pause();
        winSound.currentTime = 0;
        break;
      case "eatpill":
        eatPillSound.pause();
        eatPillSound.currentTime = 0;
        break;
      case "eatghost":
        eatGhostSound.pause();
        eatGhostSound.currentTime = 0;
        break;
      case "extrapac":
        extraPacSound.pause();
        extraPacSound.currentTime = 0;
        break;
      default:
        break;
    }
  }
}

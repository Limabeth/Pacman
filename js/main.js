class Game {
  constructor() {
    this.cheats = false; //True if a cheat has been activated by user.

    this.on = false; // Game is running.
    this.over = false; //Not used anywhere I think.

    this.level = 1;
    this.score = 0;
    this.eatGhostScore = 0; /* If a ghost has been eaten by pacman, adds X points to this value. It is substracted from the current score (during main loop timer) to check if the level has been completed */

    /* Max points for the corresponding level. E.g. level 1 has 290 food items, therefore its max score is 290 x 10 = 2900 points. Also, if a player has scored 500 points by eating ghosts and their current score is 3400, the level is complete because 3400 - 500 = 2900(which is max score for level 1). */
    this.scoreLVL1 = 2900;
    this.scoreLVL2 = 5940;
    this.scoreLVL3 = 9000;
    this.scoreLVL4 = 12180;
    this.scoreLVL5 = 15360;

    this.bestScore = 0;
    this.lives = 3;

    this.extrapacs = {}; /* Stores extra lives, i.e. if a player has scored 10K points, they are given an extra life and this object will remember that the player has acquired an extra life on 10K points mark. */

    this.mute = false;
    this.optimizeSounds = false; // Sound performance mode for mobile devices. If true, eat food sound is not played.
    this.soundsUnlocked = false; // Plays all sounds when user clicks on Start Game to make sure the browser confirms user's interaction with the app.

    this.playGameTimer = null;
  }

  startGame() {
    if (game.soundsUnlocked === false && game.mute === false) {
      unlockSounds();
      game.soundsUnlocked = true;
    }
  
    activateGameController(1);

    switchToGame();
  
    game.createGame();
  }

  playGame() {
    canvasCleaner("main");

    winkyGhost.animate();
    inkyGhost.animate();
    pinkyGhost.animate();
    slinkyGhost.animate();
  
    pacman.animate();
    collisionWithFood();
    collisionWithPill();
  
    if (collisionWithGhost() === true) {

      cancelAnimationFrame(this.playGameTimer);
      this.playGameTimer = null;

      return;
    } 
  
    else if (this.score - this.eatGhostScore === this.scoreLVL1 && this.level === 1) {
      this.changeLevel(2);

      cancelAnimationFrame(this.playGameTimer);
      this.playGameTimer = null;

      return;
  
    } else if (this.score - this.eatGhostScore === this.scoreLVL2 && this.level === 2) { 
      this.changeLevel(3);

      cancelAnimationFrame(this.playGameTimer);
      this.playGameTimer = null;

      return;
  
    } else if (this.score - this.eatGhostScore === this.scoreLVL3 && this.level === 3) { 
      this.changeLevel(4);

      cancelAnimationFrame(this.playGameTimer);
      this.playGameTimer = null;

      return;

    } else if (this.score - this.eatGhostScore === this.scoreLVL4 && this.level === 4) {
      this.changeLevel(5);

      cancelAnimationFrame(this.playGameTimer);
      this.playGameTimer = null;

      return;

    } else if (this.score - this.eatGhostScore === this.scoreLVL5 && this.level === 5) {
      this.changeLevel();

      setTimeout(function () {
        winner.start();
      }, 3000);

      cancelAnimationFrame(this.playGameTimer);
      this.playGameTimer = null;

      return;
    }

    this.playGameTimer = requestAnimationFrame(this.playGame.bind(this));
  }

  createGame() {
    cancelAnimationFrame(winner.timer);
    winner.timer = null;

    soundPlayer("win", "pause");
    soundPlayer("lose", "pause");

    resetter.mazedata();
    resetter.score();
    resetter.lives();
    resetter.level();
    resetter.ghostMechs();
    resetter.difficultyLVL1();

    canvasCleaner("all");

    bg.draw();
    maze.draw();
    food.draw();

    maze.createMazeData();

    ui.drawScore();
    ui.drawLives();

    pacman.draw(180);

    this.on = true;

    pill.start();
    countdown.start();
  }

  deleteGame() {
    soundPlayer("intro", "pause");
    
    cancelAnimationFrame(winner.timer);
    winner.timer = null;

    cancelAnimationFrame(this.playGameTimer);
    this.playGameTimer = null;

    this.on = false;

    resetter.mazedata();
    resetter.score();
    resetter.lives();
    resetter.level();
    resetter.ghostMechs();
    resetter.difficultyLVL1();

    canvasCleaner("all");

    pill.stop();
    countdown.stop();

    canvasCleaner("all");
  }

  changeLevel(x) {
    levelMessage.start();
    pill.stop();

    resetter.ghostMechs();

    soundPlayer("level", "play");

    if (x === 2) {
      resetter.mazeLVL(2);
      resetter.difficultyLVL2();
      this.level = 2;
      setTimeout(this.createLevel.bind(this), 3000);

    } else if (x === 3) {
      resetter.mazeLVL(3);
      resetter.difficultyLVL3();
      this.level = 3;
      setTimeout(this.createLevel.bind(this), 3000);

    } else if (x === 4) {
      resetter.mazeLVL(4);
      resetter.difficultyLVL4();
      this.level = 4;
      setTimeout(this.createLevel.bind(this), 3000);

    } else if (x === 5) {
      resetter.mazeLVL(5);
      resetter.difficultyLVL5();
      this.level = 5;
      setTimeout(this.createLevel.bind(this), 3000);
    }
  }

  createLevel() {
    winkyGhost.stopFlee();
    inkyGhost.stopFlee();
    pinkyGhost.stopFlee();
    slinkyGhost.stopFlee();

    resetter.mazedata();
    resetter.ghostMechs();
    
    canvasCleaner("main");
    canvasCleaner("bg");
    canvasCleaner("maze");
    canvasCleaner("food");
    canvasCleaner("pill");

    bg.draw();
    maze.draw();
    food.draw();

    maze.createMazeData();

    pacman.draw(180);

    pill.start();
    countdown.start();
  }

  updateScore(x) {
    if (x === 10) {
      this.score += 10;
    }
    if (x === 100) {
      this.score += 100;
      this.eatGhostScore += 100;
    }
    this.addLives();
    ui.drawScore();
  }

  loseLives() {
    this.lives--;
    ui.drawLives();
  }

  addLives() {
    if (this.lives !== 3 && this.score >= 10000 && !("10000_POINTS_LIFE" in this.extrapacs)) {
      soundPlayer("extrapac", "play");
      this.lives += 1;
      this.extrapacs["10000_POINTS_LIFE"] = true;
      ui.drawLives();
    } else {
      return;
    }
  }

  saveScore() {
    if (this.score > AjaxScore.userdata[AjaxScore.username] && this.cheats === false) {
      AjaxScore.storeInfo();
    } else if (this.score < AjaxScore.userdata[AjaxScore.username] && this.cheats === false) {
      return;
    }
  }
}

class Countdown {
  constructor() {
    this.counter = 3;
    this.timer = null;
  }

  count() {
    if (this.counter === 0) {
      clearInterval(this.timer);
      canvasCleaner("bg");

      this.counter = 3;
      this.timer = null;

      game.playGameTimer = game.playGame();

    } else {
      this.draw(this.counter);
      this.counter--;
    }
  }

  start() {
    soundPlayer("intro", "play");

    this.count();
    this.timer = setInterval(this.count.bind(this), 1000);
  }

  stop() {
    clearInterval(this.timer);
    this.timer = null;
    this.counter = 3;
  }

  draw(i) {
    canvasCleaner("bg");
    ctxBG.fillStyle = "rgb(250, 240, 98)";
    ctxBG.beginPath();
    ctxBG.font = blockWidth * 3 + "px" + " " + "Squada One";
    ctxBG.fillText(i, blockWidth * 13.5, blockHeight * 15);
    ctxBG.closePath();
  }
}

class LevelMessage {
  constructor() {
    this.counter = 0;
    this.timer = null;
  }

  start() {
    this.draw();
    this.timer = setInterval(this.draw.bind(this), 500);
  }

  draw() {
    const colors = [
      "rgb(250, 240, 98)",
      "rgb(236, 54, 139)",
      "rgb(138, 255, 239)",
      "rgb(134, 255, 110)",
    ];

    if (this.counter === 4) {
      clearInterval(this.timer);
      this.counter = 0;
      this.timer = null;
      return;
    }

    canvasCleaner("bg");
    ctxBG.fillStyle = colors[this.counter];
    ctxBG.beginPath();
    ctxBG.font = blockHeight * 1.5 + "px" + " " +  "Squada One";
    ctxBG.fillText("LEVEL", blockWidth * 12.5, blockHeight * 14);
    ctxBG.closePath();

    ctxBG.fillStyle = colors[this.counter];
    ctxBG.beginPath();
    ctxBG.font = blockHeight * 1.5 + "px" + " " +  "Squada One";
    ctxBG.fillText("PASSED", blockWidth * 12, blockHeight * 16);
    ctxBG.closePath();

    this.counter++;
  }
}

class Interface {
  constructor() {
    this.fontSize = blockHeight - blockHeight / 10 + "px";
    this.fontStyle = "Audiowide";
    this.color = "rgb(250, 240, 98)";
  }

  draw() {
    const scoreText = {x: blockWidth / 2, y: blockHeight * 32};
    const livesText = {x: blockWidth * 20, y: blockHeight * 32};

    ctx_ui.fillStyle = this.color;
    ctx_ui.font = this.fontSize + " " + this.fontStyle;
    ctx_ui.fillText("SCORE: ", scoreText.x, scoreText.y);

    ctx_ui.fillStyle = this.color;
    ctx_ui.font = this.fontSize + " " + this.fontStyle;
    ctx_ui.fillText("LIVES: ", livesText.x, livesText.y);
  }

  drawScore() {
    canvasCleaner("score");

    const scoreCountText = {x: blockWidth / 2 + blockWidth * 4, y: blockHeight * 32};

    ctx_score.fillStyle = this.color;
    ctx_score.font = this.fontSize + " " + this.fontStyle;
    ctx_score.fillText(game.score, scoreCountText.x, scoreCountText.y);
  }

  drawLives() {
    canvasCleaner("ui");
    this.draw();

    const pacs = {cx: blockWidth * 24.5, cy: blockHeight * 32 - blockHeight / 2.5, r: blockWidth / 2, a1: 0.2 * Math.PI, a2: 1.8 * Math.PI};

    for (let i = 0; i < game.lives; i++) {
      ctx_ui.fillStyle = this.color;
      ctx_ui.beginPath();
      ctx_ui.arc(
        pacs.cx + blockWidth * i,
        pacs.cy,
        pacs.r,
        pacs.a1,
        pacs.a2
      );
      ctx_ui.lineTo(pacs.cx + blockWidth * i, pacs.cy);
      ctx_ui.closePath();
      ctx_ui.fill();
    }
  }

  drawDefaultScore() {
    canvasCleaner("score");

    const coords = {FSx: blockWidth / 2, FSy: blockHeight * 31, BSx: blockWidth * 17, BSy: blockHeight * 31};
  
    const colorFS = "rgb(101, 255, 101)";
    const colorBS = "rgb(77, 226, 252)";
    const fontSize = blockWidth - blockWidth / 12 + "px";
    const fontStyle = "Audiowide";
  
    ctx_score.fillStyle = colorFS; 
    ctx_score.font = fontSize + " " + fontStyle;
    ctx_score.fillText("FINAL SCORE: " + game.score, coords.FSx, coords.FSy);

    ctx_score.fillStyle = colorBS; 
    ctx_score.font = fontSize + " " + fontStyle;
    ctx_score.fillText("BEST SCORE: 0", coords.BSx, coords.BSy);

  }

  drawFinalScore() {
    canvasCleaner("score");

    const coords = {FSx: blockWidth / 2, FSy: blockHeight * 31, BSx: blockWidth * 17, BSy: blockHeight * 31};
  
    const colorFS = "rgb(101, 255, 101)";
    const colorBS = "rgb(77, 226, 252)";
    const fontSize = blockWidth - blockWidth / 12 + "px";
    const fontStyle = "Audiowide";
  
    ctx_score.fillStyle = colorFS; 
    ctx_score.font = fontSize + " " + fontStyle;
    ctx_score.fillText("FINAL SCORE: " + game.score, coords.FSx, coords.FSy);
  
    if (game.score >= game.bestScore) {
      ctx_score.fillStyle = colorBS; 
      ctx_score.font = fontSize + " " + fontStyle;
      ctx_score.fillText("BEST SCORE: " + game.score, coords.BSx, coords.BSy);

    } else if (game.score < game.bestScore) {
      ctx_score.fillStyle = colorBS; 
      ctx_score.font = fontSize + " " + fontStyle;
      ctx_score.fillText("BEST SCORE: " + game.bestScore, coords.BSx, coords.BSy);
    } 
  }

  drawFinalScoreAjax() {
    canvasCleaner("score");

    const coords = {FSx: blockWidth / 2, FSy: blockHeight * 31, BSx: blockWidth * 17, BSy: blockHeight * 31};
  
    const colorFS = "rgb(101, 255, 101)";
    const colorBS = "rgb(77, 226, 252)";
    const fontSize = blockWidth - blockWidth / 12 + "px";
    const fontStyle = "Audiowide";
  
    ctx_score.fillStyle = colorFS; 
    ctx_score.font = fontSize + " " + fontStyle;
    ctx_score.fillText("FINAL SCORE: " + game.score, coords.FSx, coords.FSy);
  
    if (game.score >= AjaxScore.userdata[AjaxScore.username]) {
      ctx_score.fillStyle = colorBS; 
      ctx_score.font = fontSize + " " + fontStyle;
      ctx_score.fillText("BEST SCORE: " + game.score, coords.BSx, coords.BSy);

    } else if (game.score < AjaxScore.userdata[AjaxScore.username]) {
      ctx_score.fillStyle = colorBS; 
      ctx_score.font = fontSize + " " + fontStyle;
      ctx_score.fillText("BEST SCORE: " + AjaxScore.userdata[AjaxScore.username], coords.BSx, coords.BSy);
    } 
  }
}

class Reset {
  constructor() {}

  difficultyLVL1() {
    pacman.x = pacmanLVL1.x;
    pacman.y = pacmanLVL1.y;
    pacman.speed = pacmanLVL1.speed;

    winkyGhost.x = winky.x;
    winkyGhost.y = winky.y;
    clearInterval(winkyGhost.randomizer);
    winkyGhost.randomizer = null;
    winkyGhost.speedOriginal = winky.speedOriginal;

    inkyGhost.x = inky.x;
    inkyGhost.y = inky.y;
    clearInterval(inkyGhost.randomizer);
    inkyGhost.randomizer = null;
    inkyGhost.speedOriginal = inky.speedOriginal;

    pinkyGhost.x = pinky.x;
    pinkyGhost.y = pinky.y;
    clearInterval(pinkyGhost.randomizer);
    pinkyGhost.randomizer = null;
    pinkyGhost.speedOriginal = pinky.speedOriginal;

    slinkyGhost.x = slinky.x;
    slinkyGhost.y = slinky.y;
    clearInterval(slinkyGhost.randomizer);
    slinkyGhost.randomizer = null;
    slinkyGhost.speedOriginal = slinky.speedOriginal;
  }

  difficultyLVL2() {
    pacman.x = pacmanLVL2.x;
    pacman.y = pacmanLVL2.y;
    pacman.speed = pacmanLVL2.speed;

    winkyGhost.x = winkyLVL2.x;
    winkyGhost.y = winkyLVL2.y;
    clearInterval(winkyGhost.randomizer);
    winkyGhost.randomizer = null;
    winkyGhost.speedOriginal = winkyLVL2.speedOriginal;

    inkyGhost.x = inkyLVL2.x;
    inkyGhost.y = inkyLVL2.y;
    clearInterval(inkyGhost.randomizer);
    inkyGhost.randomizer = null;
    inkyGhost.speedOriginal = inkyLVL2.speedOriginal;

    pinkyGhost.x = pinkyLVL2.x;
    pinkyGhost.y = pinkyLVL2.y;
    clearInterval(pinkyGhost.randomizer);
    pinkyGhost.randomizer = null;
    pinkyGhost.speedOriginal = pinkyLVL2.speedOriginal;

    slinkyGhost.x = slinkyLVL2.x;
    slinkyGhost.y = slinkyLVL2.y;
    clearInterval(slinkyGhost.randomizer);
    slinkyGhost.randomizer = null;
    slinkyGhost.speedOriginal = slinkyLVL2.speedOriginal;
  }

  difficultyLVL3() {
    pacman.x = pacmanLVL3.x;
    pacman.y = pacmanLVL3.y;
    pacman.speed = pacmanLVL3.speed;

    winkyGhost.x = winkyLVL3.x;
    winkyGhost.y = winkyLVL3.y;
    clearInterval(winkyGhost.randomizer);
    winkyGhost.randomizer = null;
    winkyGhost.speedOriginal = winkyLVL3.speedOriginal;

    inkyGhost.x = inkyLVL3.x;
    inkyGhost.y = inkyLVL3.y;
    clearInterval(inkyGhost.randomizer);
    inkyGhost.randomizer = null;
    inkyGhost.speedOriginal = inkyLVL3.speedOriginal;

    pinkyGhost.x = pinkyLVL3.x;
    pinkyGhost.y = pinkyLVL3.y;
    clearInterval(pinkyGhost.randomizer);
    pinkyGhost.randomizer = null;
    pinkyGhost.speedOriginal = pinkyLVL3.speedOriginal;

    slinkyGhost.x = slinkyLVL3.x;
    slinkyGhost.y = slinkyLVL3.y;
    clearInterval(slinkyGhost.randomizer);
    slinkyGhost.randomizer = null;
    slinkyGhost.speedOriginal = slinkyLVL3.speedOriginal;
  }

  difficultyLVL4() {
    pacman.x = pacmanLVL4.x;
    pacman.y = pacmanLVL4.y;
    pacman.speed = pacmanLVL4.speed;

    winkyGhost.x = winkyLVL4.x;
    winkyGhost.y = winkyLVL4.y;
    clearInterval(winkyGhost.randomizer);
    winkyGhost.randomizer = null;
    winkyGhost.speedOriginal = winkyLVL4.speedOriginal;

    inkyGhost.x = inkyLVL4.x;
    inkyGhost.y = inkyLVL4.y;
    clearInterval(inkyGhost.randomizer);
    inkyGhost.randomizer = null;
    inkyGhost.speedOriginal = inkyLVL4.speedOriginal;

    pinkyGhost.x = pinkyLVL4.x;
    pinkyGhost.y = pinkyLVL4.y;
    clearInterval(pinkyGhost.randomizer);
    pinkyGhost.randomizer = null;
    pinkyGhost.speedOriginal = pinkyLVL4.speedOriginal;

    slinkyGhost.x = slinkyLVL4.x;
    slinkyGhost.y = slinkyLVL4.y;
    clearInterval(slinkyGhost.randomizer);
    slinkyGhost.randomizer = null;
    slinkyGhost.speedOriginal = slinkyLVL4.speedOriginal;
  }

  difficultyLVL5() {
    pacman.x = pacmanLVL5.x;
    pacman.y = pacmanLVL5.y;
    pacman.speed = pacmanLVL5.speed;

    winkyGhost.x = winkyLVL5.x;
    winkyGhost.y = winkyLVL5.y;
    clearInterval(winkyGhost.randomizer);
    winkyGhost.randomizer = null;
    winkyGhost.speedOriginal = winkyLVL5.speedOriginal;

    inkyGhost.x = inkyLVL5.x;
    inkyGhost.y = inkyLVL5.y;
    clearInterval(inkyGhost.randomizer);
    inkyGhost.randomizer = null;
    inkyGhost.speedOriginal = inkyLVL5.speedOriginal;

    pinkyGhost.x = pinkyLVL5.x;
    pinkyGhost.y = pinkyLVL5.y;
    clearInterval(pinkyGhost.randomizer);
    pinkyGhost.randomizer = null;
    pinkyGhost.speedOriginal = pinkyLVL5.speedOriginal;

    slinkyGhost.x = slinkyLVL5.x;
    slinkyGhost.y = slinkyLVL5.y;
    clearInterval(slinkyGhost.randomizer);
    slinkyGhost.randomizer = null;
    slinkyGhost.speedOriginal = slinkyLVL5.speedOriginal;
  }

  mazeLVL(x) {
    switch (x) {
      case 2:
        mazeMap = LEVEL_2_MAP;
        maze.color = maze.colorLVL2;
        break;
      case 3:
        mazeMap = LEVEL_3_MAP;
        maze.color = maze.colorLVL3;
        break;
      case 4:
        mazeMap = LEVEL_4_MAP;
        maze.color = maze.colorLVL4;
        break;
      case 5:
        mazeMap = LEVEL_5_MAP;
        maze.color = maze.colorLVL5;
        break;
      default:
        break;
    }
  }

  score() {
    game.score = 0;
    game.eatGhostScore = 0;
  }

  lives() {
    game.lives = 3;
    game.extrapacs = {};
  }

  level() {
    mazeMap = LEVEL_1_MAP;
    maze.color = maze.colorLVL1;
    game.level = 1;
  }

  mazedata() {
    walldata = [];
    pilldata = [];
    fooddata = [];
  }

  ghostMechs() {
    winkyGhost.stopFlee();
    inkyGhost.stopFlee();
    pinkyGhost.stopFlee();
    slinkyGhost.stopFlee();

    winkyGhost.eaten = false;
    inkyGhost.eaten = false;
    pinkyGhost.eaten = false;
    slinkyGhost.eaten = false;

    pacman.immunity = false;
  }
}

const ui = new Interface();
const game = new Game();
const resetter = new Reset();
const countdown = new Countdown(); // Displays and manages the countdown before the game starts or before new level starts.
const levelMessage = new LevelMessage(); // Displays the level complete message



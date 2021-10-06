class AnimatedFood {
  constructor(step) {
    this.x = 0 + step;
    this.y = cvsHeight / 2;
    this.speed = blockWidth / 5;
    this.color = "rgb(201, 201, 201)";
    this.radius = blockWidth / 2;
  }

  animate() {
    if (this.x > cvsWidth - blockWidth * 8) {
      this.x = 0;
    }
    this.x += this.speed;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fill();
  }
}

const AnimatedFoodArr = [
  new AnimatedFood(0),
  new AnimatedFood(blockWidth * 2),
  new AnimatedFood(blockWidth * 4),
  new AnimatedFood(blockWidth * 6),
  new AnimatedFood(blockWidth * 8),
  new AnimatedFood(blockWidth * 10),
  new AnimatedFood(blockWidth * 12),
  new AnimatedFood(blockWidth * 14),
  new AnimatedFood(blockWidth * 16),
  new AnimatedFood(blockWidth * 18),
];

class Victory {
  constructor() {
    this.color = "rgb(255, 255, 0)";
    this.eyeColor = "#000";
    this.percent = 100;
    this.step = -10;
    this.timer = null;
  }

  draw() {
    canvasCleaner("main");
    const f = this.calculate((this.percent += this.step));

    const cx = cvsWidth - blockWidth * 5;
    const cy = cvsHeight / 2;
    const r = blockWidth * 5;
    const a1 = f * 0.3 * Math.PI;
    const a2 = (2 - f * 0.3) * Math.PI;
  
    ctx.fillStyle = this.color;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate((180 * Math.PI) / 180);
    ctx.translate(-cx, -cy);
    ctx.beginPath();
    ctx.arc(cx, cy, r, a1, a2);
    ctx.lineTo(cx, cy);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  
    const eyeAngle = Math.PI * (0.3 + f * 0.2);
    const eyeX = r * 0.6 * Math.cos(eyeAngle);
    const eyeY = r * 0.6 * Math.sin(eyeAngle);
  
    ctx.fillStyle = this.eyeColor;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate((180 * Math.PI) / 180);
    ctx.translate(-cx, -cy);
    ctx.beginPath();
    ctx.arc(cx + eyeX, cy + eyeY, r * 0.15, 0, 2 * Math.PI);
    ctx.fill();
    ctx.restore();

    for (let foodie of AnimatedFoodArr) {
      foodie.animate();
    }
    this.timer = requestAnimationFrame(this.draw.bind(this));
  }

  calculate(p) {
    const f = p / 100;
    if (this.percent % 100 === 0) {
      this.step = -this.step;
    }
    return f;
  }

  start() {
    soundPlayer("win", "play");

    game.deleteGame();
    game.on = false;

    activateGameController(0);

    if (game.cheats === false && AjaxScore.username !== null) {
      AjaxScore.restoreInfo("FinalScore");
    } else if (game.cheats === false && AjaxScore.username === null) {
      if (game.score > game.bestScore) {
        game.bestScore = game.score;
      }
      ui.drawFinalScore();
    } else if (game.cheats === true){
      ui.drawDefaultScore();
    }

    MainMenu.newgame.style.display = "block";

    this.timer = this.draw();
  }
}

const winner = new Victory();


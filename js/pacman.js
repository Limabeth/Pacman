class Pac {
  constructor() {
    this.immunity = false; /* Set to true when the eaten ghost is in flee mode to prevent it from eating pacman as soon as its flee timer ends and it's next to pacman. Currently does not work. */
    this.cheat_immunity = false;

    this.x = pacmanLVL1.x;
    this.y = pacmanLVL1.y;

    this.direction = undefined; // New direction when user presses a key.
    this.cd = undefined; // Current moving direction.

    this.speed = pacmanLVL1.speed;

    this.mouthAngle = -10; /* Substracted from this.percentOpen to calculate how open pacman's mouth should be during each animation phase. Can be bigger to speed up the animation. */
    this.percentOpen = 100; // Mouth open in %. 100% - fully open. 0% - fully closed.

    this.r = blockWidth * 0.50;
    this.color = "rgb(255, 255, 0)";

    this.safeSpace = blockWidth / 2; // If the distance between pacman and a ghost is less than this value, pacman dies.
  }

  draw(dir) {
    let floatOpen = this.calculate((this.percentOpen += this.mouthAngle));

    let cx = this.x;
    let cy = this.y;
    let r = this.r;
    let a1 = floatOpen * 0.3 * Math.PI;
    let a2 = (2 - floatOpen * 0.3) * Math.PI;

    ctx.fillStyle = this.color;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate((dir * Math.PI) / 180);
    ctx.translate(-cx, -cy);
    ctx.beginPath();
    ctx.arc(cx, cy, r, a1, a2);
    ctx.lineTo(cx, cy);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    let eyeAngle = Math.PI * (0.3 + floatOpen * 0.2);
    let eyeX = r * 0.6 * Math.cos(eyeAngle);
    let eyeY = r * 0.6 * Math.sin(eyeAngle);

    if (dir === 180) {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate((dir * Math.PI) / 180);
      ctx.translate(-cx, -cy);
      ctx.beginPath();
      ctx.arc(cx + eyeX, cy + eyeY, r * 0.15, 0, 2 * Math.PI);
      ctx.fillStyle = "#000";
      ctx.fill();
      ctx.restore();
    } else {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate((dir * Math.PI) / 180);
      ctx.translate(-cx, -cy);
      ctx.beginPath();
      ctx.arc(cx + eyeX, cy - eyeY, r * 0.15, 0, 2 * Math.PI);
      ctx.fillStyle = "#000";
      ctx.fill();
      ctx.restore();
    }
  }

  animate() {
    let collision = undefined;

    switch (this.cd) {
      case "left":
        collision = collisionWithWallPacman(this.cd);
        if (collision.check === false) {
          this.left();
        } else if (collision.check === true) {
          this.x = collision.x;
          this.draw(180);
        } else if (collision.check === "TP") {
          this.teleport("left");
        }
        break;
      case "right":
        collision = collisionWithWallPacman(this.cd);
        if (collision.check === false) {
          this.right();
        } else if (collision.check === true) {
          this.x = collision.x;
          this.draw(0);
        } else if (collision.check === "TP") {
          this.teleport("right");
        }
        break;
      case "up":
        collision = collisionWithWallPacman(this.cd);
        if (collision.check === false) {
          this.up();
        } else if (collision.check === true) {
          this.y = collision.y;
          this.draw(270);
        }
        break;
      case "down":
        collision = collisionWithWallPacman(this.cd);
        if (collision.check === false) {
          this.down();
        } else if (collision.check === true) {
          this.y = collision.y;
          this.draw(90);
        }
        break;
      case undefined:
        this.draw(180);
        break;
      default:
        break;
    }

    switch (this.direction) {
      case "up":
        collision = collisionWithWallPacman(this.direction);
        if (
          collision.check === false &&
          (this.cd === "left" || this.cd === "right")
        ) {
          this.adjustCoords("x");
          this.cd = this.direction;
        } else if (collision.check === false && this.cd === undefined) {
          this.cd = this.direction;
        } else if (collision.check === false) {
          this.cd = this.direction;
        }
        break;

      case "down":
        collision = collisionWithWallPacman(this.direction);
        if (
          collision.check === false &&
          (this.cd === "left" || this.cd === "right")
        ) {
          this.adjustCoords("x");
          this.cd = this.direction;
        } else if (collision.check === false && this.cd === undefined) {
          this.cd = this.direction;
        } else if (collision.check === false) {
          this.cd = this.direction;
        }
        break;

      case "left":
        collision = collisionWithWallPacman(this.direction);
        if (
          collision.check === false &&
          (this.cd === "up" || this.cd === "down")
        ) {
          this.adjustCoords("y");
          this.cd = this.direction;
        } else if (collision.check === false && this.cd === undefined) {
          this.cd = this.direction;
        } else if (collision.check === false) {
          this.cd = this.direction;
        } else if (
          collision.check === "TP" &&
          (this.cd === "up" || this.cd === "down")
        ) {
          this.adjustCoords("y");
          this.cd = this.direction;
          this.teleport("left");
        }
        break;

      case "right":
        collision = collisionWithWallPacman(this.direction);
        if (
          collision.check === false &&
          (this.cd === "up" || this.cd === "down")
        ) {
          this.adjustCoords("y");
          this.cd = this.direction;
        } else if (collision.check === false && this.cd === undefined) {
          this.cd = this.direction;
        } else if (collision.check === false) {
          this.cd = this.direction;
        } else if (
          collision.check === "TP" &&
          (this.cd === "up" || this.cd === "down")
        ) {
          this.adjustCoords("y");
          this.cd = this.direction;
          this.teleport("right");
        }
        break;
      default:
        break;
    }
  }

  adjustCoords(axis) {
    if (axis === "x") {
      if (this.cd === "left") {
        this.x = Math.floor(this.x / 10) * 10;
        if (collisionWithWallPacman(this.direction).check === true) {
          this.x += blockWidth / 2;
        }
      } else if (this.cd === "right") {
        this.x = Math.ceil(this.x / 10) * 10;
        if (collisionWithWallPacman(this.direction).check === true) {
          this.x -= blockWidth / 2;
        }
      }
    } else if (axis === "y") {
      if (this.cd === "up") {
        this.y = Math.floor(this.y / 10) * 10;
        if (collisionWithWallPacman(this.direction).check === true) {
          this.y += blockWidth / 2;
        }
      } else if (this.cd === "down") {
        this.y = Math.ceil(this.y / 10) * 10;
        if (collisionWithWallPacman(this.direction).check === true) {
          this.y -= blockWidth / 2;
        }
      }
    }
  }

  teleport(dir) {
    switch (dir) {
      case "up":
        this.y = cvsHeight - blockHeight;
        break;
      case "down":
        this.y = blockHeight;
        break;
      case "right":
        this.x = blockWidth;
        break;
      case "left":
        this.x = cvsWidth - blockWidth;
        break;
      default:
        break;
    }
  }

  right() {
    this.x += this.speed;
    this.draw(0);
  }

  left() {
    this.x -= this.speed;
    this.draw(180);
  }

  up() {
    this.y -= this.speed;
    this.draw(270);
  }

  down() {
    this.y += this.speed;
    this.draw(90);
  }

  calculate(p) {
    let f = p / 100;
    if (this.percentOpen % 100 === 0) {
      this.mouthAngle = -this.mouthAngle;
    }
    return f;
  }
}

class Die {
  constructor() {
    this.rotate = null;
    this.a1 = 0.7 * Math.PI;
    this.a2 = 0.2 * Math.PI;
    this.step = 0.1 * Math.PI;
    this.angle = this.a1;
    this.timer = null;
  }

  animate() {
    this.angle += this.step;

    if (this.angle - this.a2 >= 2 * Math.PI && game.lives >= 1) {
      this.normalDeath();
      return;
    } else if (this.angle - this.a2 >= 2 * Math.PI && game.lives === 0) {
      this.finalDeath();
    } else {
      this.draw();
    }
  }

  normalDeath() {
    canvasCleaner("main");
    clearInterval(this.timer);

    resetter.ghostMechs();

    switch (game.level) {
      case 1:
        resetter.difficultyLVL1();
        break;
      case 2:
        resetter.difficultyLVL2();
        break;
      case 3:
        resetter.difficultyLVL3();
        break;
      case 4:
        resetter.difficultyLVL4();
        break;
      case 5:
        resetter.difficultyLVL5();
        break;
      default:
        break;
    }

    this.timer = null;
    this.rotate = null;
    this.angle = this.a1;

    game.loseLives();

    countdown.start();
  }

  finalDeath() {
    canvasCleaner("main");
    clearInterval(this.timer);

    this.timer = null;
    this.rotate = null;
    this.angle = this.a1;

    canvasCleaner("all");

    pill.stop();

    loser.start();
  }

  getDirection() {
    switch (pacman.cd) {
      case "left":
        this.rotate = 90;
        break;
      case "right":
        this.rotate = 270;
        break;
      case "up":
        this.rotate = 180;
        break;
      case "down":
        this.rotate = 0;
        break;
      default:
        break;
    }
  }

  draw() {
    if (this.rotate === null) {
      this.getDirection();
    }

    canvasCleaner("main");
    ctx.fillStyle = pacman.color;
    ctx.save();
    ctx.translate(pacman.x, pacman.y);
    ctx.rotate((this.rotate * Math.PI) / 180);
    ctx.translate(-pacman.x, -pacman.y);
    ctx.beginPath();
    ctx.arc(pacman.x, pacman.y, pacman.r, this.angle, this.a2);
    ctx.lineTo(pacman.x, pacman.y);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  start() {
    soundPlayer("death", "play")

    try {
      window.navigator.vibrate(200);
      } catch (error) {
        console.error(error);
      }
      
    this.timer = setInterval(this.animate.bind(this), 100);
  }
}

const pacmanLVL1 = {x: blockWidth * 14, y: blockHeight * 23.5, speed: blockWidth / 10 + blockWidth / 20}; // speed = 3
const pacmanLVL2 = {x: blockWidth * 14, y: blockHeight * 26.5, speed: blockWidth / 6.25}; // speed = 3.2
const pacmanLVL3 = {x: blockWidth * 14, y: blockHeight * 26.5, speed: blockWidth / 6.25 + blockWidth / 100}; // speed = 3.4
const pacmanLVL4 = {x: blockWidth * 14, y: blockHeight * 23.5, speed: blockWidth / 5 - blockWidth / 50}; // speed = 3.6 
const pacmanLVL5 = {x: blockWidth * 14, y: blockHeight * 23.5, speed: blockWidth / 5 - blockWidth / 100}; // speed = 3.8

const pacman = new Pac();
const death = new Die();
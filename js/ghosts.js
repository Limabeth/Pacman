class Ghost {
  constructor(x, y, so, sc, co, cs) {
    this.direction = undefined; // Current direction
    this.newDirection = undefined; // New direction when the ghost hits a wall or when a new direction is randomly selected
    this.x = x;
    this.y = y;

    this.speedOriginal = so;
    this.speed = this.speedOriginal;
    this.speedPanic = sc;
    this.speedFlee = blockWidth / 5;

    // Ghost animation. Ignore. Should fix later.
    this.line_1_p1 = ((blockWidth * 0.6) / 3) * 2;
    this.line_1_p2 = blockWidth / 4;
    this.line_1_px = ((blockWidth * 0.6) / 3) * 2;

    this.line_2_p1 = ((blockWidth * 0.6) / 3) * 1;
    this.line_2_px = ((blockWidth * 0.6) / 3) * 1;

    this.line_1_step = blockWidth / 100;
    this.line_2_step = blockWidth / 100;

    this.line_4_p1 = ((blockWidth * 0.6) / 3) * 1;
    this.line_4_px = ((blockWidth * 0.6) / 3) * 1;

    this.line_5_p1 = ((blockWidth * 0.6) / 3) * 2;
    this.line_5_p2 = blockWidth / 4;
    this.line_5_px = ((blockWidth * 0.6) / 3) * 2;

    this.line_4_step = blockWidth / 100;
    this.line_5_step = blockWidth / 100;
    // End of ghost animation variables

    this.colorOriginal = co;
    this.color = this.colorOriginal;

    this.colorPanic = cs;
    this.colorPanicEnd = "rgba(255, 255, 255, 0.904)"; // So-called alert when panic mode is about to end, i.e. ghost flashes white

    this.colorFlee = "rgb(82, 82, 82)";

    this.eyeRadius = blockWidth / 5.5;
    this.irisRadius = blockWidth / 12;

    this.randomizer = null; // Timer to get random direction every X ms
    this.fleeTimer = null;
    this.fleeCounter = 0;

    this.eaten = false;
    this.panic = false;
  }

  animate() {
    if (this.randomizer === null) {
      this.timer();
    }

    let collision;

    switch (this.direction) {
      case "left":
        collision = collisionWithWallGhost(this.direction, this.x, this.y);
        if (collision.check === false) {
          this.move(this.direction);
        } else if (collision.check === "TP") {
          this.teleport("left");
        } else if (collision.check === true) {
          do {
            this.newDirection = this.getRandomDirection(2);
          } while (
            collisionWithWallGhost(this.newDirection, this.x, this.y).check ===
            true
          );
          this.x = collision.x;
          this.move(this.newDirection);
        }
        break;

      case "right":
        collision = collisionWithWallGhost(this.direction, this.x, this.y);
        if (collision.check === false) {
          this.move(this.direction);
        } else if (collision.check === "TP") {
          this.teleport("right");
        } else if (collision.check === true) {
          do {
            this.newDirection = this.getRandomDirection(2);
          } while (
            collisionWithWallGhost(this.newDirection, this.x, this.y).check ===
            true
          );
          this.x = collision.x;
          this.move(this.newDirection);
        }
        break;

      case "up":
        collision = collisionWithWallGhost(this.direction, this.x, this.y);
        if (collision.check === false) {
          this.move(this.direction);
        } else if (collision.check === true) {
          do {
            this.newDirection = this.getRandomDirection(1);
          } while (
            collisionWithWallGhost(this.newDirection, this.x, this.y).check ===
            true
          );
          this.y = collision.y;
          this.move(this.newDirection);
        }
        break;

      case "down":
        collision = collisionWithWallGhost(this.direction, this.x, this.y);
        if (collision.check === false) {
          this.move(this.direction);
        } else if (collision.check === true) {
          do {
            this.newDirection = this.getRandomDirection(1);
          } while (
            collisionWithWallGhost(this.newDirection, this.x, this.y).check ===
            true
          );
          this.y = collision.y;
          this.move(this.newDirection);
        }
        break;

      case undefined:
        do {
          this.newDirection = this.getRandomDirection(3);
        } while (
          collisionWithWallGhost(this.newDirection, this.x, this.y).check ===
          true
        );
        this.move(this.newDirection);

      default:
        break;
    }

    switch (this.newDirection) {
      case "left":
        collision = collisionWithWallGhost(this.newDirection, this.x, this.y);
        if (collision.check === false && this.direction !== "left") {
          this.adjustCoords("y");
          this.move(this.newDirection);
        } else if (collision.check === "TP") {
          this.adjustCoords("y");
          this.direction = this.newDirection;
          this.teleport("left");
        }
        break;

      case "right":
        collision = collisionWithWallGhost(this.newDirection, this.x, this.y);
        if (collision.check === false && this.direction !== "right") {
          this.adjustCoords("y");
          this.move(this.newDirection);
        } else if (collision.check === "TP") {
          this.adjustCoords("y");
          this.direction = this.newDirection;
          this.teleport("right");
        }
        break;

      case "up":
        collision = collisionWithWallGhost(this.newDirection, this.x, this.y);
        if (collision.check === false && this.direction !== "up") {
          this.adjustCoords("x");
          this.move(this.newDirection);
        }
        break;

      case "down":
        collision = collisionWithWallGhost(this.newDirection, this.x, this.y);
        if (collision.check === false && this.direction !== "down") {
          this.adjustCoords("x");
          this.move(this.newDirection);
        }
        break;
      case undefined:
        this.newDirection = this.getRandomDirection(3);

      default:
        break;
    }
  }

  move(dir) {
    if (dir === "up") {
      this.y -= this.speed;
      this.direction = dir;
      this.draw(dir);
    } else if (dir === "down") {
      this.y += this.speed;
      this.direction = dir;
      this.draw(dir);
    } else if (dir === "left") {
      this.x -= this.speed;
      this.direction = dir;
      this.draw(dir);
    } else if (dir === "right") {
      this.x += this.speed;
      this.direction = dir;
      this.draw(dir);
    }
  }

  adjustCoords(axis) {
    if (axis === "x") {
      if (this.direction === "left") {
        this.x = Math.floor(this.x / 10) * 10;
        if (
          collisionWithWallGhost(this.newDirection, this.x, this.y).check ===
          true
        ) {
          this.x += blockWidth / 2;
        }
      } else if (this.direction === "right") {
        this.x = Math.ceil(this.x / 10) * 10;
        if (
          collisionWithWallGhost(this.newDirection, this.x, this.y).check ===
          true
        ) {
          this.x -= blockWidth / 2;
        }
      }
    } else if (axis === "y") {
      if (this.direction === "up") {
        this.y = Math.floor(this.y / 10) * 10;
        if (
          collisionWithWallGhost(this.newDirection, this.x, this.y).check ===
          true
        ) {
          this.y += blockWidth / 2;
        }
      } else if (this.direction === "down") {
        this.y = Math.ceil(this.y / 10) * 10;
        if (
          collisionWithWallGhost(this.newDirection, this.x, this.y).check ===
          true
        ) {
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

  draw(dir) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.moveTo(this.x - blockWidth * 0.6, this.y + blockHeight * 0.7);
    ctx.quadraticCurveTo(
      this.x - blockWidth * 0.6,
      this.y - blockHeight * 0.6,
      this.x,
      this.y - blockHeight * 0.6
    );
    ctx.quadraticCurveTo(
      this.x + blockWidth * 0.6,
      this.y - blockHeight * 0.6,
      this.x + blockWidth * 0.6,
      this.y + blockHeight * 0.7
    );
    ctx.lineTo(
      this.x + (this.line_1_px -= this.line_1_step),
      this.y + blockHeight * 0.4
    );
    ctx.lineTo(
      this.x + (this.line_2_px -= this.line_2_step),
      this.y + blockHeight * 0.75
    );
    ctx.lineTo(this.x, this.y + blockHeight * 0.4);
    ctx.lineTo(
      this.x - (this.line_4_px -= this.line_4_step),
      this.y + blockHeight * 0.75
    );
    ctx.lineTo(
      this.x - (this.line_5_px -= this.line_5_step),
      this.y + blockHeight * 0.4
    );
    ctx.lineTo(
      this.x - ((blockWidth * 0.6) / 3) * 3,
      this.y + blockHeight * 0.7
    );
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(
      this.x - blockWidth / 4,
      this.y - blockHeight / 6,
      this.eyeRadius,
      0,
      2 * Math.PI
    );
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(
      this.x + blockWidth / 4,
      this.y - blockHeight / 6,
      this.eyeRadius,
      0,
      2 * Math.PI
    );
    ctx.closePath();
    ctx.fill();

    if (dir === "up") {
      ctx.fillStyle = "black";
      ctx.beginPath();
      ctx.arc(
        this.x + blockWidth / 4,
        this.y - blockHeight / 4,
        this.irisRadius,
        0,
        2 * Math.PI
      );
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = "black";
      ctx.beginPath();
      ctx.arc(
        this.x - blockWidth / 4,
        this.y - blockHeight / 4,
        this.irisRadius,
        0,
        2 * Math.PI
      );
      ctx.closePath();
      ctx.fill();
    } else if (dir === "down") {
      ctx.fillStyle = "black";
      ctx.beginPath();
      ctx.arc(
        this.x + blockWidth / 4,
        this.y - blockHeight / 8.5,
        this.irisRadius,
        0,
        2 * Math.PI
      );
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = "black";
      ctx.beginPath();
      ctx.arc(
        this.x - blockWidth / 4,
        this.y - blockHeight / 8.5,
        this.irisRadius,
        0,
        2 * Math.PI
      );
      ctx.closePath();
      ctx.fill();
    } else if (dir === "right") {
      ctx.fillStyle = "black";
      ctx.beginPath();
      ctx.arc(
        this.x + blockWidth / 3,
        this.y - blockHeight / 6,
        this.irisRadius,
        0,
        2 * Math.PI
      );
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = "black";
      ctx.beginPath();
      ctx.arc(
        this.x - blockWidth / 5,
        this.y - blockHeight / 6,
        this.irisRadius,
        0,
        2 * Math.PI
      );
      ctx.closePath();
      ctx.fill();
    } else if (dir === "left") {
      ctx.fillStyle = "black";
      ctx.beginPath();
      ctx.arc(
        this.x + blockWidth / 5,
        this.y - blockHeight / 5,
        this.irisRadius,
        0,
        2 * Math.PI
      );
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = "black";
      ctx.beginPath();
      ctx.arc(
        this.x - blockWidth / 3,
        this.y - blockHeight / 5,
        this.irisRadius,
        0,
        2 * Math.PI
      );
      ctx.closePath();
      ctx.fill();
    }

    this.animationControl();
  }

  // Makes sure the animation is drawn correctly, ignore
  animationControl() {
    if (
      this.x + this.line_1_px <= this.x + this.line_1_p2 ||
      this.x + this.line_1_px >= this.x + this.line_1_p1
    ) {
      this.line_1_step = -this.line_1_step;
    }
    if (
      this.x + this.line_2_px < this.x - blockWidth / 40 ||
      this.x + this.line_2_px >= this.x + this.line_2_p1
    ) {
      this.line_2_step = -this.line_2_step;
    }
    if (
      this.x - this.line_4_px > this.x + blockWidth / 40 ||
      this.x - this.line_4_px <= this.x - this.line_4_p1
    ) {
      this.line_4_step = -this.line_4_step;
    }
    if (
      this.x - this.line_5_px >= this.x - this.line_5_p2 ||
      this.x - this.line_5_px <= this.x - this.line_5_p1
    ) {
      this.line_5_step = -this.line_5_step;
    }
  }

  // Gets a new direction every X ms when the ghost is moving and is not colliding with anything, e.g. if moving right it might go up as soon as it gets to a junction
  randomize() {
    if (this.direction === "up" || this.direction === "down") {
      this.newDirection = this.getRandomDirection(1);
    } else if (this.direction === "left" || this.direction === "right") {
      this.newDirection = this.getRandomDirection(2);
    }
  }

  timer() {
    this.randomizer = setInterval(this.randomize.bind(this), 1000);
  }

  // Get a random direction depending on the situation
  getRandomDirection(x) {
    const directions = ["up", "down", "left", "right"];

    let direction;

    if (x === 1) {
      direction = directions[getRandomInt(2, directions.length)];
    } else if (x === 2) {
      direction = directions[getRandomInt(0, 2)];
    } else if (x === 3) {
      direction = directions[getRandomInt(0, directions.length)];
    }

    function getRandomInt(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min) + min);
    }

    return direction;
  }

  flee() {
    switch (this.direction) {
      case "left":
        this.speed = this.speedFlee;
        this.color = this.colorFlee;
        this.move("right");
        break;
      case "right":
        this.speed = this.speedFlee;
        this.color = this.colorFlee;
        this.move("left");
        break;
      case "up":
        this.speed = this.speedFlee;
        this.color = this.colorFlee;
        this.move("down");
        break;
      case "down":
        this.speed = this.speedFlee;
        this.color = this.colorFlee;
        this.move("up");
        break;
      default:
        break;
    }
  }

  startFlee() {
    soundPlayer("eatghost", "play");

    this.flee();

    this.eaten = true;
    this.panic = false;

    this.fleeTimer = setInterval(
      function () {
        if (this.fleeCounter >= 1.5) {
          this.stopFlee();
          this.fleeFromPacman = false;
          return;
        }
        this.fleeCounter += 0.5;
      }.bind(this),
      500
    );
  }

  stopFlee() {
    clearInterval(this.fleeTimer);
    this.fleeTimer = null;
    this.fleeCounter = 0;

    this.speed = this.speedOriginal;
    this.color = this.colorOriginal;

    if (this.eaten === true) {
      setTimeout(function () {
        this.eaten = false;
      }, 5000);
    }
  }

  panicTimerEnding() {
    switch (pill.counter) {
      case 3.5:
        this.color = this.colorPanicEnd;
        break;
      case 3.75:
        this.color = this.colorPanic;
        break;
      case 4:
        this.color = this.colorPanicEnd;
        break;
      case 4.25:
        this.color = this.colorPanic;
        break;
      case 4.5:
        this.color = this.colorPanicEnd;
        break;
      case 4.75:
        this.color = this.colorPanic;
        break;
      case 5:
        this.color = this.colorPanicEnd;
        break;
      default:
        break;
    }
  }

  startPanic() {
    this.speed = this.speedPanic;
    this.color = this.colorPanic;

    this.panic = true;
  }

  stopPanic() {
    this.speed = this.speedOriginal;
    this.color = this.colorOriginal;

    this.panic = false;
  }
}

// X and Y are the starting coords for ghost positions depending on the level

const winky = {
  x: blockWidth * 6.5,
  y: blockHeight * 5.5,
  speedOriginal: blockWidth / 10 + blockWidth / 20  - blockWidth / 100, // speed = 3
  speedScared: blockWidth / 20, // speed = 1
  colorOriginal: "rgb(0,191,255)",
  colorScared: "rgb(55, 68, 255)",
};

const pinky = {
  x: blockWidth * 18.5,
  y: blockHeight * 11.5,
  speedOriginal: blockWidth / 10 + blockWidth / 20 + blockWidth / 100, // speed = 3.2
  speedScared: 0,
  colorOriginal: "rgb(253, 71, 156)",
  colorScared: "rgb(55, 68, 255)",
};

const inky = {
  x: blockWidth * 9.5,
  y: blockHeight * 11.5,
  speedOriginal: blockWidth / 10 + blockWidth / 20 - blockWidth / 100, // speed = 3
  speedScared: blockWidth / 20, // speed = 1
  colorOriginal: "rgb(238, 196, 81)",
  colorScared: "rgb(55, 68, 255)",
};

const slinky = {
  x: blockWidth * 21.5,
  y: blockHeight * 5.5,
  speedOriginal: blockWidth / 8, // speed = 2.5
  speedScared: blockWidth / 10, // speed = 2
  colorOriginal: "rgb(76, 233, 154)",
  colorScared: "rgb(55, 68, 255)",
};

const winkyLVL2 = {
  x: blockWidth * 6.5,
  y: blockHeight * 8.5,
  speedOriginal: blockWidth / 10 + blockWidth / 20 + blockWidth / 100, // speed = 3.2
};
const pinkyLVL2 = {
  x: blockWidth * 24.5,
  y: blockHeight * 17.5,
  speedOriginal: blockWidth / 10 + blockWidth / 20 + blockWidth / 50, // speed = 3.4
};
const inkyLVL2 = {
  x: blockWidth * 3.5,
  y: blockHeight * 17.5,
  speedOriginal: blockWidth / 10 + blockWidth / 20 + blockWidth / 100, // speed = 3.2
};
const slinkyLVL2 = {
  x: blockWidth * 21.5,
  y: blockHeight * 8.5,
  speedOriginal: blockWidth / 10 + blockWidth / 40 + blockWidth / 100, // speed = 2.7
};

const winkyLVL3 = {
  x: blockWidth * 6.5,
  y: blockHeight * 5.5,
  speedOriginal: blockWidth / 10 + blockWidth / 20 + blockWidth / 50, // speed = 3.4
};
const pinkyLVL3 = {
  x: blockWidth * 21.5,
  y: blockHeight * 14.5,
  speedOriginal: blockWidth / 5 - blockWidth / 50, // speed = 3.6
};
const inkyLVL3 = {
  x: blockWidth * 6.5,
  y: blockHeight * 14.5,
  speedOriginal: blockWidth / 10 + blockWidth / 20 + blockWidth / 50, // speed = 3.4
};
const slinkyLVL3 = {
  x: blockWidth * 21.5,
  y: blockHeight * 5.5,
  speedOriginal: blockWidth / 10 + blockWidth / 40 + blockWidth / 50, // speed = 2.9
}; 

const winkyLVL4 = {
  x: blockWidth * 1.5,
  y: blockHeight * 11.5,
  speedOriginal: blockWidth / 5 - blockWidth / 50 // speed = 3.6
}

const pinkyLVL4 = {
  x: blockWidth * 26.5,
  y: blockHeight * 11.5,
  speedOriginal: blockWidth / 5 - blockWidth / 100 // speed = 3.8
}

const inkyLVL4 = {
  x: blockWidth * 1.5,
  y: blockHeight * 29.5,
  speedOriginal: blockWidth / 5 - blockWidth / 50 // speed = 3.6
}

const slinkyLVL4 = {
  x: blockWidth * 26.5,
  y: blockHeight * 29.5,
  speedOriginal: blockWidth / 20 + blockWidth / 10 + blockWidth / 200 // speed = 3.1
}

const winkyLVL5 = {
  x: blockWidth * 9.5,
  y: blockHeight * 4.5,
  speedOriginal: blockWidth / 5 - blockWidth / 100 // speed = 3.8
}

const pinkyLVL5 = {
  x: blockWidth * 21.5,
  y: blockHeight * 7.5,
  speedOriginal: blockWidth / 5 // speed = 4
}

const inkyLVL5 = {
  x: blockWidth * 6.5,
  y: blockHeight * 7.5,
  speedOriginal: blockWidth / 5 - blockWidth / 100 // speed = 3.8
}

const slinkyLVL5 = {
  x: blockWidth * 18.5,
  y: blockHeight * 4.5,
  speedOriginal: blockWidth / 20 + blockWidth / 10 + blockWidth / 100 + blockWidth / 200 // speed = 3.3
}


const winkyGhost = new Ghost(
  winky.x,
  winky.y,
  winky.speedOriginal,
  winky.speedScared,
  winky.colorOriginal,
  winky.colorScared
);

const inkyGhost = new Ghost(
  inky.x,
  inky.y,
  inky.speedOriginal,
  inky.speedScared,
  inky.colorOriginal,
  inky.colorScared
);

const pinkyGhost = new Ghost(
  pinky.x,
  pinky.y,
  pinky.speedOriginal,
  pinky.speedScared,
  pinky.colorOriginal,
  pinky.colorScared
);

const slinkyGhost = new Ghost(
  slinky.x,
  slinky.y,
  slinky.speedOriginal,
  slinky.speedScared,
  slinky.colorOriginal,
  slinky.colorScared
);

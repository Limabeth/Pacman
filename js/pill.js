class Pill {
  constructor() {
    this.color = "rgb(252, 250, 125)";
    this.r = blockWidth / 2.5 - blockWidth / 40;
    this.step = -(blockWidth / 80);
    this.counter = 0; // Countdown. Once it hits 5 (seconds), it's no longer active and the game goes back to its normal mode.
    this.timer = null; // Animation timer.
    this.active = null; // Stores timer's id when pacman eats a pill.
  }

  animate() {
    canvasCleaner("pill");

    if (this.r % (blockWidth / 8) === 0 && this.r !== blockWidth / 4) {
      this.step = -this.step;
    }

    this.r -= this.step;

    for (let i = 0; i < pilldata.length; i++) {
      if (pilldata[i].eaten === false) {
        ctxPill.fillStyle = this.color;
        ctxPill.beginPath();
        ctxPill.arc(pilldata[i].x, pilldata[i].y, this.r, 0, 2 * Math.PI);
        ctxPill.fill();
        ctxPill.closePath();
      }
    }
  }

  countdown() {
    if (this.counter === 0) {
      if (winkyGhost.fleeTimer === null) {
        winkyGhost.startPanic();
      }
      if (inkyGhost.fleeTimer === null) {
        inkyGhost.startPanic();
      }
      if (pinkyGhost.fleeTimer === null) {
        pinkyGhost.startPanic();
      }
      if (slinkyGhost.fleeTimer === null) {
        slinkyGhost.startPanic();
      }

    } else if (this.counter === 5) {
      clearInterval(this.active);
      this.counter = 0;
      this.active = null;

      if (winkyGhost.fleeTimer === null) {
        winkyGhost.stopPanic();
      }
      if (inkyGhost.fleeTimer === null) {
        inkyGhost.stopPanic();
      }
      if (pinkyGhost.fleeTimer === null) {
        pinkyGhost.stopPanic();
      }
      if (slinkyGhost.fleeTimer === null) {
        slinkyGhost.stopPanic();
      }
      return;

    } else {
      if (winkyGhost.fleeTimer === null && winkyGhost.panic === true) {
        winkyGhost.panicTimerEnding();
      }
      if (inkyGhost.fleeTimer === null && inkyGhost.panic === true) {
        inkyGhost.panicTimerEnding();
      }
      if (pinkyGhost.fleeTimer === null && pinkyGhost.panic === true) {
        pinkyGhost.panicTimerEnding();
      }
      if (slinkyGhost.fleeTimer === null && slinkyGhost.panic === true) {
        slinkyGhost.panicTimerEnding();
      }
    }

    this.counter += 0.250;
  }

  activate() {
    soundPlayer("eatpill", "play");
    this.countdown();
    this.active = setInterval(this.countdown.bind(this), 250);
  }

  start() {
    this.timer = setInterval(this.animate.bind(this), 50);
  }

  stop() {
    canvasCleaner("pill");

    clearInterval(this.timer);
    clearInterval(this.active);

    this.counter = 0;
    this.timer = null;
    this.active = null;

    winkyGhost.stopPanic();
    inkyGhost.stopPanic();
    pinkyGhost.stopPanic();
    slinkyGhost.stopPanic();
  }
}

const pill = new Pill();

let pilldata = [];

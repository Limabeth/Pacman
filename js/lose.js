class Lose {
  constructor() {
    this.o1 = cvsWidth / 2;
    this.o2 = cvsHeight / 2;

    this.h = blockWidth * 10;
    this.shift1 = blockWidth / 4;
    this.shift2 = blockWidth / 8;
    this.shift3 = blockWidth / 2;

    this.color = "rgb(255, 255, 0)";

    this.eyeX =
      this.o1 + Math.sin((330 * Math.PI) / 180) * (this.h - blockWidth * 3);
    this.eyeY =
      this.o2 - Math.cos((330 * Math.PI) / 180) * (this.h - blockWidth * 3);
    this.eyeColor = "rgb(0, 0, 0)";
    this.eyeRadius = blockWidth / 2 + blockWidth / 4;
  }

  start() {
    setTimeout(function () {
      soundPlayer("lost", "play");
      
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

      game.on = false;
    }, 1000);

    setTimeout(function() {
      MainMenu.newgame.style.display = "block";
      activateGameController(0);
    }, 4000);

    setTimeout(this.draw1.bind(this), 1000);
    setTimeout(this.draw2.bind(this), 2000);
    setTimeout(this.draw3.bind(this), 3000);
    setTimeout(this.draw4.bind(this), 4000);
  }

  calculateControlPoint(a) {
    const d = blockWidth * 10.3;
    const x = this.o1 + Math.sin((a * Math.PI) / 180) * d;
    const y = this.o2 - Math.cos((a * Math.PI) / 180) * d;

    const controlPoint = { x: x, y: y };

    return controlPoint;
  }

  //Ignore all these draw functions. They draw the pizza pieces of pacman consecutively once the lose screen starts.
  draw1() {
    let p8_1 = this.o1 + Math.sin((345 * Math.PI) / 180) * this.h;
    let p8_2 = this.o2 - Math.cos((345 * Math.PI) / 180) * this.h;
    let p8_3 = this.o1 + Math.sin((15 * Math.PI) / 180) * this.h;
    let p8_4 = this.o2 - Math.cos((15 * Math.PI) / 180) * this.h;

    let p8_cp = this.calculateControlPoint(360);

    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.moveTo(this.o1, this.o2);
    ctx.lineTo(p8_1, p8_2);
    ctx.quadraticCurveTo(p8_cp.x, p8_cp.y, p8_3, p8_4);
    ctx.lineTo(this.o1, this.o2);
    ctx.closePath();
    ctx.fill();

    let p3_1 = this.o1 + Math.sin((135 * Math.PI) / 180) * this.h;
    let p3_2 = this.o2 - Math.cos((135 * Math.PI) / 180) * this.h;
    let p3_3 = this.o1 + Math.sin((165 * Math.PI) / 180) * this.h;
    let p3_4 = this.o2 - Math.cos((165 * Math.PI) / 180) * this.h;

    let p3_cp = this.calculateControlPoint(150);

    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.moveTo(this.o1, this.o2);
    ctx.lineTo(p3_1, p3_2);
    ctx.quadraticCurveTo(p3_cp.x, p3_cp.y, p3_3, p3_4);
    ctx.lineTo(this.o1, this.o2);
    ctx.closePath();
    ctx.fill();
  }

  draw2() {
    let p2_1 = this.o1 + Math.sin((75 * Math.PI) / 180) * this.h;
    let p2_2 = this.o2 - Math.cos((75 * Math.PI) / 180) * this.h;
    let p2_3 = this.o1 + Math.sin((105 * Math.PI) / 180) * this.h;
    let p2_4 = this.o2 - Math.cos((105 * Math.PI) / 180) * this.h;

    let p2_cp = this.calculateControlPoint(90);

    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.beginPath();
    ctx.moveTo(this.o1 + this.shift3, this.o2 + this.shift2);
    ctx.lineTo(p2_1 + this.shift3, p2_2 + this.shift2);
    ctx.quadraticCurveTo(
      p2_cp.x + this.shift3,
      p2_cp.y + this.shift2,
      p2_3 + this.shift3,
      p2_4 + this.shift2
    );
    ctx.lineTo(this.o1 + this.shift3, this.o2 + this.shift2);
    ctx.closePath();
    ctx.fill();

    let p5_1 = this.o1 + Math.sin((195 * Math.PI) / 180) * this.h;
    let p5_2 = this.o2 - Math.cos((195 * Math.PI) / 180) * this.h;
    let p5_3 = this.o1 + Math.sin((225 * Math.PI) / 180) * this.h;
    let p5_4 = this.o2 - Math.cos((225 * Math.PI) / 180) * this.h;

    let p5_cp = this.calculateControlPoint(210);

    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.moveTo(this.o1, this.o2);
    ctx.lineTo(p5_1, p5_2);
    ctx.quadraticCurveTo(p5_cp.x, p5_cp.y, p5_3, p5_4);
    ctx.lineTo(this.o1, this.o2);
    ctx.closePath();
    ctx.fill();
  }

  draw3() {
    let p4_1 = this.o1 + Math.sin((165 * Math.PI) / 180) * this.h;
    let p4_2 = this.o2 - Math.cos((165 * Math.PI) / 180) * this.h;
    let p4_3 = this.o1 + Math.sin((195 * Math.PI) / 180) * this.h;
    let p4_4 = this.o2 - Math.cos((195 * Math.PI) / 180) * this.h;

    let p4_cp = this.calculateControlPoint(180);

    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.moveTo(this.o1, this.o2 + this.shift1);
    ctx.lineTo(p4_1, p4_2 + this.shift1);
    ctx.quadraticCurveTo(
      p4_cp.x,
      p4_cp.y + this.shift1,
      p4_3,
      p4_4 + this.shift1
    );
    ctx.lineTo(this.o1, this.o2 + this.shift1);
    ctx.closePath();
    ctx.fill();

    let p7_1 = this.o1 + Math.sin((315 * Math.PI) / 180) * this.h;
    let p7_2 = this.o2 - Math.cos((315 * Math.PI) / 180) * this.h;
    let p7_3 = this.o1 + Math.sin((345 * Math.PI) / 180) * this.h;
    let p7_4 = this.o2 - Math.cos((345 * Math.PI) / 180) * this.h;

    let p7_cp = this.calculateControlPoint(330);

    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.moveTo(this.o1, this.o2 + this.shift1);
    ctx.lineTo(p7_1, p7_2 + this.shift1);
    ctx.quadraticCurveTo(
      p7_cp.x,
      p7_cp.y + this.shift1,
      p7_3,
      p7_4 + this.shift1
    );
    ctx.lineTo(this.o1, this.o2 + this.shift1);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = this.eyeColor;
    ctx.beginPath();
    ctx.arc(this.eyeX, this.eyeY, this.eyeRadius, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fill();
  }

  draw4() {
    let p1_1 = this.o1 + Math.sin((15 * Math.PI) / 180) * this.h;
    let p1_2 = this.o2 - Math.cos((15 * Math.PI) / 180) * this.h;
    let p1_3 = this.o1 + Math.sin((45 * Math.PI) / 180) * this.h;
    let p1_4 = this.o2 - Math.cos((45 * Math.PI) / 180) * this.h;

    let p1_cp = this.calculateControlPoint(30);

    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.moveTo(this.o1, this.o2 + this.shift1);
    ctx.lineTo(p1_1, p1_2 + this.shift1);
    ctx.quadraticCurveTo(
      p1_cp.x,
      p1_cp.y + this.shift1,
      p1_3,
      p1_4 + this.shift1
    );
    ctx.lineTo(this.o1, this.o2 + this.shift1);
    ctx.closePath();
    ctx.fill();

    let p6_1 = this.o1 + Math.sin((45 * Math.PI) / 180) * this.h;
    let p6_2 = this.o2 - Math.cos((45 * Math.PI) / 180) * this.h;
    let p6_3 = this.o1 + Math.sin((75 * Math.PI) / 180) * this.h;
    let p6_4 = this.o2 - Math.cos((75 * Math.PI) / 180) * this.h;

    let p6_cp = this.calculateControlPoint(60);

    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.beginPath();
    ctx.moveTo(this.o1 + this.shift1, this.o2 + this.shift2);
    ctx.lineTo(p6_1 + this.shift1, p6_2 + this.shift2);
    ctx.quadraticCurveTo(
      p6_cp.x + this.shift1,
      p6_cp.y + this.shift2,
      p6_3 + this.shift1,
      p6_4 + this.shift2
    );
    ctx.lineTo(this.o1 + this.shift1, this.o2 + this.shift2);
    ctx.closePath();
    ctx.fill();

    let p9_1 = this.o1 + Math.sin((105 * Math.PI) / 180) * this.h;
    let p9_2 = this.o2 - Math.cos((105 * Math.PI) / 180) * this.h;
    let p9_3 = this.o1 + Math.sin((135 * Math.PI) / 180) * this.h;
    let p9_4 = this.o2 - Math.cos((135 * Math.PI) / 180) * this.h;

    let p9_cp = this.calculateControlPoint(120);

    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.beginPath();
    ctx.moveTo(this.o1 + this.shift1, this.o2 + this.shift2);
    ctx.lineTo(p9_1 + this.shift1, p9_2 + this.shift2);
    ctx.quadraticCurveTo(
      p9_cp.x + this.shift1,
      p9_cp.y + this.shift2,
      p9_3 + this.shift1,
      p9_4 + this.shift2
    );
    ctx.lineTo(this.o1 + this.shift1, this.o2 + this.shift2);
    ctx.closePath();
    ctx.fill();
  }
}

const loser = new Lose();

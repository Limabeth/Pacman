class Background {
  constructor() {
    this.color = "rgb(17, 17, 17)";
    this.width = cvsWidth;
    this.height = cvsHeight;
  }
  draw() {
    canvasCleaner("bg");
    ctxBG.fillStyle = this.color;
    ctxBG.beginPath();
    ctxBG.rect(0, 0, this.width, this.height);
    ctxBG.closePath();
    ctxBG.fill();
  }
}

const bg = new Background();

class Food {
  constructor() {
    this.color = "rgb(201, 201, 201)";
  }

  draw() {
    canvasCleaner("food");
    for (let i = 0; i < mazeMap.length; i++) {
      const mazeMapRow = mazeMap[i];
      for (let j = 0; j < mazeMapRow.length; j++) {
        if (mazeMapRow[j] === 3) {
          this.make(i, j);
        }
      }
    }
  }

  make(i, j) {
    const data = {
      cx: blockWidth * j + blockWidth / 2,
      cy: blockHeight * i + blockHeight / 2,
      r: blockWidth / 8,
      a1: 0,
      a2: Math.PI * 2,
    };

    ctxFood.fillStyle = this.color;
    ctxFood.beginPath();
    ctxFood.arc(data.cx, data.cy, data.r, data.a1, data.a2);
    ctxFood.fill();
    ctxFood.closePath();
  }
}

let fooddata = [];

const food = new Food();

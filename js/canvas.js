/*----------------------------Canvas and building block dimensions----------------------------*/

/* 

The whole game canvas is basically a grid  28 x 30 blocks, although there is also space at the bottom of the maze for the score and lives display but it's not part of the grid. There can only be one object in each block and its content is determined by the number in the layout array. For instance, if the number is 9, the canvas draws top right corner. Lines and corners pass through the center point of each block (20 x 20 units) or more precisely, the control point of a corner curve is exactly at the center of the block to allow perfect connection between lines and corners. CX and CY of food and pills are located at the center of the block too and their radius is calculated by multiplying block width (20 units) by a number ranged from 0.1 to 0.9. When the game starts, an array containing all the data is created. The two-dimensional array, which represents a layout of the level, is  also used to make another similar two-dimensional array but instead of a number there is an ojbect containing the center coordinates of whatever the number refers to, be it line, corner, food or pill. However, this so-called data array is not used anywhere. Instead, there are various arrays (one for lines and corners, one for food and one for pills) and each contains the needed center coordinates of lines, corners, food and pills as well as state, such as eaten: true/false to make sure the eaten food/pill can't be eaten again. It is then used to determine whether ghosts or pacman have collided with the object.

*/

const gameDiv = document.getElementById("container");

const WIDE_MOBILE = window.matchMedia("(max-height: 360px)");
const RES_FHD = window.matchMedia("(max-width: 1920px)");
const RES_QHD = window.matchMedia("(max-width: 2560px)");
const RES_QFHD = window.matchMedia("(max-width: 3840px)");


let blockWidth = 20;
let blockHeight = 20;

if (WIDE_MOBILE.matches) {
  blockWidth = 10;
  blockHeight = 10;
  gameDiv.style.width = 10 * 28 + "px";
} else if (RES_FHD.matches) {
  blockWidth = 20;
  blockHeight = 20;
  gameDiv.style.width = 20 * 28 + "px";
} else if (RES_QHD.matches) {
  blockWidth = 30;
  blockHeight = 30;
  gameDiv.style.width = 30 * 28 + "px";
} else if (RES_QFHD.matches) {
  blockWidth = 40;
  blockHeight = 40;
  gameDiv.style.width = 40 * 28 + "px";
} 


let cvsWidth = blockWidth * 28;
let cvsHeight = blockHeight * 30 + blockHeight * 6;


/*----------------------------Background----------------------------*/

const cvsBG = document.getElementById("cvs_bg");
const ctxBG = cvsBG.getContext("2d");
cvsBG.setAttribute("width", cvsWidth);
cvsBG.setAttribute("height", cvsHeight);

/*----------------------------Maze----------------------------*/

const cvsMaze = document.getElementById("cvs_maze");
const ctxMaze = cvsMaze.getContext("2d");
cvsMaze.setAttribute("width", cvsWidth);
cvsMaze.setAttribute("height", cvsHeight);

/*----------------------------Food----------------------------*/

const cvsFood = document.getElementById("cvs_food");
const ctxFood = cvsFood.getContext("2d");
cvsFood.setAttribute("width", cvsWidth);
cvsFood.setAttribute("height", cvsHeight);

/*----------------------------Pill----------------------------*/

const cvsPill = document.getElementById("cvs_pill");
const ctxPill = cvsPill.getContext("2d");
cvsPill.setAttribute("width", cvsWidth);
cvsPill.setAttribute("height", cvsHeight);


/*----------------------------Pacman----------------------------*/

const cvs = document.getElementById("cvs_pacman");
const ctx = cvs.getContext("2d");
cvs.setAttribute("width", cvsWidth);
cvs.setAttribute("height", cvsHeight);

/*----------------------------Score----------------------------*/

const cvs_score = document.getElementById("cvs_score");
const ctx_score = cvs_score.getContext("2d");
cvs_score.setAttribute("width", cvsWidth);
cvs_score.setAttribute("height", cvsHeight);

const cvs_ui = document.getElementById("cvs_ui");
const ctx_ui = cvs_ui.getContext("2d");
cvs_ui.setAttribute("width", cvsWidth);
cvs_ui.setAttribute("height", cvsHeight);

/*----------------------------Cleaning canvas----------------------------*/

function canvasCleaner(type) {
  switch (type) {
    case "main":
      ctx.clearRect(0, 0, cvs.width, cvs.height);
      break;
    case "bg":
      ctxBG.clearRect(0, 0, cvsBG.width, cvsBG.height);
      break;
    case "maze":
      ctxMaze.clearRect(0, 0, cvsMaze.width, cvsMaze.height);
      break;
    case "food":
      ctxFood.clearRect(0, 0, cvsFood.width, cvsFood.height);
      break;
    case "pill":
      ctxPill.clearRect(0, 0, cvsPill.width, cvsPill.height);
      break;
    case "ui":
      ctx_ui.clearRect(0, 0, cvs_ui.width, cvs_ui.height);
      break;
    case "score":
      ctx_score.clearRect(0, 0, cvs_score.width, cvs_score.height);
      break;
    case "all":
      ctx.clearRect(0, 0, cvs.width, cvs.height);
      ctxBG.clearRect(0, 0, cvsBG.width, cvsBG.height);
      ctxMaze.clearRect(0, 0, cvsMaze.width, cvsMaze.height);
      ctxFood.clearRect(0, 0, cvsFood.width, cvsFood.height);
      ctxPill.clearRect(0, 0, cvsPill.width, cvsPill.height);
      ctx_ui.clearRect(0, 0, cvs_ui.width, cvs_ui.height);
      ctx_score.clearRect(0, 0, cvs_score.width, cvs_score.height);
      break;
    default:
      break;
  }
}
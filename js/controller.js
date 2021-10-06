class Controls {
  constructor() {
    this.x1 = null;
    this.x2 = null;
    this.y1 = null;
    this.y2 = null;
  }
  touchStart(event) {
    event = event || window.event;
    event.preventDefault();

    this.x1 = event.touches[0].clientX;
    this.y1 = event.touches[0].clientY;
  }

  touchEnd(event) {
    if (this.x1 === null || this.y1 === null) {
      return;
    }

    event = event || window.event;
    event.preventDefault();

    this.x2 = event.touches[0].clientX;
    this.y2 = event.touches[0].clientY;

    if (difference(x1, x2) > difference(y1, y2)) {
      if (this.x2 - this.x1 > 0) {
        if ((game.on = true)) {
          pacman.direction = "right";
        }
      } else {
        if ((game.on = true)) {
          pacman.direction = "left";
        }
      }
    } else if (difference(x1, x2) < difference(y1, y2)) {
      if (this.y2 - this.y1 < 0) {
        if ((game.on = true)) {
          pacman.direction = "up";
        }
      } else {
        if ((game.on = true)) {
          pacman.direction = "down";
        }
      }
    }
    this.x1 = null;
    this.x2 = null;
    this.y1 = null;
    this.y2 = null;
  }

  keyDown(event) {
    event = event || window.event;
    event.preventDefault();

    let keyCode = null;

    if (event === null) {
      keyCode = window.event.keyCode;
    } else {
      keyCode = event.keyCode;
    }

    switch (keyCode) {
      case 37:
        if (navKeys.ALT === true) {
          game.deleteGame();

          activateGameController(0);

          window.history.go(-1);
        } else {
          pacman.direction = "left";
        }
        break;

      case 38:
        pacman.direction = "up";
        break;

      case 39:
        if (navKeys.ALT === true) {
          game.deleteGame();

          activateGameController(0);

          window.history.go(1);
        } else {
          pacman.direction = "right";
        }
        break;

      case 40:
        pacman.direction = "down";
        break;

      case 116:
        document.location.reload();
        break;

      case 18:
        navKeys.ALT = true;
        break;

      case 77: // Key M
        game.mute === false ? (game.mute = true) : (game.mute = false);
        break;

      default:
        break;
    }
  }

  keyUp(event) {
    event = event || window.event;
    event.preventDefault();

    let keyCode = null;

    switch (keyCode) {
      case 18:
        navKeys.ALT = false;
        break;

      default:
        break;
    }
  }
}

const GameController = new Controls();

const navKeys = {ALT: false};

function activateGameController(x) {
  if (x === 0) {
    window.removeEventListener("touchstart", GameController.touchStart);
    window.removeEventListener("touchmove", GameController.touchEnd);

    window.removeEventListener("keydown", GameController.keyDown, true);
    window.removeEventListener("keyup", GameController.keyUp, true);

    window.addEventListener("keydown", keyPressInMenu);


  } else if (x === 1) {
    window.addEventListener("touchstart", GameController.touchStart, {passive: false});
    window.addEventListener("touchmove", GameController.touchEnd, {passive: false});

    window.addEventListener("keydown", GameController.keyDown, true);
    window.addEventListener("keyup", GameController.keyUp, true);

    window.removeEventListener("keydown", keyPressInMenu);

  }
}

function keyPressInMenu(event) {
  event = event || window.event;
  let keyCode = null;

  if (event === null) {
    keyCode = window.event.keyCode;
  } else {
    keyCode = event.keyCode;
  }

  switch (keyCode) {
    case 66: // Key B
      if (
        game.on === false &&
        Menus.mainMenu.style.display === "none" &&
        SPAstate.pagename !== "EnterNameMenu" &&
         SPAstate.pagename !== "BestScoreMenu" &&
         SPAstate.pagename !== "ScoresTable" )
       {

        cancelAnimationFrame(winner.timer);
        winner.timer = null;

        canvasCleaner("all");

        Menus.mainMenu.style.display = "flex";
        Menus.cheatMenu.style.display = "none";
        MainMenu.newgame.style.display = "none";
        MainMenu.username.focus();

      }
      break;
    case 84: // Key T
    if (SPAstate.pagename === "CheatMenu") {
      switchToMainMenu();
    } else if (SPAstate.pagename === "MainMenu" && game.cheats === false) {
      switchToCheatMenu();
    }
      break;

    default:
      break;
  }
}


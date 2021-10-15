// A lot could be clarified here but should be self-explanatory.

const Menus = {
  cheatMenu: document.getElementById("cheats_menu"),
  mainMenu: document.getElementById("main_menu"),
  enterNameMenu: document.getElementById("name_input_menu"),
  bestscoreMenu: document.getElementById("bestscore_menu"),
  scoresTable: document.getElementById("all_scores"),
};

const CheatMenu = {
  ghosts: Menus.cheatMenu.getElementsByClassName("ignore_ghosts")[0],
  levels: Menus.cheatMenu.getElementsByClassName("quick_levels")[0],
  win: Menus.cheatMenu.getElementsByClassName("instant_win")[0],
  lose: Menus.cheatMenu.getElementsByClassName("instant_lose")[0],
  trap: document.getElementById("cheats_menu_trap"),
};

const MainMenu = {
  username: Menus.mainMenu.getElementsByClassName("username")[0],
  bestscore: Menus.mainMenu.getElementsByClassName("bestscore")[0],
  scorestable: Menus.mainMenu.getElementsByClassName("scores_table")[0],
  backToMenu: document.getElementById("back_to_menu"),
  start: Menus.mainMenu.getElementsByClassName("start")[0],
  trap: document.getElementById("main_menu_trap"),
};

const EnterNameMenu = {
  input: Menus.enterNameMenu.getElementsByClassName("enter_name")[0],
  send: Menus.enterNameMenu.getElementsByClassName("send")[0],
  dialog: Menus.enterNameMenu.getElementsByClassName("dialog")[0],
  back: Menus.enterNameMenu.getElementsByClassName("back")[0],
  trap: document.getElementById("name_input_menu_trap"),
};

const BestScoreMenu = {
  input: Menus.bestscoreMenu.getElementsByClassName("enter_name")[0],
  send: Menus.bestscoreMenu.getElementsByClassName("send")[0],
  dialog: Menus.bestscoreMenu.getElementsByClassName("dialog")[0],
  back: Menus.bestscoreMenu.getElementsByClassName("back")[0],
  trap: document.getElementById("bestscore_menu_trap"),
};

const ScoresTableMenu = {
  back: Menus.scoresTable.getElementsByClassName("back")[0],
  trap: document.getElementById("all_scores_trap2"),
};

CheatMenu.ghosts.onclick = function () {
  ignoreGhosts();
};
CheatMenu.levels.onclick = function () {
  quickLevels();
};
CheatMenu.win.onclick = function () {
  instantWin();
};
CheatMenu.lose.onclick = function () {
  instantLose();
};

MainMenu.username.onclick = function () {
  switchToEnterNameMenu();
};
MainMenu.bestscore.onclick = function () {
  switchToBestScoreMenu();
};
MainMenu.scorestable.onclick = function () {
  switchToAllScoresMenu();
};
MainMenu.start.onclick = function () {
  game.startGame();
};
MainMenu.backToMenu.onclick = function () {
  switchToMainMenu();
};

EnterNameMenu.send.onclick = function () {
  getUserName();
};
EnterNameMenu.back.onclick = function () {
  switchToMainMenu();
};

BestScoreMenu.send.onclick = function () {
  AjaxScore.restoreInfo("BestScore");
};
BestScoreMenu.back.onclick = function () {
  switchToMainMenu();
};

ScoresTableMenu.back.onclick = function () {
  switchToMainMenu();
};

CheatMenu.trap.onfocus = function () {
  CheatMenu.ghosts.focus();
};
MainMenu.trap.onfocus = function () {
  MainMenu.username.focus();
};
EnterNameMenu.trap.onfocus = function () {
  EnterNameMenu.input.focus();
};
BestScoreMenu.trap.onfocus = function () {
  BestScoreMenu.input.focus();
};
ScoresTableMenu.trap.onfocus = function () {
  ScoresTableMenu.back.focus();
};

EnterNameMenu.input.onchange = function () {
  EnterNameMenu.send.style.display = "block";
  EnterNameMenu.dialog.style.display = "none";
};
EnterNameMenu.input.onkeypress = function () {
  EnterNameMenu.send.style.display = "block";
  EnterNameMenu.dialog.style.display = "none";
};
EnterNameMenu.input.onpaste = function () {
  EnterNameMenu.send.style.display = "block";
  EnterNameMenu.dialog.style.display = "none";
};
EnterNameMenu.input.oncut = function () {
  EnterNameMenu.send.style.display = "block";
  EnterNameMenu.dialog.style.display = "none";
};

BestScoreMenu.input.onchange = function () {
  BestScoreMenu.send.style.display = "block";
  BestScoreMenu.dialog.style.display = "none";
};
BestScoreMenu.input.onkeypress = function () {
  BestScoreMenu.send.style.display = "block";
  BestScoreMenu.dialog.style.display = "none";
};
BestScoreMenu.input.onpaste = function () {
  BestScoreMenu.send.style.display = "block";
  BestScoreMenu.dialog.style.display = "none";
};
BestScoreMenu.input.oncut = function () {
  BestScoreMenu.send.style.display = "block";
  BestScoreMenu.dialog.style.display = "none";
};





function getUserName() {
  const inputField = EnterNameMenu.input;
  const username = inputField.value;

  const allowedChars = "^[a-zA-Z0-9_]*$";

  if (
    username === "" ||
    username === null ||
    username.length > 20 ||
    !username.match(allowedChars)
  ) {
    inputField.value = "";
    inputField.setAttribute("placeholder", "***INVALID NAME***");
    inputField.style.border = "solid 1px rgb(207, 37, 37)";
    inputField.focus();
    return;
  } else {
    AjaxScore.username = username;
    EnterNameMenu.send.style.display = "none";
    EnterNameMenu.dialog.style.display = "block";

    inputField.style.border = "solid 1px rgb(134, 255, 123)";
  }
}

function getUserBestScore() {
  const inputField = BestScoreMenu.input;
  const username = inputField.value;

  if (username in AjaxScore.userdata) {
    inputField.style.border = "solid 1px rgb(134, 255, 123)";

    BestScoreMenu.send.style.display = "none";
    BestScoreMenu.dialog.style.display = "block";
    BestScoreMenu.dialog.innerHTML = AjaxScore.userdata[username];
  } else {
    inputField.value = "";
    inputField.setAttribute("placeholder", "***NAME NOT FOUND***");
    inputField.style.border = "solid 1px rgb(207, 37, 37)";
    inputField.focus();
    return;
  }
} 

function getScoresTable() {
  const tableDiv = document.getElementById("all_scores");
  const oldTable = tableDiv.querySelector("table");
  tableDiv.removeChild(oldTable);

  const scoreTable = document.createElement("table");
  const names = Object.keys(AjaxScore.userdata);

  for (let i = 0; i < names.length; i++) {
    const row = document.createElement("tr");

    const userName = document.createElement("td");
    userName.innerHTML = names[i];

    const userScore = document.createElement("td");
    userScore.innerHTML = AjaxScore.userdata[names[i]];

    row.appendChild(userName);
    row.appendChild(userScore);

    scoreTable.appendChild(row);
  }

  tableDiv.appendChild(scoreTable);
}

function warnBeforeReload(event) {
  event.returnValue = "Whatever"
}





function ignoreGhosts() {
  pacman.cheat_immunity = true;
  game.cheats = true;
  game.deleteGame();

  resetter.mazedata();
  resetter.score();
  resetter.lives();
  resetter.level();
  resetter.difficultyLVL1();

  switchToMainMenu();
}

function quickLevels() {
  game.cheats = true;

  game.scoreLVL1 = 300;
  game.scoreLVL2 = 600;
  game.scoreLVL3 = 900;
  game.scoreLVL4 = 1200;
  game.scoreLVL5 = 1500;

  game.deleteGame();

  resetter.mazedata();
  resetter.score();
  resetter.lives();
  resetter.level();
  resetter.difficultyLVL1();

  switchToMainMenu();
}

function instantWin() {
  switchToMainMenu();

  game.cheats = true;
  game.deleteGame();
  winner.start();

  setTimeout(function() {Menus.mainMenu.style.display = "none";}, 10);
}

function instantLose() {
  switchToMainMenu();
  
  game.cheats = true;
  game.deleteGame();
  loser.start();

  setTimeout(function() {Menus.mainMenu.style.display = "none";}, 10);
}





let SPAstate = {};

function switchToStateFromURLHash() {
  let URLHash = window.location.hash;

  let stateStr = URLHash.substr(1);

  if (stateStr !== "") {
    const parts = stateStr.split("_");
    SPAstate = { pagename: parts[0] };
  } else if (stateStr === "") {
    location.hash = "MainMenu";
    SPAstate = { pagename: "MainMenu" };
  }

  switchMenus();
}

function switchToState(newState) {
  const stateStr = newState.pagename;

  location.hash = stateStr;
}

function switchToCheatMenu() {
  switchToState({ pagename: "CheatMenu" });
}

function switchToMainMenu() {
  canvasCleaner("all");
  switchToState({ pagename: "MainMenu" });
}

function switchToEnterNameMenu() {
  switchToState({ pagename: "EnterNameMenu" });

  if (AjaxScore.username !== null) {
    EnterNameMenu.input.value = AjaxScore.username;
    EnterNameMenu.send.style.display = "none";
    EnterNameMenu.dialog.style.display = "block";
  }
}

function switchToBestScoreMenu() {
  switchToState({ pagename: "BestScoreMenu" });
}

function switchToGame() {
  switchToState({pagename: "Game"});
}

function switchToAllScoresMenu() {
  switchToState({ pagename: "ScoresTable" });
}

function switchMenus() {

  switch (SPAstate.pagename) {
    case "CheatMenu":
      if (game.cheats === true) {
        switchToMainMenu();
        return;
      }
      Menus.mainMenu.style.display = "none";
      Menus.cheatMenu.style.display = "flex";
      Menus.enterNameMenu.style.display = "none";
      Menus.bestscoreMenu.style.display = "none";
      Menus.scoresTable.style.display = "none";
      break;

    case "MainMenu":
      if (game.on === true) {
        game.deleteGame();
        activateGameController(0);
      }
      Menus.mainMenu.style.display = "flex";
      Menus.cheatMenu.style.display = "none";
      Menus.enterNameMenu.style.display = "none";
      Menus.bestscoreMenu.style.display = "none";
      Menus.scoresTable.style.display = "none";
      MainMenu.backToMenu.style.display = "none";
      MainMenu.username.focus();
      break;

    case "EnterNameMenu":
      Menus.mainMenu.style.display = "none";
      Menus.cheatMenu.style.display = "none";
      Menus.enterNameMenu.style.display = "block";
      Menus.bestscoreMenu.style.display = "none";
      Menus.scoresTable.style.display = "none";
      break;

    case "BestScoreMenu":
      Menus.mainMenu.style.display = "none";
      Menus.cheatMenu.style.display = "none";
      Menus.enterNameMenu.style.display = "none";
      Menus.bestscoreMenu.style.display = "block";
      Menus.scoresTable.style.display = "none";
      break;

    case "ScoresTable":
      Menus.mainMenu.style.display = "none";
      Menus.cheatMenu.style.display = "none";
      Menus.enterNameMenu.style.display = "none";
      Menus.bestscoreMenu.style.display = "none";
      Menus.scoresTable.style.display = "block";
      AjaxScore.restoreInfo("ScoresTable");
      break;

    case "Game":
      if (game.on === false) {
        switchToMainMenu();
        return;
      }
      Menus.mainMenu.style.display = "none";
      Menus.cheatMenu.style.display = "none";
      Menus.enterNameMenu.style.display = "none";
      Menus.bestscoreMenu.style.display = "none";
      Menus.scoresTable.style.display = "none";
      MainMenu.backToMenu.style.display = "none";
      break;

    default:
      break;
  }
}


window.addEventListener("hashchange", switchToStateFromURLHash);
switchToStateFromURLHash(); 

window.addEventListener("load", function () {
  window.removeEventListener("beforeunload", warnBeforeReload);
  window.addEventListener("keydown", keyPressInMenu);

  getSounds();
  optimizeSounds();
});

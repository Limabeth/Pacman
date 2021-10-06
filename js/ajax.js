class AJAXStorage {
  constructor(k) {
    this.ajaxHandlerScript = "https://fe.it-academy.by/AjaxStringStorage2.php";
    this.updatePassword = null;
    this.key = k; // The key used to save all the data in Ajax service.

    this.userdata = null; // Stores players' names and scores. Key - name, score - value.
    this.username = null; // Stores player's name if it's been entered in the corresponding menu.

    this.type = null; /* Used to determine what kind of data to restore, e.g. get player's best score, in which case the player's name will be used as a key to get their score. */
  }

  storeInfo() {
    this.updatePassword = Math.random();
    $.ajax({
      url: this.ajaxHandlerScript,
      type: "POST",
      cache: false,
      dataType: "json",
      data: { f: "LOCKGET", n: this.key, p: this.updatePassword },
      success: this.lockGetReady.bind(this),
      error: this.errorHandler,
    });
  }

  lockGetReady(callresult) {
    if (callresult.error != undefined) alert(callresult.error);
    else {
      this.userdata[this.username] = game.score;
      let info = JSON.stringify(this.userdata);
      $.ajax({
        url: this.ajaxHandlerScript,
        type: "POST",
        cache: false,
        dataType: "json",
        data: { f: "UPDATE", n: this.key, v: info, p: this.updatePassword },
        success: this.updateReady,
        error: this.errorHandler,
      });
    }
  }

  updateReady(callresult) {
    if (callresult.error != undefined) alert(callresult.error);
  }

  restoreInfo(type) {
    this.type = type;
    $.ajax({
      url: this.ajaxHandlerScript,
      type: "POST",
      cache: false,
      dataType: "json",
      data: { f: "READ", n: this.key },
      success: this.readReady.bind(this),
      error: this.errorHandler,
    });
  }

  readReady(callresult) {
    if (callresult.error != undefined) {
      alert(callresult.error);
    }

    else if (callresult.result != "") {
      this.userdata = JSON.parse(callresult.result);

      if (this.type === "ScoresTable") {
        getScoresTable();
        this.type = null;
      } else if (this.type === "BestScore") {
        getUserBestScore();
        this.type = null;
      } else if (this.type === "FinalScore") {
        this.showFinalScore();
      }
    }
  }

  showFinalScore() {
    if (this.username !== null && this.username in this.userdata) {
      ui.drawFinalScoreAjax();
      game.saveScore();
      this.type = null;
    } else if (this.username !== null && !(this.username in this.userdata)) {
      ui.drawFinalScore();
      this.storeInfo();
      this.type = null;
    } 
  }

  errorHandler(jqXHR, statusStr, errorStr) {
    alert(statusStr + " " + errorStr);
  }
}

const AjaxScore = new AJAXStorage("ISKAKOV_FD2_PROJECT_PACMAN_USERSCORE");

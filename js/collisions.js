function collisionWithWallPacman(dir) {
  const wall = walldata;
  const planeDiff = blockWidth * 0.75; /* Even if the center point of a wall/corner and pacman.x/pacman.y aren't on the same line but fall within the range of planeDiff, it still counts as if they are on the same plane. */

  for (let i = 0; i < wall.length; i++) {
    if (
      dir === "left" &&
      wall[i].type === "teleport" &&
      pacman.x - wall[i].x > 0 &&
      pacman.x - blockWidth <= wall[i].x &&
      difference(pacman.y, wall[i].y) <= blockWidth / 4
    ) {
      return { check: "TP" };
    } else if (
      dir === "right" &&
      wall[i].type === "teleport" &&
      pacman.x - wall[i].x < 0 &&
      pacman.x + blockWidth >= wall[i].x &&
      difference(pacman.y, wall[i].y) <= blockWidth / 4
    ) {
      return { check: "TP" };




    } else if  (
      dir === "left" &&
      (wall[i].type === "wall" || wall[i].type === "lair") &&
      pacman.x - wall[i].x > 0 &&
      pacman.x - blockWidth <= wall[i].x &&
      difference(pacman.y, wall[i].y) <= planeDiff
    ) {
      return { check: true, x: wall[i].x + blockWidth };
    } else if (
      dir === "right" &&
      (wall[i].type === "wall" || wall[i].type === "lair") &&
      pacman.x - wall[i].x < 0 &&
      pacman.x + blockWidth >= wall[i].x &&
      difference(pacman.y, wall[i].y) <= planeDiff
    ) {
      return { check: true, x: wall[i].x - blockWidth };
    } else if (
      dir === "up" &&
      (wall[i].type === "wall" || wall[i].type === "lair") &&
      pacman.y - wall[i].y > 0 &&
      pacman.y - blockWidth <= wall[i].y &&
      difference(pacman.x, wall[i].x) <= planeDiff
    ) {
      return { check: true, y: wall[i].y + blockHeight };
    } else if (
      dir === "down" &&
      (wall[i].type === "wall" || wall[i].type === "lair") &&
      pacman.y - wall[i].y < 0 &&
      pacman.y + blockWidth >= wall[i].y &&
      difference(pacman.x, wall[i].x) <= planeDiff
    ) {
      return { check: true, y: wall[i].y - blockHeight };

    } 
  }
  return { check: false };
}

function collisionWithFood() {
  for (let i = 0; i < fooddata.length; i++) {
    if (  
      difference(pacman.x, fooddata[i].x) <= blockWidth / 2 &&
      difference(pacman.y, fooddata[i].y) <= blockWidth / 2 &&
      fooddata[i].eaten === false
    ) {
      game.updateScore(10);

      soundPlayer("munch", "play");

      fooddata[i].eaten = true;
      deleteFood(fooddata[i].x, fooddata[i].y);
      return;
    }
  }
  function deleteFood(x, y) {
      ctxFood.fillStyle = "rgb(17, 17, 17)";
      ctxFood.beginPath();
      ctxFood.arc(x, y, blockWidth / 5, 0, Math.PI * 2);
      ctxFood.fill();
      ctxFood.closePath();
  }
}

function collisionWithPill() {
  for (let i = 0; i < pilldata.length; i++) {
    if (
      difference(pacman.x, pilldata[i].x) <= blockWidth / 2 &&
      difference(pacman.y, pilldata[i].y) <= blockWidth / 2 &&
      pilldata[i].eaten === false &&
      pill.active === null
    ) {
      pill.activate();
      pilldata[i].eaten = true;
      return;
    }
  }
}

function collisionWithWallGhost(dir, ghostX, ghostY) {
  const wall = walldata;

  const planeDiff = blockWidth * 0.75;

  for (let i = 0; i < wall.length; i++) {
    if (
      dir === "left" &&
      wall[i].type === "teleport" &&
      ghostX - wall[i].x > 0 &&
      ghostX - (blockWidth) <= wall[i].x &&
      difference(ghostY, wall[i].y) <= blockWidth / 4
    ) {
      return { check: "TP" };
    } else if (
      dir === "right" &&
      wall[i].type === "teleport" &&
      ghostX - wall[i].x < 0 &&
      ghostX + (blockWidth) >= wall[i].x &&
      difference(ghostY, wall[i].y) <= blockWidth / 4
    ) {
      return { check: "TP" };



    } else if  (
      dir === "left" &&
      (wall[i].type === "wall" || wall[i].type === "lair") &&
      ghostX - wall[i].x > 0 &&
      ghostX - blockWidth <= wall[i].x &&
      difference(ghostY, wall[i].y) <= planeDiff
    ) {
      return { check: true, x: wall[i].x + blockWidth };
    } else if (
      dir === "right" &&
      (wall[i].type === "wall" || wall[i].type === "lair") &&
      ghostX - wall[i].x < 0 &&
      ghostX + blockWidth >= wall[i].x &&
      difference(ghostY, wall[i].y) <= planeDiff
    ) {
      return { check: true, x: wall[i].x - blockWidth };
    } else if (
      dir === "up" &&
      (wall[i].type === "wall" || wall[i].type === "lair") &&
      ghostY - wall[i].y > 0 &&
      ghostY - blockWidth <= wall[i].y &&
      difference(ghostX, wall[i].x) <= planeDiff
    ) {
      return { check: true, y: wall[i].y + blockHeight };
    } else if (
      dir === "down" &&
      (wall[i].type === "wall" || wall[i].type === "lair") &&
      ghostY - wall[i].y < 0 &&
      ghostY + blockWidth >= wall[i].y &&
      difference(ghostX, wall[i].x) <= planeDiff
    ) {
      return { check: true, y: wall[i].y - blockHeight };

    } 
  }
  return { check: false };
}

function collisionWithGhost() {
  if (
    (difference(pacman.x, winkyGhost.x) <= pacman.safeSpace &&
      difference(pacman.y, winkyGhost.y) <= pacman.safeSpace &&
      winkyGhost.fleeTimer === null &&
      pill.active === null &&
      pacman.immunity === false &&
      pacman.cheat_immunity === false) ||
    (difference(pacman.x, inkyGhost.x) <= pacman.safeSpace &&
      difference(pacman.y, inkyGhost.y) <= pacman.safeSpace &&
      inkyGhost.fleeTimer === null &&
      pill.active === null &&
      game.lives >= 1 &&
      pacman.immunity === false &&
      pacman.cheat_immunity === false) || 
    (difference(pacman.x, pinkyGhost.x) <= pacman.safeSpace &&
      difference(pacman.y, pinkyGhost.y) <= pacman.safeSpace &&
      pinkyGhost.fleeTimer === null &&
      pill.active === null &&
      pacman.immunity === false && 
      pacman.cheat_immunity === false) ||
    (difference(pacman.x, slinkyGhost.x) <= pacman.safeSpace &&
      difference(pacman.y, slinkyGhost.y) <= pacman.safeSpace &&
      slinkyGhost.fleeTimer === null &&
      pill.active === null &&
      pacman.immunity === false &&
      pacman.cheat_immunity === false)
  ) {
    death.start();
    return true;

  } else if (
    difference(pacman.x, winkyGhost.x) <= pacman.safeSpace &&
    difference(pacman.y, winkyGhost.y) <= pacman.safeSpace &&
    pill.active !== null &&
    winkyGhost.fleeTimer === null &&
    winkyGhost.eaten === false &&
    pacman.immunity === false
  ) {
    game.updateScore(100);
    winkyGhost.startFlee();
  } else if (
    difference(pacman.x, inkyGhost.x) <= pacman.safeSpace &&
    difference(pacman.y, inkyGhost.y) <= pacman.safeSpace &&
    pill.active !== null &&
    inkyGhost.fleeTimer === null &&
    inkyGhost.eaten === false &&
    pacman.immunity === false
  ) {
    game.updateScore(100);
    inkyGhost.startFlee();
  } else if (
    difference(pacman.x, pinkyGhost.x) <= pacman.safeSpace &&
    difference(pacman.y, pinkyGhost.y) <= pacman.safeSpace &&
    pill.active !== null &&
    pinkyGhost.fleeTimer === null &&
    pinkyGhost.eaten === false &&
    pacman.immunity === false
  ) {
    game.updateScore(100);
    pinkyGhost.startFlee();
  } else if (
    difference(pacman.x, slinkyGhost.x) <= pacman.safeSpace &&
    difference(pacman.y, slinkyGhost.y) <= pacman.safeSpace &&
    pill.active !== null &&
    slinkyGhost.fleeTimer === null &&
    slinkyGhost.eaten === false &&
    pacman.immunity === false
  ) {
    game.updateScore(100);
    slinkyGhost.startFlee();
  }


  return false;


}

function difference(a, b) {
  return Math.abs(a - b);
}

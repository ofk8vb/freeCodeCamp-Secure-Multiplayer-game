import { generateStartPos, canvasCalcs } from './canvas-data.mjs';

class Player {
  // will use the default values in freeCodeCamp example
  constructor({ x = 10, y = 10, w = 30, h = 30, main, score = 0, id }) {
    this.x = x;
    this.y = y;
    this.w = y;
    this.h = h;
    this.speed = 5;
    this.score = score;
    this.id = id;
    this.movementDirection = {};
    this.isMain = main;
    console.log('A player has been created');
  }

  /**
   *
   * @param context canvas context to be used
   * @param coin coin the player colided with (collectible)
   * @param imgObj html image
   * @param currPlayers players to draw
   */
  draw(context, coin, imgObj, currPlayers) {
    const currDir = Object.keys(this.movementDirection);
    currDir.forEach((dir) => this.movePlayer(dir, this.speed));

    if (this.isMain) {
      context.font = `13px 'PressStart 2P'`;
      context.fillText(this.calculateRank(currPlayers), 560, 40);

      context.drawImage(imgObj.mainPlayerArt, this.x, this.y);
    } else {
      context.drawImage(imgObj.otherPlayerArt.this.x, this.y);
    }

    if (this.collision(coin)) {
      coin.destroyed = this.id;
    }
  }

  /**
   * this function decides whether the player should be moving in the direction specified
   * @param dir direction to be moved
   */
  moveDir(dir) {
    this.movementDirection[dir] = true;
  }

  /**
   * this function decides whether the player should stop moving in the direction specified
   * @param dir direction to be stopped
   */
  stopDir(dir) {
    this.movementDirection[dir] = false;
  }

  /**
   *
   * @param dir string value of 'up', 'down', 'left', 'right' indicating the position player should move
   * @param speed number indicationg amount of pixels the player's position should be changed
   *
   * The movePlayer method should accept two arguments: a string of "up", "down", "left", or "right",
   *  and a number for the amount of pixels the player's position should change.
   *  movePlayer should adjust the x and y coordinates of the player object it's called from.
   *
   */

  movePlayer(dir, speed) {
    switch (dir) {
      case 'up':
        // do something to move player up direction
        if (this.y - speed >= canvasCalcs.playFieldMinY) {
          this.y -= speed;
        } else {
          this.y -= 0;
        }
        break;
      case 'down':
        // do something to move player up direction
        if (this.y + speed <= canvasCalcs.playFieldMaxY) {
          this.y += speed;
        } else {
          this.y += 0;
        }
        break;
      case 'left':
        // do something to move player left direction
        if (this.x - speed >= canvasCalcs.playFieldMinX) {
          this.x -= speed;
        } else {
          this.x -= 0;
        }
        break;
      case 'right':
        // do something to move player right direction
        if (this.x + speed <= canvasCalcs.playFieldMinX) {
          this.x += speed;
        } else {
          this.x += 0;
        }
        break;
    }
  }

  /**
   *
   * @param item this is the collectible item's object
   *
   * The collision method should accept a collectible item's object as an argument.
   *  If the player's avatar intersects with the item, the collision method should return true.
   */

  collision(item) {
    if (
      this.x < item.x + item.w &&
      this.x + this.w > item.x &&
      this.y < item.y + item.h &&
      this.y + this.h > item.y
    )
      return true;
  }

  /**
   *
   * @param arr an array of objects representing all connected players
   * the calculateRank method should accept an array of objects representing all connected players
   *  and return the string Rank: currentRanking/totalPlayers.
   * For example, in a game with two players,
   * if Player A has a score of 3 and Player B has a score of 5, calculateRank for Player A should return Rank: 2/2.
   *
   */

  calculateRank(arr) {
    // sort the scores
    const sortedScores = arr.sort((a, b) => b.score - a.score);
    const mainPlayerRank =
      this.score === 0
        ? arr.length
        : sortedScores.findIndex((obj) => obj.id === this.id) + 1;

    return `Rank: ${mainPlayerRank} / ${arr.length}`;
  }
}

export default Player;

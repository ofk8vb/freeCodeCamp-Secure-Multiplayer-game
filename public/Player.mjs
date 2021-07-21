class Player {
  constructor({x, y, score, id}) {
    this.x = x;
    this.y = y;
    this.score = score;
    this.id = id;
    console.log('A player has been created')
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
    switch(dir){
      case 'up':
        // do something to move player up direction
        break;
      case 'down':
        // do something to move player up direction
        break;
      case 'left':
        // do something to move player left direction
        break;
      case 'right':
        // do something to move player right direction
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

  }

  /**
   * 
   * @param arr an array of objects representing all connected players
   * he calculateRank method should accept an array of objects representing all connected players
   *  and return the string Rank: currentRanking/totalPlayers.
   * For example, in a game with two players,
   * if Player A has a score of 3 and Player B has a score of 5, calculateRank for Player A should return Rank: 2/2.
   * 
   */

  calculateRank(arr) {

  }
}

export default Player;

class Collectible {
  constructor({x, y, value, id}) {
    this.x = x;
    this.y = y;
    this.value = value;
    this.id = id;
    console.log('New Collectible has been created' )
  }

  /**
   * 
   * @param context  # html canvas that Collectible will be drawn on
   * @param imgObj  # 
   */
  draw(context,imgObj){

  }
 

}

/*
  Note: Attempt to export this for use
  in server.js
*/
try {
  module.exports = Collectible;
} catch(e) {}

export default Collectible;

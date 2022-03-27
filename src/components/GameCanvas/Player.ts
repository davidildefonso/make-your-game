import Vec from './Vector';

export default  class Player {
  constructor(actor, pos, speed) {

	
	this.data = actor
    this.data.pos = pos //new Vec(actor.visibleAreaInCanvas.x1, actor.visibleAreaInCanvas.y1);
    this.data.speed = speed // new Vec(actor.obj.xSpeed, actor.obj.ySpeed);
	this.playerXSpeed = 7;
  } 

  get type() { return "PLAYER"; }

//   static create(actor) {
	
//     return new Player(pos.plus(new Vec(0, -0.5)),  new Vec(0, 0));
//   }
}

Player.prototype.size = new Vec(0.8, 1.5);

Player.prototype.update = function(time, state, keys) {

	let xSpeed = this.data.speed.x;
	let ySpeed = this.data.speed.y;
	let pos = this.data.pos;

	if (keys.ArrowLeft) xSpeed -= this.playerXSpeed;
	if (keys.ArrowRight) xSpeed += this.playerXSpeed;
	console.log(pos)
	let newPos = pos.plus(new Vec(xSpeed * time, 0));
console.log(newPos)
	const size = {x: this.data.obj.width, y: this.data.obj.height}

	pos = newPos;

	// if (!state.level.touches(pos, size, "ground") ) {
	// 	console.log("aqui")
	// 	pos = newPos;
	// 	console.log(pos)
	// }

	const gravity = this.data.obj.gravity;
	ySpeed += time * gravity;

	newPos = pos.plus(new Vec(0, ySpeed * time));
	
	if (!state.level.touches(newPos, size, "ground") ) {
		pos = newPos;
	} else if (keys.ArrowUp && ySpeed > 0) {
		ySpeed = - this.data.obj.jumpSpeed;
	} else {
		ySpeed = 0;
	}
	
	

	return new Player(this.data, pos, new Vec(xSpeed, ySpeed) );
};
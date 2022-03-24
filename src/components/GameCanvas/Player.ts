import Vec from './Vector';

export default  class Player {
  constructor(actor) {
	console.log(actor)
	
	this.data = actor
    this.data.pos = new Vec(actor.visibleAreaInCanvas.x1, actor.visibleAreaInCanvas.y1);
    this.data.speed = new Vec(actor.obj.xSpeed, actor.obj.ySpeed);
	//this.data = actor
  }

  get type() { return "PLAYER"; }

  static create(actor) {
	console.log(actor)
    return new Player(pos.plus(new Vec(0, -0.5)),  new Vec(0, 0));
  }
}

Player.prototype.size = new Vec(0.8, 1.5);

Player.prototype.update = function(time, state, keys) {
console.log(state.player)
	let xSpeed = state.player.obj.data.speed.x;

	if (keys.ArrowLeft) xSpeed -= playerXSpeed;
	if (keys.ArrowRight) xSpeed += playerXSpeed;
	let pos = this.data.pos;
	let movedX = pos.plus(new Vec(xSpeed * time, 0));

	const size = {x: this.data.obj.width, y: this.data.obj.height}

	if (!state.level.touches(movedX, size, "ground") ) {
		pos = movedX;
	}

	const gravity = this.data.obj.gravity;
	let ySpeed = this.data.speed.y + time * gravity;
	let movedY = pos.plus(new Vec(0, ySpeed * time));
	if (!state.level.touches(movedY, size, "ground") ) {
		pos = movedY;
	} else if (keys.ArrowUp && ySpeed > 0) {
		ySpeed = -jumpSpeed;
	} else {
		ySpeed = 0;
	}
	
	return new Player({...this.data, pos: new Vec(xSpeed, ySpeed)});
};
import { overlap } from "./utils";

let lives = 5;

export default class State {
  constructor(level, actors, status, fullscreen = false, transitioning = false) {
    this.level = level;
    this.actors = actors;
    this.status = status;
	this.fullscreen = fullscreen
	this.transitioning = transitioning
  }

  static start(level) {
    return new State(level, level.startActors, "playing", false);
  }

  get player() {
	console.log(this.actors)
    return this.actors.find(a => a.type == "PLAYER" || a.type == "player");
  }
}




State.prototype.update = function(time, keys) {
	
	let actors = this.actors
		.map(actor =>{
		console.log(actor)
			if(actor.obj && actor.obj.update){
				return  actor.obj.update(time, this, keys)
			}else if(actor && actor.update){
				return  actor.update(time, this, keys)
			}
			return actor;
		});
	let newState = new State(this.level, actors, this.status);

	if (newState.status != "playing") return newState;

	let player = this.player;

	const pos = this.player.obj.data.pos;
	const size = {x: this.player.obj.data.obj.width, y: this.player.obj.data.obj.height}
	console.log(this.level.touches(pos, size, "lava") )
	if (this.level.touches(pos, size, "lava") ) {
		lives--	
		return new State(this.level, actors, "lost");
	}

	// if (this.level.touches(player.pos, player.size, "lava")) {
			
	// 	lives--	


	// 	return new State(this.level, actors, "lost");
	// }

	const otherActors = actors.filter(actor => actor.type !== "player");
console.log(otherActors)
	for (let actor of otherActors) {
		if (actor != player && overlap(actor, player)) {
			newState = actor.collide(newState);
		}
	}
	return newState;
};
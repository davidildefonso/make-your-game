import Player from './Player';
import Lava from './Lava';
import Coin from './Coin';
import { touching } from './utils';
import Ground from './Ground';

export default class Level {
	constructor(ctx, map, scale) {
		console.log(ctx, map, scale)
		this.startActors = map.drawObjects.map(obj => this.createActor(obj));
		this.width = ctx.canvas.width;
		this.height = ctx.canvas.height;
		this.map = map
		console.log(this.startActors)
	}

	createActor(data){
		let actor = null;

		switch (data.type) {
			case 'PLAYER': 
				
				actor = new Player(data);
				break;	
			case 'OBJECT_NO_DAMAGE': 
				actor = new Ground(data); 
				break;	
			case 'OBJECT_DAMAGE': 
				if(data.obj.name === 'lava'){
					actor =  new Lava(data); 
				}
				break;
			case 'OBJECT_ASSET': 
				if(data.obj.name === 'coin'){
					actor = new Coin(data);
				}
				break;
			default:
				break;
		}

		return actor;
	}
	
};


Level.prototype.touches = function(pos, size, type) {
	
	const actors = this.actors ? this.actors : this.startActors;
	const player = actors.find( actor => actor.type === "PLAYER");
	
	const r1 = player.obj.data.visibleAreaInCanvas;

	const otherActors = actors.filter(actor => actor.type !== "PLAYER");
console.log(otherActors)
	const touchingData = otherActors.map(actor =>  touching(r1, actor) );

	const {x,y} = player.obj.data.pos;
	

	const isOutside = x < 0 || x >= this.map.width ||	y < 0 || y >= this.map.height;
	const here = isOutside ? "ground" : touchingData[0].name;
		
	if (here == type) return true;
	return false;

};

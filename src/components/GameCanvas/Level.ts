import Player from './Player';
import Lava from './Lava';
import Coin from './Coin';
import { touching } from './utils';
import Ground from './Ground';
import Vec from './Vector';

export default class Level {
	constructor(ctx, map, scale,  canvasRef, canvas) {
	
		this.startActors = map.drawObjects.map(obj => this.createActor(obj));
		this.width = ctx.canvas.width;
		this.height = ctx.canvas.height;
		this.map = map;
		this.context = ctx;
	
	}

	createActor(data){
		let actor = null;

		switch (data.type) {
			case 'PLAYER': 
				actor = new Player(data, new Vec(data.visibleAreaInCanvas.x1, data.visibleAreaInCanvas.y1), new Vec(data.obj.xSpeed, data.obj.ySpeed)  );
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

	const r1 =  {
		x1: player.data.pos.x,
		y1: player.data.pos.y,
		x2: player.data.pos.x + player.data.obj.width,
		y2: player.data.pos.y + player.data.obj.height
	};

	const otherActors = actors.filter(actor => actor.type !== "PLAYER");

	const touchingData = otherActors.map(actor =>  touching(r1, actor) );



	const {x,y} = player.data.pos;
	

	const isOutside = x < 0 || x >= this.map.width ||	y < 0 || y >= this.map.height;

	const here = isOutside 
		? "ground" :
		touchingData.length === 0 
			? ""
			: touchingData[0].name;
		
	if (here == type) return true;
	return false;

};

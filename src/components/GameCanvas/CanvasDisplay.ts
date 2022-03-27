import { drawImages } from "../Canvas/utils";

var results = [
  {name: "Satisfied", count: 1043, color: "lightblue"},
  {name: "Neutral", count: 563, color: "lightgreen"},
  {name: "Unsatisfied", count: 510, color: "pink"},
  {name: "No comment", count: 175, color: "silver"}
];

function flipHorizontally(context, around) {
  context.translate(around, 0);
  context.scale(-1, 1);
  context.translate(-around, 0);
}

export default class CanvasDisplay {
  constructor(level) {
  


    this.flipPlayer = false;

	this.level = level

    this.viewport = {
      left: 0,
      top: 0,
      width: this.level.width, //  / scale,
      height: this.level.height // / scale
    };

	this.context = level.context;
	this.scale = 1;
	this.playerXOverlap = 4;
  }

  clear() {
    //this.canvas.remove();
  }
}

CanvasDisplay.prototype.syncState = function(state) {
console.log(state.actors)
  this.updateViewport(state);
  this.clearDisplay(state.status);
  this.drawBackground(state.level);
  this.drawActors(state.actors);
};

CanvasDisplay.prototype.updateViewport = function(state) {

  let view = this.viewport;
  let margin = view.width / 3;
  let player = state.player;
 
  let center = player.data.pos.plus(player.size.times(0.5));

  if (center.x < view.left + margin) {
    view.left = Math.max(center.x - margin, 0);
  } else if (center.x > view.left + view.width - margin) {
    view.left = Math.min(center.x + margin - view.width,
                         state.level.width - view.width);
  }
  if (center.y < view.top + margin) {
    view.top = Math.max(center.y - margin, 0);
  } else if (center.y > view.top + view.height - margin) {
    view.top = Math.min(center.y + margin - view.height,
                        state.level.height - view.height);
  }
};

CanvasDisplay.prototype.clearDisplay = function(status) {
	
  if (status == "won") {
    this.context.fillStyle = "rgb(68, 191, 255)";
  } else if (status == "lost") {
    this.context.fillStyle = "rgb(44, 136, 214)";
  } else {
    this.context.fillStyle = "rgb(52, 166, 251)";
  }
  this.context.fillStyle = "rgb(0, 0, 0)";

  this.context.fillRect(0, 0, this.level.width, this.level.height);
};


CanvasDisplay.prototype.drawBackground = function(level) {
	this.context.fillStyle  = '#000';	
	this.context.fillRect(0, 0, this.level.width, this.level.height);
};



CanvasDisplay.prototype.drawPlayer = function(player, x, y, width, height){
  width += this.playerXOverlap * 2;
 // x -= this.playerXOverlap;
 
  if (player.data.speed.x != 0) {
    this.flipPlayer = player.data.speed.x < 0;
  }

  let tile = 8;
  if (player.data.speed.y != 0) {
    tile = 9;
  } else if (player.data.speed.x != 0) {
    tile = Math.floor(Date.now() / 60) % 8;
  }

  this.context.save();

  if (this.flipPlayer) {
    flipHorizontally(this.context, x + width / 2);
  }
  let imageX, imageY, imageWidth, imageHeight;



	if(player.data.obj.otherImagesInSameSprite && player.data.obj.singleSprite){
		imageX = player.data.obj.xPosOnSprite ;
		imageY = player.data.obj.yPosOnSprite ;
		imageWidth = player.data.obj.width;
		imageHeight = player.data.obj.height;
	}else if(!player.data.obj.otherImagesInSameSprite && !player.data.obj.singleSprite){
		imageX = player.data.obj.mainImageXPosOnSprite ;
		imageY = player.data.obj.mainImageYPosOnSprite  ;
		imageWidth = player.data.obj.width;
		imageHeight = player.data.obj.height;
	}


		
	this.context.drawImage(
		player.data.image,
		imageX, imageY, imageWidth, imageHeight,
		x, y, imageWidth, imageHeight);

  	this.context.restore();
};

CanvasDisplay.prototype.drawGround = function(player, x, y, width, height){
  	let imageX, imageY, imageWidth, imageHeight;

	if(player.data.obj.otherImagesInSameSprite && player.data.obj.singleSprite){
		imageX = player.data.obj.xPosOnSprite ;
		imageY = player.data.obj.yPosOnSprite ;
		imageWidth = player.data.obj.width;
		imageHeight = player.data.obj.height;
	}else if(!player.data.obj.otherImagesInSameSprite && !player.data.obj.singleSprite){
		imageX = player.data.obj.mainImageXPosOnSprite ;
		imageY = player.data.obj.mainImageYPosOnSprite  ;
		imageWidth = player.data.obj.width;
		imageHeight = player.data.obj.height;
	}
		
	this.context.drawImage(
		player.data.image,
		imageX, imageY, imageWidth, imageHeight,
		x, y, imageWidth, imageHeight);
};

CanvasDisplay.prototype.drawActors = function(actors) {
	//drawImages(this.context, this.level.map, this.scale);
	for (let actor of actors) {

		let width = actor.data.obj.width * this.scale;
		let height = actor.data.obj.height * this.scale;
		let x = (actor.data.pos.x - this.viewport.left) * this.scale;
		let y = (actor.data.pos.y - this.viewport.top) * this.scale;


		if (actor.data.type == "PLAYER") {
			this.drawPlayer(actor, x, y, width, height);
		} else {
			this.drawGround(actor, x, y, width, height);
		}
	}
};




document.addEventListener("keydown", function(e) {
  if (e.key === "Enter") {
    toggleFullScreen();
  }
}, false);


function toggleFullScreen() {
  if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
}
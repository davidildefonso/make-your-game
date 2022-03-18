import {   MapImage, MapPosition, MapType} from "../../types";
import { getIntersectingRectangle } from "../../utils/general";

export 	const cursorOnImage = (img: MapImage, x: number, y: number) => { 
	if( x > img.visibleAreaInCanvas.x1 && x < img.visibleAreaInCanvas.x2 && y > img.visibleAreaInCanvas.y1 && y < img.visibleAreaInCanvas.y2 ){
		return true;
	}
};

export 	const getDirection = (img: MapImage, x: number, y: number) => { 
	if( x >  img.visibleAreaInCanvas.x1  &&  y < img.visibleAreaInCanvas.y1    &&  x < img.visibleAreaInCanvas.x2    ) return 'UP';
	if( x >  img.visibleAreaInCanvas.x1  &&  y > img.visibleAreaInCanvas.y2  &&  x < img.visibleAreaInCanvas.x2    ) return 'DOWN';
	if( x <  img.visibleAreaInCanvas.x1  &&  y < img.visibleAreaInCanvas.y2  &&  y > img.visibleAreaInCanvas.y1   ) return 'LEFT';
	if( x >  img.visibleAreaInCanvas.x2   &&  y < img.visibleAreaInCanvas.y2  &&  y > img.visibleAreaInCanvas.y1    ) return 'RIGHT';
};

/**
 * 
 * DO NOT DELETE THIS FUNCTION IT HAS A COOL EFFECT!!!

 */
	// const handleMouseMove = (e: { stopPropagation: () => void; clientX: number; clientY: number; }) => {
	// 	if (dragOk){
	// 		e.stopPropagation();

	// 		const mx = e.clientX - canvasPosition.offsetX;
	// 		const my = e.clientY - canvasPosition.offsetY;

	// 		const dx = (mx - imageDragging.startX) * canvasScale;
	// 		const dy = (my - imageDragging.startY) * canvasScale;

	// 		if(isDragging){
	// 			setImages(images.map(img => img.order === imageDragging.order ? {...img, xPosInCanvas: img.xPosInCanvas + dx, yPosInCanvas: img.yPosInCanvas + dy } : img ));				
	// 		}
		
	// 		imageDragging.startX = mx;
	// 		imageDragging.startY = my;

	// 	}
	// };

export const findImageVisibleArea = (map: MapType, img: MapImage) : MapImage => {

//	if (!img.visible) return img;

	const scale = img.scale ? img.scale : 1;
	const x1 = img.xPosInMap  ;
	const y1 = img.yPosInMap ;
	const x2 =  ( x1 + img.obj.width ) ;
	const y2 = ( y1 + img.obj.height ) ;
	
	const r1 = { x1, y1, x2, y2 };

//	x1 = map.canvasX;
//	y1 = map.canvasY;
	const  r2 = { 
		x1: map.canvasX,
		y1: map.canvasY,
		x2: map.canvasX + map.visibleCanvasWidth,
		y2: map.canvasY + map.visibleCanvasHeight  
	};
	
	let visibleArea  =  getIntersectingRectangle(r1, r2);
	
	if(!visibleArea){
	//	img =  {...img, visible: false};
		return  {...img, visible: false};
	}

	let visibleAreaInCanvas =  { 
		x1: visibleArea.x1 - map.canvasX  ,
		y1: visibleArea.y1 - map.canvasY ,
		x2: visibleArea.x2 - map.canvasX ,
		y2: visibleArea.y2 - map.canvasY ,
	};

	visibleArea = {  
		x1: visibleArea.x1  ,
		y1: visibleArea.y1,
		x2: visibleArea.x2 ,
		y2: visibleArea.y2 	
	};

	visibleAreaInCanvas =  { 
		x1: visibleAreaInCanvas.x1 / scale  ,
		y1: visibleAreaInCanvas.y1 / scale ,
		x2: visibleAreaInCanvas.x2 / scale ,
		y2: visibleAreaInCanvas.y2 / scale ,
	};

	

	return {...img, visible: true, visibleArea, visibleAreaInCanvas};
};

export const drawImages = (ctx: CanvasRenderingContext2D, map: MapType, positionInMap: MapPosition, canvasScale: number) => {
	if(map && map.drawObjects && map.drawObjects.length > 0){		
		map.drawObjects.forEach( i => drawImageInCanvas(ctx, i, positionInMap, canvasScale ) );
	}
};

export const drawBg = (ctx : CanvasRenderingContext2D, scale: number,  dimension: number , strokeStyle: string ) => {		
	const canvasWidth = ctx.canvas.width ;
	const canvasHeight = ctx.canvas.height ;

	ctx.fillStyle  = '#000';	
	ctx.fillRect(0, 0, canvasWidth, canvasHeight);
	ctx.strokeStyle = strokeStyle;
	let xPos, yPos;
	for (let i = 0; i <  Math.floor(canvasWidth/ (dimension / scale)) ; ++i) {
		xPos = Math.floor(i * (dimension / scale));
		ctx.beginPath();
		ctx.moveTo(xPos, 0);
		ctx.lineTo(xPos, canvasHeight);
		ctx.stroke();

		yPos =  Math.floor(i * (dimension / scale)); 
		ctx.beginPath();
		ctx.moveTo(0, yPos);
		ctx.lineTo(canvasWidth, yPos);
		ctx.stroke();
	}
};

export 	const clearCanvas = (context: CanvasRenderingContext2D) => {
	context.fillStyle  = '#000';
	context.fillRect(0, 0, context.canvas.width, context.canvas.height);
};

export 	const drawImageInCanvas = (ctx: CanvasRenderingContext2D, img: MapImage, positionInMap: MapPosition, canvasScale: number) => {	
	let imageX, imageY,imageWidth,imageHeight, offsetX, offsetY;
	
	if(positionInMap){
		offsetX = positionInMap.dx >= 0 ? 0 : img.obj.width - (img.visibleAreaInCanvas.x2 - img.visibleAreaInCanvas.x1) * canvasScale;
		offsetY = positionInMap.dy >= 0 ? 0 : img.obj.height - (img.visibleAreaInCanvas.y2 - img.visibleAreaInCanvas.y1) * canvasScale;
	}

	if(!offsetX && !offsetY){
		offsetX = 0;
		offsetY = 0;
	}	
	

	if(img.obj.otherImagesInSameSprite && img.obj.singleSprite){
		imageX = img.obj.xPosOnSprite +  offsetX;
		imageY = img.obj.yPosOnSprite + offsetY;
		imageWidth =  (img.visibleAreaInCanvas.x2 - img.visibleAreaInCanvas.x1) * canvasScale;
		imageHeight = (img.visibleAreaInCanvas.y2 - img.visibleAreaInCanvas.y1) * canvasScale;
	}else if(!img.obj.otherImagesInSameSprite && !img.obj.singleSprite){
		imageX = img.obj.mainImageXPosOnSprite +  offsetX;
		imageY = img.obj.mainImageYPosOnSprite + offsetY ;
		imageWidth = (img.visibleAreaInCanvas.x2 - img.visibleAreaInCanvas.x1) * canvasScale;
		imageHeight = (img.visibleAreaInCanvas.y2 - img.visibleAreaInCanvas.y1) * canvasScale;
	}
	ctx.drawImage(
		img.image,
		imageX  ,
		imageY,
		imageWidth  ,
		imageHeight ,
		img.visibleAreaInCanvas.x1 ,
		img.visibleAreaInCanvas.y1,
		imageWidth / canvasScale ,
		imageHeight / canvasScale
	);		
};

export 	const findImageUnderPointer = (x: number, y: number, map : MapType) => {
	if(map && map.drawObjects){
		return map.drawObjects
			.filter(img => x > img.visibleAreaInCanvas.x1 && x < img.visibleAreaInCanvas.x2  && y > img.visibleAreaInCanvas.y1 && y < img.visibleAreaInCanvas.y2)
			.sort((img1, img2) => img2.order - img1.order )[0];
	}
	return null;	
	
};
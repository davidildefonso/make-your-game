import React, { useEffect, useRef, useState } from 'react';
import  './canvas.css';


const Canvas = (props :{type : string, width: number, height: number, gameObjects, lastChangedGameObject, setGameObjects}) => {

	const canvasRef = useRef(null);
	const dimension = 20;

	const [map, setMap] = useState({});
	const [wheeling, setWheeling] = useState(false);
	const [isKeyPressed, setIsKeyPressed] = useState(false);
	const [keyCode, setKeyCode] = useState(null);
	const [zoomingIn, setZoomingIn] = useState(false);
	const [zoomingOut, setZoomingOut] = useState(false);
	const [deltaY, setDeltaY] = useState(null);
	const [wheelEvent, setWheelEvent] = useState(null);
	const [canvasScale, setCanvasScale] = useState(1);
	const [canvasPosition, setCanvasPosition] = useState(null);
	const [dragOk, setDragOk] = useState(false);
	const [isDragging, setIsDragging] = useState(false);
	//const [images, setImages] = useState([]);
	const [imageData, setImageData] = useState(null);
	const [imageDragging, setImageDragging] = useState(null);
	const [mapMoving, setMapMoving] = useState(false);
	const [moveMap, setMoveMap] = useState(false);

	useEffect(() => {		
		const canvas = canvasRef.current;	
		const BB=canvas.getBoundingClientRect();
		setCanvasPosition({...canvasPosition, offsetX: BB.left, offsetY: BB.top});
		const context = canvas.getContext("2d");
		context.canvas.width = props.width;
		context.canvas.height = props.height;
		clearCanvas(context);
		drawBg(context,  canvasScale,  dimension , '#cccccc'); 
		setMap({
			width: 6400,
			height: 3600,
			canvasX: 2880,
			canvasY: 1620,
			canvasWidth: context.canvas.width,
			canvasHeight: context.canvas.height,
			objects: []
		});	
	}, []);	

	useEffect(() => {
		const {type, objId} =  props.lastChangedGameObject;
		let obj;
		switch (type) {
			case 'OBJECT_NO_DAMAGE':
				obj = props.gameObjects.noDamageObjects.find(o => o.objId === objId);
				addImageToMap(type, objId, obj);
				break;
			case 'OBJECT_DAMAGE':
				obj = props.gameObjects.damageObjects.find(o => o.objId === objId);
				addImageToMap(type, objId, obj);
				break;
			case 'OBJECT_ASSET':
				obj = props.gameObjects.assets.find(o => o.objId === objId);
				addImageToMap(type, objId, obj);
				break;
			case 'PLAYER':
				obj = props.gameObjects.players.find(o => o.objId === objId);
				addImageToMap(type, objId, obj);
				break;
			default:
				break;
		}
		
		return () => {
		
		}
	}, [props.gameObjects]);

	const addImageToMap = (type, objId, obj) => {		
		const img = new Image();
		img.src = obj.src;
		img.onload = () => {
			const xPosInCanvas = 	Math.floor(Math.random() * 5) * 50;
			const yPosInCanvas = 	Math.floor(Math.random() * 5) * 50;
			let newImage = { 
				order: map.objects.length + 1 ,
				type,
				objId,
				obj,
				image: img,
				xPosInCanvas,
				yPosInCanvas,
				xPosInMap: xPosInCanvas + map.canvasX,
				yPosInMap: yPosInCanvas + map.canvasY
			};

			newImage = findImageVisibleArea(newImage);
		
			setMap({...map, objects: [...map.objects, newImage] });
		};
	};
	

	useEffect(() => {
		if(map && map.objects && map.objects.length > 0){
			let imagesToDraw = findImagesVisibleInCanvas(map.objects);		
			if(imagesToDraw && imagesToDraw.length > 0 ){
				setMap({...map, drawObjects: imagesToDraw });			
			}
		}		

		return () => {
		
		}
	}, [map.objects]);

	useEffect(() => {
		const canvas = canvasRef.current;	
		const context = canvas.getContext("2d");
		clearCanvas(context);
		drawBg(context,  canvasScale,  dimension , '#cccccc'); 
		drawImages(context);	

	}, [map.drawObjects]);

	const drawImages = (ctx: CanvasRenderingContext2D) => {
		if(map && map.drawObjects && map.drawObjects.length > 0){			
			map.drawObjects.forEach(i => drawImageInCanvas(ctx, i) );
		}
	};

	const drawImageInCanvas = (ctx: CanvasRenderingContext2D, img) => {	
		let imageX, imageY,imageWidth,imageHeight;
		if(img.obj.otherImagesInSameSprite && img.obj.singleSprite){
			imageX = img.obj.xPosOnSprite;
			imageY = img.obj.yPosOnSprite;
			imageWidth = img.visibleAreaInCanvas.x2 - img.visibleAreaInCanvas.x1;
			imageHeight = img.visibleAreaInCanvas.y2 - img.visibleAreaInCanvas.y1;
		}else if(!img.obj.otherImagesInSameSprite && !img.obj.singleSprite){
			imageX = img.obj.mainImageXPosOnSprite;
			imageY = img.obj.mainImageYPosOnSprite;
			imageWidth = img.visibleAreaInCanvas.x2 - img.visibleAreaInCanvas.x1;
			imageHeight = img.visibleAreaInCanvas.y2 - img.visibleAreaInCanvas.y1;
		}
		ctx.drawImage(
			img.image,
			imageX,
			imageY,
			imageWidth,
			imageHeight,
			img.visibleAreaInCanvas.x1 / canvasScale,
			img.visibleAreaInCanvas.y1 / canvasScale,
			imageWidth / canvasScale,
			imageHeight/ canvasScale
		);		
	};

	const getIntersectingRectangle = (r1, r2) => {  
		[r1, r2] = [r1, r2].map(r => {
			return {
			x: [r.x1, r.x2].sort((a,b) => a - b),
			y: [r.y1, r.y2].sort((a,b) => a - b)
			};
		});

		const noIntersect = r2.x[0] > r1.x[1] || r2.x[1] < r1.x[0] ||
							r2.y[0] > r1.y[1] || r2.y[1] < r1.y[0];

		return noIntersect ? false : {
			x1: Math.max(r1.x[0], r2.x[0]), 
			y1: Math.max(r1.y[0], r2.y[0]), 
			x2: Math.min(r1.x[1], r2.x[1]),
			y2: Math.min(r1.y[1], r2.y[1])
		};
	};

	const findImageVisibleArea = (img) => {
		let x1, y1;
		x1 = img.xPosInMap;
		y1 = img.yPosInMap;
		let r1 = { x1, y1, x2:  x1 + img.obj.width , y2: y1 + img.obj.height };

		x1 = map.canvasX;
		y1 = map.canvasY;
		let r2 = { x1, y1, x2: x1 + map.canvasWidth, y2: y1 + map.canvasHeight};

		let visibleArea =  getIntersectingRectangle(r1, r2);
		
		if(!visibleArea){
			return {...img, visible: false, visibleArea: null};
		}

		const visibleAreaInCanvas =  { 
			x1: visibleArea.x1 - map.canvasX,
			y1: visibleArea.y1 - map.canvasY,
			x2: visibleArea.x2 - map.canvasX,
			y2: visibleArea.y2 - map.canvasY,
		};
		return {...img, visible: true, visibleArea, visibleAreaInCanvas};
	};

	const findImagesVisibleInCanvas = (imagesList) => {
		return imagesList.filter(img => img.visible);
	};

	const clearCanvas = (context: CanvasRenderingContext2D) => {
		context.fillStyle  = '#000';
		context.fillRect(0, 0, context.canvas.width, context.canvas.height);
	};

	



	const drawBg = (ctx : CanvasRenderingContext2D, scale: number,  dimension: number , strokeStyle: string ) => {		
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

	const handleWheel = (e: { preventDefault: () => void; deltaY: number; }) => {	
		
		if(keyCode === 17 && isKeyPressed){
			e.preventDefault();		
			setWheeling(true);	
			setDeltaY(e.deltaY);
			setWheelEvent(e);			
		}else{
			setWheeling(false);	
			setDeltaY(null);	
		}			
	};


	const handleKeyDown = (e: { keyCode: number; }) => {
		setIsKeyPressed(true);
		setKeyCode(e.keyCode);
	};

	const handleKeyUp = () => {

		setWheeling(false);	
		setIsKeyPressed(false);
		setKeyCode(null);
		canvasRef.current.removeEventListener("wheel", handleWheel);	
	};

	const handleMouseDown = (e: { preventDefault: () => void; stopPropagation: () => void; clientX: number; clientY: number; }) => {

		e.stopPropagation();
		setDragOk(false);
		setMoveMap(false);
		const mx = e.clientX - canvasPosition.offsetX;
		const my = e.clientY - canvasPosition.offsetY;

		const imageSelected = findImageUnderPointer(mx,my);		

		if(imageSelected){
			setDragOk(true);
			setIsDragging(true);	
			setImageDragging({...imageSelected, startX: mx, startY: my });
		}else{
			console.log('move map')
			setMoveMap(true);
			setMapMoving(true);
		}
	
	};

	const findImageUnderPointer = (x, y) => {
		return map.drawObjects
			.filter(img => x > img.visibleAreaInCanvas.x1 && x < img.visibleAreaInCanvas.x2  && y > img.visibleAreaInCanvas.y1 && y < img.visibleAreaInCanvas.y2)
			.sort((img1, img2) => img2.order - img1.order )[0];
		
	};

	const handleMouseUp = (e: { stopPropagation: () => void; }) => {
		e.stopPropagation();
		setDragOk(false);
		setIsDragging(false);
		setMoveMap(false);
		setMapMoving(false);
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

	const cursorOnImage = (img, x, y) => { 
		if( x > img.visibleAreaInCanvas.x1 && x < img.visibleAreaInCanvas.x2 && y > img.visibleAreaInCanvas.y1 && y < img.visibleAreaInCanvas.y2 ){
			return true;
		}
	};

	const getDirection = (img, x, y) => { 
		if( x >  img.visibleAreaInCanvas.x1  &&  y < img.visibleAreaInCanvas.y1    &&  x < img.visibleAreaInCanvas.x2    ) return 'UP';
		if( x >  img.visibleAreaInCanvas.x1  &&  y > img.visibleAreaInCanvas.y2  &&  x < img.visibleAreaInCanvas.x2    ) return 'DOWN';
		if( x <  img.visibleAreaInCanvas.x1  &&  y < img.visibleAreaInCanvas.y2  &&  y > img.visibleAreaInCanvas.y1   ) return 'LEFT';
		if( x >  img.visibleAreaInCanvas.x2   &&  y < img.visibleAreaInCanvas.y2  &&  y > img.visibleAreaInCanvas.y1    ) return 'RIGHT';
	};


	const handleMouseMove = (e: { stopPropagation: () => void; clientX: number; clientY: number; }) => {
		if (dragOk){
			e.stopPropagation();
			
			const mx = e.clientX - canvasPosition.offsetX;
			const my = e.clientY - canvasPosition.offsetY;

			const dx = (mx - imageDragging.startX) * canvasScale;
			const dy = (my - imageDragging.startY) * canvasScale;


			if(isDragging){
				if(isKeyPressed && keyCode === 17){
						
					if(!cursorOnImage(imageDragging, mx, my)){
						const direction = getDirection(imageDragging, mx, my);
						let newImage;
						const imageUnderPointer = findImageUnderPointer(mx, my);
						
						if(imageUnderPointer){							
								setImageDragging(imageUnderPointer);
						}else{
							switch (direction) {
								case 'UP':
									newImage =  {
										...imageDragging, 
										visibleAreaInCanvas: { 
											...imageDragging.visibleAreaInCanvas,											
											y1: imageDragging.visibleAreaInCanvas.y1 - imageDragging.obj.height,											
											y2: imageDragging.visibleAreaInCanvas.y2 - imageDragging.obj.height
										},
										visibleArea: { 
											...imageDragging.visibleArea,											
											y1: imageDragging.visibleArea.y1 - imageDragging.obj.height,											
											y2: imageDragging.visibleArea.y2 - imageDragging.obj.height							
										},										
										order: map.objects.length + 1,
										objId: map.objects.filter(i => i.type === imageDragging.type).length + 1	
									};							
									setMap({...map, objects: [...map.objects, newImage]});
									setImageDragging(newImage);
									break;
								case 'DOWN':
									newImage =  {
										...imageDragging, 
										visibleAreaInCanvas: { 
											...imageDragging.visibleAreaInCanvas,											
											y1: imageDragging.visibleAreaInCanvas.y1 + imageDragging.obj.height,											
											y2: imageDragging.visibleAreaInCanvas.y2 + imageDragging.obj.height
										},
										visibleArea: { 
											...imageDragging.visibleArea,											
											y1: imageDragging.visibleArea.y1 + imageDragging.obj.height,											
											y2: imageDragging.visibleArea.y2 + imageDragging.obj.height							
										},										
										order: map.objects.length + 1,
										objId: map.objects.filter(i => i.type === imageDragging.type).length + 1	
									};							
									setMap({...map, objects: [...map.objects, newImage]});
									setImageDragging(newImage);
									break;
								case 'LEFT':
									newImage =  {
										...imageDragging, 
										visibleAreaInCanvas: { 
											...imageDragging.visibleAreaInCanvas,											
											x1: imageDragging.visibleAreaInCanvas.x1 - imageDragging.obj.width,											
											x2: imageDragging.visibleAreaInCanvas.x2 - imageDragging.obj.width
										},
										visibleArea: { 
											...imageDragging.visibleArea,											
											y1: imageDragging.visibleArea.x1 - imageDragging.obj.width,											
											y2: imageDragging.visibleArea.x2 - imageDragging.obj.width							
										},										
										order: map.objects.length + 1,
										objId: map.objects.filter(i => i.type === imageDragging.type).length + 1	
									};							
									setMap({...map, objects: [...map.objects, newImage]});
									setImageDragging(newImage);
									break;
								
								case 'RIGHT':
									newImage =  {
										...imageDragging, 
										visibleAreaInCanvas: { 
											...imageDragging.visibleAreaInCanvas,											
											x1: imageDragging.visibleAreaInCanvas.x1 + imageDragging.obj.width,											
											x2: imageDragging.visibleAreaInCanvas.x2 + imageDragging.obj.width
										},
										visibleArea: { 
											...imageDragging.visibleArea,											
											y1: imageDragging.visibleArea.x1 + imageDragging.obj.width,											
											y2: imageDragging.visibleArea.x2 + imageDragging.obj.width							
										},										
										order: map.objects.length + 1,
										objId: map.objects.filter(i => i.type === imageDragging.type).length + 1	
									};							
									setMap({...map, objects: [...map.objects, newImage]});
									setImageDragging(newImage);
									break;
								default:
									break;
							}
						}
						
					}					
				}else{
					let movedImage; //  img.visibleAreaInCanvas.x1
					setMap({...map, objects: map.objects.map(img => {
					
						if(img.order === imageDragging.order){
							movedImage =   {
								...img,
								visibleAreaInCanvas: { 
									x1: img.visibleAreaInCanvas.x1 + dx,
									y1: img.visibleAreaInCanvas.y1 + dy,
									x2: img.visibleAreaInCanvas.x2 + dx,
									y2: img.visibleAreaInCanvas.y2 + dy
								},
								visibleArea: { 
									x1: img.visibleArea.x1 + dx,
									y1: img.visibleArea.y1 + dy,
									x2: img.visibleArea.x2 + dx,
									y2: img.visibleArea.y2 + dy
								}
							};
							return movedImage;
						}
						return img;						
					})});			
					
				}

			}

			imageDragging.startX = mx;
			imageDragging.startY = my;
			

		}else if(moveMap){ 
			e.stopPropagation();

			if(mapMoving){
				console.log('moving map')
			}
			
		}
	};

	useEffect(() => {

		canvasRef.current.addEventListener("wheel", handleWheel, {passive: false});	
		
		if(wheeling && isKeyPressed){	
				
			setZoomingIn(deltaY < 0 ? true : false);
			setZoomingOut(deltaY > 0 ? true : false);		
		}

		return () => {
			//canvasRef.current.removeEventListener("wheel", handleWheel);
		};

	}, [wheeling, isKeyPressed, wheelEvent]);
	
	
	useEffect(() => {
		if(zoomingIn){
			setCanvasScale(canvasScale / 1.25);			
		}else if(zoomingOut){
			setCanvasScale(canvasScale * 1.25);	
		}
		return () => {
			
		};

	}, [zoomingIn, zoomingOut]);

	useEffect(() => {
		if(imageData){
			setImageData({...imageData, scale: canvasScale});
		}	
		return () => {
			
		}
	}, [canvasScale]);	

	return (	
		<canvas  
			onKeyDown={handleKeyDown}
			onKeyUp={handleKeyUp}
			onMouseDown={handleMouseDown}
			onMouseMove={handleMouseMove}
			onMouseUp={handleMouseUp}
			ref = {canvasRef} 
			tabIndex={0} 
		></canvas>	
	);
};

export default Canvas;
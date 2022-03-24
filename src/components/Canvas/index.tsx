import React, { FunctionComponent, useEffect, useRef, useState } from 'react';
import { CanvasProps, GameObject, MapType } from '../../types';
import { findImagesVisibleInCanvas } from '../../utils/general';
import  './canvas.css';
import {  clearCanvas, cursorOnImage, drawBg, drawImages, findImageUnderPointer, findImageVisibleArea, getDirection } from './utils';


const Canvas : FunctionComponent<CanvasProps> = ({map , setMap, width, height, gameObjects, lastChangedGameObject, saveGameData}) => {

	const canvasRef = useRef(null);
	const dimension = 20;
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
	const [imageDragging, setImageDragging] = useState(null);
	const [mapMoving, setMapMoving] = useState(false);
	const [moveMap, setMoveMap] = useState(false); 
	const [positionInMap, setPositionInMap] = useState(null);

	useEffect(() => {		
		const canvas = canvasRef.current;	
		const BB=canvas.getBoundingClientRect();
		setCanvasPosition({...canvasPosition, offsetX: BB.left, offsetY: BB.top});
		const context = canvas.getContext("2d");
		context.canvas.width = width;
		context.canvas.height = height;
		clearCanvas(context);
		drawBg(context,  canvasScale,  dimension , '#cccccc'); 
		setMap({
			width: 64000,
			height: 36000,
			canvasX: 2880,
			canvasY: 1620,
			canvasWidth: context.canvas.width,
			canvasHeight: context.canvas.height,
			visibleCanvasWidth: context.canvas.width ,
			visibleCanvasHeight: context.canvas.height  ,
			objects: []
		});	
	}, []);	

	useEffect(() => {
		const {type, objId} =  lastChangedGameObject;
		let obj;
		switch (type) {
			case 'OBJECT_NO_DAMAGE':
				obj = gameObjects.noDamageObjects.find(o => o.objId === objId);
				addImageToMap(type, objId, obj, map);
				break;
			case 'OBJECT_DAMAGE':
				obj = gameObjects.damageObjects.find(o => o.objId === objId);
				addImageToMap(type, objId, obj , map);
				break;
			case 'OBJECT_ASSET':
				obj = gameObjects.assets.find(o => o.objId === objId);
				addImageToMap(type, objId, obj , map);
				break;
			case 'PLAYER':
				obj = gameObjects.players.find(o => o.objId === objId);
				addImageToMap(type, objId, obj , map);
				break;
			default:
				break;
		}
		
	}, [gameObjects]);	

	useEffect(() => {
	
		if(map && map.objects && map.objects.length > 0){
			
			const imagesToDraw = findImagesVisibleInCanvas(map.objects);	
				
			if(imagesToDraw && imagesToDraw.length > 0 ){
				setMap({...map, drawObjects: imagesToDraw });			
			}
		}		
	}, [map.objects]);

	useEffect(() => {
	
		const canvas = canvasRef.current;	
		const context = canvas.getContext("2d");
		clearCanvas(context);
		drawBg(context,  canvasScale,  dimension , '#cccccc'); 
		drawImages(context, map,  canvasScale);	
		saveGameData(map);
	}, [map.drawObjects]);

	useEffect(() => {
		if(map && map.canvasX && map.canvasY ){
			
			setMap({...map, objects: map.objects.map(img => findImageVisibleArea(map, img)) });
		
		}	
	}, [map.canvasX, map.canvasY]);	

	useEffect(() => {	
		canvasRef.current.addEventListener("wheel", handleWheel, {passive: false});	
		
		if(wheeling && isKeyPressed){				
			setZoomingIn(deltaY < 0 ? true : false);
			setZoomingOut(deltaY > 0 ? true : false);		
		}	
	}, [wheeling, isKeyPressed, wheelEvent]);
	
	
	useEffect(() => {	
		if(zoomingIn){
			setCanvasScale(canvasScale / 1.25);			
		}else if(zoomingOut){
			setCanvasScale(canvasScale * 1.25);	
		}	
	}, [zoomingIn, zoomingOut]);

	useEffect(() => {		
		if(map && map.objects){
			if(zoomingIn){
				setMap({
						...map,					
						visibleCanvasWidth: map.canvasWidth / canvasScale ,
						visibleCanvasHeight: map.canvasHeight / canvasScale  ,
						objects: map.objects.map(img =>{
						return findImageVisibleArea(map, {...img, scale: canvasScale});					
					})
				});		
			}else if(zoomingOut){
				setMap({
						...map,					
						visibleCanvasWidth: map.canvasWidth * canvasScale ,
						visibleCanvasHeight: map.canvasHeight * canvasScale  ,
						objects: map.objects.map(img =>{
						return findImageVisibleArea(map, {...img, scale: canvasScale});					
					})
				});
			}		
		}	
	}, [canvasScale]);	

	const addImageToMap = (type: string, objId: number, obj: GameObject, map: MapType) => {		
		const img = new Image();
		img.src = obj.src;
		img.onload = () => {
			const xPosInCanvas = 	Math.floor(Math.random() * 5) * 5;
			const yPosInCanvas = 	Math.floor(Math.random() * 5) * 5;
			const data = { 
				order: map.objects.length + 1 ,
				type,
				objId,
				obj,
				image: img,
				xPosInCanvas,
				yPosInCanvas,
				xPosInMap: xPosInCanvas + map.canvasX,
				yPosInMap: yPosInCanvas + map.canvasY,
				scale: canvasScale ? canvasScale : 1,
				visible: true,
				visibleAreaInCanvas: {},
				visibleArea: {}
			};

			const newImage = findImageVisibleArea(map, data);

			setMap({...map, objects: [...map.objects, newImage] });
		};
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

		const imageSelected = findImageUnderPointer(mx,my, map);		
		
		if(imageSelected){
			setDragOk(true);
			setIsDragging(true);	
			setImageDragging({...imageSelected, startX: mx, startY: my });
		}else{		
			setMoveMap(true);
			setMapMoving(true);
			setPositionInMap({ startX: mx, startY: my });
		}	
	};



	const handleMouseUp = (e: { stopPropagation: () => void; }) => {
		e.stopPropagation();
		setDragOk(false);
		setIsDragging(false);
		setMoveMap(false);
		setMapMoving(false);	
	};

	const handleMouseMove = (e: { stopPropagation: () => void; clientX: number; clientY: number; movementX: number; movementY: number; }) => {
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
						const imageUnderPointer = findImageUnderPointer(mx, my, map);
							
						if(imageUnderPointer){							
								setImageDragging(imageUnderPointer);
						}else{
						
							switch (direction) {
								
								case 'UP':
									newImage =  {
										...imageDragging, 
										visibleAreaInCanvas: { 
											...imageDragging.visibleAreaInCanvas,											
											y1: imageDragging.visibleAreaInCanvas.y1 - imageDragging.obj.height / imageDragging.scale,											
											y2: imageDragging.visibleAreaInCanvas.y2 - imageDragging.obj.height / imageDragging.scale
										},
										visibleArea: { 
											...imageDragging.visibleArea,											
											y1: imageDragging.visibleArea.y1 - imageDragging.obj.height,											
											y2: imageDragging.visibleArea.y2 - imageDragging.obj.height							
										},										
										order: map.objects.length + 1,
										objId: map.objects.filter(i => i.type === imageDragging.type).length + 1,										
										yPosInMap: imageDragging.yPosInMap - imageDragging.obj.height 
									};							
									setMap({...map, objects: [...map.objects, newImage]});
									setImageDragging(newImage);
									break;
								case 'DOWN':
									newImage =  {
										...imageDragging, 
										visibleAreaInCanvas: { 
											...imageDragging.visibleAreaInCanvas,											
											y1: imageDragging.visibleAreaInCanvas.y1 + imageDragging.obj.height / imageDragging.scale,											
											y2: imageDragging.visibleAreaInCanvas.y2 + imageDragging.obj.height / imageDragging.scale
										},
										visibleArea: { 
											...imageDragging.visibleArea,											
											y1: imageDragging.visibleArea.y1 + imageDragging.obj.height,											
											y2: imageDragging.visibleArea.y2 + imageDragging.obj.height							
										},										
										order: map.objects.length + 1,
										objId: map.objects.filter(i => i.type === imageDragging.type).length + 1,
										yPosInMap: imageDragging.yPosInMap + imageDragging.obj.height   	
									};							
									setMap({...map, objects: [...map.objects, newImage]});
									setImageDragging(newImage);
									break;
								case 'LEFT':
									newImage =  {
										...imageDragging, 
										visibleAreaInCanvas: { 
											...imageDragging.visibleAreaInCanvas,											
											x1: imageDragging.visibleAreaInCanvas.x1 - imageDragging.obj.width  / imageDragging.scale,											
											x2: imageDragging.visibleAreaInCanvas.x2 - imageDragging.obj.width  / imageDragging.scale
										},
										visibleArea: { 
											...imageDragging.visibleArea,											
											x1: imageDragging.visibleArea.x1 - imageDragging.obj.width,											
											x2: imageDragging.visibleArea.x2 - imageDragging.obj.width							
										},										
										order: map.objects.length + 1,
										objId: map.objects.filter(i => i.type === imageDragging.type).length + 1,
										xPosInMap: imageDragging.xPosInMap - imageDragging.obj.width 
									};							
									setMap({...map, objects: [...map.objects, newImage]});
									setImageDragging(newImage);
									break;
								
								case 'RIGHT':
									newImage =  {
										...imageDragging, 
										visibleAreaInCanvas: { 
											...imageDragging.visibleAreaInCanvas,											
											x1: imageDragging.visibleAreaInCanvas.x2,											
											x2: imageDragging.visibleAreaInCanvas.x2 + imageDragging.visibleAreaInCanvas.x2 - imageDragging.visibleAreaInCanvas.x1 
										},
										visibleArea: { 
											...imageDragging.visibleArea,											
											x1: imageDragging.visibleArea.x1 + imageDragging.obj.width,											
											x2: imageDragging.visibleArea.x2 + imageDragging.obj.width							
										},										
										order: map.objects.length + 1,
										objId: map.objects.filter(i => i.type === imageDragging.type).length + 1,
										xPosInMap: imageDragging.xPosInMap + imageDragging.obj.width 
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
					let movedImage; 
					setMap({...map, objects: map.objects.map(img => {					
						if(img.order === imageDragging.order){
							movedImage =   {
								...img,
								visibleAreaInCanvas: { 
									x1: img.visibleAreaInCanvas.x1 + dx / canvasScale,
									y1: img.visibleAreaInCanvas.y1 + dy / canvasScale,
									x2: img.visibleAreaInCanvas.x2 + dx / canvasScale,
									y2: img.visibleAreaInCanvas.y2 + dy / canvasScale
								},
								visibleArea: { 
									x1: img.visibleArea.x1 + dx ,
									y1: img.visibleArea.y1 + dy ,
									x2: img.visibleArea.x2 + dx ,
									y2: img.visibleArea.y2 + dy 
								},
								xPosInCanvas: img.visibleAreaInCanvas.x1 + dx ,
								xPosInMap:  img.visibleArea.x1 + dx,
								yPosInCanvas: img.visibleAreaInCanvas.x1 + dy,
								yPosInMap:  img.visibleArea.y1 + dy
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

			const mx = e.clientX - canvasPosition.offsetX;
			const my = e.clientY - canvasPosition.offsetY;
			
			const dx = (mx - positionInMap.startX) * canvasScale;
			const dy = (my - positionInMap.startY) * canvasScale;	
			
			if(mapMoving){	
		
				setMap({...map, canvasX: map.canvasX - dx, canvasY: map.canvasY - dy});
			}

			

			setPositionInMap({
				startX: mx,
				startY: my,
				oldX: positionInMap.startX,
				oldY: positionInMap.startY,
				dx: e.movementX,
				dy: e.movementY
			});

			// positionInMap.startX = mx;
			// positionInMap.startY = my;		
			// positionInMap.dx = e.movementX;
			// positionInMap.dy =  e.movementY;		
		}
	};

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
import React, { useEffect, useRef, useState } from 'react';
import  './canvas.css';
import Icon from '../../assets/img/laughing.png';
import Icon1 from '../../assets/img/painting.jpg';



const Canvas = (props :{type : string, width: number, height: number, gameObjects, lastChangedGameObject, setGameObjects}) => {

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
	const [images, setImages] = useState([]);
	const [imageData, setImageData] = useState(null);
	const [imageDragging, setImageDragging] = useState(null);


	useEffect(() => {		
		const canvas = canvasRef.current;	
		const BB=canvas.getBoundingClientRect();
		setCanvasPosition({...canvasPosition, offsetX: BB.left, offsetY: BB.top});
		const context = canvas.getContext("2d");
		context.canvas.width = props.width;
		context.canvas.height = props.height;
		clearCanvas(context);
		drawBg(context,  canvasScale,  dimension , '#cccccc'); 	
	}, []);	

	useEffect(() => {
		const {type, objId} =  props.lastChangedGameObject;
		let obj;
		switch (type) {
			case 'OBJECT_NO_DAMAGE':
				obj = props.gameObjects.noDamageObjects.find(o => o.objId === objId);
				addImageToImages(type, objId, obj);
				break;
			case 'OBJECT_DAMAGE':
				obj = props.gameObjects.damageObjects.find(o => o.objId === objId);
				addImageToImages(type, objId, obj);
				break;
			case 'OBJECT_ASSET':
				obj = props.gameObjects.assets.find(o => o.objId === objId);
				addImageToImages(type, objId, obj);
				break;
			case 'PLAYER':
				obj = props.gameObjects.players.find(o => o.objId === objId);
				addImageToImages(type, objId, obj);
				break;
			default:
				break;
		}
		
		return () => {
		
		}
	}, [props.gameObjects]);

	const addImageToImages = (type, objId, obj) => {		
		const img = new Image();
		img.src = obj.src;
		img.onload = () => {		
			setImages([...images, { order: images.length + 1 , type, objId, obj, image: img, xPosInCanvas: Math.floor(Math.random() * 5) * 50, yPosInCanvas: Math.floor(Math.random() * 5) * 50}]);
		};
	};
	
	console.log('images in canvas: ',images)
	console.log('gameobjects: ', props.gameObjects)

	useEffect(() => {
		if(images){
			const canvas = canvasRef.current;	
			const context = canvas.getContext("2d");
			clearCanvas(context);
			drawBg(context,  canvasScale,  dimension , '#cccccc'); 
			drawImages(context);		
		}

		return () => {
		
		}
	}, [images]);

	const clearCanvas = (context: CanvasRenderingContext2D) => {
		context.fillStyle  = '#000';
		context.fillRect(0, 0, context.canvas.width, context.canvas.height);
	};

	const drawImages = (ctx: CanvasRenderingContext2D) => {
		if(images && images.length > 0){
			images.forEach(i => drawImageInCanvas(ctx, i) );
		}
	};

	const drawImageInCanvas = (ctx: CanvasRenderingContext2D, img) => {	
		
		let imageX, imageY,imageWidth,imageHeight;
		if(img.obj.otherImagesInSameSprite && img.obj.singleSprite){
			imageX = img.obj.xPosOnSprite;
			imageY = img.obj.yPosOnSprite;
			imageWidth = img.obj.width,
			imageHeight = img.obj.height
		}else if(!img.obj.otherImagesInSameSprite && !img.obj.singleSprite){
			imageX = img.obj.mainImageXPosOnSprite;
			imageY = img.obj.mainImageYPosOnSprite;
			imageWidth = img.obj.width,
			imageHeight = img.obj.height
		}
		ctx.drawImage(
			img.image,
			imageX,
			imageY,
			imageWidth,
			imageHeight,
			img.xPosInCanvas / canvasScale,
			img.yPosInCanvas / canvasScale,
			imageWidth / canvasScale,
			imageHeight/ canvasScale
		);		
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
		const mx = e.clientX - canvasPosition.offsetX;
		const my = e.clientY - canvasPosition.offsetY;

		const imageSelected = findImageUnderPointer(mx,my);		

		setDragOk(true);
		setIsDragging(true);	
		setImageDragging({...imageSelected, startX: mx, startY: my });
	};

	const findImageUnderPointer = (x, y) => {
		return images
			.filter(img => x > img.xPosInCanvas && x < img.xPosInCanvas + img.obj.width && y > img.yPosInCanvas && y < img.yPosInCanvas + img.obj.height)
			.sort((img1, img2) => img1.order - img2.order )[0];
		
	};

	const handleMouseUp = (e: { stopPropagation: () => void; }) => {
		e.stopPropagation();
		setDragOk(false);
		setIsDragging(false);
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
		if( x > img.xPosInCanvas && x < img.xPosInCanvas + img.obj.width && y > img.yPosInCanvas && y < img.yPosInCanvas + img.obj.height){
			return true;
		}
	};

	const getDirection = (img, x, y) => {
		if( x > img.xPosInCanvas &&  y < img.yPosInCanvas    &&  x < img.xPosInCanvas + img.obj.width     ) return 'UP';
		if( x > img.xPosInCanvas &&  y > img.yPosInCanvas + img.obj.height   &&  x < img.xPosInCanvas + img.obj.width     ) return 'DOWN';
		if( x < img.xPosInCanvas &&  y < img.yPosInCanvas + img.obj.height   &&  y > img.yPosInCanvas    ) return 'LEFT';
		if( x > img.xPosInCanvas + img.obj.width   &&  y < img.yPosInCanvas + img.obj.height   &&  y > img.yPosInCanvas    ) return 'RIGHT';
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
						let imageUnderPointer = findImageUnderPointer(mx, my);
						if(imageUnderPointer){							
								setImageDragging(imageUnderPointer);
						}else{
							switch (direction) {
							case 'UP':
								newImage =  {
									...imageDragging, 
									yPosInCanvas: imageDragging.yPosInCanvas - imageDragging.obj.height,
									order: images.length + 1,
									objId: images.filter(i => i.type === imageDragging.type).length + 1	
								};							
								setImages([...images, newImage]);
								setImageDragging(newImage);
							
								break;
							case 'DOWN':
								newImage =  {
									...imageDragging, 
									yPosInCanvas: imageDragging.yPosInCanvas + imageDragging.obj.height,
									order: images.length + 1,
									objId: images.filter(i => i.type === imageDragging.type).length + 1	
								};							
								setImages([...images, newImage]);
								setImageDragging(newImage);
								break;
							case 'LEFT':
								newImage =  {
									...imageDragging, 
									xPosInCanvas: imageDragging.xPosInCanvas - imageDragging.obj.width,
									order: images.length + 1,
									objId: images.filter(i => i.type === imageDragging.type).length + 1	
								};							
								setImages([...images, newImage]);
								setImageDragging(newImage);
								break;
							case 'RIGHT':
								newImage =  {
									...imageDragging, 
									xPosInCanvas: imageDragging.xPosInCanvas + imageDragging.obj.width,
									order: images.length + 1,
									objId: images.filter(i => i.type === imageDragging.type).length + 1	
								};							
								setImages([...images, newImage]);
								setImageDragging(newImage);
								break;
							default:
								break;
						}
						}
						
					}					
				}else{
					setImages(images.map(img => img.order === imageDragging.order ? {...img, xPosInCanvas: img.xPosInCanvas + dx, yPosInCanvas: img.yPosInCanvas + dy } : img ));				

				}
			}
		
			imageDragging.startX = mx;
			imageDragging.startY = my;

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
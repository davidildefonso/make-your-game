import React, { useEffect, useRef, useState } from 'react';
import  './canvas.css';
import Icon from '../../assets/img/laughing.png';
import Icon1 from '../../assets/img/painting.jpg';



const Canvas = (props :{type : string, width: number, height: number}) => {

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
	const [myImage, setMyImage] = useState(null);
	const [imageLoaded, setImageLoaded] = useState(false);
	const [imageData, setImageData] = useState(null);

	useEffect(() => {		
		const canvas = canvasRef.current;	

		const BB=canvas.getBoundingClientRect();
		setCanvasPosition({...canvasPosition, offsetX: BB.left, offsetY: BB.top});
		

		const context = canvas.getContext("2d");
		context.fillStyle  = '#000';
		console.log(props.type);
		context.canvas.width = props.width;
		context.canvas.height = props.height;
		const canvasWidth = context.canvas.width ;
		const canvasHeight = context.canvas.height ;
		context.fillRect(0, 0, canvasWidth, canvasHeight);

		

		const img = new Image();
		img.src = Icon1;
		img.onload = () => {
			
			setMyImage(img);
			setImageLoaded(true);
			draw(context);
			setImageData({...imageData, scale: 1, xPosInCanvas: 100, yPosInCanvas: 100});
		};
			
	
	}, []);	


	const clearCanvas = (context: CanvasRenderingContext2D) => {
		context.fillStyle  = '#000';
		context.fillRect(0, 0, context.canvas.width, context.canvas.height);
	};

	const draw = (ctx: CanvasRenderingContext2D) => {
		clearCanvas(ctx);
		drawBg(ctx,  1,  dimension , '#cccccc'); 
		drawImageInCanvas(ctx);
	};

	const drawImageInCanvas = (ctx: CanvasRenderingContext2D) => {	
		console.log(myImage)
		if(imageData){
			ctx.drawImage(myImage , imageData.xPosInCanvas / imageData.scale, imageData.yPosInCanvas / imageData.scale , myImage.width / imageData.scale, myImage.height / imageData.scale);	
		}
		
	};

	const drawBg = (ctx : CanvasRenderingContext2D, scale: number,  dimension: number , strokeStyle: string ) => {		
		const canvasWidth = ctx.canvas.width ;
		const canvasHeight = ctx.canvas.height ;

		ctx.fillStyle  = '#000';	
		ctx.fillRect(0, 0, canvasWidth, canvasHeight);
		ctx.strokeStyle = strokeStyle;
		let xPos, yPos;
		for (let i = 0; i <  Math.floor(canvasWidth/ (dimension / scale)) ; ++i) {
		//	if (i % dimension != 0) { continue; }
			xPos = Math.floor(i * (dimension / scale));
			ctx.beginPath();
			ctx.moveTo(xPos, 0);
			ctx.lineTo(xPos, canvasHeight);
			ctx.stroke();

			yPos =  Math.floor(i * (dimension / scale)); //Math.floor(i *  Math.floor(canvasHeight/ (dimension / scale )) );
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
		console.log("key", e.keyCode);	
	};

	const handleKeyUp = () => {
		setIsKeyPressed(false);
		setKeyCode(null);
		canvasRef.current.removeEventListener("wheel", handleWheel);
		
	};

	const handleMouseDown = (e: { preventDefault: () => void; stopPropagation: () => void; clientX: number; clientY: number; }) => {
	//	e.preventDefault();
		e.stopPropagation();

		const mx = e.clientX - canvasPosition.offsetX;
		const my = e.clientY - canvasPosition.offsetY;

		setDragOk(false);
console.log(dragOk)
		const myImage = new Image();
		myImage.src = Icon1;
		myImage.onload = () => {
			console.log(myImage.width)
			if(mx> myImage.x && mx < myImage.x+ myImage.width && my > myImage.y && my < myImage.y+ myImage.height){					
				setDragOk(true);
				setIsDragging(true);					
			}
			setCanvasPosition({...canvasPosition, startX: mx, startY: my});
		};

	
	};

	const handleMouseUp = (e: { stopPropagation: () => void; }) => {
		e.stopPropagation();
		setDragOk(false);
		setIsDragging(false);
	};

	const handleMouseMove = (e: { stopPropagation: () => void; clientX: number; clientY: number; }) => {
		if (dragOk){
			e.stopPropagation();

			const mx = e.clientX - canvasPosition.offsetX;
			const my = e.clientY - canvasPosition.offsetY;

			const dx = mx - canvasPosition.startX;
			const dy = my - canvasPosition.startY;

			if(isDragging){
				setImageData({...imageData, scale: 1, xPosInCanvas: imageData.xPosInCanvas + dx, yPosInCanvas: imageData.yPosInCanvas + dy});				
			}

			
						
			canvasPosition.startX = mx;
			canvasPosition.startY = my;

  		}
	};

	useEffect(() => {
		console.log(imageData)
		if(imageData){
			const canvas = canvasRef.current;	
			const context = canvas.getContext("2d");
			draw(context);
		}
	

		return () => {
		
		}
	}, [imageData]);
	

	useEffect(() => {
		canvasRef.current.addEventListener("wheel", handleWheel, {passive: false});
		
		if(wheeling && isKeyPressed){			
			setZoomingIn(deltaY < 0 ? true : false);
			setZoomingOut(deltaY > 0 ? true : false);		
		}

		return () => {
			
		};

	}, [wheeling, isKeyPressed, wheelEvent]);
	
	
	useEffect(() => {
		if(zoomingIn){
			console.log("zoom in");
			setCanvasScale(canvasScale / 2);			
		}else if(zoomingOut){
			console.log("zoom out");
			setCanvasScale(canvasScale * 2);	
		}

		return () => {
			
		};

	}, [zoomingIn, zoomingOut]);

	useEffect(() => {
		if(imageData){
			setImageData({...imageData, scale: canvasScale, xPosInCanvas: 100, yPosInCanvas: 100});
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
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
	const [images, setImages] = useState([]);
	const [myImage, setMyImage] = useState(null);
	const [imageData, setImageData] = useState(null);


	useEffect(() => {		
		const canvas = canvasRef.current;	
		const BB=canvas.getBoundingClientRect();
		setCanvasPosition({...canvasPosition, offsetX: BB.left, offsetY: BB.top});
		const context = canvas.getContext("2d");
		context.canvas.width = props.width;
		context.canvas.height = props.height;
		
		const img = new Image();
		img.src = Icon1;
		img.onload = () => {			
			setMyImage(img);
			draw(context);
			setImageData({...imageData, xPosInCanvas: 100, yPosInCanvas: 100});
		};	
	}, []);	

	const clearCanvas = (context: CanvasRenderingContext2D) => {
		context.fillStyle  = '#000';
		context.fillRect(0, 0, context.canvas.width, context.canvas.height);
	};

	const draw = (ctx: CanvasRenderingContext2D) => {		
		clearCanvas(ctx);
		drawBg(ctx,  canvasScale,  dimension , '#cccccc'); 
		drawImageInCanvas(ctx);	
	};

	const drawImageInCanvas = (ctx: CanvasRenderingContext2D) => {	
		if(imageData){
			ctx.drawImage(myImage , imageData.xPosInCanvas / canvasScale, imageData.yPosInCanvas / canvasScale , myImage.width / canvasScale, myImage.height / canvasScale);	
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

		const mx = e.clientX - canvasPosition.offsetX;
		const my = e.clientY - canvasPosition.offsetY;

		setDragOk(false);

		const myImage = new Image();
		myImage.src = Icon1;
		myImage.onload = () => {
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

			const dx = (mx - canvasPosition.startX) * canvasScale;
			const dy = (my - canvasPosition.startY) * canvasScale;

			if(isDragging){
				setImageData({...imageData, xPosInCanvas: imageData.xPosInCanvas + dx, yPosInCanvas: imageData.yPosInCanvas + dy});				
			}
		
			canvasPosition.startX = mx;
			canvasPosition.startY = my;

		}
	};

	useEffect(() => {
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
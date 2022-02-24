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

	useEffect(() => {		
		const canvas = canvasRef.current;	
	
		const context = canvas.getContext("2d");
		context.fillStyle  = '#000';
		console.log(props.type);
		context.canvas.width = props.width;
		context.canvas.height = props.height;
		const canvasWidth = context.canvas.width ;
		const canvasHeight = context.canvas.height ;
		context.fillRect(0, 0, canvasWidth, canvasHeight);

		drawInCanvas(context, 1, canvasWidth, canvasHeight, dimension , '#cccccc' );

		drawImageInCanvas(context, Icon1, canvasScale, 100, 100);	


	}, []);	

	const drawImageInCanvas = (ctx : CanvasRenderingContext2D, img: string, scale : number, xPosInCanvas: number, yPosInCanvas: number) => {
		const myImage = new Image();
		myImage.src = img;

		myImage.onload = () => {
			ctx.drawImage(myImage ,xPosInCanvas / scale, yPosInCanvas / scale , myImage.width / scale, myImage.height / scale);
		};	
	}

	const drawInCanvas = (ctx : CanvasRenderingContext2D, scale: number, canvasWidth: number, canvasHeight: number, dimension: number , strokeStyle: string ) => {
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
	};

	const handleKeyUp = () => {
		setIsKeyPressed(false);
		setKeyCode(null);
		canvasRef.current.removeEventListener("wheel", handleWheel);
		
	};

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
		const canvas = canvasRef.current;	
		const context = canvas.getContext("2d");	
		const canvasWidth = context.canvas.width ;
		const canvasHeight = context.canvas.height ;
		drawInCanvas(context, canvasScale, canvasWidth, canvasHeight, dimension , '#cccccc' );
		drawImageInCanvas(context, Icon1, canvasScale, 100, 100);	
	
	  return () => {
		
	  }
	}, [canvasScale]);
	

	return (	
		<canvas  onKeyDown={handleKeyDown}  onKeyUp={handleKeyUp}    ref = {canvasRef} tabIndex={0} ></canvas>	
	);
};

export default Canvas;
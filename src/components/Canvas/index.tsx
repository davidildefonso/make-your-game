import React, { useEffect, useRef, useState } from 'react';
import  './canvas.css';
import Icon from '../../assets/img/laughing.png';



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
		let x, y;

		context.strokeStyle = '#cccccc';
		for (let i = 0; i <  Math.floor(canvasWidth/ dimension) ; ++i) {
		//	if (i % dimension != 0) { continue; }
			x = Math.floor(i *  dimension);
			context.beginPath();
			context.moveTo(x, 0);
			context.lineTo(x, canvasHeight);
			context.stroke();

			y = Math.floor(i *  Math.floor(canvasHeight/ dimension) );
			context.beginPath();
			context.moveTo(0, y);
			context.lineTo(canvasWidth, y);
			context.stroke();
		}

		const myImage = new Image();
		myImage.src = Icon;

		myImage.onload = () => {
			context.drawImage(myImage ,100, 100, myImage.width, myImage.height);
		};	


	}, []);	

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
		}else if(zoomingOut){
			console.log("zoom out");
		}

		return () => {
			
		};

	}, [zoomingIn, zoomingOut]);

	return (	
		<canvas  onKeyDown={handleKeyDown}  onKeyUp={handleKeyUp}    ref = {canvasRef} tabIndex={0} ></canvas>	
	);
};

export default Canvas;
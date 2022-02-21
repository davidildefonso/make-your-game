import React, { useEffect, useRef } from 'react';
import  './canvas.css';

const Canvas = (props :{type : string, width: number, height: number}) => {

	const canvasRef = useRef(null);

	useEffect(() => {		
		const canvas = canvasRef.current;
		const context = canvas.getContext("2d");
		context.fillStyle  = '#000';
		console.log(props.type);
		context.canvas.width = props.width;
		context.canvas.height = props.height;
		context.fillRect(0,0,context.canvas.width, context.canvas.height);
	}, []);
	


	return (	
		<canvas  ref = {canvasRef}  ></canvas>	
	);
};

export default Canvas;
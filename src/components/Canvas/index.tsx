import React, { useEffect, useRef } from 'react';
import  './canvas.css';
import Icon from '../../assets/img/laughing.png';

const Canvas = (props :{type : string, width: number, height: number}) => {

	const canvasRef = useRef(null);
	const dimension = 20;

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
	


	return (	
		<canvas  ref = {canvasRef}  ></canvas>	
	);
};

export default Canvas;
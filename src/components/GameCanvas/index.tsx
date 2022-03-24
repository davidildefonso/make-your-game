import React, {useRef, useEffect} from 'react';
import { drawImages } from '../Canvas/utils';
import runGame from './game';


const GameCanvas = ({game}) => {

	const canvasRef = useRef(null);

	useEffect(() => {		
		const canvas = canvasRef.current;	
		const context = canvas.getContext("2d");
		const canvasWidth = game.canvasWidth;
		const canvasHeight = game.canvasHeight;
		context.canvas.width = game.canvasWidth;
		context.canvas.height = game.canvasHeight;
		const scale = game.drawObjects[0].scale;

		context.fillStyle  = '#000';	
		context.fillRect(0, 0, canvasWidth, canvasHeight);

		drawImages(context, game, scale);

		runGame(context, game, scale);
		
	}, []);	

	console.log(game)
	return (
		<canvas
			ref = {canvasRef} 
			tabIndex={0} 
		></canvas>
	);
};

export default GameCanvas;
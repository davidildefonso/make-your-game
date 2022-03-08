import React from 'react';
import Image from '../Image';
import PlayerSprites from '../../assets/img/player.png';
import OtherSprites from '../../assets/img/sprites.png';
import './index.css';

const Images = () => {

	const images = [
		{
			id:1,
			src: PlayerSprites,
			name: "player",
			width: 24,
			height: 30,
			x: 0,
			y: 0
		},
		{
			id:2,
			src: OtherSprites,
			name: "ground",
			width: 20,
			height: 20,
			x: 0,
			y: 0
		},
		{
			id:3,
			src: OtherSprites,
			name: "lava",
			width: 20,
			height: 20,
			x: -20,
			y: 0
		},
		{
			id:4,
			src: OtherSprites,
			name: "coin",
			width: 12,
			height: 12,
			x: -40,
			y: 0
		},

	];

console.log(images, OtherSprites, PlayerSprites)
	return (
		<div className='images-container'>
			<div>Images:</div>
			<div className='images-item-wrap'>
				{images.map((image) => <Image key={image.id} image={image}  /> )}
			</div>
	
		</div>
	);
};

export default Images;
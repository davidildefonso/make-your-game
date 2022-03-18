import React, { FunctionComponent } from 'react';
import Image from '../Image';
import PlayerSprites from '../../assets/img/player.png';
import OtherSprites from '../../assets/img/sprites.png';
import './index.css';
import { ImagesProps, ImagesType } from '../../types';

const Images : FunctionComponent<ImagesProps> = ( { createImage }) => {

	const images : ImagesType[] = [
		{
			id:1,
			src: PlayerSprites,
			name: "player",
			role: "PLAYER",
			type: "PLAYER",
			width: 24,
			height: 30,
			x: 0,
			y: 0,
			singleSprite: false,
			otherImagesInSameSprite: false,
			xPosOnSprite: null,
			yPosOnSprite: null,
			hasMainImage: true,
			mainImageXPosOnSprite: 0,
			mainImageYPosOnSprite: 0,
			hasAnimations: true,
			animationCount: 3,
			animations: [
				{
					id: 1,
					name: 'run',
					type: "PLAYER_ANIMATION",
					spritesCount: 8,
					startXPos: 0,
					startYPos: 0,
					hasMultipleLines: false,

				},
				{
					id: 2,
					name: 'idle',
					type: "PLAYER_ANIMATION",
					spritesCount: 1,
					startXPos: 160,
					startYPos: 0,
					hasMultipleLines: false,
					
				},
				{
					id: 3,
					name: 'jump',
					type: "PLAYER_ANIMATION",
					spritesCount: 1,
					startXPos: 180,
					startYPos: 0,
					hasMultipleLines: false,
					
				}
			]


		},
		{
			id:2,
			src: OtherSprites,
			name: "ground",
			role: "GROUND",
			type: "OBJECT_NO_DAMAGE",
			width: 20,
			height: 20,
			x: 0,
			y: 0,
			singleSprite: true,
			otherImagesInSameSprite: true,
			xPosOnSprite: 0,
			yPosOnSprite: 0,
			hasMainImage: false,
			mainImageXPosOnSprite: null,
			mainImageYPosOnSprite: null,
			hasAnimations: true,
			animationCount: 3,
			animations: []
		},
		{
			id:3,
			src: OtherSprites,
			name: "lava",
			role: "DAMAGE",
			type: "OBJECT_DAMAGE",
			width: 20,
			height: 20,
			x: -20,
			y: 0,
			singleSprite: true,
			otherImagesInSameSprite: true,
			xPosOnSprite: 20,
			yPosOnSprite: 0,
			hasMainImage: false,
			mainImageXPosOnSprite: null,
			mainImageYPosOnSprite: null,
			hasAnimations: true,
			animationCount: 3,
			animations: []
		},
		{
			id:4,
			src: OtherSprites,
			name: "coin",
			role: "INCREASE_POINTS",
			type: "OBJECT_ASSET",
			width: 12,
			height: 12,
			x: -40,
			y: 0,
			singleSprite: true,
			otherImagesInSameSprite: true,
			xPosOnSprite: 40,
			yPosOnSprite: 0,
			hasMainImage: false,
			mainImageXPosOnSprite: null,
			mainImageYPosOnSprite: null,
			hasAnimations: true,
			animationCount: 3,
			animations: []
		},

	];


	return (
		<div className='images-container'>
			<div>Images:</div>
			<div className='images-item-wrap'>
				{images.map((image) => <Image key={image.id} image={image} createImage={createImage}  /> )}
			</div>
	
		</div>
	);
};

export default Images;
import { Dispatch, SetStateAction } from "react";

export interface GameObjects{
	players: GameObject[]
	assets: GameObject[]
	enemies: GameObject[]
	backgrounds: GameObject[]
	noDamageObjects: GameObject[]
	damageObjects: GameObject[]
}

export interface GameObject{
	objId?: number
	src?: string
	type?: string
	order?: number
	width?: number
	height?: number
	otherImagesInSameSprite?: boolean
	singleSprite? : boolean
	xPosOnSprite?: number
	yPosOnSprite?: number
	mainImageXPosOnSprite?: number
	mainImageYPosOnSprite?: number
}

export interface MapPosition{
	startX: number
	startY: number
	oldX: number
	oldY: number
	dx: number
	dy: number
}

export interface Points{
	x1?: number
	x2?: number
	y1?: number
	y2?: number
}

export interface PointsExt{
	x: number[]
	y: number[]
	x1?: number
	x2?: number
	y1?: number
	y2?: number
}

export interface MapImage{
	obj: GameObject
	visibleAreaInCanvas?: Points
	visibleArea?: Points
	scale: number
	xPosInMap: number
	yPosInMap: number
	visible: boolean
	image: HTMLImageElement
	order: number
	type: string

}

export interface MapType{
	objects?: MapImage[]
	canvasX?: number
	canvasY?: number
	drawObjects?: MapImage[]
	visibleCanvasWidth?: number
	visibleCanvasHeight?: number
	canvasWidth?: number
	canvasHeight?: number
	width?: number
	height?: number
}

export interface CanvasProps{
	type: string
	map: MapType
	setMap: Dispatch<SetStateAction<MapType>>
	width: number
	height: number
	gameObjects: GameObjects
	lastChangedGameObject: {
		type?: string
		objId?: number
	}
	setGameObjects: Dispatch<SetStateAction<GameObjects>>
}

export interface ImagesProps{
	createImage: unknown;
}
export interface ImagesType{
	id: number
	src: string
	name: string
	role: string
	type: string
	width: number
	height: number
	x: number
	y: number
	singleSprite: boolean,
	otherImagesInSameSprite: boolean,
	xPosOnSprite: number
	yPosOnSprite: number
	hasMainImage: boolean,
	mainImageXPosOnSprite: number
	mainImageYPosOnSprite: number
	hasAnimations: boolean,
	animationCount: number
	animations: Animation[]

}


export interface Animation{
	id: number
	name: string
	type: string
	spritesCount: number
	startXPos:number
	startYPos:number
	hasMultipleLines: boolean
}
import React from 'react';

interface ImageProps {
    src : string
	name : string
	width : number
	height : number
	x : number
	y : number
}

const Image = (props : { image: ImageProps }   ) => {
	console.log(props);

	const imgStyle = {
		backgroundImage: `url(${props.image.src})`,
		backgroundPosition: `${props.image.x}px ${props.image.y}px`,
		width: `${props.image.width}px`,
		height: ` ${props.image.height}px`
    }; 
	
	

	return (
		<div className='images-item'>
			<div className='img-container'> 
				<div className='img-wrap' style={imgStyle} ></div>
			</div>
		</div>
	);
};

export default Image;
import  React, { useState, useRef, useEffect } from 'react';
import './index.css';

interface ImageProps {
    src : string
	name : string
	width : number
	height : number
	x : number
	y : number
}

const Image = (props : { image: ImageProps, createImage }   ) => {
	const [visible, setVisible] = useState(false);
	const [dragImgPosition, setDragImagePosition] = useState(null);
	const [moveDragImg, setMoveDragImg] = useState(false);
	const [styles, setStyles] = useState(null);

	const imgRef = useRef(null);

	useEffect(() => {		
		const img1 = imgRef.current;	
		const imgBB = img1.getBoundingClientRect();
		setDragImagePosition({top: imgBB.top, left: imgBB.left, width: imgBB.width, height: imgBB.height});	
	}, []);	

	useEffect(() => {
		if(dragImgPosition){
			const imgStyle = {
				backgroundImage: `url(${props.image.src})`,
				backgroundPosition: `${props.image.x}px ${props.image.y}px`,
				width: `${props.image.width}px`,
				height: ` ${props.image.height}px`
			}; 
			
			const dragImgStyle = {
				backgroundImage: `url(${props.image.src})`,
				backgroundPosition: `${props.image.x}px ${props.image.y}px`,
				width: `${props.image.width}px`,
				height: ` ${props.image.height}px`,
				position: "absolute",
				top: `${dragImgPosition.top - dragImgPosition.height / 2}px`,
				left: `${dragImgPosition.left - dragImgPosition.width / 2}px`,
			}; 

			setStyles({imgStyle,dragImgStyle});
		}
	}, [dragImgPosition]);
	
	const handleClick = (e) => {
		e.preventDefault();
		e.stopPropagation();
		props.createImage(props.image);
	};

	const showDragImage = visible ? "" : "hidden" ;



	return (
		<div className='images-item'>
			<div className='img-container'> 
				<div onClick={handleClick} ref={imgRef} className='img-wrap' style={styles?.imgStyle} ></div>
				<div className= {`img-wrap ${showDragImage}`}  style={styles?.dragImgStyle} ></div>
			</div>
		</div>
	);
};

export default Image;
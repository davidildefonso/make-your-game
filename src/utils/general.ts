import { MapImage, Points } from "../types";

export const findImagesVisibleInCanvas = (imagesList : MapImage[]) => {
	return imagesList.filter(img => img.visible);
};

export 	const getIntersectingRectangle = (r1: { x1?: number; y1?: number; x2?: number; y2?: number; x?: number[]; y?: number[]; }, r2: { x1?: number; y1?: number; x2?: number; y2?: number; x?: number[]; y?: number[]; }) : Points | false => {  

	[r1, r2] = [r1, r2].map(r => {
		return {
			x: [r.x1, r.x2].sort((a,b) => a - b),
			y: [r.y1, r.y2].sort((a,b) => a - b)
		};
	});

	const noIntersect = r2.x[0] > r1.x[1] || r2.x[1] < r1.x[0] ||
						r2.y[0] > r1.y[1] || r2.y[1] < r1.y[0];



	return noIntersect ? false : {
		x1: Math.max(r1.x[0], r2.x[0]), 
		y1: Math.max(r1.y[0], r2.y[0]), 
		x2: Math.min(r1.x[1], r2.x[1]),
		y2: Math.min(r1.y[1], r2.y[1])
	};
};
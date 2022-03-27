import { getIntersectingRectangle } from "../../utils/general";


export const  overlap = (actor1, actor2) => {
	if(actor1.type === "OBJECT_NO_DAMAGE"){
	
		return actor1.obj.visibleAreaInCanvas.x2 > actor2.obj.data.pos.x &&
				actor1.obj.visibleAreaInCanvas.x1 < actor2.obj.data.pos.x + actor2.obj.data.obj.width &&
				actor1.obj.visibleAreaInCanvas.y2 > actor2.obj.data.pos.y &&
				actor1.obj.visibleAreaInCanvas.y1 < actor2.obj.data.pos.y + actor2.obj.data.obj.height;
	}
	
}




export const  trackKeys = (keys) =>  {
  let down = Object.create(null);
  function track(event) {
    if (keys.includes(event.key)) {
      down[event.key] = event.type == "keydown";
      event.preventDefault();
    }
  }
  window.addEventListener("keydown", track);
  window.addEventListener("keyup", track);
  return down;
}


export const touching = (r1, actor) => {
	
	const r2 = actor.data.visibleAreaInCanvas;
	const type = actor.data.type;
	const name = actor.data.obj.name;
	const role = actor.data.obj.role;
	const touches = getIntersectingRectangle(r1, r2);

	if(!touches){
		return {
			touches: false,
			type: null,
			actor: null,
			name: null,
			role: null
		};
	}

	return {
		touches: true,
		type,
		actor,
		name,
		role
	};

};
import Vec from "./Vector";

export default  class Ground {
  constructor(actor) {
	this.data = actor
    this.data.pos = new Vec(actor.visibleAreaInCanvas.x1, actor.visibleAreaInCanvas.y1);
  }
}
import { trackKeys } from "./utils";
import Level from './Level';
import State from './State';
import CanvasDisplay from './CanvasDisplay';

let lives = 1
var wobbleSpeed = 8, wobbleDist = 0.07;

const arrowKeys =  trackKeys(["ArrowLeft", "ArrowRight", "ArrowUp"]);

function runAnimation(frameFunc) {
  let lastTime = null;
  function frame(time) {
    if (lastTime != null) {
      let timeStep = Math.min(time - lastTime, 100) / 1000;
      if (frameFunc(timeStep) === false) return;
    }
    lastTime = time;
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

function runLevel(level) {

	let state = State.start(level);
	let display = new CanvasDisplay(level);

	return new Promise(resolve => {
		runAnimation(time => {
			state = state.update(time, arrowKeys);
			display.syncState(state);
			if (state.status == "playing") {
				return true;
			} else {
			//	display.clear();
				resolve(state.status);
				return false;
			}
		});
	});
}
//context, game, scale, canvasRef, canvas, context
export default async function runGame(ctx, game, scale, canvasRef, canvas) {
	await runLevel(new Level(ctx, game, scale, canvasRef, canvas));
	//endGame("win");
}

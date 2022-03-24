import { trackKeys } from "./utils";
import Level from './Level';
import State from './State';

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

	return new Promise(resolve => {
		runAnimation(time => {
			state = state.update(time, arrowKeys);
			console.log(state)
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

export default async function runGame(ctx, game, scale) {
	await runLevel(new Level(ctx, game, scale));
	//endGame("win");
}

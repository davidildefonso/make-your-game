import React, { useState, useRef, useEffect } from 'react';
import Canvas from '../Canvas';
import './App.css';
import Images from '../Images';

const App = () => {
	const [gameObjects, setGameObjects] = useState({
		players: [],
		assets: [],
		enemies: [],
		backgrounds: [],
		noDamageObjects: [],
		damageObjects: []
	});
	const [lastChangedGameObject, setLastChangedGameObject] = useState({});
	const [location, setLocation] = useState(null);

	const createImage = (obj) => {
		switch (obj.type) {
			case 'PLAYER':
				setGameObjects({...gameObjects, players: gameObjects.players.concat({...obj, objId: gameObjects.players.length + 1})});
				setLastChangedGameObject({type: "PLAYER", objId: gameObjects.players.length + 1 });
				break;
			case 'OBJECT_NO_DAMAGE':
				setGameObjects({...gameObjects, noDamageObjects: gameObjects.noDamageObjects.concat({...obj,  objId: gameObjects.noDamageObjects.length + 1})});
				setLastChangedGameObject({type: "OBJECT_NO_DAMAGE", objId: gameObjects.noDamageObjects.length + 1 });
				break;
			case 'OBJECT_DAMAGE':
				setGameObjects({...gameObjects, damageObjects: gameObjects.damageObjects.concat({...obj,  objId: gameObjects.damageObjects.length + 1})});
				setLastChangedGameObject({type: "OBJECT_DAMAGE", objId: gameObjects.damageObjects.length + 1 });
				break;
			case 'OBJECT_ASSET':
				setGameObjects({...gameObjects, assets: gameObjects.assets.concat({...obj,  objId: gameObjects.assets.length + 1})});
				setLastChangedGameObject({type: "OBJECT_ASSET", objId: gameObjects.assets.length + 1 });
				break;
			default:
				break;
		}
	};

	const startGamePreview = (e) => {
		e.preventDefault();
		window.history.pushState({}, "", 'play');
		const navEvent = new PopStateEvent('popstate');
		window.dispatchEvent(navEvent);
		setLocation('/play');
	};
	
	if (location === "/play") {
		return <div>
		play the game
		{gameObjects.toString()}
		</div>;
	}

	return (
		<div className='app-container'> 
			<div>
				<button  onClick={startGamePreview} >PLAY</button>
				<Images createImage ={createImage} />
			</div>

			<Canvas type="main" width={640} height={360} gameObjects={gameObjects}  setGameObjects={setGameObjects} lastChangedGameObject={lastChangedGameObject} />
		</div>
	);
};

export default App;
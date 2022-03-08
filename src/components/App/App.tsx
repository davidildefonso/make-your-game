import React from 'react';
import Canvas from '../Canvas';
import './App.css';
import Images from '../Images';

const App = () => {

  return (
    <div className='app-container'> 
		<Images  />
		<Canvas type="main" width={700} height={400}  />
    </div>
  );
};

export default App;
import 'core-js/fn/object/assign';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/Main';
import DiceBox from './components/DiceBox';

// Render the main component into the dom
ReactDOM.render(<App/>, document.getElementById('app'));
ReactDOM.render(<DiceBox/>, document.getElementById('dice'));

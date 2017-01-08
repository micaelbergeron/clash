import 'purecss/build/pure.css';
import 'normalize.css';
import styles from 'styles/App.css';
import { Box } from 'reflexbox';

import mousetrap from 'mousetrap';
import { HotKeys } from 'react-hotkeys';
import React from 'react';
import R from 'ramda';
import ReactDOM from 'react-dom';

import ActorList from './ActorList';
import Menu from './Menu/MenuView';
import ModeLine from './ModeLine';

import { setMultiplex } from 'actions/actions.js';

const map = {
  'select_down': 'j',
  'select_up': 'k',
  'select_first': 'g g',
  'select_last': 'G',
  'cancel': ['esc', 'ctrl+g'],
  'multiplex': R.range(0,10).map(String),
}

class App extends React.Component {
  render() {
    const handlers = {
      'select_down': () => this.props.onSelectActor({motion: 'next'}),
      'select_up': () => this.props.onSelectActor({motion: 'prev'}),
      'select_first': () => this.props.onSelectActor({relative: 'first'}),
      'select_last': () => this.props.onSelectActor({relative: 'last'}),
      'cancel': (event) => {
        event.stopPropagation();
        console.log('CANCEL')
        this.props.onSetMultiplex(0)
      },
      'multiplex': (event) => {
        console.info(event)
        let factor = 10*this.props.multiplexFactor + (event.keyCode - 48)
        this.props.onSetMultiplex(factor)
      },
    }
    
    return (
      <main>
        <HotKeys keyMap={map} handlers={handlers} className="app">
          <h1 className="app-name">Clash</h1> 
          <Menu>
            <ActorList />
          </Menu>
        </HotKeys>
        <ModeLine multiplex={this.props.multiplexFactor} mode={'default'} />
      </main>
    );
  }
}

export default App;

import 'purecss/build/pure.css';
import 'normalize.css';
import styles from 'styles/App.css';
import { Box } from 'reflexbox';

import mousetrap from 'mousetrap';
import React from 'react';

import DiceBox from './DiceBox';
import ActorList from './ActorList';
import Menu from './Menu/MenuView';
import ModeLine from './ModeLine';

class App extends React.Component {
  componentDidMount() {
    mousetrap.bind('j', () => this.props.onSelectActor({motion: 'next'}));
    mousetrap.bind('k', () => this.props.onSelectActor({motion: 'prev'}));
    mousetrap.bind('g g', () => this.props.onSelectActor({relative: 'first'}));
    mousetrap.bind('G', () => this.props.onSelectActor({relative: 'last'}));
  }
  
  render() {
    return (
      <main>
        <div className="app pure-g">
          <div className="pure-u-4-5">
            <h1 className="app-name">Clash</h1> 
            <ActorList {...this.props} />
          </div>
          <div className="pure-u-1-5">
            <Menu />
          </div>
        </div>
        <ModeLine mode={'default'} />
      </main>
    );
  }
}

export default App;

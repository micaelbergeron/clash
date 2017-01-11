import 'purecss/build/pure.css';
import 'normalize.css';
import styles from 'styles/App.css';

import mousetrap from 'mousetrap';
import { HotKeys } from 'react-hotkeys';
import React from 'react';
import R from 'ramda';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';

import ActorList from './ActorList';
import Menu from './Menu/MenuView';
import ModeLine from './ModeLine';

import { selectActor } from 'actions/actions.js';

const map = {
  'cancel': ['esc', 'ctrl+g'],
}

class App extends React.Component {
  render() {
    return (
      <main>
        <h1 className="app-name">Clash</h1> 
        <HotKeys keyMap={map} className="app">
          <Menu>
            <ActorList />
          </Menu>
        </HotKeys>
        <ModeLine multiplex={this.props.multiplexFactor} mode={'default'} />
      </main>
    );
  }
}

const mapStateToProps = (state) => ({
  multiplexFactor: state.multiplex,
})

export default connect(mapStateToProps)(App);

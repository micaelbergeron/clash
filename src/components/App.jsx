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
import { IconButton } from 'material-ui'
import Folder from 'material-ui/svg-icons/file/folder'

import { selectActor } from 'actions/actions.js';
import { CombatView } from './ActorListViews'


const map = {
  'cancel': ['esc', 'ctrl+g'],
}

class App extends React.Component {
  render() {
    return (
      <main>
        <h1 className="app-name">
          Clash
          <IconButton onClick={(e) => console.log('save store')}><Folder /></IconButton>
        </h1>
        <HotKeys keyMap={map} className="app">
          <Menu>
            <ActorList />
          </Menu>
        </HotKeys>
        <ModeLine multiplex={this.props.multiplexFactor} view={this.props.view} />
      </main>
    );
  }
}

const mapStateToProps = (state) => ({
  multiplexFactor: state.multiplex,
  view: state.actors.get('view'),
})

export default connect(mapStateToProps)(App);

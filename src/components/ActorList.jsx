require('styles/ActorList.css')

import React from 'react';
import ReactDOM from 'react-dom';
import R from 'ramda';
import ActorEntry from './ActorEntry';
import { connect } from 'react-redux';
import { HotKeys } from 'react-hotkeys';

import * as actions from 'actions/actions';

const map = {
  'select_down': 'j',
  'select_up': 'k',
  'select_first': 'g g',
  'select_last': 'G',
  'multiplex': R.range(0,10).map(String),
}

// TODO: virtualize the rendering
class ActorList extends React.Component {
  displayName: 'ActorList';

  focus() {
    ReactDOM.findDOMNode(this).focus();
  }

  constructor(props) {
    super(props)
    this.state = { showHelp: false }
    this.componentDidMount = this.focus;
    this.componentDidUpdate = this.focus;
  }

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
    
    let { actors, selectedActor, ...rest } = Object.assign({ actors: [], selectedActor: 0 }, this.props);
    this.props = rest;

    return(
      <HotKeys keyMap={map} handlers={handlers} attach={window} focused={true} component="ol" id="initiative-list" className="pure-table pure-table-horizontal">
      {actors.map(entry =>
        <ActorEntry key={entry.id} actor={entry} selected={entry === selectedActor} onClick={this.props.onSelectActor} />
      )}
      </HotKeys>
    )
  }
}

const ActorListView = connect(
  (state) => ({
    actors: state.actors,
    selectedActor: state.actors[state.selectedActorIndex],
    multiplexFactor: state.multiplex,
  }),
  (dispatch) => ({
    onAddActor: (actor) =>          dispatch(actions.addActor(actor)),
    onRemoveActor: (actor_or_id) => dispatch(actions.removeActor(actor_or_id)),
    onSelectActor: (actor) =>       dispatch(actions.selectActor(actor)),
    onSetMultiplex: (factor) =>     dispatch(actions.setMultiplex(factor)),
  })
)(ActorList);

export default ActorListView;

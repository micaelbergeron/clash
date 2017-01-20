require('styles/ActorList.css')

import React from 'react';
import ReactDOM from 'react-dom';
import R from 'ramda';
import ActorEntry from './ActorEntry';
import { connect } from 'react-redux';
import { HotKeys } from 'react-hotkeys';
import { CombatView, View } from 'components/ActorListViews'; 

import * as actions from 'actions/actions';

const map = {
  'select_down': ['j', 'down'],
  'select_up': ['k', 'up'],
  'select_first': 'g g',
  'select_last': 'G',
  'multiplex': R.range(0,10).map(String),
  'view_combat': ['ctrl+m c'],
  'view_edit': ['ctrl+m e'],
}

// TODO: virtualize the rendering with react-virtualized
class ActorList extends React.Component {
  displayName: 'ActorList';

  focus() {
    ReactDOM.findDOMNode(this).focus();
  }

  constructor(props) {
    super(props)
    this.state = {
      showHelp: false,
      view: props.view || new View(),
    }
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
      'view_combat': (event) => this.setState({ view: CombatView }),
      'view_edit': (event) => this.setState({ view: new View({ sortFn: a => a.name }) }),
    }
    
    let { actors, selectedActor, ...rest } = this.props;
    this.props = rest;

    return(
      <HotKeys keyMap={map} handlers={handlers} attach={window} focused={true} component="ol" id="initiative-list" className="pure-table pure-table-horizontal">
        {actors.sortBy(this.state.view.sortFn).map(entry =>
          <ActorEntry key={entry.id} view={this.state.view} actor={entry} selected={entry === selectedActor} onClick={this.props.onSelectActor} />
         )}
      </HotKeys>
    )
  }
}

const ActorListView = connect(
  (state) => ({
    actors: state.actors.get('repo'), // list?
    selectedActor: state.actors.getIn(['repo', state.actors.get('selectedActorIndex')]), // reselect
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

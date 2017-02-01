require('styles/ActorList.css')

import React from 'react';
import ReactDOM from 'react-dom';
import R from 'ramda';
import ActorEntry from './ActorEntry';
import { connect } from 'react-redux';
import { HotKeys } from 'react-hotkeys';
import * as Views from 'components/ActorListViews'; 
import * as actions from 'actions/actions';
import * as actorActions from 'actions/actors';
import { ActionCreators as undoActions } from 'redux-undo';


const map = {
  'select_down': ['j', 'down'],
  'select_up': ['k', 'up'],
  'select_first': 'g g',
  'select_last': 'G',
  'multiplex': R.range(0,10).map(String),
  'view_combat': ['ctrl+m c'],
  'view_edit': ['ctrl+m e'],
  'view_default': ['ctrl+m d'],
  'undo': ['ctrl+z', 'u'],
  'redo': ['ctrl+shift+z', 'ctrl+r'],
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
      'view_default': (event) => this.props.onChangeView('DefaultView'),
      'view_combat': (event) => this.props.onChangeView('CombatView'),
      'view_edit': (event) => this.props.onChangeView('EditView'),
      // these two makes no sense here
      'undo': (event) => this.props.onUndo(),
      'redo': (event) => { event.preventDefault(); this.props.onRedo(); },
    }
    
    let { actors, selectedActor, ...rest } = this.props;
    this.props = rest;

    return(
      <HotKeys keyMap={map} handlers={handlers} className="fill-y scroll-y">
        <div className="title">
          <p>Actors<span className="title__hotkeys">j&nbsp;k&nbsp;/↑↓ to move</span></p>
        </div>
        <ol id="initiative-list" className="pure-table pure-table-horizontal">
        {actors.sortBy(this.props.view.sortFn).map(entry =>
          <ActorEntry key={entry.id} view={this.props.view} actor={entry} selected={entry === selectedActor} onClick={this.props.onSelectActor} />
         )}
        </ol>
      </HotKeys>
    )
  }
}

const ActorListView = connect(
  (state) => ({
    actors: state.actors.present.get('repo'), // list?
    selectedActor: state.actors.present.getIn(['repo', state.actors.present.get('selectedActorIndex')]), // reselect
    multiplexFactor: state.multiplex,
    view: Views[state.actors.present.get('view')],
  }),
  (dispatch) => ({
    onSetMultiplex: (factor) =>     dispatch(actions.setMultiplex(factor)),
    onAddActor: (actor) =>          dispatch(actorActions.addActor(actor)),
    onRemoveActor: (actor_or_id) => dispatch(actorActions.removeActor(actor_or_id)),
    onSelectActor: (actor) =>       dispatch(actorActions.selectActor(actor)),
    onChangeView: (view) =>         dispatch(actorActions.changeActorsView(view)),
    onUndo: () =>                   dispatch(undoActions.undo()),
    onRedo: () =>                   dispatch(undoActions.redo()),
  })
)(ActorList);

export default ActorListView;

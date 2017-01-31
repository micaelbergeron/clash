require('styles/ActorList.css')

import React from 'react';
import ReactDOM from 'react-dom';
import R from 'ramda';
import ActorEntry from './ActorEntry';
import { connect } from 'react-redux';
import { HotKeys } from 'react-hotkeys';
import * as Views from 'components/ActorListViews'; 
import * as actions from 'actions/actions';

const map = {
  'select_down': ['j', 'down'],
  'select_up': ['k', 'up'],
  'select_first': 'g g',
  'select_last': 'G',
  'multiplex': R.range(0,10).map(String),
  'view_combat': ['ctrl+m c'],
  'view_edit': ['ctrl+m e'],
  'view_default': ['ctrl+m d'],
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
    }
    
    let { actors, selectedActor, ...rest } = this.props;
    this.props = rest;

    return(
      <HotKeys keyMap={map} handlers={handlers} attach={window} focused={true} className="fill-y scroll-y">
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
    actors: state.actors.get('repo'), // list?
    selectedActor: state.actors.getIn(['repo', state.actors.get('selectedActorIndex')]), // reselect
    multiplexFactor: state.multiplex,
    view: Views[state.actors.get('view')],
  }),
  (dispatch) => ({
    onAddActor: (actor) =>          dispatch(actions.addActor(actor)),
    onRemoveActor: (actor_or_id) => dispatch(actions.removeActor(actor_or_id)),
    onSelectActor: (actor) =>       dispatch(actions.selectActor(actor)),
    onSetMultiplex: (factor) =>     dispatch(actions.setMultiplex(factor)),
    onChangeView: (view) =>         dispatch(actions.changeActorsView(view)),
  })
)(ActorList);

export default ActorListView;

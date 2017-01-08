require('styles/ActorList.css')

import React from 'react';
import ReactDOM from 'react-dom';
import ActorEntry from './ActorEntry';
import { selectActor } from 'actions/actions';
import { connect } from 'react-redux';
import { FocusTrap } from 'react-hotkeys';

class ActorList extends React.Component {
  displayName: 'ActorList';

  componentDidUpdate() {
    const node = ReactDOM.findDOMNode(this)
    node.focus()
  }
  
  constructor(props) {
    super(props)
    this.state = { showHelp: false }
  }

  render() {
    let { actors, selectedActor, ...rest } = Object.assign({ actors: [], selectedActor: 0 }, this.props);
    this.props = rest;

    return(
      <FocusTrap component="ol" id="initiative-list" className="pure-table pure-table-horizontal">
      {actors.map(entry =>
        <ActorEntry key={entry.id} actor={entry} selected={entry === selectedActor} onClick={this.props.onSelectActor} />
      )}
      </FocusTrap>
    )
  }
}

const ActorListView = connect(
  (state) => ({
    actors: state.actors,
    selectedActor: state.actors[state.selectedActorIndex],
  }),
  (dispatch) => ({
    onSelectActor: (actor) => dispatch(selectActor(actor)),
  })
)(ActorList);

export default ActorListView;

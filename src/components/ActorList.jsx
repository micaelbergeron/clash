require('styles/ActorList.css')

import mousetrap from 'mousetrap';
import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import ActorEntry from './ActorEntry';
import Keycap from './Keycap';
import { selectActor } from 'actions/actions';
import { withReflex } from 'reflexbox';

import { connect } from 'react-redux';

class ActorList extends React.Component {
  displayName: 'ActorList';
  constructor(props) {
    super(props)
    this.state = { showHelp: false }
  }
  componentDidMount() {
    mousetrap.bind('?', () => this.setState({showHelp: true}))
    mousetrap.bind('esc', () => this.setState({showHelp: false}))
  }
  render() {
    let { actors, selectedActor, ...rest } = Object.assign({ actors: [], selectedActor: 0 }, this.props);
    this.props = rest;

    return(
      <div>
        <ol id="initiative-list" className="pure-table pure-table-horizontal">
          {actors.map(entry =>
            <ActorEntry key={entry.id} actor={entry} selected={entry === selectedActor} onClick={this.props.onSelectActor} />
          )}
        </ol>
      </div>
    )
  }
}

const ActorListView = connect(
  (state) => ({
    actors: state.actors,
    selectedActorId: state.selectedActorId,
  }),
  (dispatch) => ({
    onSelectActor: (actor) => dispatch(selectActor(actor)),
  })
)(ActorList);

export default withReflex()(ActorListView);

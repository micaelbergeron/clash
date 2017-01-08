import _ from 'lodash';
import * as actions from 'actions/actions.js';
import { connect } from 'react-redux';
import App from './App';


const mapStateToProps = (state) => ({
  actors: state.actors,
  selectedActor: _.find(state.actors, a => a.id == state.selectedActorId),
  multiplexFactor: state.multiplex,
})

const mapDispatchToProps = (dispatch) => ({ 
  onAddActor: (actor) =>          dispatch(actions.addActor(actor)),
  onRemoveActor: (actor_or_id) => dispatch(actions.removeActor(actor_or_id)),
  onSelectActor: (actor) =>       dispatch(actions.selectActor(actor)),
  onSetMultiplex: (factor) =>     dispatch(actions.setMultiplex(factor)),
})

export default connect(mapStateToProps, mapDispatchToProps)(App);

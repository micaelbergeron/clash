_ = require('lodash')
A = require('../actions/actions')
connect = require('react-redux').connect
App = require('./App')

mapStateToProps = (state) ->
  actors: state.actors
  selectedActor: _.find(state.actors, (a) -> a.id == state.selectedActorId)

mapDispatchToProps = (dispatch) -> 
  onAddActor: (actor) ->
    dispatch(A.addActor(actor))
  onRemoveActor: (actor) ->
    dispatch(A.removeActor(actor))
  onSelectActor: (actor_or_id) ->
    dispatch(A.selectActor(actor_or_id))

module.exports =
  AppView = connect(
    mapStateToProps,
    mapDispatchToProps
  )(App)

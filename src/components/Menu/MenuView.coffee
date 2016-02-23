_ = require('lodash')
A = require('../../actions/actions')
connect = require('react-redux').connect
Menu = require('./Menu').Menu

mapStateToProps = (state) ->
  actor: _.find(state.actors, (a) -> a.id == state.selectedActorId)

mapDispatchToProps = (dispatch) -> 
  dispatch: dispatch
  onChangeActorProp: (actor, prop, mod) ->
    dispatch(A.changeActorProp(actor, prop, mod))

module.exports =
  MenuView = connect(
    mapStateToProps,
    mapDispatchToProps
  )(Menu)
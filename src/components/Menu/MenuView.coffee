_ = require('lodash')
A = require('../../actions/actions')
connect = require('react-redux').connect
Menu = require('./Menu').Menu

mapStateToProps = (state) ->
  target: state.selectedActorId

mapDispatchToProps = (dispatch) -> 
  onChangeActorProp: (actor, prop, mod) ->
    dispatch(A.changeActorProp(actor, prop, mod))

module.exports =
  MenuView = connect(
    mapStateToProps,
    mapDispatchToProps
  )(Menu)

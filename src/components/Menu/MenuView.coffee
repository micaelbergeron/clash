_ = require('lodash')
connect = require('react-redux').connect
Menu = require('./Menu').Menu

mapStateToProps = (state) ->
  actor: state.actors.present.getIn(['repo', state.actors.present.get('selectedActorIndex')])

mapDispatchToProps = (dispatch) -> 
  dispatch: dispatch

module.exports =
  MenuView = connect(
    mapStateToProps,
    mapDispatchToProps
  )(Menu)

_ = require('lodash')
A = require('../actions/actions')
connect = require('react-redux').connect
ActorList = require('./ActorList')

mapStateToProps = (state) ->
  actors: state.actors

mapDispatchToProps = (dispatch) -> {
  onAddActor: (actor) ->
    dispatch(A.addActor(actor))
  }

module.exports =
  ActorListView = connect(
    mapStateToProps,
    mapDispatchToProps
  )(ActorList)

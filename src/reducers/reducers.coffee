_ = require('lodash')
actions = require('actions/actions')
  
initialState =
  actors: []
  round: 0
  timer: 0
  roll: 1

clashApp = (state = initialState, action) ->
  switch action.type
    when actions.CHANGE_ACTOR_PROP
      actor = state.actors[action.index]
      
      # only set existing props
      state unless actor
      state unless _.has(actor, action.prop)
      
      _state = _.cloneDeep(state)
      _.set(_state.actors[action.index], action.prop, action.mod)      
      _state
    when actions.ADD_ACTOR
      _.assign({}, state, {
        actors: _(state.actors).push(action.actor).value()
      })
    else state

module.exports = clashApp

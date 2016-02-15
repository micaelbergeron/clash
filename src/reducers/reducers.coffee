_ = require('lodash')
actions = require('actions/actions')
  
initialState =
  actors: []
  selectedActorId: -1
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
      _state = _.cloneDeep(state)
      _state.actors.push(action.actor)
      _state
    when actions.REMOVE_ACTOR
      _state = _.cloneDeep(state)
      _state.actors = _.filter(_state.actors, (a) -> a.id == action.actor) 
      _state
    when actions.SELECT_ACTOR
      _state = _.cloneDeep(state)
      has_id = (id) -> (a) -> a.id == id
      actors_count = state.actors.length
      
      _selectedActorIndex = _.findIndex(state.actors, has_id(state.selectedActorId))
      next_idx = switch(action.motion.type)
        when 'motion'
          _selectedActorIndex + action.motion.arg
        when 'id'
          _.findIndex(_state.actors, has_id(action.motion.arg))
        when 'relative'
          if action.motion.arg >= 0 then action.motion.arg
          else actors_count + action.motion.arg

      # cycle through the list
      next_idx = if next_idx < 0 then actors_count - 1
      else next_idx % actors_count
      
      _state.selectedActorId = _state.actors[next_idx]?.id or -1
      _state
    else state

module.exports = clashApp

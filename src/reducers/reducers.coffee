_ = require('lodash')
R = require('ramda')
actions = require('actions/actions')
parser = require('./dice.pegjs')

has_id = (id) -> (a) -> a.id == id

clashApp = (state, action) ->
  switch action.type
    when actions.CHANGE_ACTOR_PROP
      actorIndex = _.findIndex(state.actors, has_id(action.actor))
      actor = state.actors[actorIndex]

      # only set existing props
      state unless actor
      state unless _.has(actor, action.prop)
      
      _state = _.cloneDeep(state)
      _.set(_state.actors[actorIndex], action.prop, action.mod)      
      _state
    when actions.ADD_ACTOR
      _state = _.cloneDeep(state)
      _state.actors.push(action.actor)
      _state
    when actions.REMOVE_ACTOR
      _state = _.cloneDeep(state)
      _state.actors = R.remove(state.selectActorIndex, action.count, _state.actors) 
      _state
    when actions.SELECT_ACTOR
      _state = _.cloneDeep(state)
      actors_count = state.actors.length
      return -1 if actors_count == 0
      
      _selectedActorIndex = state.selectedActorIndex
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
      
      _state.selectedActorIndex = next_idx
      _state
    when actions.SET_MULTIPLEX
      _state = _.cloneDeep(state)
      _state.multiplex = Math.max(action.factor, 0)
      _state
    else state

module.exports = clashApp

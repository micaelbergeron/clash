import _ from 'lodash'
import R from 'ramda'
import * as actions from 'actions/actions'


const has_id = R.curry((id, a) => a.id == id)

export default (state, action) =>
  R.cond([
    [R.equals(actions.CHANGE_ACTOR), _ => {
      const actorIndex = R.findIndex(R.propEq('id', action.actor.id), state.get('actors').toJS())
      return state.setIn(['actors', actorIndex], action.actor)
    }],
    [R.equals(actions.ADD_ACTOR), _ => {
      return state.updateIn(['actors'], actors => actors.concat(action.actor))
    }],
    [R.equals(actions.REMOVE_ACTOR), _ => {
      return state.updateIn(['actors'], actors => actors.splice(state.get('selectedActorIndex'), action.count))
    }],
    [R.equals(actions.SELECT_ACTOR), _ => {
      const actors = state.get('actors')
      const actors_count = actors.size
      const _selectedActorIndex = state.get('selectedActorIndex')
      const next_idx = R.cond([
        [R.equals('motion'), R.always(_selectedActorIndex + action.motion.arg)],
        [R.equals('id'), _ => R.findIndex(R.propEq('id', action.motion.arg), actors.toJS())],
        [R.equals('relative'), R.always((action.motion.arg + actors_count) % actors_count)],
      ])(action.motion.type)

      // cycle through the list
      return state.set('selectedActorIndex', next_idx)
    }],
    [R.equals(actions.SET_MULTIPLEX), _ => {
      return state.set('multiplex', Math.max(action.factor, 0))
    }],
    [R.T, action => state]
  ])(action.type)

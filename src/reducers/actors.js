import R from 'ramda'
import * as actions from 'actions/actions'
import Immutable from 'immutable'
import { View } from 'components/ActorListViews'

const has_id = R.curry((id, a) => a.id == id)

const initialState = Immutable.Map({
  repo: Immutable.List(),
  selectedActorId: -1,
  view: 'DefaultView',
})

export default (state=initialState, action) => {
  const nextState = R.cond([
    [R.equals(actions.CHANGE_ACTOR), _ => {
      const actor_id = action.actor.get('id')
      const actorIndex = state.get('repo').findIndex(a => a.get('id') === actor_id)
      if (actorIndex === -1)
        return state;
      
      return state.setIn(['repo', actorIndex], action.actor)
    }],
    
    [R.equals(actions.ADD_ACTOR), _ => {
      return state.update('repo', actors => actors.push(action.actor))
    }],
    
    [R.equals(actions.REMOVE_ACTOR), _ => {
      return state.update('repo', actors => actors.splice(state.get('selectedActorIndex'), action.count))
    }],
    
    [R.equals(actions.SELECT_ACTOR), _ => {
      const actors = state.get('repo')
      const actors_count = actors.size
      // TODO: index doesn't work if the repo isn't sorted
      const _selectedActorIndex = state.get('selectedActorIndex')
      const next_idx = R.cond([
        [R.equals('motion'), R.always(_selectedActorIndex + action.motion.arg)],
        [R.equals('id'), _ => R.findIndex(R.propEq('id', action.motion.arg), actors.toJS())],
        [R.equals('relative'), R.always((action.motion.arg + actors_count) % actors_count)],
      ])(action.motion.type)

      // cycle through the list
      return state.set('selectedActorIndex', next_idx)
    }],

    [R.equals(actions.CHANGE_ACTORS_VIEW), _ => {
      return state.set('view', action.viewName)
    }],
    
    [R.T, action => state]
  ])(action.type)

  // after the action went through, reorder the actors
  return nextState.update('repo', repo => repo.sortBy(nextState.get('view').orderFn))
}

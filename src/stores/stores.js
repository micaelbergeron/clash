import R from 'ramda';
import clashApp from '../reducers/reducers'

import { createStore, applyMiddleware, compose } from 'redux'
import { combineReducers } from 'redux-immutable'
import { enableBatching } from 'redux-batched-actions'
import { batchActions, setMultiplex } from 'actions/actions'
import Immutable from 'immutable'
  
const initialState = Immutable.Map({
  actors: Immutable.List(),
  selectedActorId: -1,
  round: 0,
  timer: 0,
  roll: 1,
  multiplex: 0,
})

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const multiplexMiddleware = store => next => action => {
  const m = Math.max(store.getState().get('multiplex'), 1)
  const multiplex = action.multiplex || R.identity
  let actions = action;

  // do not multiplex when the factor is unit
  if (action.multiplex && m > 1) {
    // if the action is multiplexed, consume the current factor
    actions = batchActions([multiplex(action, m), setMultiplex(0)])
  }

  next(actions)
}

// the main store
let store = createStore(enableBatching(clashApp),
                        initialState,
                        composeEnhancers(
                          applyMiddleware(
                            multiplexMiddleware,
                          )
                        ));


// let just inspect the store mutations
let unsubscribe = store.subscribe(() => console.log(store.getState().toJS()))

console.log(store.getState());
export default store;

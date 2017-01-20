import R from 'ramda';

import { combineReducers, createStore, applyMiddleware, compose } from 'redux'
// import { combineReducers } from 'redux-immutable'
import { persistStore, autoRehydrate } from 'redux-persist'
import immutableTransform from 'redux-persist-transform-immutable'
import { enableBatching } from 'redux-batched-actions'
import { batchActions, setMultiplex } from 'actions/actions'
import Immutable from 'immutable'

import actors from '../reducers/actors'
import multiplex from '../reducers/multiplex'
import { Property } from '../models/Properties'
  

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const multiplexMiddleware = store => next => action => {
  const m = Math.max(store.getState().multiplex, 1)
  const multiplex = action.multiplex || R.identity
  let actions = action;

  // do not multiplex when the factor is unit
  if (action.multiplex && m > 1) {
    // if the action is multiplexed, consume the current factor
    actions = batchActions([multiplex(action, m), setMultiplex(0)])
  }

  next(actions)
}

const reducer = combineReducers({
  actors,
  multiplex,
})

// the main store
const store = createStore(enableBatching(reducer),
                          composeEnhancers(
                            applyMiddleware(multiplexMiddleware),
                            autoRehydrate(),
                          ));

persistStore(store, { transforms: [immutableTransform()] })

// let just inspect the store mutations
let unsubscribe = store.subscribe(() => console.log(store.getState()))
export default store;

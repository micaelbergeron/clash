import { batchActions as _batchActions } from 'redux-batched-actions'
import R from 'ramda'
import { factoryOf } from '../models/Actor'
import * as Views from 'components/ActorListViews'

export function batchActions(actions) {
  // action -> [actions]
  const flattenBatch = R.compose(
    R.ifElse(
      R.propEq('type', 'BATCHING_REDUCER.BATCH'),
      R.prop('payload'),
      R.of,
    )
  )

  const unbatch = R.reduce(
    (acc, val) => R.concat(acc, flattenBatch(val)), []
  )

  const unbatched = unbatch(actions)

  // the next action batch
  const multiplexable = unbatched[0];
  let batched = _batchActions(unbatched);
  
  if (multiplexable.multiplex) {
    // if the first action can be multiplexed, let's forward it.
    batched.multiplex = (action, m) => batchActions([
      multiplexable.multiplex(multiplexable, m), // multiplex the first action
      ...batched.payload.splice(1), // append the rest
    ])
  }
  return batched
}

const multiplex = fn => apply => _ => {
  const action = Object.assign({meta: {}}, fn.apply(null, arguments))   
  return multiplex => apply(action, multiplex)
}

const timesMultiplex = (action, m) => {
  action.meta.times = m
  return action
}    


const notifyFor = (actionCreator) => (...args) => {
  const action = actionCreator(...args)
  return batchActions([action, notify(action.type, action)])
}

/*
 * action types
 */

export const CHANGE_ACTOR = 'CHANGE_ACTOR';
export const ADD_ACTOR = 'ADD_ACTOR';
export const REMOVE_ACTOR = 'REMOVE_ACTOR';
export const SELECT_ACTOR = 'SELECT_ACTOR';
export const CHANGE_ACTORS_VIEW = 'CHANGE_ACTORS_VIEW'; // use a router? could be cool, /combat or /edit

export const SET_MULTIPLEX = 'SET_MULTIPLEX';
export const NOTIFY = 'NOTIFY';
export const SAVE_STORE = 'SAVE';

export const save = R.always({ type: SAVE_STORE })

// add a message in the notification area
export function notify(message, args) {
  return {
    type: NOTIFY,
    message: message,
    // onClick: () =>
  }
}

export const changeActor = notifyFor((actor, mutation, withFn=R.nthArg(1)) => {
  return {
    type: CHANGE_ACTOR,
    actor: actor.mergeWith(withFn, mutation),
  }
})


export const addActor = notifyFor((actor) => {
  return {
    multiplex: (action, m) => batchActions(
      R.times(_ => addActor(factoryOf(actor).create()), m)
    ),
    type: ADD_ACTOR,
    actor
  }
})

export const removeActor = () => {
  return {
    multiplex: (action, m) => {
      return Object.assign(action, { count: m })
    },
    type: REMOVE_ACTOR,
    count: 1
  }
}

/*
 * A selector can either be
 *   motion: 'next', 'prev', +1, -1
 *   relative: 'first', 'last', <index>
 *   id: <actor id>
 */
export function selectActor(selector) {
  var parsed = false;
  var type, arg;
  if (!parsed && selector.hasOwnProperty('motion')) {
    parsed = true;
    type = 'motion';
    switch(selector.motion) {
      case 'next':
        arg = 1;
        break;
      case 'prev':
      case 'previous':
        arg = -1;
        break;
      default:
        arg = Number(selector.motion);
    }
  }

  if (!parsed && selector.has && selector.has('id')) {
    parsed = true;
    type = 'id';
    arg = selector.get('id');
  }

  if (!parsed && selector.hasOwnProperty('relative')) {
    parsed = true;
    type = 'relative';
    switch(selector.relative) {
      case 'first':
      case 'head':
        arg = 0;
        break;
      case 'last':
      case 'tail':
        arg = -1;
        break;
      default:
        arg = Number(selector.relative);
    }
  }

  if (!parsed) throw "Invalid selector, valid keys are 'motion', 'relative' or 'id'.";
  
  return {
    multiplex: (action, m) => {
      if (action.motion.type === 'relative'
          ||  action.motion.type === 'id')
        return action;
      action.motion.arg *= m;
      return action;
    },
    type: SELECT_ACTOR,
    motion: {type, arg}
  }
}

// todo: throw on wrong view
export const changeActorsView = (viewName) => ({
  type: CHANGE_ACTORS_VIEW,
  viewName,
  view: Views[viewName],
})

// the multiplex is a value the multiplexMiddleware will use to mutate actions on-the-fly
// so they are applied N times.
// i.e: issuing a delete statement 
export function setMultiplex(factor) {
  return {
    type: SET_MULTIPLEX,
    factor: factor,
  }
}

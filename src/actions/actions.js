import { batchActions } from 'redux-batched-actions'
import R from 'ramda'

const multiplex = fn => apply => _ => {
  const action = Object.assign({meta: {}}, fn.apply(null, arguments))   
  return multiplex => apply(action, multiplex)
}

const timesMultiplex = (action, m) => {
  action.meta.times = m
  return action
}    

/*
 * action types
 */

export const CHANGE_ACTOR_PROP = 'CHANGE_ACTOR_PROP';
export const ADD_ACTOR = 'ADD_ACTOR';
export const REMOVE_ACTOR = 'REMOVE_ACTOR';
export const SELECT_ACTOR = 'SELECT_ACTOR';
export const SET_MULTIPLEX = 'SET_MULTIPLEX';

export function changeActorProp(actor, prop, mod) {
  actor = actor.id || actor
  return {
    type: CHANGE_ACTOR_PROP,
    actor,
    prop,
    mod
  }
}

export function addActor(actor) {
  return {
    multiplex: (action, m) => batchActions(
      //R.times(Number, 10)
      R.times(_ => addActor(actor.clone()), m)
    ),
    type: ADD_ACTOR,
    actor
  }
}

export const removeActor = actor => {
  var actor = actor.id || actor 
  return {
    multiplex: (action, m) => batchActions(
      R.times(_ => removeActor(actor), m)
    ),
    type: REMOVE_ACTOR,
    actor
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

  if (!parsed && selector.hasOwnProperty('id')) {
    parsed = true;
    type = 'id';
    arg = selector.id;        
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

// the multiplex is a value the multiplexMiddleware will use to mutate actions on-the-fly
// so they are applied N times.
// i.e: issuing a delete statement 
export function setMultiplex(factor) {
  return {
    type: SET_MULTIPLEX,
    factor: factor,
  }
}

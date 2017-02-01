import R from 'ramda'
import { batchActions, notifyFor } from './actions'
import { factoryOf } from '../models/Actor'
import { viewFor } from '../models/helper'

export const CHANGE_ACTOR = 'CHANGE_ACTOR';
export const ADD_ACTOR = 'ADD_ACTOR';
export const REMOVE_ACTOR = 'REMOVE_ACTOR';
export const SELECT_ACTOR = 'SELECT_ACTOR';
export const CHANGE_ACTORS_VIEW = 'CHANGE_ACTORS_VIEW'; // use a router? could be cool, /combat or /edit

export const TYPES = [
  CHANGE_ACTOR,
  ADD_ACTOR,
  REMOVE_ACTOR,
  SELECT_ACTOR,
  CHANGE_ACTORS_VIEW,
]

export const changeActor = notifyFor((actor, mutation, withFn=R.nthArg(1)) => {
  return {
    type: CHANGE_ACTOR,
    actor: actor.mergeWith(withFn, mutation),
    undoable: true,
  }
})

export const addActor = notifyFor((actor) => {
  return {
    multiplex: (action, m) => batchActions(
      R.times(_ => addActor(factoryOf(actor).create()), m)
    ),
    type: ADD_ACTOR,
    undoable: true,
    actor
  }
})

export const removeActor = () => {
  return {
    multiplex: (action, m) => {
      return Object.assign(action, { count: m })
    },
    type: REMOVE_ACTOR,
    undoable: true,
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
  view: viewFor(viewName),
})

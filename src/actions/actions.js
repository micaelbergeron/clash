import { batchActions as _batchActions } from 'redux-batched-actions'
import R from 'ramda'

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
  let batched = _batchActions(unbatched);
  if (batched.payload[0].multiplex) {
    // if the first action can be multiplexed, let's forward it.
    batched.multiplex = (action, m) => batchActions([
      batched.payload[0].multiplex(action, m), 
      ...batched.payload.splice(1),
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
export const SET_MULTIPLEX = 'SET_MULTIPLEX';
export const NOTIFY = 'NOTIFY';


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
    actor: R.mergeWith(withFn, actor, mutation),
  }
})


export const addActor = notifyFor((actor) => {
  return {
    multiplex: (action, m) => batchActions(
      R.times(_ => addActor(actor.meta.template.createFactory().create()), m)
    ),
    type: ADD_ACTOR,
    actor
  }
})

export const removeActor = () => {
  return {
    multiplex: (action, m) => Object.assign(action, { count: m }),
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

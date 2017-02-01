import R from 'ramda'
import { batchActions as _batchActions } from 'redux-batched-actions'

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

export const SET_MULTIPLEX = 'SET_MULTIPLEX';
export const NOTIFY = 'NOTIFY';
export const SAVE_STORE = 'SAVE';

export const notifyFor = (actionCreator) => (...args) => {
  const action = actionCreator(...args)
  return batchActions([action, notify(action.type, action)])
}

export const save = R.always({ type: SAVE_STORE })

// add a message in the notification area
export function notify(message, args) {
  return {
    type: NOTIFY,
    message: message,
    // onClick: () =>
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

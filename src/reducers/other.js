import R from 'ramda'
import * as actions from 'actions/actions'


const has_id = R.curry((id, a) => a.id == id)

export default (state, action) =>
  R.cond([
    [R.equals(actions.SET_MULTIPLEX), _ => {
      return state.set('multiplex', Math.max(action.factor, 0))
    }],
    [R.T, action => state]
  ])(action.type)

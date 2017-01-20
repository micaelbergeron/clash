import R from 'ramda'
import * as actions from 'actions/actions'


export default (state=0, action) =>
  R.cond([
    [R.equals(actions.SET_MULTIPLEX), _ => {
      return Math.max(action.factor, 0)
    }],
    [R.T, action => state]
  ])(action.type)

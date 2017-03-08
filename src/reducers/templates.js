import R from 'ramda'
import Immutable from 'immutable'

import * as actions from 'actions/template'
import * as defaultTemplates from 'models/templates'


const initialState = Immutable.Set(
  R.map(Immutable.Map, R.values(defaultTemplates))
);

export default (state=initialState, action) => {
  switch(action.type) {
    case actions.IMPORT_TEMPLATES:
      return Immutable.Set(action.templates)
    default:
      return state
  }
}


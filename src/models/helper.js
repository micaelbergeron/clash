import R from 'ramda'
import * as Views from 'components/ActorListViews'


export const viewFor = viewName =>
  Views[viewName] || new Views.View();



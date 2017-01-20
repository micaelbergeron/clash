import R from 'ramda'
import { Record } from 'immutable'
import { templateOf } from '../models/Actor'

export const View = Record({
  sortFn: a => a.ini,
  visibleAttrsFn: a => templateOf(a).allPropertyNames(),
  mutableAttributes: a => R.map(R.prop('name'), templateOf(a).mutableProperties()),
  // attribute 
})
  
export const CombatView = new View({
  sortFn: a => a.hp,
  visibleAttrsFn: R.always(['name', 'hp', 'ini', 'spot', 'listen']),
});
  

import R from 'ramda'
import { Record } from 'immutable'
import { templateOf } from '../models/Actor'
import style from '../styles/ActorList.css'
import Immutable from 'immutable'


export const View = Record({
  sortFn: a => a.get('ini'),
  orderFn: a => a.get('ini'),
  visibleAttrsFn: a => templateOf(a).allPropertyNames(),
  mutableAttributes: a => R.map(R.prop('name'), templateOf(a).mutableProperties()),
  // attribute 
  pinColor: a => style[a.get('side')] || 'white',
}, 'ActorListView')

export const DefaultView = new View()

export const EditView = new View({
  sortFn: a => a.get('side'),
})
  
export const CombatView = new View({
  sortFn: a => a.get('ini'),
  orderFn: a => a.get('ini'),
  visibleAttrsFn: () => Immutable.List(['name', 'hp', 'ini', 'ac']),
})

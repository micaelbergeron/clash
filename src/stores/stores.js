import { createStore } from 'redux'
import clashApp from '../reducers/reducers'
import * as A from '../actions/actions'

let store = createStore(clashApp)

console.log(store.getState());

let unsubscribe = store.subscribe(() => console.log(store.getState()))

export default store

import { createStore } from 'redux'
import clashApp from '../reducers/reducers'

let store = createStore(clashApp)
let unsubscribe = store.subscribe(() => console.log(store.getState()))

console.log(store.getState());
export default store

import { createStore } from 'redux'
import clashApp from '../reducers/reducers'
  
let initialState = {
    actors: [],
    selectedActorId: -1,
    round: 0,
    timer: 0,
    roll: 1,
}

let store = createStore(clashApp,
                        initialState,
                        window.devToolsExtension ? window.devToolsExtension() : undefined)
let unsubscribe = store.subscribe(() => console.log(store.getState()))

console.log(store.getState());
export default store

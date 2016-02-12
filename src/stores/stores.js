import { createStore } from 'redux'
import clashApp from '../reducers/reducers'
import * as A from '../actions/actions'

let store = createStore(clashApp)

console.log(store.getState());

let unsubscribe = store.subscribe(() => console.log(store.getState()))

store.dispatch(A.addActor({hp: 'HP', ini: 115}))
store.dispatch(A.addActor({hp: 'HP', ini: 10}))
store.dispatch(A.changeActorProp(0, 'hp', '1d8'))
store.dispatch(A.changeActorProp(1, 'hp', '1d10'))
store.dispatch(A.changeActorProp(0, 'hp', '1d12'))
store.dispatch(A.addActor({hp: 'HP', ini: 10}))
store.dispatch(A.addActor({hp: 'HP', ini: 10}))
store.dispatch(A.addActor({hp: 'HP', ini: 10}))

unsubscribe();

export default store

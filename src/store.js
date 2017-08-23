import { createStore, applyMiddleware } from 'redux'
import reducers from './reducers'
import { createLogger } from 'redux-logger'
import thunkMiddleware from 'redux-thunk'

// const store = createStore(
//   rootReducer,
//   applyMiddleware(
//     createLogger({collapsed: true}),
//     thunkMiddleware
//   )
// )

const mapStoreToStorage = () =>
	localStorage.setItem('reduxState', JSON.stringify(store.getState())),
	persistedState = localStorage.getItem('reduxState') ?
		JSON.parse(localStorage.getItem('reduxState')) :
		{
			rooms: new Set(),
			video: true,
			audio: true
		};
const store = createStore(reducers, persistedState)
store.subscribe(mapStoreToStorage)

export default store

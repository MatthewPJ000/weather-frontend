// store/store.js
import { createStore, combineReducers } from 'redux';
import myReducer from './reducer';

const rootReducer = combineReducers({
  myState: myReducer,
});

const store = createStore(rootReducer);

export default store;
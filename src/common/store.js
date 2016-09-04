import {createStore, combineReducers, applyMiddleware} from 'redux';
import {routerReducer} from 'react-router-redux';
import promise from 'redux-promise-middleware';

import test from '@components/home/model/client';

let reducer = combineReducers({
  test,
  routing: routerReducer
});
let middleware = applyMiddleware(promise());
let store = createStore(reducer, middleware);

export default store;

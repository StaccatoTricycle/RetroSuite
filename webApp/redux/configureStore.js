import { applyMiddleware, compose, createStore } from 'redux';
import reducer from './reducer';
import logger from 'redux-logger';

// Middleware... not for production:
let finalCreateStore = compose(
  applyMiddleware(logger())
)(createStore);

let configureStore = function (initialState) {
  return finalCreateStore(reducer, initialState);
};

export default configureStore;

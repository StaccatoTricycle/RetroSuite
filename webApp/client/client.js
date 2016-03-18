import React from 'react';
import { render } from 'react-dom';
import App from '../components/App';
import configureStore from '../redux/configureStore';
import { Provider } from 'react-redux';

let initialState = {};

let store = configureStore(initialState);

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
);

$(document).ready(function () {

  $('.button-collapse').sideNav({
    edge: 'right'
  });

});

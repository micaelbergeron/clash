import 'core-js/fn/object/assign';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux'
import clashStore from './stores/stores'
import AppView from './components/AppView';

// Render the main component into the dom
render(
  <Provider store={clashStore}>
    <AppView />
  </Provider>,
  document.getElementById('app')
);

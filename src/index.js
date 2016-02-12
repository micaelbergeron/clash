import 'core-js/fn/object/assign';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux'
import store from './stores/stores'

import App from './components/Main';

// Render the main component into the dom
render(<Provider store={store}>
         <App/>
       </Provider>,
       document.getElementById('app')
)

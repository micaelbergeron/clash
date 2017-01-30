import 'core-js/fn/object/assign';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux'
import clashStore from './stores/stores'
import AppView from './components/App';

import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import Perf from 'react-addons-perf'
import installDevTools from 'immutable-devtools'
import Immutable from 'immutable'
import injectTapEventPlugin from "react-tap-event-plugin";

// TODO: debug switch
// installDevTools(Immutable);
window.Perf = Perf
injectTapEventPlugin();

// Render the main component into the dom
render(
  <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
    <Provider store={clashStore}>
      <AppView />
    </Provider>
  </MuiThemeProvider>,
  document.getElementById('app')
);

require('normalize.css');
require('purecss/build/pure.css');
require('styles/App.css');

import React from 'react';
import DiceBox from './DiceBox';
import ActorListView from './ActorListView'; 
import Menu from './Menu/Menu';

let yeomanImage = require('../images/yeoman.png');

class AppComponent extends React.Component {
  render() {
    return (
      <div>
        <div><DiceBox /></div>
        <div className="pure-g">
          <div className="pure-u-4-5">
            <ActorListView />
          </div>
          <div className="pure-u-1-5">
            <Menu submenus={[]} title="Main menu" />
          </div>
        </div>
      </div>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;

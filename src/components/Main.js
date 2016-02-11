require('normalize.css');
require('purecss/build/pure.css');
require('styles/App.css');

import React from 'react';
import DiceBox from './DiceBox';
import InitiativeList from './InitiativeList'; 

let yeomanImage = require('../images/yeoman.png');

class AppComponent extends React.Component {
  render() {
    return (
      <div>
        <div><DiceBox /></div>
        <div className="pure-g">
          <div className="pure-u-4-5">
            <InitiativeList entries={[1,2,3,4,5,6,7,7,8,8,8,213,6,54,54,325,4325,432,543,2]} />
          </div>
          <div className="pure-u-1-5">
          </div>
        </div>
      </div>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;

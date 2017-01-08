import React from 'react';
import ReactDOM from 'react-dom';
import { HotKeys } from 'react-hotkeys';
import Keycap from 'components/Keycap';
import R from 'ramda';


export default class ActionList extends React.Component {
  componentWillMount() {
    // we want the moustrap handler to be on the menu
    this.menu = ReactDOM.findDOMNode(this.props.menu); 
  }
  
  render() {
    let { actions } = this.props;
    let map = R.map(a => a.hotkey, actions)
    let handlers = R.map(a => (event) => a.action.call(this, event), actions)

    let items = R.compose(R.values,
                          R.mapObjIndexed((action, k) => 
      <div tabindex="0" className="menu-item" key={k} onClick={(e) => action.action.call(this, e)}>
        <Keycap hotkey={action.hotkey} onPress={(e) => action.action.call(this, e)} />
        <span className="caption">{action.title}</span>
      </div>
    ));

    return (
      <HotKeys keyMap={map} handlers={handlers} focused={true} attach={this.menu} >
        <p className="menu-title">{this.props.title}</p>
        {this.props.children}
        <div rel="action-list">
          {items(actions)}
        </div>
      </HotKeys>
    );
  }
}



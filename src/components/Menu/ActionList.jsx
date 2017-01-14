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
    const enable = ({enable, disable}) =>
      (!enable && !disable) || (!disable && enable.call(this)) || (!enable && !disable.call(this))

    const ActionListItem = (action, k) => {
      const enabled = enable(action)
      if (enabled) {
        return (
          <div tabIndex="0" className="menu__item" key={k} onClick={(e) => action.action.call(this, e)}>
            <Keycap hotkey={action.hotkey} />
            <span className="caption">{action.title}</span>
          </div>
        )
      } else {
        return (
          <div className="menu__item menu__item--disabled" disabled={true} key={k}>
            <Keycap hotkey={action.hotkey} />
            <span className="caption">{action.title}</span>
          </div>
        )
      }
    }
    
    let { actions } = this.props
    let map = R.map(a => a.hotkey, actions)
    let handlers = R.map(a => (event) => a.action.call(this, event), actions)
    let items = R.compose(R.values, R.mapObjIndexed(ActionListItem.bind(this)))

    return (
      <HotKeys keyMap={map} handlers={handlers} focused={true} attach={this.menu} >
        <p className="menu__title">{this.props.title}</p>
        {this.props.children}
        <div rel="action-list">
          {items(actions)}
        </div>
      </HotKeys>
    );
  }
}



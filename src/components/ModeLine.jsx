import React from 'react';
import { withReflex } from 'reflexbox';

class ModeLine extends React.Component {
  render() {
    return (
      <div className="modeline">{this.props.mode}</div>
    )
  }
}

export default withReflex()(ModeLine);

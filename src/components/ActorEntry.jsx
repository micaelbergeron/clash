import React from 'react';


class ActorEntry extends React.Component {
  render() {
    let { actor } = this.props;
    let selected = this.props.selected ? 'selected' : null;

    return (
      <li onClick={() => this.props.onClick(actor)} className={selected}>
        <span>{actor.hp}</span>
        <span>{actor.ini}</span>
        <span>{actor.name}</span>
        <span>{actor.ac}</span>
        <span>{actor.res}</span>
      </li>
    )
  }
}

export default ActorEntry;

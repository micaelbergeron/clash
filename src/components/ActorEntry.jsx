import React from 'react';
import R from 'ramda';
import { withReflex, Box, Flex } from 'reflexbox';
import { templateOf } from '../models/Actor'

const Attribute = (prop, name) =>
  <Box style={{backgroundColor: 'grey'}} key={name} col={2} m={1} p={1}>{`${name}: ${prop}`}</Box>

class ActorEntry extends React.PureComponent {
  shouldComponentUpdate(newProps) {
    return this.props.actor != newProps
        || this.props.selected != newProps.selected;
  }
  
  render() {
    let { actor, view } = this.props
    const template = templateOf(actor)
    const actorJs = actor.toJS()
    let selected = this.props.selected ? 'selected' : null;

    const visibleAttributes = view.visibleAttrsFn(actor)
    const attributes = R.compose(R.values,
                                 R.mapObjIndexed(Attribute),
                                 R.pick(visibleAttributes))
    
    return (
      <li onClick={() => this.props.onClick(actor)} className={selected}>
        <div className={'entry__pin'} style={{backgroundColor: '#4455BB'}} />
        <Flex>{attributes(actorJs)}</Flex>
      </li>
    )
  }
}

export default ActorEntry;

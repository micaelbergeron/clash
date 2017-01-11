import React from 'react';
import R from 'ramda';
import { withReflex, Box, Flex } from 'reflexbox';


const Attribute = (prop, name) =>
  <Box style={{backgroundColor: 'grey'}} key={name} col={2} m={1} p={1}>{`${name}: ${prop.value}`}</Box>

class ActorEntry extends React.Component {
  render() {
    let { actor } = this.props;
    let selected = this.props.selected ? 'selected' : null;
    const attributes = R.compose(R.values,
                                 R.mapObjIndexed(Attribute));
    
    return (
      <li onClick={() => this.props.onClick(actor)} className={selected}>
        <div className={'entry__pin'} style={{backgroundColor: '#4455BB'}} />
        <Flex>{attributes(actor.attrs)}</Flex>
      </li>
    )
  }
}

export default withReflex()(ActorEntry);

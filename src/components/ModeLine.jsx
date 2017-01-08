import React from 'react';
import { withReflex, Flex, Box } from 'reflexbox';

class ModeLine extends React.Component {
  render() {
    return (
      <Flex className="modeline" p="2" justify="space-between">
        <Box>{this.props.mode}</Box>
        <Box>{this.props.multiplex}</Box>
      </Flex>
    )
  }
}

export default ModeLine;

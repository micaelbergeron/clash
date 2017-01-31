import React from 'react';
import { withReflex, Flex, Box } from 'reflexbox';
import Keycap from 'components/Keycap'


class ModeLine extends React.Component {
  render() {
    return (
      <Flex className="modeline" p="2" justify="space-between">
        <Box>{this.props.view} (<Keycap hotkey="ctrl+m" /> to change)</Box>
        <Box>{this.props.multiplex}</Box>
      </Flex>
    )
  }
}

export default ModeLine;

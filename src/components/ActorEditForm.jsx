import React from 'react';
import R from 'ramda';
import * as A from 'actions/actions';
import Textfield from 'material-ui/TextField';
import { PropertyInput } from '../models/Properties';
import { withReflex, Flex, Box } from 'reflexbox';


export default class ActorEditForm extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      actor: props.actor.clone(),
    }

    this.handleChange = attr => (event, value) => {
      let mutation = {}
      mutation[attr] = value
      mutation = Object.assign(this.state.actor.clone(), mutation)
      mutation = { attrs: { [attr]: { value: this.props.actor[attr] + mutation[attr] } } }
      this.changeActor(mutation)
    }
  }

  componentDidMount() {
    this.firstField.input.focus()
  }

  changeActor(mutation) {
    this.setState({actor: Object.assign(this.state.actor, mutation)})
  }
  
  validate() {
    return true;
  }
  
  render() {
    let { actor } = this.props
    const handleChange = this.handleChange
    const input_for = (attr, i) => {
      return (
        <Flex>
          <Box p="1">{actor[attr]}</Box>
          <PropertyInput target={this.state.actor}
                         floatingLabelText={labelText}
                         attr={attr}
                         onChange={this.handleChange(attr)} />
          
        </Flex>
      )
    }
    return (
      <form>
        {Object.keys(actor.meta.template.properties).map(input_for)}
      </form>
    )
  }
}

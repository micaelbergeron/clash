import React from 'react';
import R from 'ramda';
import * as A from 'actions/actions';
import Textfield from 'material-ui/TextField';
import { PropertyInput } from '../models/Properties';
import { withReflex, Flex, Box } from 'reflexbox';
import { templateOf } from '../models/Actor';


export default class ActorEditForm extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      form: {},
      mutation: {},
    }

    this.handleChange = attr => (event, value) => {
      const template = templateOf(this.props.actor)
      const mutation = R.objOf(attr, value)
      const xform = template.createXform(this.state.mutation)
      
      // update the form to show the correct values
      this.setState({ mutation, form: R.merge(this.state.form, mutation) })
      
      // do what you want with the new actor
      // should I pass the mutation instead?
      this.props.onChangeActor(xform[attr](value))
    }
  }

  componentDidMount() {
    this.firstField.input.focus()
  }
  
  validate() {
    return true;
  }
  
  render() {
    let { actor } = this.props

    const input_for = (property, i) =>
      <Textfield name={property.get('name')}
                 value={this.state.form[property.get('name')] || ""}
                 floatingLabelText={`${property.get('name')}: ${actor.get(property.get('name'))}`}
                 ref={i == 0 ? (f) => this.firstField = f:null}
                 onChange={this.handleChange(property.get('name'))} />

    return (
      <form>
        {R.addIndex(R.map)(input_for, templateOf(actor).mutableProperties())}
      </form>
    )
  }
}



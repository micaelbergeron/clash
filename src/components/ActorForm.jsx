import React from 'react';
import R from 'ramda';
import { withReflex } from 'reflexbox';
import { connect } from 'react-redux';
import Actor from '../models/Actor';
import * as A from 'actions/actions';
import Textfield from 'material-ui/TextField';
import { PropertyInput } from '../models/Properties';
import { Player } from '../models/Factories';


const playerFactory = Player.createFactory();


class ActorForm extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      form: R.clone(this.props.actor)
    }

    this.handleChange = attr => (event, value) => {
      const mutation = R.objOf(attr, value)
      const template = this.props.actor.meta.template.value(attr, value)
      // mutate the template default value if we create an ad-hoc template
      const xform = template.createXform(this.props.actor)
      this.setState({ form: R.merge(this.state.form, R.objOf(attr, value))})
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
      <Textfield name={property.name}
                 value={this.state.form[property.name]}
                 floatingLabelText={property.name}
                 ref={i == 0 ? (f) => this.firstField = f:null}
                 onChange={this.handleChange(property.name)} />

    return (
      <form>
        {R.addIndex(R.map)(input_for, actor.meta.template.properties)}
      </form>
    )
  }
}

export default ActorForm;

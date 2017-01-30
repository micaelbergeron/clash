import React from 'react';
import R from 'ramda';
import { withReflex } from 'reflexbox';
import { connect } from 'react-redux';
import Actor from '../models/Actor';
import * as A from 'actions/actions';
import Textfield from 'material-ui/TextField';
import { PropertyInput } from '../models/Properties';
import { Player } from '../models/Factories';
import { templateOf } from '../models/Actor';

const playerFactory = Player.createFactory();


class ActorForm extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      form: this.props.actor.toJS()
    }

    this.handleChange = attr => (event, value) => {
      const mutation = R.objOf(attr, value)
      let template = templateOf(this.props.actor)
      template = template.value(attr, value)
      // mutate the template default value if we create an ad-hoc template
      const xform = template.createXform(this.props.actor.toJS())
      this.setState({ form: R.merge(this.state.form, mutation) })
      this.props.onChangeActor(this.props.actor.merge(xform[attr](value)))
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
      <PropertyInput name={property.name}
                     property={property}
                     value={this.state.form[property.name]}
                     floatingLabelText={property.name}
                     inputRef={i == 0 ? (f) => this.firstField = f:null}
                     onChange={this.handleChange(property.name)} />

      return (
      <form>
        {R.addIndex(R.map)(input_for, templateOf(actor).properties.toJS())}
      </form>
      )
  }
}

export default ActorForm;

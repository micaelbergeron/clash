import React from 'react';
import R from 'ramda';
import { withReflex } from 'reflexbox';
import { connect } from 'react-redux';
import Actor from '../models/Actor';
import * as A from 'actions/actions';
import Textfield from 'material-ui/TextField';
import { PropertyInput } from 'models/Properties';
import { templateOf } from 'models/Actor';


class ActorForm extends React.Component {
  constructor(props) {
    super(props)

    this.template = templateOf(props.actor)
    this.state = {
      form: R.map(p => p.get('value'), this.template.asMap())
    }

    this.handleChange = attr => (event, value) => {
      const mutation = R.objOf(attr, value)

      // update the form inputs
      this.setState({ form: this.state.form.merge(mutation) })

      let template = templateOf(this.props.actor).value(attr, value)

      // update the template of the actor before create an xform upon it
      // I don't like this code path, I'll come with something else later
      const nextActor = this.props.actor.setIn(['_template', 'properties'], template.properties)
      const xform = template.createXform(nextActor.toJS())

      // publish the result
      this.props.onChangeActor(nextActor.merge(xform[attr](value)))
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
                     value={this.state.form.get(property.name)}
                     floatingLabelText={property.name}
                     inputRef={i == 0 ? (f) => this.firstField = f:null}
                     onChange={this.handleChange(property.name)} />

      return (
      <form>
        {R.addIndex(R.map)(input_for, this.template.properties.toJS())}
      </form>
      )
  }
}

export default ActorForm;

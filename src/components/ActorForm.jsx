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

    this.handleChange = attr => (event, value) => {
      let mutation = {}
      mutation[attr] = value
      this.changeActor(mutation)
    }
  }

  componentDidMount() {
    this.firstField.input.focus()
  }

  changeActor(mutation) {
    let next_actor = Object.assign(this.props.actor.clone(), mutation)
    this.props.onChangeActor(next_actor)
  }
  
  validate() {
    return true;
  }
  
  render() {
    let { actor } = this.props;
    const handleChange = this.handleChange;
   
    const input_for = (attr, i) =>
      <PropertyInput inputRef={i == 0 ? (f) => this.firstField = f:null} target={actor} attr={attr} onChange={this.handleChange(attr)} />
    return (
      <form>
        {Object.keys(actor.meta.template.properties).map(input_for)}
      </form>
    );
  }
}

export default ActorForm;

import React from 'react';
import { withReflex } from 'reflexbox';
import { connect } from 'react-redux';
import Actor from '../models/Actor';
import * as A from 'actions/actions';


class ActorForm extends React.Component {
  constructor(props) {
    props = Object.assign({
      onCreateActor: console.info,
    }, props);
    super(props);

    this.handleChange = attr => event => {
      let mutation = {}
      mutation[attr] = event.target.value
      this.changeActor(mutation)
    }
  }

  componentDidMount() {
    this._first.focus();
  }

  handleChange(event) {
  }
  

  changeActor(mutation) {
    let next_actor = Object.assign({}, this.props.actor, mutation)
    this.props.onChangeActor(next_actor)
  }
  
  validate() {
    return true;
  }
  
  render() {
    let { actor } = this.props;
    return (
      <form className={'pure-form pure-form-aligned'}>
        <fieldset>
          <div className={'pure-control-group'}>
            <label>Name</label>
            <input ref={input => this._first = input} type="text" value={actor.name} onChange={this.handleChange('name')} />
          </div>
          <div className={'pure-control-group'}>
            <label>Initiative</label>
            <input type="text" value={actor.init} onChange={this.handleChange('init')} />
          </div>
          <div className={'pure-control-group'}>
            <label>HP</label>
            <input value={actor.hp} />
          </div>
          <div className={'pure-control-group'}>
            <label>AC</label>
            <input value={actor.ac} />
          </div>
          <div class="pure-control-group">
            <label>Saves</label>
            <input type="text" placeholder="REF" value={actor.saves.reflex} />
            <input type="text" placeholder="FOR" value={actor.saves.fortitude} />
            <input type="text" placeholder="WIL" value={actor.saves.will} />
          </div>
        </fieldset>
      </form>
    );
  }
}

export default ActorForm;

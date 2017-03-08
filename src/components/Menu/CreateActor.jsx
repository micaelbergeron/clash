import React from 'react'
import { connect } from 'react-redux'
import R from 'ramda'
import ActorForm from 'components/ActorForm'
import ActionList from './ActionList'
import * as A from 'actions/actions' 


const defaultProps = {
  title: 'New actor',
  actions: {
    create: {
      title: 'Create',
      hotkey: ['enter', 'ctrl+k'],
      action: function(e) {
        let actor = this.props.actor
        this.props.dispatch(A.batchActions([
          A.addActor(actor),
          A.selectActor(actor),
        ]))
        this.props.pager.home()
      },
    }
  }
}

export default factory =>
  class extends React.Component {
    key: "create-actor"

    constructor(props) {
      super(props)
      
      this.state = {
        actor: factory.create()
      }
    }

    handleChangeActor(actor) {
      this.setState({ actor })
    }

    render() {
      return (
        <ActionList {...this.props} {...defaultProps} actor={this.state.actor} >
          <ActorForm actor={this.state.actor} onChangeActor={actor => this.handleChangeActor(actor)} />
        </ActionList>
      )
    }
  }
  

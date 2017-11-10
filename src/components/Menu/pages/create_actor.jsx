import React from 'react'
import ActionList from '../ActionList'
import ActorForm from 'components/ActorForm'
import * as A from 'actions/actions'


const CreateActorPageFactory = (factory) => class extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      actor: factory.create()
    }
  }

  getActions() {
    return {
      create: {
        hotkey: ['enter', 'ctrl+k'],
        action: function(event) {
          event.preventDefault()
          const { dispatch, actor } = this.props
          dispatch(A.batchActions([
            A.addActor(actor),
            A.selectActor(actor),
          ]))
          this.props.pager.home()
        }
      }
    }
  }

  handleChangeActor(actor) {
    this.setState({ actor })
  }

  render() {
    return (
      <ActionList {...this.props} actor={this.state.actor} actions={this.getActions()} >
        <ActorForm actor={this.state.actor} onChangeActor={this.handleChangeActor} />
      </ActionList>
    )
  }
}

export default CreateActorPageFactory

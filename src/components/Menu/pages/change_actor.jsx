import React from 'react'
import ActionList from '../ActionList'

export default class ChangeActorPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      mutation: {}
    }
  }

  handleChangeActor(actor) {
    // only use defined properties
    mutablePropertyNames = R.map(((x) => x.get('name')), templateOf(this.props.actor).mutableProperties())
    mutation = R.pick(mutablePropertyNames.toJS(), actor)
    this.setState({ mutation })
  }

  render() {
    return (
      <ActionList {...this.props} {...this.state}>
        <ActorEditForm actor={this.props.actor} onChangeActor={this.handleChangeActor} />
      </ActionList>

    )
  }
}

ChangeActorPage.key = 'change-actor-prop'
ChangeActorPage.defaultProps = {
  title: 'Change actor',
  actions: {
    add: {
      hotkey: ['ctrl+a', '+'],
      title: 'Add',
      action: function(event, props) {
        const { dispatch, actor, mutation } = props
        event.preventDefault()
        dispatch(A.batchActions([
          A.changeActor(actor, mutation, R.add),
          A.selectActor(actor),
        ]))
        props.pager.home()
      }
    },
    subtract: {
      hotkey: ['ctrl+x', '-'],
      title: 'Subtract',
      action: function(event, props) {
        const { dispatch, actor, mutation } = this.props
        event.preventDefault()
        dispatch(A.batchActions([
          A.changeActor(actor, mutation, R.subtract),
          A.selectActor(actor),
        ]))
        this.props.pager.home()
      }
    },
    set: {
      hotkey: ['enter', 'ctrl+s'],
      title: 'Set',
      action: function(event, props) {
        const { dispatch, actor, mutation } = this.props
        event.preventDefault()
        dispatch(A.batchActions([
          A.changeActor(actor, mutation),
          A.selectActor(actor),
        ]))
        this.props.pager.home()
      }
    }
  }
}

import _ from 'lodash'
import R from 'ramda'
import React from 'react'

import * as A from 'actions/actions'
import ActionList from 'components/Menu/ActionList'
import { templateOf } from 'models/Actor'

import SelectTemplatePage from './select_template'
import ChangeActorPage from './change_actor'

// jsx version
class MainPage extends React.Component {
  render() {
    return <ActionList {...this.props} />
  }
}

MainPage.defaultProps = {
  title: 'Main menu',
  actions: {
    add_actors: {
      title: "Add a new actor",
      action: function(event, props) {
        event.preventDefault()
        props.pager.goto(SelectTemplatePage)
      }
    },
    remove_actor: {
      hotkey: "del",
      title: "Remove an actor",
      action: function(event, props) {
        const { actor, dispatch, pager } = props
        event.preventDefault()
        dispatch(A.batchActions([
          A.removeActor(actor),
          A.selectActor({ motion: 0 }),
        ]))
        pager.home()
      }
    },
    change_actor: {
      title: "Change current actor",
      action: function(event, props) {
        event.preventDefault()
        props.pager.goto(ChangeActorPage)
      },
      enable: (props) => props.actor
    },
    copy_actor: {
      title: "Copy selected actor",
      action: function(event, props) {
        const { actor, dispatch } = props
        let clone = templateOf(actor).createFactory().create()
        dispatch(A.addActor(clone))
      },
      enable: (props) => props.actor
    }
  }
}
MainPage.key = "main"

export default MainPage

import React from 'react'
import R from 'ramda'

import * as templates from 'models/Factories'
import CreateActorPage from './create_actor'
import ActionList from '../ActionList'

export default class SelectTemplatePage extends React.Component {
  getActions() {
    return R.mapObjIndexed(
      (T, TName) => ({
        hotkey: 'A',
        title: TName,
        action: function() {
          this.props.pager.goto(
            CreateActorPage(T.createFactory())
          )
        }
      }), templates)
  }

  render() {
    return <ActionList {...this.props} actions={this.getActions()} />
  }
}

SelectTemplatePage.key = "select-template"
SelectTemplatePage.defaultProps = {
  title: 'Select template'
}

import React from 'react'
import R from 'ramda'
import ActionList from './ActionList'
import CreateActor from './CreateActor'
import templateFor from 'models/helper'

import { connect } from 'react-redux'
import { ActorTemplate } from 'models/Actor'

class SelectTemplate extends React.Component {
  key: 'select-template'

  constructor(props) {
    super(props)
  }
  
  getActions() {
    const gotoCreate = T =>
      this.props.pager.goto(CreateActor(T.createFactory()))
    
    const actionForTemplate = T => ({
      [T.name]: {
        hotkey: T.name.substring(0,1),
        title: T.name,
        action: _ => gotoCreate(T)
      }
    })

    // TOOD: this seems cryptic
    return R.compose(R.reduce(R.merge, {}),
                     R.map(actionForTemplate))(this.props.templates)
  }
  
  render() {
    return <ActionList {...this.props} actions={this.getActions()} />
  }
}

const templateFromMap = tmap =>
  new ActorTemplate(tmap.get('name'), tmap.get('properties'))

// TODO: use reselect
const mapStateToProps = state => ({
  templates: R.map(templateFromMap, state.templates),
})

export default connect(mapStateToProps)(SelectTemplate);

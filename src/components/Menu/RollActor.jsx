import React from 'react'
import R from 'ramda'
import ActionList from './ActionList'
import { PARSER_DICE, parserOf } from 'models/Properties'
import * as A from 'actions/actions'

import { templateOf, ActorTemplate } from 'models/Actor'

class RollActor extends React.Component {
  key: 'roll-actor'

  constructor(props) {
    super(props)
  }
  
  getActions() {
    const template = templateOf(this.props.actor)

    const rerollProperty = prop => {
      const parser = parserOf(prop)
      const initValue = prop.get('value')
      const roll = R.objOf(prop.get('name'), parser(initValue))
      
      this.props.dispatch(A.batchActions([
        A.changeActor(this.props.actor, roll),
        A.selectActor(this.props.actor),
      ]))
      this.props.pager.home()
    }
    
    const actionForProperty = P => ({
      [P.get('name')]: {
        hotkey: P.get('name').substring(0,1),
        title: P.get('name'),
        action: _ => rerollProperty(P)
      }
    })

    const rollableProperties = R.filter(x => x.get('parser') == PARSER_DICE,
                                        template.properties)
    
    return R.compose(R.reduce(R.merge, {}),
                     R.map(actionForProperty))(rollableProperties)
  }
  
  render() {
    return <ActionList title="Select a property" {...this.props} actions={this.getActions()} />
  }
}

export default RollActor;

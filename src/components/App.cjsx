require('normalize.css');
require('purecss/build/pure.css');
require('styles/App.scss');
  
mousetrap = require('mousetrap')
React = require('react')
DiceBox = require('./DiceBox')
ActorList = require('./ActorList')
Menu = require('./Menu/MenuView')

module.exports =
App = React.createClass
  displayName: 'App'
  componentDidMount: ->
    mousetrap.bind('j', () => @props.onSelectActor({motion: 'next'}))
    mousetrap.bind('k', () => @props.onSelectActor({motion: 'prev'}))
    mousetrap.bind('g g', () => @props.onSelectActor({relative: 'first'}))
    mousetrap.bind('G', () => @props.onSelectActor({relative: 'last'}))

  render: ->
    selectedActor = @props.selectedActor?.id or -1
    <div>
      <div><DiceBox /></div>
      <div className="pure-g">
        <div className="pure-u-4-5">
          <ActorList {...this.props} selectedActor={selectedActor} />
        </div>
        <div className="pure-u-1-5">
          <Menu />
        </div>
      </div>
    </div>

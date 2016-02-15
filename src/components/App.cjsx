require('normalize.css');
require('purecss/build/pure.css');
require('styles/App.scss');
  
mousetrap = require('mousetrap')
React = require('react')
DiceBox = require('./DiceBox')
ActorList = require('./ActorList')
MainMenu = require('./Menu/Menu').MainMenu

module.exports =
App = React.createClass
  displayName: 'App'
  componentDidMount: ->
    mousetrap.bind('j', () => @props.onSelectActor({motion: 'next'}))
    mousetrap.bind('k', () => @props.onSelectActor({motion: 'prev'}))
    mousetrap.bind('g g', () => @props.onSelectActor({relative: 'first'}))
    mousetrap.bind('G', () => @props.onSelectActor({relative: 'last'}))
    mousetrap.bind('+', () => @props.onAddActor({id: @props.actors.length+1, hp: 50, ini: 10, ac: 12}))
    mousetrap.bind('del', () =>
      @props.onRemoveActor({ id: @props.selectedActor.id })
      @props.onSelectActor({ motion: 'next' })
      )
  render: ->
    selectedActor = @props.selectedActor?.id or -1
    <div>
      <div><DiceBox /></div>
      <div className="pure-g">
        <div className="pure-u-4-5">
          <ActorList {...this.props} selectedActor={selectedActor} />
        </div>
        <div className="pure-u-1-5">
          <MainMenu />
        </div>
      </div>
    </div>

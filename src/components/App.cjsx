require('normalize.css');
require('purecss/build/pure.css');
require('styles/App.css');

mousetrap = require('mousetrap')
React = require('react')
DiceBox = require('./DiceBox')
ActorList = require('./ActorList')
Menu = require('./Menu/Menu')

module.exports =
App = React.createClass
  displayName: 'App'
  componentDidMount: ->
    mousetrap.bind('j', () => @props.onSelectActor(1))
    mousetrap.bind('k', () => @props.onSelectActor(1))
    mousetrap.bind('+', () => @props.onAddActor({id: @props.actors.length+1, hp: 50, ini: 10, ac: 12}))
  render: ->
    selectedActor = @props.selectedActor?.id or -1
    @props = _.omit(@props, 'selectedActor')
    <div>
      <div><DiceBox /></div>
      <div className="pure-g">
        <div className="pure-u-4-5">
          <ActorList {...this.props} selectedActor={selectedActor} />
        </div>
        <div className="pure-u-1-5">
          <Menu submenus={[]} title="Main menu" />
        </div>
      </div>
    </div>

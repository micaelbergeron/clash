require('styles/ActorList.scss')

mousetrap = require('mousetrap')
React = require('react')
ReactCSSTransitionGroup = require('react-addons-css-transition-group')
ActorEntry = require('./ActorEntry')
Keycap = require('./Keycap')

module.exports =
ActorList = React.createClass
  displayName: 'ActorList'
  getInitialState: -> {showHelp: false}
  componentDidMount: ->
    mousetrap.bind('?', () => @setState({showHelp: true}))
    mousetrap.bind('esc', () => @setState({showHelp: false}))
  render: ->
    extracted = ['actors', 'selectedActor']
    {actors, selectedActor} = _.pick(@props, extracted)
    @props = _.omit(@props, extracted)
    <div>
      <span>{selectedActor}</span>
      <Keycap key="?" side="help"/>
      {<p>Here is your help!</p> if @state.showHelp}
      <table id="initiative-list" className="pure-table pure-table-horizontal">
        {<ActorEntry {...entry} key={entry.id} selected={entry.id == selectedActor} /> for entry in actors}
      </table>
    </div>

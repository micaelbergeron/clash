require('styles/ActorList.scss')

mousetrap = require('mousetrap')
  
React = require('react')
ActorEntry = require('./ActorEntry')
Keycap = require('./Keycap')

module.exports =
ActorList = React.createClass
  getInitialState: -> {showHelp: false, selectedActor: -1}
  componentDidMount: ->
    mousetrap.bind('?', () => @setState({showHelp: true}))
    mousetrap.bind('esc', () => @setState({showHelp: false}))
    mousetrap.bind('+', () => @props.onAddActor({hp: 50, ini: 10, ac: 12}))
    mousetrap.bind('j', () => @setState({selectedActor: @state.selectedActor+1}))
    mousetrap.bind('k', () => @setState({selectedActor: @state.selectedActor-1}))
  render: ->
    <div>
      <span>{@state.selectedActor}</span>
      <Keycap key="?" side="help"/>
      {<p>Here is your help!</p> if @state.showHelp}
      <table id="initiative-list" className="pure-table pure-table-horizontal">
        <tbody>
          {<ActorEntry key={entry.id} ini={entry.ini} selected={i == @state.selectedActor} /> for entry,i in @props.actors}
        </tbody>
      </table>
    </div>

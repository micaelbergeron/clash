require('styles/ActorList.scss')

mousetrap = require('mousetrap')
  
React = require('react')
ActorEntry = require('./ActorEntry')
Keycap = require('./Keycap')

module.exports =
ActorList = React.createClass
  getInitialState: -> {showHelp: false}
  componentDidMount: ->
    mousetrap.bind('?', () => @setState({showHelp: true}))
    mousetrap.bind('esc', () => @setState({showHelp: false}))
  render: ->
    <div>
      <Keycap key="?" side="help"/>
      {<p>Here is your help!</p> if @state.showHelp}
      <table id="initiative-list" className="pure-table pure-table-horizontal">
        <tbody>
          {<ActorEntry key={entry} ini={entry.ini} /> for entry in @props.actors}
        </tbody>
      </table>
    </div>

require('styles/InitiativeList.scss')

mousetrap = require('mousetrap')
  
React = require('react')
InitiativeEntry = require('./InitiativeEntry')
Keycap = require('./Keycap')

module.exports =
InitiativeList = React.createClass
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
          {<InitiativeEntry key={entry} ini={entry} /> for entry in [0..5]}
        </tbody>
      </table>
    </div>

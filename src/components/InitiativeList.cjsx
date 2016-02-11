require('styles/InitiativeList.scss')

mousetrap = require('mousetrap')
  
React = require('react')
InitiativeEntry = require('./InitiativeEntry')

module.exports =
InitiativeList = React.createClass
  getInitialState: -> {showHelp: false}
  componentDidMount: ->
    mousetrap.bind('?', () => this.setState({showHelp: true}))
    mousetrap.bind('esc', () => this.setState({showHelp: false}))
  render: ->
    (<span>Here is your help!</span> if @state)
    <table id="initiative-list" className="pure-table pure-table-horizontal">
      <tbody>
        {<InitiativeEntry key={entry} ini={entry} /> for entry in [0..1000]}
      </tbody>
    </table>

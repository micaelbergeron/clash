React = require('react')

ActorEntry = React.createClass
  getDefaultProps: ->
    {ini: 0, name: "NPC", hp: 35, ac: 18, res: "1|2|3"}
  render: ->
    <tr className={'selected' if @props.selected}>
      <td>HP: {this.props.hp}</td>
      <td>{this.props.ini}</td>
      <td>{this.props.name}</td>
      <td>{this.props.ac}</td>
      <td>{this.props.res}</td>
    </tr>

module.exports = ActorEntry

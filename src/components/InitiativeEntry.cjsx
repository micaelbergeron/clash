React = require('react')

InitiativeEntry = React.createClass
  getDefaultProps: ->
    {ini: 0, name: "NPC", hp: 35, ac: 18, res: "1|2|3"}
  render: ->
    <tr>
      <td>{this.props.ini}</td>
      <td>{this.props.name}</td>
      <td>{this.props.hp}</td>
      <td>{this.props.ac}</td>
      <td>{this.props.res}</td>
    </tr>

module.exports = InitiativeEntry
React = require('react')
Icon = require('./Icon')

ActorEntry = React.createClass
  displayName: "Actor"
  render: ->
    <tr className={'selected' if @props.selected}>
      <td><Icon glyph={'foot-trip'} /> HP: {@props.hp}</td>
      <td><Icon glyph={'bugle-call'} />{@props.ini}</td>
      <td>{@props.name}</td>
      <td>{@props.ac}</td>
      <td>{@props.res}</td>
    </tr>

module.exports = ActorEntry

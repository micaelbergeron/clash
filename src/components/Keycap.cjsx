require('styles/Keycap.scss')

React = require('react')

module.exports =
Keycap = React.createClass
  render: ->
    <div className="key light">
      <div className="keycap">
        <kdb>{@props.hotkey}</kdb>
        {<span className="side">{@props.side}</span> if @props.side}
      </div>
    </div>

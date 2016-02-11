require('styles/Keycap.scss')

React = require('react')

module.exports =
Keycap = React.createClass
  render: ->
    <div className="key">
      <div className="keycap">
        {@props.key or '?'}
        {<span className="side">{@props.side}</span> if @props.side}
      </div>
    </div>

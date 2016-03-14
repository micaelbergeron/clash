require('styles/Keycap.scss')
M = require('mousetrap')

React = require('react')

module.exports =
Keycap = React.createClass
  componentDidMount: ->
    M.bind(@props.hotkey, @props.onPress) if @props.hotkey

  componentWillUnmount: ->
    console.log "Unmount"
    M.unbind(@props.hotkey) if @props.hotkey

  render: ->
    <div className="key light">
      <div className="keycap">
        <kdb>{@props.hotkey}</kdb>
        {<span className="side">{@props.side}</span> if @props.side}
      </div>
    </div>

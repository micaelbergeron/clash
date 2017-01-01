# require('styles/Keycap.scss')
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
    <kdb>{@props.hotkey}</kdb>

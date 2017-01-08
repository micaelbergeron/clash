# require('styles/Keycap.scss')
React = require('react')

module.exports =
Keycap = React.createClass
  render: ->
    <kdb>{@props.hotkey}</kdb>

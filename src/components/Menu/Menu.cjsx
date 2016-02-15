React = require('react')
Keycap = require('../Keycap')

Menu = React.createClass
  getInitialState: ->
    {selectedMenu: -1} 
  render: ->
    <div className="menu-page">
      <p className="menu-title">{@props.title}</p>
      <div rel="menu" data-id={@state.selectedMenu}>
        {<div key={i} className="menu-item">
          <Keycap hotkey={item.hotkey} />
          <span className="caption">{item.title}</span>
        </div> for item,i in @props.items}
      </div>
    </div>

MainMenu = React.createClass
  getDefaultProps: -> 
    title: "Main menu"
    items: [
      {hotkey: "+", title: "Add a new actor"}
      {hotkey: "del", title: "Remove an actor"}
      {hotkey: "c", title: "Change actor status"}
    ]

  componentDidMount: ->
    console.log "Main menu attached"

  render: ->
    <Menu {...@props} />
    
module.exports =
  Menu: Menu
  MainMenu: MainMenu

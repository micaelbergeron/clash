React = require('react')

module.exports =
  Menu = React.createClass
    getInitialState: ->
      {selectedMenu: -1} 
    render: ->
      <div>
        <p className="menu-title">{@props.title}</p>
        <div rel="menu" className="menu-page" data-id={@state.selectedMenu}>
          {<div key={@item.key} className="menu-item">{@item.title}</div> for item in @props.submenus}
        </div>
      </div>
        

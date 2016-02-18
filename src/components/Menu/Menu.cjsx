_ = require('lodash')
React = require('react')
Keycap = require('../Keycap')
mousetrap = require('mousetrap')
A = require('../../actions/actions.js')

MenuPage = React.createClass
  getDefaultProps: ->
    onHandleAction: _.noop
  
  getInitialState: ->
    {menuStack: []}

  itemClass: (item) ->
    'menu-item'
  
  getMenuItems: ->
    return @props.items unless @state.menuStack.length > 0
    stack = _.chain(@state.menuStack)
      .map((s) -> s + '.items')
      .join('.')
      .value()
    console.log('current menu stack: ' + stack)
    _.get(@props.items, stack)

  onReturn: ->
    @setState {menuStack: _.initial(@state.menuStack)}

  onHandleClick: (key, item) ->
    # either we trigger the callback, or enter a submenu
    return @props.onHandleAction(key, item) if item.action
    @setState {menuStack: @state.menuStack.concat(key)}

  render: ->
    <div className="menu-page">
      <p className="menu-title">{@props.title}</p>
      <div rel="menu">
        {<div key={k} className={@itemClass(k)} onClick={@onHandleClick.bind(this, k, item)}>
          <Keycap hotkey={item.hotkey} />
          <span className="caption">{item.title}</span>
        </div> for k, item of @getMenuItems()}
      </div>
    </div>

Menu = React.createClass
  
  getDefaultProps: -> 
    title: "Main menu"
    target: -1
    items: {
      add_actors: {hotkey: "+", title: "Add a new actor"}
      remove_actor: {hotkey: "del", title: "Remove an actor"}
      change_actor: {
        hotkey: "c"
        title: "Change actor status"
        items: {
          hp: {
            hotkey: 'h'
            title: 'HP'
            action: true
          }
          ac: {
            hotkey: 'a'
            title: 'AC'
            action: true
          }
        }
      }
    }

  onHandleAction: (key,item) ->
    @props.onChangeActorProp(@props.target, 'hp', 100)

  componentDidMount: ->
    mousetrap.bind('esc', @_menu.onReturn)

  render: ->
    <MenuPage ref={(m) => @_menu = m} {...@props} onHandleAction={@onHandleAction} />
    
module.exports =
  Menu: Menu

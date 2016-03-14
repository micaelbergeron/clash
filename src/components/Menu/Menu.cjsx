_ = require('lodash')
React = require('react')
ReactCSSTransitionGroup = require('react-addons-css-transition-group')
Keycap = require('../Keycap')
mousetrap = require('mousetrap')
A = require('../../actions/actions.js')


# HigherOrder component to "pagify" a component
Page = (pager, Component) ->
  React.createClass
    displayName: "Page"
    onHandleAction: (action) ->
      action.action.call(@_component, pager)
  
    render: ->
      <Component ref={(c) => @_component = c} {...@props} onHandleAction={@onHandleAction} />


ActionList = React.createClass
  getDefaultProps: ->
    onHandleAction: _.noop
    actions: []
  
  itemClass: (item) ->
    'menu-item'

  handleActionFor: (action) ->
    @props.onHandleAction.bind(this, action)
  
  getActions: ->
    @props.actions

  render: ->
    items = for k, action of @getActions()
      <div key={k} actor={@props.target} onClick={@handleActionFor(action)}>
        <Keycap hotkey={action.hotkey} onPress={@handleActionFor(action)} />
        <span className="caption">{action.title}</span>
      </div> 

    <div>
      <p className="menu-title">{@props.title}</p>
      <div rel="action-list">
        {items}
      </div>
    </div>


MainActions = React.createClass
  getDefaultProps: ->
    title: "Main menu"
    actions:
      add_actors:
        hotkey: "+"
        title: "Add a new actor"
        action: () -> @props.dispatch(A.addActor({hp: 50, ini: 10, ac: 12}))
      remove_actor:
        hotkey: "del"
        title: "Remove an actor"
        action: () -> @props.dispatch(A.removeActor(@props.actor))
      change_actor:
        hotkey: "c"
        title: "Change current actor"
        action: (pager) -> pager.goto ChangeActions

  render: ->
    <ActionList {...@props} />
MainActions.key = "main"

ChangeActions = React.createClass
  getDefaultProps: ->
    title: "Change actor"
    actions:
      hp:
        hotkey: 'h'
        title: 'Hit points'
        action: (pager) ->
          @onChange('hp', 10)
          pager.back()
      ac:
        hotkey: 'a'
        title: 'Armor class'
        action: (pager) -> 
          @onChange('ac', 5)
          pager.back()

  onChange: (prop, mod) ->
    @props.dispatch(A.changeActorProp(@props.actor, prop, mod))
    @props.gotoHome

  render: ->
    <ActionList {...@props} />
ChangeActions.key = "change-actor-prop"
  
# A menu page holder
Menu = React.createClass
  displayName: "Menu"
  getInitialState: ->
    componentTree: [MainActions]
      
  asPager: ->
    goto: @navigateTo
    gotoHome: () => @setState {componentTree: [MainActions]}
    back: @navigateBack
    dispatch: @props.dispatch

  navigateBack: ->
    return unless @state.componentTree.length > 1
    @setState {componentTree: _.initial(@state.componentTree)}
    
  navigateTo: (component) ->
    @setState {componentTree: _(@state.componentTree).push(component).value()}

  componentDidMount: ->
    mousetrap.bind('esc', @navigateBack)

  getCurrentPage: ->
    @pagify _.last(@state.componentTree)

  pagify: (component) ->
    PagedComponent = Page(@asPager(), component)
    pageProps = page = React.createElement(PagedComponent, _.merge({key: component.key}, @props))
    
  render: ->
    <ReactCSSTransitionGroup component="div" className="menu-page"
                          transitionName="menu-page"
                          transitionEnterTimeout=500
                          transitionLeaveTimeout=500>
      {@pagify component for component in @state.componentTree}
    </ReactCSSTransitionGroup>

module.exports =
  Menu: Menu

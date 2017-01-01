_ = require('lodash')
React = require('react')
ReactCSSTransitionGroup = require('react-addons-css-transition-group')
Keycap = require('../Keycap')
mousetrap = require('mousetrap')
A = require('../../actions/actions.js')
ActorForm = require('../ActorForm').default
connect = require('react-redux').connect
Actor = require('../../models/Actor').default


# HigherOrder component to "pagify" a component
Page = (pager, Component) ->
  React.createClass
    displayName: "Page"
    onHandleAction: (action) ->
      action.call(@_component, pager)
  
    render: ->
      <Component ref={(c) => @_component = c} {...@props} pager={pager} onHandleAction={@onHandleAction} />


ActionList = React.createClass
  getDefaultProps: ->
    onHandleAction: _.noop
    actions: []
  
  itemClass: (item) ->
    'menu-item'

  getActions: ->
    @props.actions

  render: ->
    onHandleAction = @props.onHandleAction
    target = @props.target
    items = for k, action of @getActions()
      do (k, action) ->
        <div className="menu-item" key={k} onClick={() => onHandleAction(action.action)}>
          <Keycap hotkey={action.hotkey} onPress={() => onHandleAction(action.action)} />
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
        action: (pager) -> pager.goto CreateActor
      remove_actor:
        hotkey: "del"
        title: "Remove an actor"
        action: () -> @props.dispatch(A.removeActor(@props.actor)) # should it know the current actor?
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
        action: () ->
          @onChange('hp', 10)
          @props.pager.back()
      ac:
        hotkey: 'a'
        title: 'Armor class'
        action: () -> 
          @onChange('ac', 5)
          @props.pager.back()

  onChange: (prop, mod) ->
    @props.dispatch(A.changeActorProp(@props.actor, prop, mod))
    @props.gotoHome

  render: ->
    <ActionList {...@props} />
ChangeActions.key = "change-actor-prop"

CreateActor = React.createClass
  getDefaultProps: =>
    title: 'New actor'
    actions:
      create:
        hotkey: 'k'
        title: 'Create'
        action: () ->
          @props.dispatch(A.addActor(@state.actor))
          @props.pager.gotoHome()

  getInitialState: ->
    actor: new Actor()

  render: ->
    <div key={@props.key}>
      <ActorForm {...@props} actor={@state.actor} onChangeActor={(actor) => this.setState({ actor: actor })} />
      <ActionList {...@props} />
    </div>
CreateActor.key = "create-actor"

# A menu page holder
Menu = React.createClass
  displayName: "Menu"
  getInitialState: ->
    componentTree: [MainActions]
      
  asPager: ->
    goto: @navigateTo
    back: @navigateBack
    gotoHome: () => @setState {componentTree: [MainActions]}

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

_ = require('lodash')
R = require('ramda')
React = require('react')
ReactDOM = require('react-dom')
ReactCSSTransitionGroup = require('react-addons-css-transition-group')
mousetrap = require('mousetrap')
HotKeys = require('react-hotkeys').HotKeys

A = require('../../actions/actions.js')
batchActions = require('redux-batched-actions').batchActions
ActorForm = require('../ActorForm').default
ActionList = require('./ActionList').default
connect = require('react-redux').connect
playerFactory = require('../../models/Factories').Player.createFactory()
Box = require('reflexbox').Box;
Flex = require('reflexbox').Flex;

MainActions = React.createClass
  getDefaultProps: ->
    title: "Main menu"
    actions:
      add_actors:
        hotkey: "+"
        title: "Add a new actor"
        action: (event) ->
         @props.pager.goto CreateActor
         event.preventDefault()
      remove_actor:
        hotkey: "del"
        title: "Remove an actor"
        action: () ->
          actor = @props.actor
          R.map(@props.dispatch, [
            A.removeActor(actor), # should it know the current actor?
            A.selectActor({ motion: 0 }),
          ])
          @props.pager.home()
        
      change_actor:
        hotkey: "c"
        title: "Change current actor"
        action: () -> @props.pager.goto ChangeActions
      copy_actor:
        hotkey: "y"
        title: "Copy current actor"
        action: () ->
          actor_clone = @props.actor.clone().reroll()
          @props.dispatch(A.addActor(actor_clone)) # that easy?

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
    @props.home()

  render: ->
    <ActionList {...@props} />
ChangeActions.key = "change-actor-prop"

CreateActor = React.createClass
  getDefaultProps: ->
    title: 'New actor'
    actions:
      create:
        hotkey: ['enter', 'ctrl+k']
        title: 'Create'
        action: () ->
          actor = @props.actor
          R.map(@props.dispatch, [
            A.addActor(actor),
            A.selectActor(actor),
          ])
          @props.pager.home()

  getInitialState: ->
    actor: playerFactory()

  render: ->
    <ActionList {...@props} actor={@state.actor} >
      <ActorForm actor={@state.actor} onChangeActor={(actor) => this.setState({ actor: actor })} />
    </ActionList>
CreateActor.key = "create-actor"

# A menu page holder
Menu = React.createClass
  displayName: "Menu"
  handlers: {}
  getInitialState: ->
    componentTree: [MainActions]

  asPager: ->
    goto: @navigateTo
    back: @navigateBack
    home: @navigateHome

  # [M0, ..., Mn] -> [M0]
  navigateHome: ->
    @setState {componentTree:  [@state.componentTree.shift()]}

  # [M0, ..., Mn] -> [M0, ..., Mn-1]
  navigateBack: ->
    return unless @state.componentTree.length > 1
    @setState {componentTree: _.initial(@state.componentTree)}
    
  # [M0, ..., Mn] -> [M0, ..., Mn, Mn+1]
  navigateTo: (component) ->
    @setState {componentTree: @state.componentTree.concat(component)} # 

  buildPage: (component) ->
    page_props = _.omit(@props, 'children')
    # todo: use child context
    React.createElement(component, _.merge({key: component.key, pager: @asPager(), menu: this}, page_props))

  componentWillUpdate: (nextProps, nextState) ->
    if (nextState.componentTree.length > 1)
      this.handlers =
        cancel: @navigateBack

  render: ->
    currentPage = @buildPage(_.last(@state.componentTree))
    <HotKeys component={Flex} handlers={this.handlers} className="menu__page">
      <Box col={9} className='menu__content'>
        {@props.children}
      </Box>
      <Box col={3} className='menu__actions'>
        <ReactCSSTransitionGroup component="div"
                          transitionName="menu__page"
                          transitionEnterTimeout=500
                          transitionLeaveTimeout=500>
          {currentPage}
        </ReactCSSTransitionGroup>
      </Box>
    </HotKeys>

module.exports =
  Menu: Menu


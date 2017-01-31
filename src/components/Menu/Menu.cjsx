_ = require('lodash')
R = require('ramda')
React = require('react')
ReactDOM = require('react-dom')
ReactCSSTransitionGroup = require('react-addons-css-transition-group')
mousetrap = require('mousetrap')
HotKeys = require('react-hotkeys').HotKeys

A = require('../../actions/actions.js')
ActorForm = require('../ActorForm').default
ActorEditForm = require('../ActorEditForm').default
ActionList = require('./ActionList').default
connect = require('react-redux').connect
templateOf = require('../../models/Actor').templateOf
playerFactory = require('../../models/Factories').Player.createFactory()
templates = require('../../models/Factories')
Box = require('reflexbox').Box;
Flex = require('reflexbox').Flex;

MainActions = React.createClass
  getDefaultProps: ->
    title: "Main menu"
    actions:
      add_actors:
        hotkey: "n a"
        title: "Add a new actor"
        action: (event) ->
         event.preventDefault()
         @props.pager.goto SelectTemplate
      remove_actor:
        hotkey: "del"
        title: "Remove an actor"
        action: (event) ->
          event.preventDefault()
          actor = @props.actor
          @props.dispatch(A.batchActions([
            A.removeActor(actor), # should it know the current actor?
            A.selectActor({ motion: 0 }),
          ]))
          @props.pager.home()
        enable: () -> @props.actor
      change_actor:
        hotkey: "m"
        title: "Change current actor"
        action: (event) ->
          event.preventDefault()
          @props.pager.goto ChangeActions
        enable: () -> @props.actor
      copy_actor: # TODO: make a register system
        hotkey: "y y"
        title: "Copy current actor"
        action: () ->
          actor_clone = templateOf(@props.actor).createFactory().create()
          @props.dispatch(A.addActor(actor_clone)) # that easy?
        enable: () -> @props.actor

  render: ->
    <ActionList {...@props} />
MainActions.key = "main"

ChangeActions = React.createClass
  getDefaultProps: ->
    title: "Change actor"
    actions:
      add:
        hotkey: ['ctrl+a', '+']
        title: 'Add'
        action: (event) ->
          event.preventDefault()
          @props.dispatch(A.batchActions([
            A.changeActor(@props.actor, @props.mutation, R.add),
            A.selectActor(@props.actor),
          ]))
          @props.pager.home()
      subtract:
        hotkey: ['ctrl+x', '-']
        title: 'Subtract'
        action: (event) ->
          event.preventDefault()
          @props.dispatch(A.batchActions([
            A.changeActor(@props.actor, @props.mutation, R.subtract),
            A.selectActor(@props.actor),
          ]))
          @props.pager.home()
      set:
        hotkey: ['enter', 'ctrl+s']
        title: 'Set'
        action: (event) ->
          event.preventDefault()
          @props.dispatch(A.batchActions([
            A.changeActor(@props.actor, @props.mutation),
            A.selectActor(@props.actor),
          ]))
          @props.pager.home()

  getInitialState: ->
    mutation: {}

  handleChangeActor: (actor) ->
    # only use defined properties
    mutablePropertyNames = R.map(((x) -> x.get('name')), templateOf(@props.actor).mutableProperties())
    mutation = R.pick(mutablePropertyNames.toJS(), actor)
    @setState({ mutation })    

  render: ->
    <ActionList {...@props} {...@state}>
      <ActorEditForm actor={@props.actor} onChangeActor={@handleChangeActor} />
    </ActionList>

ChangeActions.key = "change-actor-prop"

SelectTemplate = React.createClass
  getDefaultProps: ->
    title: 'Select template'

  getActions: ->
    actions = R.mapObjIndexed(((T, TName) -> {
      hotkey: 'A',
      title: TName,
      action: () ->
        @props.pager.goto CreateActor(T.createFactory())
    }), templates)

  render: ->
    <ActionList {...@props} actions={@getActions()} />
SelectTemplate.key = "select-template"
 

CreateActor = (factory) -> React.createClass
  key: "create-actor"
  getDefaultProps: ->
    title: 'New actor'
    actions:
      create:
        hotkey: ['enter', 'ctrl+k']
        title: 'Create'
        action: () ->
          actor = @props.actor
          @props.dispatch(A.batchActions([
            A.addActor(actor),
            A.selectActor(actor),
          ]))
          @props.pager.home()

  getInitialState: ->
    actor: factory.create()

  handleChangeActor: (actor) ->
    # only use defined properties
    @setState({ actor })    

  render: ->
    <ActionList {...@props} actor={@state.actor} >
      <ActorForm actor={@state.actor} onChangeActor={@handleChangeActor} />
    </ActionList>

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
        {currentPage}
      </Box>
    </HotKeys>

module.exports =
  Menu: Menu


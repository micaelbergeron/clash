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
MainPage = require('./pages/main.jsx').default

# A menu page holder
Menu = React.createClass
  displayName: "Menu"
  handlers: {}
  getInitialState: ->
    componentTree: [MainPage]

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

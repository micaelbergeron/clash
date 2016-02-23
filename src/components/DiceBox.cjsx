React = require('react')
dice = require('../reducers/dice.pegjs').parse

console.log dice
DiceBoxComponent = React.createClass  
  roll: dice

  getInitialState: -> {roll: @roll('d20')}
  handleClick: (e) ->
    this.setState({roll: @roll('d20')})

  render: ->
    console.log(this)
    <div>
      <div>Dice box</div>
      <span onClick={this.handleClick}>{this.state.roll}</span>
    </div>

module.exports = DiceBoxComponent

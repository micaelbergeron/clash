React = require('react')

DiceBoxComponent = React.createClass  
  roll: (min, max) -> Math.random() * (max - min) + min

  getInitialState: -> {roll: this.roll(1,20)}
  handleClick: (e) ->
    this.setState({roll: this.roll(1,20)})

  render: ->
    console.log(this)
    <div>
      <div>Dice box</div>
      <span onClick={this.handleClick}>{this.state.roll}</span>
    </div>

module.exports = DiceBoxComponent

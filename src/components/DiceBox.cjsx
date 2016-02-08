React = require('react')

class DiceBoxComponent extends React.Component
  roll: 42
  render: ->
    <div>
      <div>Dice box</div>
      <span>{@roll}</span>
    </div>

module.exports = DiceBoxComponent

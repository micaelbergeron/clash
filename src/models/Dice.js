import { parse as parseDice } from '../reducers/dice.pegjs'


export default class Dice {
  constructor(dice) {
    this.dice = dice;
    this.value = NaN;
  }

  roll() {
    this.value = parseDice(this.dice)
    return this
  }
}


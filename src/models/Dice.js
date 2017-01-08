import { parse as parseDice } from '../reducers/dice.pegjs'


export default class Dice {
  constructor(dice) {
    this.dice = dice;
    this.roll = () => new Dice(dice);
  }

  get dice() {
    return this._dice;
  }

  set dice(dice) {
    this._dice = dice; // debugging purpose
    this.value = parseDice(dice)
  }
}


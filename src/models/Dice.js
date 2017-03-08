import R from 'ramda'
import { parse as parseDice } from 'reducers/dice.pegjs'


export const roll = R.tryCatch(parseDice, R.always(NaN))

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


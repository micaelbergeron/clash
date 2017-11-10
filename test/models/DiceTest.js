import { times } from 'ramda'
import Dice from 'models/Dice'


describe('Dice', function() {
  it('should initialize properly', function() {
    let dice = new Dice('1d20')

    expect(dice.value).to.be.NaN
    expect(dice.dice).to.equal('1d20')
  })

  describe('.roll', function() {
    // TODO: seed properly
    it('should produce a pseudo-random sequence', function() {
      let dice = new Dice('d20')

      times(_ => expect(dice.roll().value).to.be.above(0).and.below(21), 100)
    })

    it('supports multiple dices', function() {
      var diceUno = new Dice('1d10')
      var diceDuo = new Dice('2d10')
      var diceTrio = new Dice('3d12')

      times(_ => {
        expect(diceUno.roll().value).to.be.above(0).and.below(11)   // [1,10]
        expect(diceDuo.roll().value).to.be.above(1).and.below(21)   // [2, 20]
        expect(diceTrio.roll().value).to.be.above(2).and.below(37)  // [3, 36]
      }, 100)
    })

    it('should support modifiers', function() {
      var dicePlus = new Dice('1d20+10')
      var diceMinus = new Dice('1d20-10')

      times(_ => {
        expect(dicePlus.roll().value).to.be.above(10).and.below(31)
        expect(diceMinus.roll().value).to.be.above(-10).and.below(11)
      }, 100)
    })
  })
})

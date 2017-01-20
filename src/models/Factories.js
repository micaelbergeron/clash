import { ActorTemplate } from './Actor'
import * as Props from './Properties'


export const GameObject = new ActorTemplate('object')
  .addProperty('durability', { set: Number })
  .addProperty('toughness', { set: Number })
  .addProperty('notes')

export const Living = new ActorTemplate('living')
  .addProperty(Props.dice('ini', '1d20'))
  .addProperty(Props.dice('hp', 0))
  .addProperty(Props.dice('ac', 10))

export const NPC = Living
  .addProperty(Props.choice(['good', 'neutral', 'bad'])('side', { mutable: false }))

export const Player = Living
  .addProperty(Props.text('name'))
  .addProperty(Props.dice('spot'))
  .addProperty(Props.dice('listen'));


// -- Tests

const playerFactory = Player.createFactory()
const player1 = playerFactory.create()

const playerXform = Player.createXform(player1)

console.info(player1)
console.info(playerXform.ac('1d20'))

const PlayerWithValues = Player.value('hp', '1d20').createFactory().create()
console.info(PlayerWithValues)


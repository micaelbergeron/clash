// for now let's just define the templates at load-time
// but I'd like to be able to add/modify templates runtime

import { ActorTemplate } from 'models/Actor'
import * as Props from 'models/Properties'


export const GameObject = new ActorTemplate('object')
  .addProperty(Props.dice('durability'))
  .addProperty(Props.dice('toughness'))
  .addProperty(Props.text('notes'))

export const Living = new ActorTemplate('living')
  .addProperty(Props.check('ini'))
  .addProperty(Props.dice('hp'))
  .addProperty(Props.dice('ac', 10))
  .addProperty(Props.check('spot'))
  .addProperty(Props.check('listen'))

export const NPC = new ActorTemplate('npc', Living.properties)
  .addProperty(Props.choice(['neutral', 'good', 'bad'])('side', { mutable: false }))

export const NPC_Bad = new ActorTemplate('npc.bad', NPC.properties)
  .value('side', 'bad')

export const Player = new ActorTemplate('player', NPC.properties)
  .addProperty(Props.text('name'))
  .value('side', 'good')


import { ActorTemplate } from './Actor'
import * as Props from './Properties'


export const GameObject = new ActorTemplate('object')
  .addProperty('durability', { set: Number })
  .addProperty('toughness', { set: Number })
  .addProperty('notes')

export const Living = new ActorTemplate('living')
  .addProperty('hp', Props.dice)
  .addProperty('init', Props.dice)

export const NPC = Living
  .addProperty('side', Props.choice(['good', 'neutral', 'bad']))

export const Player = Living
  .addProperty('spot', Props.dice)
  .addProperty('listen', Props.dice);

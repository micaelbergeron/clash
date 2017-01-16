import uuid from 'uuid/v4';
import Dice from './Dice';
import R from 'ramda';

// TODO: use Immutable.js
export class Actor {
  constructor() {
    this.id = uuid();
  }

  // filter
  // how do we manage what to reroll at any given time?
  // create another object from the same template
  reroll() {
    if (!this.meta && !this.meta.template) throw new Error("This actor has no template.");
    return ActorTemplate.asFactory(this.meta.template).create()
  }
}

export class ActorFactory {
  constructor(template) {
    this._template = template
  }
  
  create(attrs) {
    let actor = R.compose(
      R.reject(R.either(R.isNil, R.equals(NaN))),
      R.reduce(R.merge, new Actor()),
      R.map(x => R.objOf(x.name, x.convert(x.value))), // x.set is the property pipeline
    )(this.template.properties);

    actor.meta = {
      template: this.template, // this should be immutable, so we can clone an object.
    }
    return R.merge(actor, attrs)
  }

  reroll(predicateOrArray) {
  }

  get template() {
    const tpl = R.clone(this._template)
    return new ActorTemplate(tpl.name, tpl.properties)
  }
}  

export class ActorTemplate {
  constructor(name, properties=[]) {
    this.name = name;
    this.properties = properties;
  }

  allPropertyNames() {
    return R.map(x => x.name, this.properties)
  }

  mutableProperties() {
    return R.reject(R.propEq('mutable', false), this.properties)
  }

  // TODO: Use Immutable.JS record type to ensure a complete property  
  //  - name:   the property accessor name
  //  - value:  any value passed into the set fn
  //  - render: (actor) -> Component
  //  - set:    (value) -> converted
  addProperty(prop) {
    this.properties.push(prop);
    return this;
  } 

  static asFactory(template) {
    return new ActorFactory(template)
  }

  // TODO: this could use a ramda lens
  value(name, value) {
    const idx = R.findIndex(R.propEq('name', name), this.properties)
    this.properties = R.adjust(R.assocPath(['value'], value), idx, this.properties)
    return this
  }
  
  createFactory() {
    return ActorTemplate.asFactory(this)
  }

  createXform(target) {
    const createAssigner = R.curry(
      (property, value) =>
        Object.assign({}, target, R.objOf(property.name, property.convert(value)))
    )

    return R.compose(
      R.reduce(R.merge, {}),
      R.map(x => R.objOf(x.name, createAssigner(x)))
    )(this.properties)
  }
}

import uuid from 'uuid/v4';
import Dice from './Dice';
import R from 'ramda';
import { parserOf } from './Properties'
import Immutable from 'immutable' 


export const templateOf = R.memoize(actor =>
  ActorTemplate.asTemplate(actor.get('_template').toObject())
)

export const factoryOf = R.memoize(actor =>
  ActorTemplate.asFactory(templateOf(actor))
)

export class ActorFactory {
  constructor(template) {
    this._template = template
  }
  
  create(attrs) {
    let actor = R.compose(
      R.reject(R.either(R.isNil, R.equals(NaN))),
      R.reduce(R.merge, { id: uuid() }),
      R.map(x => R.objOf(x.get('name'),
                         parserOf(x).apply(null, [x.get('value'), x.get('parserArgs')])
      )),
    )(this.template.properties);

    actor._template = Immutable.Map(this.template)
    return Immutable.Map(R.merge(actor, attrs))
  }

  reroll(predicateOrArray) {
  }

  get template() {
    return new ActorTemplate(this._template.name, this._template.properties)
  }
}  

export class ActorTemplate {
  constructor(name, properties=Immutable.List()) {
    this.name = name;
    this.properties = properties;
  }

  allPropertyNames() {
    return R.map(x => x.get('name'), this.properties)
  }

  mutableProperties() {
    return R.reject(x => x.getIn(['config', 'mutable']) === false, this.properties)
  }

  // TODO: Use Immutable.JS record type to ensure a complete property  
  //  - name:   the property accessor name
  //  - value:  any value passed into the set fn
  //  - render: (actor) -> Component
  //  - set:    (value) -> converted
  addProperty(prop) {
    this.properties = this.properties.push(prop);
    return this;
  }

  static asTemplate(template) {
    return new ActorTemplate(template.name, template.properties)
  }

  static asFactory(template) {
    return new ActorFactory(template)
  }

  value(name, value) {
    const idx = this.properties.findIndex(x => x.get('name') === name)
    if (idx !== -1) {
      this.properties = this.properties.update(idx, p => p.set('value', value))
    }
    return this
  }
  
  createFactory() {
    return ActorTemplate.asFactory(this)
  }

  // TODO: use immutable instead
  createXform(target) {
    const createAssigner = R.curry(
      (property, value) =>
        Object.assign({},
                      target,
                      R.objOf(property.get('name'),
                              parserOf(property).apply(null, [value, property.get('parserArgs')])
                      )
        )
    )

    return R.compose(
      R.reduce(R.merge, {}),
      R.map(x => R.objOf(x.get('name'), createAssigner(x)))
    )(this.properties);
  }
}

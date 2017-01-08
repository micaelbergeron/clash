import uuid from 'uuid/v4';
import Dice from './Dice';
import R from 'ramda';

export class Actor {
  constructor(attrs={}) {
    this.id = uuid();
    Object.defineProperty(this, 'attrs', { enumerable: true, value: Object.assign({}, attrs)});    
  }

  static create(attrs={}) {
    return new Actor(attrs);
  }

  // filter
  reroll() {
    R.mapObjIndexed((prop, name, attrs) => {
      if (prop instanceof Dice) attrs[name] = prop.roll()
    }, this.attrs);
  }

  // create another object from the same template
  clone() {
    if (!this.meta && !this.meta.template) throw new Error("This actor has no template.");
    return this.meta.template.createFactory()(this.attrs);
  }
}

export class ActorTemplate {
  constructor(name, factory=Actor.create) {
    this.name = name;
    this.factory = factory;
    this.properties = {};
  }
  
  addProperty(name, prop) {
    this.properties[name] = prop || this.defaultProperty(name);
    return this;
  }

  applyProps(obj) {
    return (prop, name) => {
      const identity = x => x;
      let propdef = Object.assign(this.defaultProperty(name), {
        set: R.compose(x => obj.attrs[name] = x, prop.set || identity),
        get: R.compose(prop.get || identity, () => obj.attrs[name]),
      });
      Object.defineProperty(obj, name, propdef);
    };
  }

  defaultProperty(name) {
    return {
      enumerable: !name.startsWith("_"),
      configurable: true,
    }
  }
  
  // to be able to reduce apply multiple template
  createFactory() {
    return (attrs={}) => {
      let actor = this.factory(attrs);
      let applyProp = this.applyProps(actor);

      actor.meta = {
        template: this, // this should be immutable, so we can clone an object.
      }

      R.mapObjIndexed(applyProp, this.properties);
      return actor;
    }
  }
}

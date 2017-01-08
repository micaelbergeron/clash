import React from 'react';
import R from 'ramda';
import Textfield from 'material-ui/TextField';
import Dice from './Dice';

export default class Property {
  constructor(type, def) {
    this._type = type;
    Object.assign(this, def);
  }
}

export const PropertyInput = ({target, attr, ...props}) => {
  let property = target.meta.template.properties[attr];
  props = Object.assign(props, {
    key: attr,
    name: attr,
    floatingLabelText: target[attr] ? `${attr} = ${target[attr]}` : attr,
    ref: props.inputRef
  });

  let value = target.attrs[attr]
  if (value != undefined)
    props.value = property.inputValue(value);
  
  delete props.inputRef;
  return (
    <Textfield {...props} /> 
  );
}

// -- Property definitions
export const dice = new Property(Dice, {
  set: R.compose(x => new Dice(x), String),
  get: x => x ? x.value : NaN,
  inputValue: x => x ? x._dice : "",
});

export const choice = (choices) => new Property('Choice', {
  set: R.compose(x => R.findIndex(R.equals(x))(choices), String),
  get: i => choices[i],
  inputValue: i => choices[i],
});

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

export const PropertyInput = ({target, attr, value, inputRef, ...props}) => {
  let property = target.meta.template.properties[attr];
  newprops = {
    key: attr,
    name: attr,
    ref: inputRef,
    value: value,
  }

  if (props.value === undefined) {
    props.value = property.inputValue(target.attrs[attr])
  }
  delete props.inputRef;
  return (
    <Textfield floatingLabelText={target[attr] ? `${attr} = ${target[attr]}` : attr} {...props} {...newprops} /> 
  );
}

// -- Property definitions
export const dice = new Property(Dice, {
  set: R.compose(x => new Dice(x).roll(), String),
  get: x => x ? x.value : 0,
  inputValue: x => x ? x._dice : "",
});

export const choice = (choices) => new Property('Choice', {
  set: R.compose(x => R.findIndex(R.equals(x))(choices), String),
  get: i => choices[i],
  inputValue: i => choices[i],
});

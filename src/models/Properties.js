import React from 'react';
import R from 'ramda';
import Textfield from 'material-ui/TextField';
import { roll } from './Dice';


export const PropertyInput = ({target, attr, inputRef, ...props}) => {
  let property = target.meta.template.properties[attr];
  newprops = {
    key: attr,
    name: attr,
    ref: inputRef,
  }

  delete props.inputRef;
  return (
    <Textfield floatingLabelText={target[attr] ? `${attr} = ${target[attr]}` : attr} {...props} {...newprops} /> 
  );
}

// -- Property definitions, setters?
export const dice = (name, value=NaN, config={}) => R.merge({
  name,
  convert: R.compose(roll, String),
  value,
}, config);

export const choice = (choices) => (name, config={}) => R.merge({
  name,
  convert: R.compose(x => R.findIndex(R.equals(x), choices), String),
  value: choices[0],
}, config);

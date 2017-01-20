import React from 'react';
import R from 'ramda';
import Textfield from 'material-ui/TextField';
import { roll } from './Dice';
import { templateOf } from './Actor'
import Immutable from 'immutable'


const PARSER_DICE = 'DICE';
const PARSER_CHOICE = 'CHOICE';
const PARSER_NONE = 'NONE';

const defaultProperty = Immutable.Map({
  name: undefined,
  value: undefined,
  parser: PARSER_NONE,
  parserArgs: [],
  config: {},  
})

export const PropertyInput = ({target, attr, inputRef, ...props}) => {
  let property = templateOf(target).properties[attr];
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


export const PARSERS = {
  [PARSER_DICE]: R.compose(roll, String),
  [PARSER_CHOICE]: (choices, value) => R.compose(x => R.findIndex(R.equals(x), choices), String)(value),
  [PARSER_NONE]: R.identity,
}

export const parserOf = R.memoize(
  property => PARSERS[property.get('parser')]
)

// -- Property definitions, setters?
export const text = (name, value="", config={}) => defaultProperty.merge({
  name,
  value,
  config,
});

export const dice = (name, value=NaN, config={}) => defaultProperty.merge({
  name,
  parser: PARSER_DICE,
  value,
  config
});

export const choice = (choices) => (name, config={}) => defaultProperty.merge({
  name,
  parser: PARSER_CHOICE,
  parserArgs: [choices],
  value: choices[0],
  config,
});


// -- Tests
console.info(dice('test', 0).set('value', 20))

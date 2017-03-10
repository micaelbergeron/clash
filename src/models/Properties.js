import React from 'react';
import R from 'ramda';
import Textfield from 'material-ui/TextField';
import AutoComplete from 'components/material-ui/AutoComplete'; // overridden
import { roll } from './Dice';
import { templateOf } from './Actor'
import Immutable from 'immutable'


const PARSER_DICE = 'DICE';
const PARSER_CHECK = 'CHECK';
const PARSER_CHOICE = 'CHOICE';
const PARSER_NONE = 'NONE';

const defaultProperty = Immutable.Map({
  name: undefined,
  value: undefined,
  parser: PARSER_NONE,
  parserArgs: Immutable.List(),
  config: Immutable.Map(),  
})

export const PropertyInput = ({property, inputRef, ...props}) => {
  switch(property.parser) {
    case PARSER_CHECK:
      return <Textfield {...props} floatingLabelText={props.floatingLabelText + " (check)"}  ref={inputRef} /> 

    case PARSER_CHOICE:
      return <AutoComplete {...props} onUpdateInput={value => props.onChange(null, value)} openOnFocus={true} dataSource={property.parserArgs} ref={inputRef} />

    case PARSER_NONE:
    case PARSER_DICE:
      return <Textfield {...props} ref={inputRef} /> 

    default:
      throw new Exception("Unknown property type.")
  }
}

export const PARSERS = {
  [PARSER_DICE]: R.compose(roll, String),
  [PARSER_CHOICE]: (value, choices) => String(value),
  [PARSER_CHECK]: R.compose(x => x + roll('1d20'), roll, String),
  [PARSER_NONE]: R.identity,
}

export const parserOf = R.memoize(
  property => PARSERS[property.get('parser')]
)

// -- Property definitions, setters?
export const text = (name, value='', config={}) => defaultProperty.merge({
  name,
  value,
  config,
});

export const dice = (name, value='', config={}) => defaultProperty.merge({
  name,
  parser: PARSER_DICE,
  value,
  config
});

export const check = (name, value='', config={}) => defaultProperty.merge({
  name,
  parser: PARSER_CHECK,
  value,
  config
});

export const choice = (choices) => (name, config={}) => defaultProperty.merge({
  name,
  parser: PARSER_CHOICE,
  parserArgs: choices,
  value: choices[1],
  config,
});


// -- Tests
console.info(dice('test', 0).set('value', 20))

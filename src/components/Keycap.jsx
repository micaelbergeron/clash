import React from 'react'
import R from 'ramda'

const symbols = [
  [/(enter|return|RET)/, "↵"],
  [/ctrl\+/, "⌃"],
  [/alt\+/, "⌘"],
  [/shift\+/, "⇫"],
]

// hotkey -> ... symbols replacements -> symbolized  hotkey
const symbolize = R.reduce(
  (hotkey, symdef) => hotkey.replace(symdef[0], symdef[1]),
  R.__,
  symbols,
);

export default ({hotkey, ...props}) => {
  const [major, ...alias] = hotkey;
  return <kdb>{symbolize(major)}</kdb>;
}


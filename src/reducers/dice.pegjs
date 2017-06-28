/*
 * Simple Arithmetics Grammar
 * ==========================
 *
 * Accepts expressions like "2 * (3 + 4)" and computes their value.
 * Also accepts Dice notation
 * Also accepts implicit expression notation
 */

{
  var MT = require('mersennetwister');
  var _ = require('lodash');

  function roll(faces) {
    return Math.floor(MT.random() * faces) + 1;
  }
}

Expression
  = neg:"-"? head:Term tail:(_ ("+" / "-") _ Term)* {
    var result = head, i;

    for (i = 0; i < tail.length; i++) {
      if (tail[i][1] === "+") { result += tail[i][3]; }
      if (tail[i][1] === "-") { result -= tail[i][3]; }
    }

    return (neg?-1:1) * result;
  }

Term
  = head:Factor tail:(_ ("*" / "/") _ Factor)* {
    var result = head, i;

    for (i = 0; i < tail.length; i++) {
      if (tail[i][1] === "*") { result *= tail[i][3]; }
      if (tail[i][1] === "/") { result /= tail[i][3]; }
    }

    return result;
  }

Factor
  = neg:"-"? "(" _ expr:Expression _ ")" { return (neg?-1:1) * expr; }
  / Dice
  / Integer

Dice
  = rolls:Integer? [dD] faces:Integer {
    var result = 0;
    rolls = rolls || 1;
    for (var i = 0; i < rolls; i++)
      result += roll(faces);
    return result;
  }

Integer "integer"
  = [0-9]+ { return parseInt(text(), 10); }

_ "whitespace"
  = [ \t\n\r]*

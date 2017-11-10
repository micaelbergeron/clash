const R = require('ramda')

function* hotkeys(cmd) {
  const head = R.head(cmd)
  yield head

  const words = cmd.split(' ')

  const second = words[1]
  const as_chord = (...letters) => letters.join(' ')

  for (var i = 1; i < 4; i++) {
    const chords = R.take(i, second).split('')

    yield as_chord(head, ...chords)
    yield as_chord(head, ...chords, R.last(second))
  }

  return cmd
}

function* rec_hotkeys(cmds, prefix=[]) {
  if (cmds.length == 0) { return ""; }
  const [pivot, ...rest] = cmds
  const [head, last] = [R.head(pivot), R.last(pivot)]

  yield head
  yield* rec_hotkeys(rest)
  yield last
  yield* rec_hotkeys(rest)
}

//const as_hotkey = cmd => [hotkeys(cmd), cmd]
// you can basically prefilter anything you want here
// i.e. ignore prefixed terms (_<term>)
const underscored_terms = term => term.startsWith('_')
const as_hotkey = cmd => {
  const terms = cmd.split(' ')
  return [rec_hotkeys(terms), terms.join(' ')]
}

var commands = R.map(as_hotkey)([
  "add actor",
  "add npc good",
  "add npc bad",
  "add template",
  "add all",
  "add first",
  "add player",
  "add object",
  "add test 123",
  "remove actor",
  "remove doodad",
  "remove npc test test test good",
  "remove npc test test test bad",
  "remove template",
  "remove all",
  "remove first",
  "remove player",
  "remove object",
  "remove test 123",
  "change actor",
  "change npc good",
  "change npc bad",
  "change template",
  "change all",
  "change first",
  "change player",
  "change object",
  "change test 123",
  "show actor",
  "show npc good",
  "show npc bad",
  "show template",
  "show all",
  "show first",
  "show player",
  "show object",
  "show test 123",
])

const tap = name => R.tap(x => console.info(name, x));

// [gen, cmd] -> [hk, gen, cmd]
const step = hotkey => {
  const chords = hotkey[0].next().value;
  return [chords].concat(hotkey)
}

const byHotkey = gens => gens[0]

function squash(kmap) {
  for(var hk in kmap) {
    if (kmap[hk].length == 1) {
      // the command
      kmap[hk] = R.head(kmap[hk])[2];
    } else {
      // only keep the generators, we go for another round
      const gens = R.map(R.tail, kmap[hk])
      kmap[hk] = build_map(gens)
    }
  }
  return kmap
}

const build_map = R.compose(
  squash,
  R.groupBy(byHotkey),
  R.map(step),
)

var hk_graph = build_map(commands)

// -- PARSING
const inputs = "a n y g".split(' ') // that is "new actor"

function parse(graph, inputs) {
  let root = graph
  for (const input of inputs) {
    root = root[input];
    if (typeof(root) === "string")
      return root;
  }
  return null;
}

console.log("=== parse ===")
// console.info(parse(hk_graph, inputs))

function* g_parse(graph) {
  let node = graph;
  let chords = []
  let k;
  do {
    do {
      // gimme the next key
      k = yield node
    } while(!(node.hasOwnProperty(k)))

    chords.push(k)
    node = node[k]
  } while(typeof(node) != "string") // we found the command!

  return R.objOf(chords.join(' '), node);
}

const flatten_map = graph => {
  const go = obj_ => R.chain(([k, v]) => {
    if (typeof v == 'object') {
      return R.map(([k_, v_]) => [`${k} ${k_}`, v_], go(v))
    } else {
      return [[k, v]]
    }
  }, R.toPairs(obj_))

  return R.fromPairs(go(graph))
}

//export const create_parser = g_parse;
//export const build_kmap;

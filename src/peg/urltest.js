var url = require('./url');

var tree = url.parse('http://example.com/search?q=hello#page=1');

tree.elements.forEach(function(node) {
    console.log(node.offset, node.text);
});


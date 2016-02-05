var blessed = require('blessed');
var process = require('process');

// Create a screen object. 
var screen = blessed.screen({
    smartCSR: true
});

screen.title = 'D&D Initiative tracker';

var form = blessed.form({
    parent: screen,
    keys: true,
    left: 'right',
    width: '40%',
    tags: true,
    content: 'Submit or cancel?'
});

// simple inline-block layout
form.layout = blessed.layout({
    parent: form,
    width: '100%',
    height: '100%',
    border: 'line'
});

form.name = blessed.textbox({
    width: '100%',
    mouse: true,
    keys: true,
    inputOnFocus: true,
    height: 1,
    style: {
	bg: '#00ff00',
	focus: {
	    fg: '#0000ff',
	    bg: '#00ff00'
	},
	hover: {
	    bg: '#00ff00'
	}
    }
});

form.hp = blessed.textbox({
    name: 'hp',
    width: '60%',
    mouse: true,
    keys: true,
    inputOnFocus: true,
    height: 1,
    top: 2
});

var submit = blessed.button({
    mouse: true,
    keys: true,
    width: '20%',
    name: 'submit',
    content: 'submit',
    style: {
	bg: 'blue',
	focus: {
	    bg: 'red'
	},
	hover: {
	    bg: 'red'
	}
    }
});

var cancel = blessed.button({
    mouse: true,
    keys: true,
    width: '20%',
    name: 'cancel',
    content: 'cancel',
    style: {
	bg: 'blue',
	focus: {
	    bg: 'red'
	},
	hover: {
	    bg: 'red'
	}
    }
});

form.layout.append(form.name);
form.layout.append(form.hp);
form.layout.append(submit);
form.layout.append(cancel);

submit.on('press', function() {
    form.submit();
});

cancel.on('press', function() {
    form.reset();
});

form.on('submit', function(data) {
    form.setContent('Submitted.');
    screen.render();
});

form.on('reset', function(data) {
    form.setContent('Canceled.');
    screen.render();
});

// Create a box perfectly centered horizontally and vertically. 
var box = blessed.box({
    top: 'bottom',
    width: '60%',
    height: '100%',
    content: '{center}Event list{/center}',
    style: {
	fg: 'white',
	border: {
	    fg: '#f0f0f0'
	},
    }
});

box.on('click', function() { screen.prepend(form) });
box.focus();

// Quit on Escape, q, or Control-C. 
var done = false;
screen.key(['escape', 'q', 'C-c'], function(ch, key) {
    return process.exit(0);
});

// Render the screen, game loop style
screen.render();

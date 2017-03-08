/*eslint no-console:0 */
'use strict';
require('core-js/fn/object/assign');
const webpack = require('webpack');
const Watchpack = require('watchpack');
const WebpackDevServer = require('webpack-dev-server');
const config = require('./webpack.config');
const open = require('open');
const spawn = require('child_process').spawn;

console.log(JSON.stringify(config, null, 2));

new WebpackDevServer(webpack(config), config.devServer)
.listen(config.port, '0.0.0.0', (err) => {
  if (err) {
    console.log(err);
  }
  console.log('Listening at localhost:' + config.port);
  console.log('Opening your system browser...');
  open('http://localhost:' + config.port + '/webpack-dev-server/');
});


const templateWatcher = new Watchpack()
templateWatcher.watch([], ['templates']);
templateWatcher.on("change", function(filePath, mtime) {
  console.info(arguments);
})


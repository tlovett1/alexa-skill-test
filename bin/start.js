#!/usr/bin/env node

'use strict';

var ArgumentParser = require('argparse').ArgumentParser;
var nodemon = require('nodemon');
var path = require('path');
var fs = require('fs');
var parser = new ArgumentParser();
var colors = require('colors');

parser.addArgument(
  [ '-p', '--path' ],
  {
    help: 'Path to Alexa skill'
  }
);

var args = parser.parseArgs();

var path = args.path ? args.path : process.cwd();

try {
  var skillPackageConf = require(path + '/package.json');
} catch (err) {
  console.error('Package.json not found.'.red);
  process.exit(1);
}

if (!skillPackageConf.main) {
  console.error('Main script file not found.'.red);
  process.exit(1);
}

var mainScriptFile = skillPackageConf.main;

try {
  var mainScript = require(path + '/' + mainScriptFile);
} catch (error) {
  console.error('Problem with main script file.'.red);
  console.log(error);
  process.exit(1);
}

nodemon({
  script: __dirname + '/../server.js',
  args: [path  + '/' + mainScriptFile, skillPackageConf.name],
  watch: [
    __dirname + '/../server.js',
    __dirname + '/../package.json',
    __dirname + '/../webpack.config.js',
    path + '/'
  ],
  env: {
    DEBUG: (process.env.DEBUG) ? process.env.DEBUG : 'skill'
  }
});

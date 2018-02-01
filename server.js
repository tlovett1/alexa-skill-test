var express = require('express');
var app = express();
var path = require('path');
var lrserver = require('tiny-lr')();
var pkgConfig = require('./package.json');
var webpack = require('webpack');
var webpackMiddleware = require('webpack-dev-middleware');
var webpackConf = require('./webpack.config.js');
var webpackCompiller = webpack(webpackConf);
var lambdaLocal = require('lambda-local');
var bodyParser = require('body-parser');
var colors = require('colors');
var debug = require('debug')('skill');

var skill = require(process.argv[2]);

var skillName = process.argv[3];

// pull the port number out of the string '--port 3000'
var port = process.argv[4].replace('--port ', '');

var interactionModel = false;
if (process.argv[5]) {
  var interactionModelPath = process.argv[5].replace('--interaction-model ', '');

  try {
    interactionModel = JSON.stringify(require(interactionModelPath));
  } catch (err) {
    // Do nothing
  }
}

var livereloadServerConf = {
  port: 35729
};

var triggerLiveReloadChanges = function() {
  lrserver.changed({
    body: {
      files: [webpackConf.output.filename]
    }
  });
};

lrserver.listen(livereloadServerConf.port, triggerLiveReloadChanges);

webpackCompiller.plugin('done', triggerLiveReloadChanges);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(webpackMiddleware(webpackCompiller));
app.use(require('connect-livereload')(livereloadServerConf));

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
  res.end([
    '<!doctype html>',
    '<html lang="en">',
    '<head>',
    '<meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1">',
    '<title>Alexa Skills Tester - ' + skillName + '</title>',
    '</head>',
    '<body>',
    '<div id="root"></div>',
    '<script>window.SKILL_NAME = "' + skillName + '";</script>',
    '<script>window.INTERACTION_MODEL = ' + interactionModel + '</script>',
    '<script src="' + webpackConf.output.filename + '"></script>',
    '</body>',
    '</html>'
  ].join(''));
});

app.post('/lambda', function(req, res) {
  res.setHeader('Content-Type', 'application/json');

  debug('Lambda event:');
  debug(req.body.event);

  lambdaLocal.execute({
    event: req.body.event,
    lambdaPath: process.argv[2],
    lambdaHandler: 'handler',
    timeoutMs: 10000,
    callback: function(error, data) {
        if (error) {
          debug('Lambda returned error');
          debug(error);
          res.end(JSON.stringify(data));
        } else {
          debug('Lambda returned response')
          debug(data);
          res.end(JSON.stringify(data));
        }
    }
  });
});

app.listen(port, function() {
  console.log('Alexa Skill Test');
  console.log('Skill: ' + skillName);
  console.log('Open http://localhost:' + port + ' in your browser'.green)
});

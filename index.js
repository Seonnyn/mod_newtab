var express = require('express');
var http = require('http');
var async = require('async');
var breach = require('breach_module');

var port = 42424;

var bootstrap = function(http_srv) {
  breach.init(function(cb_) {
    breach.expose('init', function(src, args, cb_) {
      breach.module('core').call('tabs_new_tab_url', {
        url: 'http://127.0.0.1:' + port + '/newtab'
      }, function(err) {
        console.log('New tab page set! [' + err + ']');
      });
      return cb_();
    });
    
    breach.expose('kill', function(args, cb_) {
      process.exit(0);
    });
    
    console.log('Exposed: `http://127.0.0.1:' + port + '/newtab`');
  });
};

(function setup() {
  var app = express();
  
  /* App Configuration */
  app.use('/', express.static(__dirname + '/controls'));
  app.use(require('body-parser')());
  app.use(require('method-override')());
  
  /* Listen locally only */
  var http_srv = http.createServer(app).listen(0, '127.0.0.1');
  
  http_srv.on('listening', function() {
    var port = http_srv.address().port;
    return bootstrap(port);
  });
})();

var rl = require("readline");
var events = require('events');
var domain = require('domain');
var stdin = process.stdin;
var stdout = process.stdout;

// filters the locations based on given user input, everything if
// no match found
function completer(line) {
  var eventNames = [
    'crash',
    'custom',
    'done',
    'error'
  ];

  var hits = eventNames.filter(function(c) {
    return c.indexOf(line) == 0
  });

  return [hits.length ? hits : eventNames, line]
}

function handleInput(appInstance){
  var prompt = rl.createInterface(stdin,stdout,completer);
  prompt.setPrompt('Enter event type (tab to autocomplete): ');
  prompt.prompt();
  prompt.on('line', function(line) {
    switch(line.trim()) {
      case 'done':
          prompt.close();
          break;
      case 'custom':
          appInstance.emit('custom', {
            msg: 'custom event'
          });
          break;
      case 'error':
          appInstance.emit('error', {
            name: "Error",
            level: "recoverable",
            cause: 'missing xyz',
            when: new Date()
          });
          break;
      case 'crash':
        throw {
          name: "Crash",
          level: "fatal",
          cause: 'manuallyTriggered',
          when: new Date()
        };
      default:
          console.log('(Sending positive vides to '+ line +')')
          break;
    }
    prompt.prompt();
  });

  prompt.on('close', function() {
    console.log('Have a great day!');
    appInstance.emit('done');
  });
}


var App = function(){
  var self = this;
  var d = domain.create();
  d.on('error', function(error){
    self.emit('error', error);
  });
  d.add( self );

  self.start = function() {
    handleInput(self);
  };
};
App.prototype = Object.create(require('events').EventEmitter.prototype);
module.exports = App;

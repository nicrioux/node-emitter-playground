var rl = require("readline");
var events = require('events');
var stdin = process.stdin;
var stdout = process.stdout;

// Define the App object
var App = function(){
  var self = this;

  self.start = function() {
    var prompt = createPrompt();
    prompt.prompt(); // now waiting for user input

    // process user input (after enter/return is pressed)
    prompt.on('line', function(line) {
      handleInput(self, prompt, line);
    });
  }
};

// make the App an event emitter
App.prototype = Object.create(require('events').EventEmitter.prototype);

// filters the event names based on given user input
function completer(line) {
  // available events
  var eventNames = [
    'crash',
    'custom',
    'exit',
    'error'
  ];

  // filter by what has been entered so far
  var hits = eventNames.filter(function(c) {
    return c.indexOf(line) == 0
  });

  // return matching events or all if none matched
  return [hits.length ? hits : eventNames, line]
}

function createPrompt(){
  var prompt = rl.createInterface(stdin,stdout,completer);
  prompt.setPrompt('>Enter event type (tab to list/autocomplete): ');
  return prompt;
}

// handles user input
function handleInput(appInstance, prompt, line){
  switch(line.trim()) {
    case 'exit':
        prompt.close();
        appInstance.emit('exit');
    case 'custom':
        appInstance.emit('custom', {
          msg: 'custom event'
        });
        prompt.prompt();
        break;
    case 'error':
        appInstance.emit('error', {
          name: "Error",
          level: "recoverable",
          cause: 'missing xyz',
          when: new Date()
        });
        prompt.prompt();
        break;
    case 'crash':
      throw {
        name: "Crash",
        level: "fatal",
        cause: 'manuallyTriggered',
        when: new Date()
      };
      prompt.prompt();
      break;
    default:
      console.log('Invalid operation. Press tab to see all operations.');
      prompt.prompt();
  }
}

module.exports = App;

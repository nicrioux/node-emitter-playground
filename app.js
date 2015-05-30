var rl = require("readline");
var events = require('events');
var domain = require('domain');


// filters the locations based on given user input, everything if
// no match found
function completer(line) {

  // List of all locations supported
  var locations = [
    'vancouver',
    'san francisco',
    'madagascar'
  ];

  var hits = locations.filter(function(c) {
    return c.indexOf(line) == 0
  });

  return [hits.length ? hits : locations, line]
}
function handleLocation(location){
  console.log('(Sending positive vides to '+ location +')')
}

var App = function(){
};
App.prototype = Object.create(require('events').EventEmitter.prototype);
App.prototype.start = function() {
  var prompts =
    rl.createInterface(process.stdin, process.stdout,completer);
  prompts.setPrompt('Enter your location (quit to exit): ');
  prompts.prompt();
  prompts.on('line', function(line) {
    switch(line.trim()) {
      case 'quit':
          prompts.close();
          break;
      case 'event':
          emit('event', {
            msg: 'sample event'
          });
          break;
      case 'crash':
          var d = domain.create();

          d.on('error', function(error){
            ev.emit('error', error);
          });

          d.run( function(){
            throw {
              name: "Error",
              level: "Show Stopper",
              cause: 'manuallyTriggered',
              when: new Date()
            };
          });
          break;
      default:
          handleLocation(line);
          break;
    }
    prompts.prompt();
  });

  prompts.on('close', function() {
    console.log('Have a great day!');
    emit('done');
  });
};

module.exports = App;

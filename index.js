var App = require("./App");

function onAppDone(){
  console.log('done received');
  process.exit(0);
}
function onAppEvent(msg){
  console.log('event received');
  console.dir(msg);
}
function onAppError(error){
  console.log('There was an error.');
  console.dir( error );
  App = null;
  startApp();
}

function startApp(){
  var app = new App();
  app.on('done', onAppDone );
  app.on('event', onAppEvent );
  app.on('error', onAppError );
  app.start();
}

// start the app
startApp();

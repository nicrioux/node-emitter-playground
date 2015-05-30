var cluster = require('cluster');

if (cluster.isMaster) {
  // fork one process to run the app
  cluster.fork();

  // restart app if it crash, exit otherwise
  cluster.on('exit', function(worker, code, signal) {
    if( code !== 0 ){
      cluster.fork();
    }else{
      process.exit(0);
    }
  });

}else{ // worker
  var App = require("./App");

  // handles any exception bubbling out of the app
  process.on('uncaughtException', function (err) {
    console.error('>>> uncaught exception.', err);
    console.error('>>> restarting app');
    process.exit(1);
  });

  var app = new App();

  // exit on done event
  app.on('exit', function (){
    console.log('>>> exit event received');
    console.log('>>> exiting');
    process.exit(0);
  });

  // log custom event
  app.on('custom', function (msg){
    console.log('>>> custom event received');
    console.dir(msg);
  });

  // log error event
  app.on('error',   function (error){
      console.log('>>> error event received');
      console.dir( error );
  });

  app.start();
}

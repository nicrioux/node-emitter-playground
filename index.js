var cluster = require('cluster');

if (cluster.isMaster) {
  // fork one process to run the app
  cluster.fork();

  // restart app if it crash
  cluster.on('exit', function(worker, code, signal) {
    if( code === 0 ){
      process.exit(0);
    }else{
      cluster.fork();
    }
  });
}else{ // worker
  var App = require("./App");

  // handles any exception bubbling out of the app
  process.on('uncaughtException', function (err) {
    console.error('>>> uncaught exception', err);
    process.exit(1);
  });

  var app = new App();
  app.on('done', function (){
    console.log('>>> done event received');
    process.exit(0);
  });
  app.on('custom', function (msg){
    console.log('>>> custom event received');
    console.dir(msg);
  });
  app.on('error',   function (error){
      console.log('>>> error event received');
      console.dir( error );
  });

  app.start();
}

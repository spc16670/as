var NwBuilder = require('./node-webkit-builder');
var nw = new NwBuilder({
  version: '0.12.1',
  platforms: ['win64','win32'],
  winIco: './icons/ageascope48.ico',
  cacheDir: './nw',
  files: '../ageascope/**' // use the glob format
});

//Log stuff you want

nw.on('log',  console.log);

// Build returns a promise
nw.build().then(function () {
   console.log('all done!');
}).catch(function (error) {
    console.error(error);
});


var Gui = angular.module('ageascope.services.Gui',[]);

Gui.run([function() { 

}]);

Gui.service('GuiService',['$rootScope','growl',function($rootScope,growl){
  var gui = require('nw.gui');
  var win = gui.Window.get();

  win.on('close', function() {
    win.hide();
    showTray();
  });

  win.on('minimize', function() {
    win.hide();
    showTray();
  });

  function showTray() {
    var tray;
    tray = new gui.Tray({ icon: 'lib/img/a16.png' });
    tray.on('click', function() {
      win.show();
      this.remove();
      tray = null;
    });
  };

  win.hide();
  showTray();

  var Service = {};

  Service.msg = function(data) {
    Service.maximise();
    growl.info(data.msg,{ttl: -1});
  };

  Service.maximise = function() {
    win.setAlwaysOnTop(true);
    win.focus();
    win.show(); 
    win.setAlwaysOnTop(false);
  };

  Service.close = function() {
    win.close(true);
  };

  return Service;
}]);

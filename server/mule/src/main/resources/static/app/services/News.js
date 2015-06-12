
var News = angular.module('ageascope.services.News',[]);

News.run([function() { 

}]);

News.service('NewsService',['GuiService','HttpService',
  function(GuiService,HttpService){

  var Service = {
    latest : null
  };

  Service.receive = function(news) {
    console.log('NEWS',news);
    Service.latest = news;
  };

  return Service;
}]);

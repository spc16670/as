var Ageascope = angular.module('ageascope.directives.Ageascope',[]);

Ageascope.directive('avatarImg', function(){
  return function (scope, element, attrs) {
    scope.$watch('userAvatar', function(url){
      element.css({
        //'width': "inherit"
        'height': "auto"
        ,'border-radius': "70px"
        ,'-webkit-border-radius': "70px"
        ,'-moz-border-radius': "70px"
        ,'background-image': "url(" + url + ")"
        ,'background-repeat' : "no-repeat"
        ,'background-position': "left"
        ,'background-color': "#99CCFF"
      });
    });
  };
});

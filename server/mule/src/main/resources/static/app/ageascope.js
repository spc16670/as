var app = angular.module('Ageascope', [
  'ui.bootstrap'
  ,'ui.router'
  ,'angular-growl'
  ,'xeditable'
  ,'cgBusy'
  ,'ngAnimate'
  ,'ageascope.services.Auth'
  ,'ageascope.services.Ageascope'
  ,'ageascope.controllers.Main'
  ,'ageascope.controllers.Dialler'
  ,'ageascope.controllers.News'
  ,'ageascope.controllers.Viper'
  ,'ageascope.controllers.Di'
  ,'ageascope.controllers.Settings'
  ,'ageascope.controllers.Admin'
  ,'ageascope.controllers.Strata'
  ,'ageascope.directives.Ageascope'
  ,'ageascope.directives.Validate'
  ,'ageascope.services.Config'
  ,'ageascope.services.Strata'
  ,'ageascope.services.News'
  ,'ageascope.services.Partial'
  ,'ageascope.services.Dialler'
  ,'ageascope.services.Gui'
  ,'ageascope.services.System'
  ,'ageascope.services.Rest'
  ,'ageascope.services.Http'
]);

/*
 * This is needed to ensure ng-class works  
 * Angular runs this function only once
 */
app.run(['$state','$rootScope','editableOptions',function($state,$rootScope,editableOptions) {
  $rootScope.$state = $state;  // ui.router
  editableOptions.theme = 'bs3'; // xeditable - bootstrap3 theme. Can be also 'bs2', 'default'
}]);

app.config(['growlProvider', function(growlProvider) {
  growlProvider.globalTimeToLive(3000);
  growlProvider.globalPosition('bottom-center');
}]);

app.config(['$stateProvider','$urlRouterProvider'
  ,function($stateProvider,$urlRouterProvider) {

  $urlRouterProvider.otherwise('/');

  $stateProvider

  .state('shell', {
    abstract : true
    ,template: '<ui-view/>' 
  })

  .state('shell.home', {
    url : '/'
    ,controller: 'MainController'
    ,templateProvider: function (PartialService,$stateParams) {
      PartialService.fetch('home');
      return PartialService.promise.then(function(response) {
        return PartialService.partial;
      }); 
    }
  })
  .state('shell.admin', {
    url : '/admin'
    ,controller: 'AdminController'
    ,templateProvider: function (PartialService,$stateParams) {
      PartialService.fetch('admin');
      return PartialService.promise.then(function(response) {
        return PartialService.partial;
      }); 
    }
  })
  .state('shell.settings', {
    url : '/settings'
    ,controller: 'SettingsController'
    ,templateProvider: function (PartialService,$stateParams) {
      PartialService.fetch('settings');
      return PartialService.promise.then(function(response) {
        return PartialService.partial;
      }); 
    }
  })
  .state('shell.dataservices', {
    url : '/dataservices'
    ,templateProvider: function (PartialService,$stateParams) {
      PartialService.fetch('dataservices');
      return PartialService.promise.then(function(response) {
        return PartialService.partial;
      });    
    }
  })
  .state('shell.dialler', {
    url : '/dialler'
    ,templateProvider: function (PartialService,$stateParams) {
      PartialService.fetch('dialler');
      return PartialService.promise.then(function(response) {
        return PartialService.partial;
      });    
    }
  })

  .state('shell.strata', {
    url : '/strata'
    ,controller: 'StrataController'
    ,templateProvider: function (PartialService,$stateParams) {
      PartialService.fetch('strata');
      return PartialService.promise.then(function(response) {
        return PartialService.partial;
      });    
    }
  })

  .state('shell.viper-email', {
    url : '/viper/email'
    ,controller: 'ViperController'
    ,templateProvider: function (PartialService,$stateParams) {
      PartialService.fetch('viper-email');
      return PartialService.promise.then(function(response) {
        return PartialService.partial;
      });    
    }
  })
  .state('shell.viper-reg', {
    url : '/viper/reg'
    ,controller: 'ViperController'
    ,templateProvider: function (PartialService,$stateParams) {
      PartialService.fetch('viper-reg');
      return PartialService.promise.then(function(response) {
        return PartialService.partial;
      });    
    }
  })

}]);



// ============================================================================


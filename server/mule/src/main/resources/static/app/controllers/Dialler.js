var dialler = angular.module('ageascope.controllers.Dialler', []);

dialler.controller('DiallerController',['$scope','growl','AuthService','DiallerService','ConfigService'
  ,function($scope,growl,AuthService,DiallerService,ConfigService) {

  $scope.msg = "Click to start a new session...";
  $scope.diallerState = 0;
  $scope.btnLabel = "Attach";
  $scope.diallerJobs = [];
  $scope.onCall = false;
  $scope.extension = null; 
  $scope.selectedJob = null;
  $scope.selectedWrapUpCode = null;

  $scope.screenFields = null; // == DiallerService.getScreenFields();
  $scope.fieldData = {}; // == DiallerService.getScreenFields();

  $scope.completionCodes = [
    ConfigService.dialler.COMPLETION_CODES.CUSTHU
    , ConfigService.dialler.COMPLETION_CODES.CODE20 
    , ConfigService.dialler.COMPLETION_CODES.SOLD 
  ];
 
  $scope.toggler = {
    'showForm':true
    ,'showWrapUp':false
  };

  $scope.visible = function(view) {
    for (var key in $scope.toggler) {
      if ($scope.toggler.hasOwnProperty(key)) {
        if (key !== view) {
          if ($scope.toggler[key] == true) {
            $scope.toggler[key] = false;
          }
        } else {
          $scope.toggler[key] = true;
        }
      }
    }
  };


  $scope.$watch(function() { return AuthService },function() {
    $scope.extension = AuthService.getExtension();
  },true);

  $scope.connect = function () {
    if ($scope.extension != 0) {
      if ($scope.diallerState == 0) {
        DiallerService.connect();
        $scope.btnLabel = "Detach";
      } else {
        if ($scope.onCall) {
          $scope.msg = "Log out pending...";
          growl.error('Please select a completion code first');
          $scope.visible('showWrapUp');
          $scope.logOutPending = true;
        } else {
          DiallerService.disconnect();
          $scope.btnLabel = "Attach";
          $scope.selectedJob = null;
          $scope.diallerJobs = [];
          $scope.screenFields = null;
        }
      } 
    } else {
      $scope.msg = "Please specify your extension number in 'Settings'";  
    } 
  }

  $scope.setSelected = function(job) {
    $scope.selectedJob = job;
  }

  $scope.setSelectedWrapUpCode = function(wrapUpCode) {
    $scope.selectedWrapUpCode = wrapUpCode;
  }

  $scope.wrapUp = function() {
    DiallerService.wrapUp($scope.selectedWrapUpCode.code);
    $scope.selectedWrapUpCode = null;
    $scope.clearScreenFields();
    $scope.visible('showForm');
    $scope.onCall = false;
    if ($scope.logOutPending) {
      $scope.logOutPending = false;
      $scope.connect();
    } else {
      $scope.msg = "Mowing onto next call...";
      DiallerService.nextCall();
    }
  }

  $scope.join = function() {
    DiallerService.attachJob($scope.selectedJob);
  }

  $scope.$watch(function() { return DiallerService },function() {
    $scope.diallerState = DiallerService.state;
    console.log('CONTROLLER STATE: ', $scope.diallerState);
    switch ($scope.diallerState) {
      case ConfigService.dialler.STATES.AGTListJobs + ConfigService.dialler.CODES.DATA :
        // filter only active jobs
        for(var i in DiallerService.jobs) {
          if (DiallerService.jobs[i].status === 'A') {
            $scope.diallerJobs.push(DiallerService.jobs[i]);
          }
        }
        if ($scope.diallerJobs.length == 0) {
          growl.error("No active jobs...");      
          DiallerService.disconnect();
        } else {
          $scope.btnLabel = "Detach";
        } 
        break;

      case ConfigService.dialler.STATES.AGTListJobs + ConfigService.dialler.CODES.COMPLETE :
        // any state in controller is lost after navigating away
        if ($scope.diallerJobs.length == 0) {
          for(var i in DiallerService.jobs) {
            if (DiallerService.jobs[i].status === 'A') {
              $scope.diallerJobs.push(DiallerService.jobs[i]);
            }
          }
          if ($scope.diallerJobs.length == 0) {
            // This is never fire as previous state runs a disconnect in such an event
          } else {
            $scope.btnLabel = "Detach";
          } 
        }
        break;

      case ConfigService.dialler.STATES.AGTAttachJob + ConfigService.dialler.CODES.COMPLETE :
        DiallerService.listScreens($scope.selectedJob); 
        break;

      case ConfigService.dialler.STATES.AGTListScreens + ConfigService.dialler.CODES.COMPLETE :
        var screens = DiallerService.getScreens();
        if (screens.length == 1) {
          DiallerService.getScreen(screens[0]);
        }
        break;

      case ConfigService.dialler.STATES.AGTGetScreen + ConfigService.dialler.CODES.COMPLETE :
        break;

      case ConfigService.dialler.STATES.AGTListDataFields + ConfigService.dialler.CODES.COMPLETE :
        /*
         * The $scope.screenFields is assigned value only in the AGTListDataFields stage
         * to have the opportunity of adding any extra form fields that might have been 
         * missed in the screen definition
         */
        $scope.screenFields = DiallerService.getScreenFields();
        $scope.clearScreenFields();
        break;
    
      case ConfigService.dialler.STATES.AGTAvailWork + ConfigService.dialler.CODES.COMPLETE :
        break;

      case ConfigService.dialler.STATES.AGTCallNotify + ConfigService.dialler.CODES.DATA :
        //$scope.displayCallData();
        break;
      case ConfigService.dialler.STATES.AGTCallNotify + ConfigService.dialler.CODES.COMPLETE :
        $scope.msg = "Call connected!";
        $scope.onCall = true;
        $scope.screenFields = DiallerService.getScreenFields();
        $scope.clearScreenFields();
        $scope.displayCallData(); 
        $scope.btnLabel = "Detach";
        break;

      case ConfigService.dialler.STATES.AGTFinishedItem + ConfigService.dialler.CODES.COMPLETE :
        $scope.clearScreenFields();
        $scope.onCall = false;
        break;
      case ConfigService.dialler.STATES.AGTJobEnd + ConfigService.dialler.CODES.COMPLETE :
        growl.info('The job has ended.',{ttl:5000});
        break;
      case 0 :
        $scope.selectedJob = null;
        $scope.btnLabel = "Attach";
        break;

      default :
        break; 
    }
    $scope.msg = DiallerService.statusMsg;
  },true);

  /*
   * Clear input fields
   */
  $scope.clearScreenFields = function() {
    if ($scope.screenFields != null && $scope.screenFields.data.length > 0) {
      for (var i=0;i<$scope.screenFields.data.length;i++) {
        var fields = $scope.screenFields.data[i].fields;
        if (fields.length == 2) {
          for (var v=0;v<fields.length;v++) {
            if (fields[v].type === 'F') {
              $scope.fieldData[fields[v].text.name] = "";
            }
          }
        } 
      }
    }
  }

  $scope.displayCallData = function() {
    if ($scope.screenFields != null && $scope.screenFields.data.length > 0) {
      var callNofityData = DiallerService.getCallNotifyData();
      if (callNofityData != null && callNofityData.length > 1) {
        for (var i=0;i<callNofityData.length;i++) {
          var obj = callNofityData[i];
          for (var key1 in obj) {
            if ($scope.fieldData != null) {
              for (var key2 in $scope.fieldData) {
                if ($scope.fieldData.hasOwnProperty(key2)) {
                  if (key1 === key2) {
                    $scope.fieldData[key2] = obj[key1];
                  }
                }
              }
            }
          }
        }
      }
    }
  }

}]);


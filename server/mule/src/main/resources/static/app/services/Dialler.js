
var Dialler = angular.module('ageascope.services.Dialler',[]);

Dialler.run(['DiallerService',function(DiallerService) { 
  //DiallerService.connect();
}]);

Dialler.factory('DiallerService',['$rootScope','ConfigService','AuthService'
  ,function($rootScope,ConfigService,AuthService){

  var tls = require('tls');
  var sprintf = require('sprintf');
  var fs = require('fs');

  var LOG_FILE = ConfigService.dialler.LOG_FILE; 
  
  var SEP = String.fromCharCode(30);
  var ETB = String.fromCharCode(23);
  var ETX = String.fromCharCode(3);
  var SOCKET = null;

  var USER_ID = null;
  var USER_PASS = null;
  var HEADSET_ID = null;

  var Service = {
    state : 0
    ,jobs : []
    ,job : null // the currently selected job
    ,screens : [] // the availalbe screens for the crrent job
    ,screenFields : null // the fields of the selected screen
    ,dataFields : null // the list of all fields in the dialler table
    ,jobDataFieldIndex : null // keeps index of additional fields
    ,AGTSetDataField : [] 
    ,recordPreview : null
    ,callNotifyData : []
    ,statusMsg : "Not Connected"
    ,setState : function (state) {
      $rootScope.$apply( function() { Service.state = state; });
    }
    ,getScreens : function () {
      return Service.screens;
    }
    ,getScreenFields : function () {
      Service.addExtraFormFields();
      return Service.screenFields;
    }
    ,getDataFields : function () {
      return Service.dataFields;
    }  
    ,getCallNotifyData : function () {
      return Service.callNotifyData;
    }

  };

  /**
   *  Connects to the dialler, reads from and writes to the socket   
   */
  Service.connect = function() {
    HEADSET_ID = AuthService.getExtension();
    var options = {
      host: ConfigService.dialler.HOST,
      port: ConfigService.dialler.PORT,
      //Error: Hostname/IP doesn't match certificate's altnames: IP: 10.20.32.21 is not in the cert's list:
      rejectUnauthorized: false,
      key: fs.readFileSync('lib/certs/agent_key.pem'),
      cert: fs.readFileSync('lib/certs/agent_cert.pem'),
      // This is necessary only if the server uses the self-signed certificate
      ca: [ fs.readFileSync('lib/certs/pc_ca.pem') ]
    };
    console.log('Dialler init',options);
    SOCKET = tls.connect(options, function() {
      if (SOCKET.authorized) {
        console.log('Dialler Connected');
      } else {
        console.log('DiallerSocket: ', SOCKET);
      }
    });
    console.log("Socket: ",SOCKET);
    SOCKET.setEncoding('utf8');
    SOCKET.on('data', function(data) {
      console.log("DIALLER RESPONSE << : ",data);
      fs.appendFile(LOG_FILE, "DIALLER RESPONSE << : " +  data + '\n');
      var msg = parse(data);
      console.log("DIALLER RESPONSE (PARSED) << : ",msg);
      var response = respond(msg);
      if (response != null) { SOCKET.write(response) };
    });
    SOCKET.on('end', function() {
      console.log('Dialler Connection Closed.');
    });
  } 

  Service.send = function (msg) {
    if (msg != null) { 
      fs.appendFile(LOG_FILE, "DIALLER REQUEST >> : " +  msg + '\n');
      console.log("DIALLER REQUEST >> : ",msg);
      SOCKET.write(msg) 
    };
  }

  Service.disconnect = function () {
    var msg = agentMsg({keyword: 'AGTLogoff',data : []});
    Service.send(msg);
  }

  Service.attachJob = function (job) {
    var msg = null;
    if (Service.job == null) {
      Service.job = job;  
      msg = agentMsg({keyword: 'AGTSetWorkClass',data : [job.type]});
    } else {
      // This is needed to define the notification key
      Service.job.settings = ConfigService.dialler.JOB_SETTINGS.CRASS;
      msg = agentMsg({keyword: 'AGTAttachJob',data : [Service.job.name]});
    }
    Service.send(msg);
  }

  Service.getScreen = function(screen) {
    msg = agentMsg({keyword: 'AGTGetScreen',data : [screen]});
    Service.send(msg); 
  }
 
  Service.listScreens = function(job) {
    msg = agentMsg({keyword: 'AGTListScreens',data : [job.type]});
    Service.send(msg); 
  }
 
  Service.nextCall = function() {
    console.log('MOVING ONTO ANOTHER CALL...');
    msg = agentMsg({keyword: ConfigService.dialler.STATES.AGTReadyNextItem,data : []});
    Service.send(msg); 
  }

  Service.wrapUp = function(code) {
    msg = agentMsg({keyword: ConfigService.dialler.STATES.AGTFinishedItem,data : [code]});
    Service.send(msg); 
  }

  //===========================================================================
  //=============================== PRIVATE ===================================
  //===========================================================================
  

  function parse (msg) {
    var parsed = {};
    var header = msg.substring(0,55);
    var keyword = header.substring(0,20);
    var keywordTrim = keyword.trim();
    var type = header.substring(20,21);
    var client = header.substring(21,41);
    var processID = header.substring(41,47);
    var invokeID = header.substring(47,51);
    var segmentCount = header.substring(51,55);
    var segments = parseInt(segmentCount);
    var data = msg.substring(55);
    var dataArray = data.split(SEP);
    var returnCode = dataArray[1];
    // Parse return message
    var returnMessage = dataArray[2];
    returnMessage = returnMessage.replace(new RegExp(ETX,"g"), '');
    var returnMsgInfo = [];
    if (returnMessage.indexOf(",") > -1) {
      var returnMessageArr = returnMessage.split(",");
      returnMessage = returnMessageArr[0];
      for (var m=1; m<returnMessageArr.length; m++) {
        if (returnMessageArr[m] !== "") {
          returnMsgInfo.push(returnMessageArr[m]);
        }
      }
    }
    if (returnMsgInfo.length > 0) {
      parsed.returnInfo = returnMsgInfo;
    }
    //
    parsed.keyword = keywordTrim;
    parsed.returnCode = returnCode;
    parsed.returnMessage = returnMessage;
     
    switch(keywordTrim) {
      case ConfigService.dialler.STATES.AGTListJobs : 
        if ( returnMessage == ConfigService.dialler.CODES.DATA ) {
          parsed.jobs = [];  
          for (var i=3;i<dataArray.length;i++) {
             var jobStrings = dataArray[i].replace(new RegExp(ETX,"g"), '');
             var jobArray = jobStrings.split(',');
             parsed.jobs.push({ type: jobArray[0], name: jobArray[1], status: jobArray[2] }); 
          }
	}
        break;
      case ConfigService.dialler.STATES.AGTListScreens : 
        if ( returnMessage == ConfigService.dialler.CODES.DATA ) {
          parsed.screens = []; 
          for (var i=3;i<dataArray.length;i++) {
            parsed.screens.push(dataArray[i]); 
          }
	}
        break;
      case ConfigService.dialler.STATES.AGTListDataFields : 
        if ( returnMessage == ConfigService.dialler.CODES.DATA ) {
          parsed.dataFields = {}; 
          for (var i=3;i<dataArray.length;i++) {
            var dataFields = dataArray[i].replace(new RegExp(ETX,"g"), '');
            var arr = dataFields.split(',');
            parsed.dataFields[arr[0]] = { name: arr[0], length: arr[1], type: arr[2] };
          }
          Service.dataFields = parsed.dataFields;
          console.log('DATA FIELDS: ', parsed.dataFields); 
	}
        break;

      case ConfigService.dialler.STATES.AGTCallNotify : 
        if ( returnMessage == ConfigService.dialler.CODES.DATA ) {
          parsed.callNotifyData = {}; 
          for (var i=3;i<dataArray.length;i++) {
            var dataFields = dataArray[i].replace(new RegExp(ETX,"g"), '');
            var arr = dataFields.split(',');
            if (arr.length % 2 == 0) {
              for (var m=0;m<arr.length;m=m+2) {
                parsed.callNotifyData[arr[m]] = arr[m+1];
                Service.callNotifyData.push(parsed.callNotifyData);
              }
            }
            console.log('CALL NOTIFY DATA ARRAY: ', arr); 
          }
	}
        break;

      case ConfigService.dialler.STATES.AGTPreviewRecord : 
        if ( returnMessage == ConfigService.dialler.CODES.DATA ) {
          parsed.recordPreview = {}; 
          for (var i=3;i<dataArray.length;i++) {
            var dataFields = dataArray[i].replace(new RegExp(ETX,"g"), '');
            var arr = dataFields.split(',');
            console.log('RECORD PREVIEW DATA [] : ', arr); 
          }
	}
        break;

      case ConfigService.dialler.STATES.AGTGetScreen :
        if ( returnMessage == ConfigService.dialler.CODES.DATA ) {
          try {
            var fields = []; 
            var pattern = /(.*),(.*),(.*),(.*),"(.*)"/;
            var dim = { x : 0, y : 0};
            for (var i=3;i<dataArray.length;i++) {
              var field = {};
              var tokens = dataArray[i].replace(new RegExp(ETX,"g"), '');
              tokens = pattern.exec(tokens);
              if (tokens != null) {  
                field.type = tokens[1];
                field.x = parseInt(tokens[2]);
                if (field.x > dim.x) { dim.x = field.x };
                field.y = parseInt(tokens[3]);
                if (field.y > dim.y) { dim.y = field.y };
                field.width = parseInt(tokens[4]);
                var text = tokens[5].split(':');
                if (field.type === "F") {
                  field.text = {};
                  field.text.name = text[0];
                  field.text.access = text[1];
                  field.text.locked = text[2];
                  field.text.format = text[3];
                  field.text.acceptable = text[4].split(',');
                  field.text.required = text[5];
                  field.text.dots = text[6];
                  // This is later used to request form field data
                  Service.AGTSetDataField.push(field.text.name);
                } else {
                  field.text = text[0];
                }
                fields.push(field);
              }
            }

            // group feilds into rows
            parsed.fields = { dim : dim, data : [] };
            // variable to hold the size of longest row
            parsed.fields.dim.xMaxElmCount = 0;
            for (var a=0; a<dim.y; a++) {
              parsed.fields.data.push({ row : a, fields : []})
              for (var b=0; b<fields.length; b++) {
                if (fields[b].y == a+1) {
                  parsed.fields.data[a].fields.push(fields[b]);
                }
              }
              // populate xMaxElmCount to make building table in html easier
              if (parsed.fields.data[a].fields.length > parsed.fields.dim.xMaxElmCount) {
                 parsed.fields.dim.xMaxElmCount = parsed.fields.data[a].fields.length;
              }
              // sort by x asc
              function compare(a,b) {
                if (a.x < b.x)
                  return -1;
                if (a.x > b.x)
                  return 1;
                return 0;
              }
              parsed.fields.data[a].fields.sort(compare);
            }
            // mutate rows into Label : Field pair
            for (var a=0; a<dim.y; a++) {
              
              if (parsed.fields.data[a].fields.length != 0) {

                if (parsed.fields.data[a].fields.length == 1) {
                  if (parsed.fields.data[a].fields[0].type === "L") {
                    parsed.fields.data[a].fields.push({ type: "F", y: a+1, text: null });
                  } else {
                    parsed.fields.data[a].fields.unshift({ type: "L", y: a+1, text: "" });
                  }
                }
                
                // concatenate label string together
                var remIndex = 0;
                for (var b=1; b<parsed.fields.data[a].fields.length; b++) {
                  if (parsed.fields.data[a].fields[b].type === "L") {
                    parsed.fields.data[a].fields[0].text = 
		      parsed.fields.data[a].fields[0].text + " " 
                      + parsed.fields.data[a].fields[b].text + " ";
                    remIndex++;
                  }
                }
                parsed.fields.data[a].fields.splice(1,remIndex); 
              }
            }
 
          } catch (e) {
            console.log('COULD NOT PARSE SCREEN FIELDS: ',e);
          }
	}
        break;
      case "AGTReserveHeadset" :
        if ( returnMessage == ConfigService.dialler.CODES.DATA ) {
	}
        break;
      }
    return parsed;
  }


  function agentMsg (obj) {
    var keyword = sprintf("%-20s", obj.keyword == undefined 
      ? ConfigService.dialler.DEFAULTS.AGENT_MSG.KEYWORD : obj.keyword);
    var type = sprintf("%-1s", obj.type == undefined 
      ? ConfigService.dialler.DEFAULTS.AGENT_MSG.TYPE.COMMAND : obj.type);
    var client = sprintf("%-20s", obj.client == undefined 
      ? ConfigService.dialler.DEFAULTS.AGENT_MSG.CLIENT : obj.client);
    var processId = sprintf("%-6s", obj.processId == undefined 
      ? ConfigService.dialler.DEFAULTS.AGENT_MSG.PROCESS_ID : obj.processId);
    var invokeId = sprintf("%-4s", obj.invokeId == undefined 
      ? ConfigService.dialler.DEFAULTS.AGENT_MSG.INVOKE_ID : obj.invokeId);
    var segmentCount = sprintf("%-4s", obj.data.length);
    var header = keyword + type + client + processId + invokeId + segmentCount;
    var data = "";
    for (var c in obj.data) {
      data = data + SEP + obj.data[c];
    }
    var msg = header + data + ETX;
    return msg; 
  }


  function respond (obj,callback) {
    var msg = null;
    switch (obj.keyword) {
      case "AGTSTART":
        msg = agentMsg({keyword: 'AGTLogon',
          data : [
            USER_ID == null ? ConfigService.dialler.DEFAULTS.USER_ID : USER_ID,
            USER_PASS == null ? ConfigService.dialler.DEFAULTS.USER_PASS : USER_PASS,
            ConfigService.dialler.DEFAULTS.VER_API]});
        Service.statusMsg = 'Please wait...';
        break; 
      case "AGTLogon":
        if (obj.returnMessage === ConfigService.dialler.CODES.PENDING) {
          Service.statusMsg = 'Agent logon is pending...';
        } else if (obj.returnMessage === ConfigService.dialler.CODES.COMPLETE) { 
          msg = agentMsg({keyword: 'AGTReserveHeadset',
            data : [
              HEADSET_ID == null ? ConfigService.dialler.DEFAULTS.HEADSET_ID : HEADSET_ID ]})
        }
        break;
      case ConfigService.dialler.STATES.AGTReserveHeadset :
        if (obj.returnMessage === ConfigService.dialler.CODES.PENDING) {
          Service.statusMsg = 'Reserving headset...';
        } else if (obj.returnMessage === ConfigService.dialler.CODES.COMPLETE) { 
          msg = agentMsg({keyword: 'AGTConnHeadset',data : []})
        } else if (obj.returnMessage === ConfigService.dialler.CODES.UNEXPECTED) {
          Service.disconnect();
          Service.statusMsg = 'Unexpected headset id, disconnecting'; 
        }
        break;
      case ConfigService.dialler.STATES.AGTConnHeadset :
        if (obj.returnMessage === ConfigService.dialler.CODES.PENDING) {
          Service.statusMsg = 'Connecting headset...';
        } else if (obj.returnMessage === ConfigService.dialler.CODES.COMPLETE) { 
          msg = agentMsg({keyword: 'AGTListJobs',data : ['A']})
        }
        break;
      case ConfigService.dialler.STATES.AGTListJobs :
        if (obj.returnMessage === ConfigService.dialler.CODES.DATA) {
          Service.jobs = obj.jobs;
          Service.statusMsg = 'Job list obtained...';
        } else if (obj.returnMessage === ConfigService.dialler.CODES.COMPLETE) { 
        }
        break;
      case "AGTSetWorkClass":
        if (obj.returnMessage === ConfigService.dialler.CODES.COMPLETE) { 
          Service.statusMsg = 'Job type has been set.';
          Service.attachJob(undefined); 
        }
        break;
      case ConfigService.dialler.STATES.AGTAttachJob :
        if (obj.returnMessage === ConfigService.dialler.CODES.COMPLETE) { 
          Service.statusMsg = 'Attached to job,';
        }
        break;
      case  ConfigService.dialler.STATES.AGTListScreens :
        if (obj.returnMessage === ConfigService.dialler.CODES.PENDING) {
          Service.statusMsg = 'Obtaining Screens...';
        } else if (obj.returnMessage === ConfigService.dialler.CODES.DATA) { 
          Service.screens = obj.screens;
          Service.statusMsg = 'Screens obtained.'; 
        } else if (obj.returnMessage === ConfigService.dialler.CODES.COMPLETE) {
        }
        break;
      case ConfigService.dialler.STATES.AGTGetScreen:
        if (obj.returnMessage === ConfigService.dialler.CODES.PENDING) {
        } else if (obj.returnMessage === ConfigService.dialler.CODES.DATA) {
           Service.screenFields = obj.fields;
           if (Service.screenFields == null) {
             alert('COULD NOT PARSE SCREEN FIELDS');
             obj.keyword = null;obj.returnMessage = null;// NEEDED IN CONTROLLER
           }
        } else if (obj.returnMessage === ConfigService.dialler.CODES.COMPLETE) {
          msg = agentMsg({keyword: ConfigService.dialler.STATES.AGTListDataFields,data : [Service.job.type]})
        }
        break; 
      case ConfigService.dialler.STATES.AGTListDataFields:
        if (obj.returnMessage === ConfigService.dialler.CODES.PENDING) {
        } else if (obj.returnMessage === ConfigService.dialler.CODES.DATA) {
           Service.dataFields = obj.dataFields;
           if (Service.dataFields == null) {
             alert('COULD NOT PARSE DATA FIELDS');
             obj.keyword = null;obj.returnMessage = null;// NEEDED IN CONTROLLER
           }
        } else if (obj.returnMessage === ConfigService.dialler.CODES.COMPLETE) {
          /*
           *  At this stage AGTListDataFields returned fields however we are going to use
           *  a pre-selected, hardocded field for the AGTSetNotifyKeyField event
           */
          msg = agentMsg({keyword: ConfigService.dialler.STATES.AGTSetNotifyKeyField,data : 
            [Service.job.type, Service.job.settings.AGTSetNotifyKeyField]})
        }
        break; 
      case ConfigService.dialler.STATES.AGTSetNotifyKeyField:
        if (obj.returnMessage === ConfigService.dialler.CODES.PENDING) {
        } else if (obj.returnMessage === ConfigService.dialler.CODES.DATA) {
        } else if (obj.returnMessage === ConfigService.dialler.CODES.COMPLETE) {
          /*
           * Set the AGTSetDataField
           */
          Service.jobDataFieldIndex = 0;
          msg = agentMsg({keyword: ConfigService.dialler.STATES.AGTSetDataField,data : [
            Service.job.type
            ,Service.AGTSetDataField[Service.jobDataFieldIndex]]})
        }
        break;  
      case ConfigService.dialler.STATES.AGTSetDataField:
        if (obj.returnMessage === ConfigService.dialler.CODES.PENDING) {
        } else if (obj.returnMessage === ConfigService.dialler.CODES.DATA) {
        } else if (obj.returnMessage === ConfigService.dialler.CODES.COMPLETE) {
          /*
           *  This should fire every time one extra AGTSetDataField is sucessfully 
           *  added. The adding of the fields for preview and call notifications can be 
           *  done after AGTAttachJob and before AGTAvailWork
           *
           *  The code below should fire as many times as there are items in the 
           *  Service.job.settings.AGTSetDataField array
           */

           if (Service.jobDataFieldIndex != null) {
             if (Service.AGTSetDataField.length == Service.jobDataFieldIndex) {
               Service.jobDataFieldIndex = null;
               
               console.log('FINISHED SETTING DATA FIELDS');
               msg = agentMsg({keyword: ConfigService.dialler.STATES.AGTAvailWork,data : []});
               Service.send(msg); 
               // Set the agent available?
             } else {
               msg = agentMsg({keyword: ConfigService.dialler.STATES.AGTSetDataField
                ,data : [
                  Service.job.settings.TYPE
                  ,Service.AGTSetDataField[Service.jobDataFieldIndex++]]});
               Service.send(msg); 
             } 
           }
        }
        break;
      case ConfigService.dialler.STATES.AGTAvailWork :
        if (obj.returnMessage === ConfigService.dialler.CODES.PENDING) {
        } else if (obj.returnMessage === ConfigService.dialler.CODES.DATA) {
        } else if (obj.returnMessage === ConfigService.dialler.CODES.COMPLETE) {
          Service.nextCall();
          console.log('READY TO RECEIVE CALLS...');
        }
        break;  
      case ConfigService.dialler.STATES.AGTReadyNextItem :
        if (obj.returnMessage === ConfigService.dialler.CODES.PENDING) {
        } else if (obj.returnMessage === ConfigService.dialler.CODES.DATA) {
        } else if (obj.returnMessage === ConfigService.dialler.CODES.COMPLETE) {
        }
        break; 
      case ConfigService.dialler.STATES.AGTPreviewRecord :
        if (obj.returnMessage === ConfigService.dialler.CODES.PENDING) {
        } else if (obj.returnMessage === ConfigService.dialler.CODES.DATA) {
        } else if (obj.returnMessage === ConfigService.dialler.CODES.COMPLETE) {
        }
        break;  
      case ConfigService.dialler.STATES.AGTCallNotify :
        if (obj.returnMessage === ConfigService.dialler.CODES.PENDING) {
        } else if (obj.returnMessage === ConfigService.dialler.CODES.DATA) {
        } else if (obj.returnMessage === ConfigService.dialler.CODES.COMPLETE) {
        }
        break;  
      case "AGTHookflashLine" :
        var data = SEP + obj.phoneNumber + ETX;
        break;
      case "AGTManualCall" :
        var data = SEP + obj.phoneNumber + ETX;
        break;
      case "AGTSetCallback" :
        var data = SEP + obj.date + SEP + obj.time + SEP + obj.phoneIndex + ETX;
        break;

      case ConfigService.dialler.STATES.AGTFinishedItem :
        if (obj.returnMessage === ConfigService.dialler.CODES.PENDING) {
          Service.statusMsg = 'Wrapping up ...';
        } else if (obj.returnMessage === ConfigService.dialler.CODES.DATA) {
        } else if (obj.returnMessage === ConfigService.dialler.CODES.COMPLETE) {
          Service.statusMsg = 'Wrap up finished';
        }
        break;  
      case ConfigService.dialler.STATES.AGTReleaseLine :
        if (obj.returnMessage === ConfigService.dialler.CODES.PENDING) {
          Service.statusMsg = 'Releasing line ...';
        } else if (obj.returnMessage === ConfigService.dialler.CODES.DATA) {
        } else if (obj.returnMessage === ConfigService.dialler.CODES.COMPLETE) {
          Service.statusMsg = 'Call hung up.';
        }
        break;  
      case ConfigService.dialler.STATES.AGTNoFurtherWork :
        if (obj.returnMessage === ConfigService.dialler.CODES.PENDING) {
          Service.statusMsg = 'Releasing agent from work...';
        } else if (obj.returnMessage === ConfigService.dialler.CODES.DATA) {
        } else if (obj.returnMessage === ConfigService.dialler.CODES.COMPLETE) {
          Service.statusMsg = 'Attempting to log off...';
          Service.disconnect();
        }
        break;
      case ConfigService.dialler.STATES.AGTLogoff :
        if (obj.returnMessage === ConfigService.dialler.CODES.PENDING) {
        } else if (obj.returnMessage === ConfigService.dialler.CODES.COMPLETE) { 
          Service.statusMsg = 'Logged off';
          Service.job = null;
          Service.jobs = [];
          obj.keyword = null;obj.returnMessage = null;// NEEDED IN CONTROLLER
          SOCKET = null;
        } else if (obj.returnMessage === "E28916") {
          Service.statusMsg = 'There is a job attached. Please wait...';
          msg = agentMsg({keyword: 'AGTDetachJob',data : []}) 
        }
        break;
      case ConfigService.dialler.STATES.AGTDetachJob :
        if (obj.returnMessage === ConfigService.dialler.CODES.COMPLETE) { 
          Service.disconnect();
        } else if (obj.returnMessage === "E28913") {
          console.log('AGTDetachJob','Nothing to detach');
        } else if (obj.returnMessage === "E28914") {
          console.log('AGTDetachJob','Agent is still available for work... Requesting no further work');
          msg = agentMsg({keyword: ConfigService.dialler.STATES.AGTNoFurtherWork,data : []}) 
        }  
        break;
      case ConfigService.dialler.AGTHeadsetConnBroken :
         if (obj.returnMessage === "E28880") {
          Service.statusMsg = 'Headset connection is broken.';
          Service.disconnect();
          obj.keyword = null;obj.returnMessage = null;// NEEDED IN CONTROLLER
          Service.jobs = [];
        } else if (obj.returnMessage === "E28881") { 
          Service.statusMsg = 'Headset connection re-established.';
        }
        break;
      case ConfigService.dialler.STATES.AGTJobEnd :
        if (obj.returnMessage === ConfigService.dialler.CODES.COMPLETE) { 
          Service.disconnect();
        }  
        break;
      default :
        console.log('UNHANDLED DIALLER RESPONSE:',obj);
        break;
    }
    //	 
    Service.setState(obj.keyword + obj.returnMessage);
    return msg;
  }

  /* 
   * ==========================================================================
   * ============================== UTILITIES ================================= 
   * ==========================================================================
   */
  Service.addExtraFormFields = function() {
    var formFields = Service.job.settings.ExtraFormFields;
    var formFieldsChecked = [];
    if (Service.dataFields != null) {
      for (var key in Service.dataFields) {
        if (Service.dataFields.hasOwnProperty(key)) {
          for(var f=0;f<formFields.length;f++) {
            if (key === formFields[f].field) {
              formFieldsChecked.push(formFields[f]);
            }
          }
        }
      }
    }
    // for every checked field
    for (var a=0;a<formFieldsChecked.length;a++) {
      if (Service.screenFields != null && Service.screenFields.data.length > 0) {
        // for every screen field
        var data = Service.screenFields.data;
        if (data.length > 0) {

          var exists = false;
          for (var i=0;i<data.length;i++) {
            var fields = data[i].fields;
            // if field has an input
            if (fields.length == 2) {
              for (var v=0;v<fields.length;v++) {
                if (fields[v].type === 'F') { 
                  // if field is a checked field
                  if(fields[v].text.name === formFieldsChecked[a].field){
                    exists = true;
                  } else {
                  }
                }
              }
            }
          }
          if (!exists) {
            // add
            Service.screenFields.dim.y += 1; 
            Service.screenFields.data.push({ 
              row: Service.screenFields.dim.y - 1
              ,fields : [
                {text:formFieldsChecked[a].label,type:"L",width:7,x:5,y:Service.screenFields.dim.y - 1}
                ,{text:
                  { acceptable:[],access:"0",dots:"1",format:"N",locked:"1",name:formFieldsChecked[a].field,required:"0" }
                    ,type:"F",width:8,x:21,y:Service.screenFields.dim.y - 1}
              ] 
            });
            break;
     
          }
        }
      }
    } 
  }

  return Service;
}]);


var Config = angular.module('ageascope.services.Config',[]);

Config.run(['ConfigService',function(ConfigService) { 
}]);

Config.service('ConfigService',[function(){

  var Service = {};

  Service.http = { 
    TIMEOUT : 2000
  };
  Service.dialler = {
    HOST : "10.20.32.21" // dialler1
    ,PORT : 22700
    ,LOG_FILE : "DiallerMessages.txt"
    ,DEFAULTS : {
      USER_ID : "Default\\agent1",
      USER_PASS : "agent1",
      HEADSET_ID : "4237",
      VER_API : "PCAPI_5.1.0.0.4",
      AGENT_MSG : {
        KEYWORD : "AGTSTART", // 20 bytes
        TYPE : { 
          COMMAND : "C",
          PENDING_RESP : "P",
          DATA : "D",
          RESPONSE : "R",
          BUSY : "B",
          NOTIFICATION : "N"
        }, // 1 byte
        CLIENT : "Ageascope", // 20 bytes
        PROCESS_ID : "111111", // 6 bytes
        INVOKE_ID : "2222" // 4 bytes      
      }
    }
    ,CODES : {
      PENDING : "S28833"
      ,UNEXPECTED : "E28871"
      ,COMPLETE : "M00000"
      ,DATA : "M00001" 
    }
    ,STATES : {
      AGTListJobs : "AGTListJobs"
      ,AGTLogoff : "AGTLogoff"
      ,AGTDetachJob : "AGTDetachJob"
      ,AGTHeadsetConnBroken : "AGTHeadsetConnBroken"
      ,AGTNoFurtherWork : "AGTNoFurtherWork"
      ,AGTConnHeadset : "AGTConnHeadset"
      ,AGTReserveHeadset : "AGTReserveHeadset"
      ,AGTAttachJob : "AGTAttachJob"
      ,AGTListScreens : "AGTListScreens"
      ,AGTListDataFields : "AGTListDataFields"
      ,AGTGetScreen : "AGTGetScreen"
      ,AGTSetNotifyKeyField : "AGTSetNotifyKeyField"
      ,AGTSetDataField : "AGTSetDataField"
      ,AGTAvailWork : "AGTAvailWork"
      ,AGTReadyNextItem : "AGTReadyNextItem" // agents starts getting calls
      ,AGTPreviewRecord : "AGTPreviewRecord" // call preview record
      ,AGTCallNotify : "AGTCallNotify" // call arrives with data fields
      ,AGTReleaseLine : "AGTReleaseLine" // dialler hang up
      ,AGTFinishedItem : "AGTFinishedItem" // finish call and set the completion code, calls AGTReleaseLine
      ,AGTDetachJob : "AGTDetachJob" // finish the job
      ,AGTJobEnd : "AGTJobEnd" // finish the job
    }
    ,JOB_SETTINGS : {
      CRASS : {
        TYPE : "O"
        ,AGTSetNotifyKeyField : "3R_ID"
        ,ExtraFormFields : [{label:"3RID",field:"3R_ID"},{label:"ENTRY DATE",field:"ENTRY_DATE"}]
      }
    }
    ,COMPLETION_CODES : {
      NOTCALLED : { keyword : "NOTCALLED", code: "0", type : "System"
        , description : "The account has not been called.", report : "", display: "", bckg: "success" }
      ,CODE1 : { keyword : "CODE1", code: "1", type : "System"
         , description : "Reserved for the system.", report : "", display: "", bckg: "success" }
      ,ERROR : { keyword : "ERROR", code: "2", type : "System"
         , description : "The system detected an invalid phone number.", report : "", display: "", bckg: "success" }
      ,TIMEOUT : { keyword : "TIMEOUT", code: "3", type : "System"
         , description : "The system did not receive a dial tone.", report : "Timed out" }
      ,HANG_PORT : { keyword : "HANG_PORT", code: "4", type : "System"
         , description : "The line was idle after the system dialed the customer record phone number.", report : "", display: "", bckg: "success" }
      ,NOTINZONE : { keyword : "NOTINZONE", code: "5", type : "System"
         , description : "System The local time for the customer phone is outside calling hours.", report : "Not within legal hours" }
      ,MOFLASH_B : { keyword : "MOFLASH_B", code: "6", type : "Agent"
         , description : "Used for native voice and data transfer. An agent transfers a call to an inbound agent without remaining on the line.", report : "Blind transfer" }
      ,HANG_TRANS : { keyword : "HANG_TRANS", code: "7", type : "System"
         , description : "No agent is available for a supervisor transfer.", report : "", display: "", bckg: "success" }
      ,TDSS_HF_B : { keyword : "TDSS_HF_B", code: "8", type : "Agent"
         , description : "ADAPTS API: the agent transfers a call without remaining on the call. This is known as blind hook flash transfer.", report : "", display: "", bckg: "success" }
      ,CODE9 : { keyword : "", code: "9", type : "System"
         , description : "Reserved for the system.", report : "", display: "", bckg: "success" }
      ,CODE10 : { keyword : "", code: "10", type : "System"
         , description : "Reserved for the system.", report : "", display: "", bckg: "success" }
      ,BUSY : { keyword : "BUSY", code: "11", type : "System"
         , description : "The system detected a busy signal.", report : "", display: "", bckg: "success" }
      ,CONTTONE : { keyword : "CONTTONE", code: "12", type : "System"
         , description : "The system detected a continuous tone, such as a fax or modem.", report : "", display: "", bckg: "success" }
      ,AUTOVOICE : { keyword : "AUTOVOICE", code: "13", type : "System"
         , description : "The system detected an answering machine.", report : "", display: "", bckg: "success" }
      ,VOICE : { keyword : "VOICE", code: "14", type : "System"
         , description : "Interim code when a person is on the line.", report : "", display: "", bckg: "success" }
      ,NOANSWER : { keyword : "NOANSWER", code: "15", type : "System"
         , description : "The call placed was not answered.", report : "", display: "", bckg: "success" }
      ,RINGING : { keyword : "RINGING", code: "16", type : "Agent"
         , description : "Can be user defined but is usually defined as a phone call that was still ringing but was passed to an agent.", report : "", display: "", bckg: "success" }
      ,CUSTHU : { keyword : "CUSTHU", code: "17", type : "Agent"
         , description : "Can be user defined but is usually used to define when a customer hangs up while the call is in the wait queue, and the call is still passed to an agent.", report : "", display: "Customer Hang Up" }
      ,TRANSFER : { keyword : "TRANSFER", code: "18", type : "Agent"
         , description : "Can be user defined but is usually defined as a transfer release.", report : "Transferred" }
      ,RECALL : { keyword : "RECALL", code: "19", type : "Agent"
         , description : "Can be user defined but is usually defined as a recall release.", report : "", display: "", bckg: "success" }
      ,CODE20 : { keyword : "", code: "20", type : "Agent"
         , description : "Customer assigned codes used by agents.", report : "", display: "Some other outcome" }
      ,CODE21 : { keyword : "", code: "21", type : "Agent"
         , description : "Customer assigned codes used by agents.", report : "", display: "", bckg: "success" }
      ,CODE22 : { keyword : "", code: "22", type : "Agent"
         , description : "Customer assigned codes used by agents.", report : "", display: "", bckg: "success" }
      ,CODE23 : { keyword : "", code: "23", type : "Agent"
         , description : "Customer assigned codes used by agents.", report : "", display: "", bckg: "success" }
      ,CODE24 : { keyword : "", code: "24", type : "Agent"
         , description : "Customer assigned codes used by agents.", report : "", display: "", bckg: "success" }
      ,CODE25 : { keyword : "", code: "25", type : "Agent"
         , description : "Customer assigned codes used by agents.", report : "", display: "", bckg: "success" }
      ,CODE26 : { keyword : "", code: "26", type : "Agent"
         , description : "Customer assigned codes used by agents.", report : "", display: "", bckg: "success" }
      ,CODE27 : { keyword : "", code: "27", type : "Agent"
         , description : "Customer assigned codes used by agents.", report : "", display: "", bckg: "success" }
      ,CODE28 : { keyword : "", code: "28", type : "Agent"
         , description : "Customer assigned codes used by agents.", report : "", display: "", bckg: "success" }
      ,CODE29 : { keyword : "", code: "29", type : "Agent"
         , description : "Customer assigned codes used by agents.", report : "", display: "", bckg: "success" }
      ,CODE30 : { keyword : "", code: "30", type : "Agent"
         , description : "Customer assigned codes used by agents.", report : "", display: "", bckg: "success" }
      ,CODE31 : { keyword : "", code: "31", type : "Agent"
         , description : "Customer assigned codes used by agents.", report : "", display: "", bckg: "success" }
      ,CODE32 : { keyword : "", code: "32", type : "Agent"
         , description : "Customer assigned codes used by agents.", report : "", display: "", bckg: "success" }
      ,CODE33 : { keyword : "", code: "33", type : "Agent"
         , description : "Customer assigned codes used by agents.", report : "", display: "", bckg: "success" }
      ,CODE34 : { keyword : "", code: "34", type : "Agent"
         , description : "Customer assigned codes used by agents.", report : "", display: "", bckg: "success" }
      ,CANCEL : { keyword : "CANCEL", code: "35", type : "System"
         , description : "Can be user defined but is usually defined as the agent cancelled the managed call.", report : "", display: "", bckg: "success" }
      ,INTERCEPT : { keyword : "INTERCEPT", code: "36", type : "System"
         , description : "Special Information Tone (SIT) received that indicates an operator intercepted the call.", report : "", display: "", bckg: "success" }
      ,NOCIRCUIT : { keyword : "NOCIRCUIT", code: "37", type : "System"
         , description : "SIT received that indicates the circuits were unavailable.", report : "", display: "", bckg: "success" }
      ,DISCONN : { keyword : "DISCONN", code: "38", type : "System"
         , description : "SIT received that indicates the call was a disconnected number.", report : "", display: "", bckg: "success" }
      ,VACANT : { keyword : "VACANT", code: "39", type : "System"
         , description : "SIT received that indicates the call cannot be completed as dialed.", report : "", display: "", bckg: "success" }
      ,REORDER : { keyword : "REORDER", code: "40", type : "System"
         , description : "The call resulted in a fast busy tone.", report : "", display: "", bckg: "success" }
      ,R_RINGING : { keyword : "R_RINGING", code: "41", type : "System"
         , description : "Reserved", report : "", display: "", bckg: "success" }
      ,LINEFAIL : { keyword : "LINEFAIL", code: "42", type : "System"
         , description : "A failure on the phone line occurred.", report : "", display: "", bckg: "success" }
      ,OP_RECALL : { keyword : "OP_RECALL", code: "43", type : "System"
          , description : "Operator set recall.", report : "", display: "", bckg: "success" }
      ,DTMF_V : { keyword : "DTMF_V", code: "44", type : "System"
          , description : "DTMF tone detected.", report : "Voice DMTF" }
      ,HU_INB : { keyword : "HU_INB", code: "45", type : "System"
          , description : "The customer hung up while in the inbound wait queue.", report : "", display: "", bckg: "success" }
      ,HU_OUT : { keyword : "HU_OUT", code: "46", type : "System"
          , description : "The customer hung up while in the outbound wait queue.", report : "", display: "", bckg: "success" }
      ,HANG_INB : { keyword : "HANG_INB", code: "47", type : "System"
          , description : "An agent was unavailable for the inbound call.", report : "", display: "", bckg: "success" }
      ,HANG_OUT : { keyword : "HANG_OUT", code: "48", type : "System"
          , description : "An agent was unavailable for the outbound call.", report : "", display: "", bckg: "success" }
      ,OPDIED : { keyword : "OPDIED", code: "49", type : "System"
          , description : "The agent session ended abnormally.", report : "", display: "", bckg: "success" }
      ,R_HSONHOOK : { keyword : "R_HSONHOOK", code: "050", type : "System"
          , description : "The agent headset disconnected from Proactive Contact.", report : "", display: "", bckg: "success" }
      ,CODE51 : { keyword : "", code: "51", type : "Agent"
          , description : "Customer assigned codes used by agents.", report : "", display: "", bckg: "success" }
      ,CODE88 : { keyword : "", code: "88", type : "Agent"
          , description : "Customer assigned codes used by agents.", report : "", display: "", bckg: "success" }
      ,MANAGEDA : { keyword : "MANAGEDA", code: "89", type : "Agent"
          , description : "Managed Dial: Managed non-connection A.", report : "", display: "", bckg: "success" }
      ,MANAGEDB : { keyword : "MANAGEDB", code: "90", type : "Agent"
          , description : "Managed Dial: Managed non-connection B.", report : "", display: "", bckg: "success" }
      ,VIRTVOICE : { keyword : "VIRTVOICE", code: "91", type : "System"
          , description : "Virtual Agent: Virtual message to VOICE, a person.", report : "", display: "", bckg: "success" }
      ,VIRTAUTOV : { keyword : "VIRTAUTOV", code: "92", type : "System"
          , description : "Virtual Agent: Virtual message to AUTOVOICE, a calling machine.", report : "", display: "", bckg: "success" }
      ,SOLD : { keyword : "SOLD", code: "093", type : "Agent"
          , description : "Sales Verification: Sold campaign.", report : "", display: "Policy Sold" }
      ,VERIFIED : { keyword : "VERIFIED", code: "94", type : "Agent"
          , description : "Sales Verification: Sale verified.", report : "Verified sale" }
      ,UNVERIFIED : { keyword : "UNVERIFIED", code: "95", type : "Agent"
          , description : "Sales Verification: Sale not verified.", report : "", display: "", bckg: "success" }
      ,CODE96 : { keyword : "", code: "96", type : "System"
          , description : "Reserved for the system.", report : "", display: "", bckg: "success" }
      ,CODE97 : { keyword : "", code: "97", type : "System"
          , description : "Reserved for the system.", report : "", display: "", bckg: "success" }
      ,AORECALL : { keyword : "AORECALL", code: "098", type : "Agent"
          , description : "Agent Owned Recall.", report : "", display: "", bckg: "success" }
      ,CODE99 : { keyword : "", code: "99", type : "System"
          , description : "Reserved for the system.", report : "", display: "", bckg: "success" }
    }
  }

  return Service;
}]);

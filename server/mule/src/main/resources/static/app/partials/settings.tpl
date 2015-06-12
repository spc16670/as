<div class="container" ng-controller="SettingsController">

  <div class="row"> 
    <p class="lead">Settings</p>
    <form editable-form name="settingsform" onaftersave="saveSettings()" oncancel="cancel()">
    <table class="table">
      <tbody>
        <tr>
          <td> User: </td>
          <td> <strong> {{ user.windows_username }} </strong> </td>
          <td> </td>
        </tr>
        <tr>
          <td> Avatar: </td>
          <td> <img ng-src="{{ user.avatar }}"> </td>
          <td> </td>
        </tr>
        <tr>
          <td> Extension: </td>
          <td> 
            <span editable-text="user.extension" e-name="extension" e-form="settingsform" onbeforesave="checkExtension($data)" e-required>
              {{ user.extension || '0' }}
            </span>
          </td>
          <td> </td>
        </tr>
      </tbody>
    </table>
        <!-- buttons -->
    <div class="btn-edit">
      <button type="button" class="btn btn-default" ng-show="!settingsform.$visible" ng-click="settingsform.$show()">
        Edit
      </button>
    </div>
    <div class="btn-form" ng-show="settingsform.$visible">
      <button type="submit" ng-disabled="settingsform.$waiting" class="btn btn-primary">Save</button>
      <button type="button" ng-disabled="settingsform.$waiting" ng-click="settingsform.$cancel()" class="btn btn-default">Cancel</button>
    </div> 
    
  </form>
  </div>

  <div class="row">
    <br>
    <br>
  </div>

</div>

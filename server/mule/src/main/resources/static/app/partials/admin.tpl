
<div id="wrapper" ng-controller="AdminController">
  <div id="sidebar-wrapper" class="col-sm-2">
    <div id="sidebar">
      <ul class="nav list-group">
        <li>
          <a class="list-group-item" ng-click="visible('showMessage')"><i class="icon-home icon-1x"></i>Message</a>
        </li>
        <li>
          <a class="list-group-item" ng-click="visible('showUsers')"><i class="icon-home icon-1x"></i>Users</a>
        </li>
      </ul>
    </div>
  </div>
  <div id="main-wrapper" class="col-sm-10 pull-right">
    <div id="main">
      <div class="row">
      </div> <!-- ./row -->

      <!-- Message -->
      <div class="row" ng-if="toggler.showMessage">
        <div class="col-sm-12">
          <br><br>
          <p class="lead">Send user a message</p>
          <label>To:</label>
          <input type="text" ng-model="$parent.selectedUser" typeahead="user.windows_username for user in users | filter:$viewValue | limitTo:8" class="form-control">
          <label>Message:</label>
          <textarea ng-model="$parent.message" class="form-control" rows="5"></textarea>
          <br>
          <button type="button" class="btn btn-primary btn-sm" ng-click="msg()" ng-disabled="selectedUser === null || message === ''" >
            <span class="glyphicon glyphicon-envelope" aria-hidden="true"></span> Send 
          </button>
        </div>
      </div>


      <!-- Users -->
      <div class="row" ng-if="toggler.showUsers">

        <table class="table" ng-if="users.length != 0">
          <thead>
            <tr>
              <th> Windows Login </th>
              <th> Dialler Login </th>
              <th> Extension </th>
              <th style="width:25%"> Action </th>
            </tr>
          </thead>
          <tbody>
            <tr ng-repeat="user in users">
              <td>
                <label> {{ user.windows_username }} </label>
              </td>
              <td>
                <span editable-text="user.dialler_username" e-name="dialler_username" e-form="rowform" onbeforesave="checkDiallerUsername($data, user.dialler_username)" e-required>
                  {{ user.dialler_username }}
                </span>
              </td>
              <td>
                <span editable-text="user.headset_id" e-name="headset_id" e-form="rowform" onbeforesave="checkExtension($data, user.headset_id)" e-required>
                  {{ user.headset_id }}
                </span>
              </td>
              <td>
                <!-- form -->
                <form editable-form name="rowform" onbeforesave="edit($data, user)" ng-show="rowform.$visible" class="form-buttons form-inline" shown="inserted == user">
                  <button type="submit" ng-disabled="rowform.$waiting" class="btn btn-primary">
                    Save
                  </button>
                  <button type="button" ng-disabled="rowform.$waiting" ng-click="rowform.$cancel()" class="btn btn-default">
                    Cancel
                  </button>
                </form>
                <div class="buttons" ng-show="!rowform.$visible">
                  <button class="btn btn-primary" ng-click="rowform.$show()">Edit</button>
                  <button class="btn btn-danger" ng-click="removeUser($index)">Remove</button>
                </div>  
              </td>
            </tr>
          </tbody>
        </table>

      </div>
    </div> <!-- ./main -->
  </div>
</div>
        

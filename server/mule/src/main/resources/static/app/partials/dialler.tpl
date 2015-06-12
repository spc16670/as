
<div id="wrapper" ng-controller="DiallerController">
  <div id="sidebar-wrapper" class="col-sm-2">
    <div id="sidebar">
      <ul class="nav list-group">
        <li>
          <a class="list-group-item" ng-click="connect()"><i class="icon-home icon-1x"></i>{{ btnLabel }}</a>
        </li>
        <li>
          <a class="list-group-item" ng-class="{ active: toggler.showForm }" ng-if="screenFields != null" ng-click="visible('showForm')"><i class="icon-home icon-1x"></i>Client Details</a>
        </li>
        <li>
          <a class="list-group-item" ng-class="{ active: toggler.showWrapUp }" ng-if="onCall" ng-click="visible('showWrapUp')"><i class="icon-home icon-1x"></i>Wrap up</a>
        </li>
      </ul>
    </div>
  </div>
  <div id="main-wrapper" class="col-sm-10 pull-right">
    <div id="main">
      <div class="row">
        <div class="col-sm-12">
          <p class="text-center"><b> {{ msg }} </b></p>
        </div>
      </div> <!-- ./row -->

      <!-- Job List -->
      <div class="row" ng-if="diallerState != 0 && screenFields == null">
        <table class="table" ng-if="diallerJobs.length != 0">
          <thead>
            <tr>
              <th> Type </th>
              <th> Name </th>
              <th> Status </th>
              <th>  </th>
            </tr>
          </thead>
          <tbody>
            <tr ng-class="{ active : job.name === selectedJob.name }" ng-repeat="job in diallerJobs" ng-click="setSelected(job)">
            <!--<tr class="danger" ng-repeat="job in diallerJobs" ng-click="setSelected(job)">-->
              <th> {{ job.type }} </th>
              <th> {{ job.name }} </th>
              <th> {{ job.status }} </th>
              <th>
                <button type="button" class="btn btn-primary btn-sm" ng-click="join()" ng-disabled="selectedJob == null || selectedJob.name !== diallerJobs[$index].name">
                  <span class="glyphicon glyphicon-play-circle" aria-hidden="true"></span> Join 
                </button>
              </th>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Job Form -->
      <div class="row" id="dialler-form-fields" ng-if="screenFields != null && diallerState != 0 && toggler.showForm == true">
        <div class="col-xs-8">
          <table class="table">
            <tbody>
              <tr ng-repeat="field in screenFields.data">
                <th ng-if="field.fields.length > 0"> {{ field.fields[0].text }}  </th>
                <th ng-if="field.fields.length == 1"> </th>
                <th ng-if="field.fields.length > 1" >
                  <!-- if the field.fields.length > 1 there will be a Field (input) object -->
                  <input ng-model="fieldData[field.fields[1].text.name]" type="text" ng-disabled="true" class="form-control"/>
                </th>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="col-xs-4">
        </div>
        <br>
        <br>
      </div> <!-- ./dialler form fields row -->

      <!-- Wrap up -->
      <div class="row" id="dialler-form-fields" ng-if="toggler.showWrapUp">
        <div class="col-xs-12">
          <table class="table">
            <thead>
              <tr>
                <th> Call Outcome </th>
                <th> </th>
              </tr>
            </thead>
            <tbody>
              <tr ng-class="{ active : wrapUpCode.code === selectedWrapUpCode.code }" ng-repeat="wrapUpCode in completionCodes" ng-click="setSelectedWrapUpCode(wrapUpCode)">
                <td> {{ wrapUpCode.display }} </td>
                <td>
                  <button type="button" class="btn btn-primary btn-sm" ng-click="wrapUp()" ng-disabled="selectedWrapUpCode == null || wrapUpCode.code != selectedWrapUpCode.code">
                    <span class="glyphicon glyphicon-play-circle" aria-hidden="true"></span> Wrap Up 
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div> <!-- ./dialler form fields row -->



    </div> <!-- ./main -->
  </div>
</div>
        

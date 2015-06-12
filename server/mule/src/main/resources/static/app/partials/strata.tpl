
<div id="wrapper" ng-controller="StrataController">
  <div id="sidebar-wrapper" class="col-sm-2">
    <div id="sidebar">
      <ul class="nav list-group">
        <li>
          <a class="list-group-item" ng-class="{ active: toggler.showSearch }" ng-click="visible('showSearch')"><i class="icon-home icon-1x"></i>Client Search</a>
        </li>
        <li>
          <a class="list-group-item" ng-class="{ active: toggler.showDetail }" ng-click="visible('showDetail')"><i class="icon-home icon-1x"></i>Client Detail</a>
        </li>
      </ul>
    </div>
  </div>
  <div id="main-wrapper" class="col-sm-10 pull-right">
    <div id="main">

      <div class="row" ng-if="toggler.showSearch">

	  <!-- ClientSearch object

	{"clientReference", "webReference", "policyNumber", "surname", "postcode", "dateOfBirth", "clientStatus", "subagentCode", "searchAggregatorData", "clientSource", "policySource", "email", "context"})

	   -->

          <div id="StrataClientSearch"> 
	    <div class="row">  
              <div class="col-sm-6">
                <div class="panel panel-default">
	          <div class="panel-body"> 
	            <p class="lead">Client Search</p>

	            <form name="strataclientsearch">
		      <label for="clientReference">Client Reference</label>
		      <input name="clientReference" ng-model="client.clientReference" type="text" id="clientReference" class="form-control" placeholder="Client Reference">
		      <label for="webReference">Web Reference</label>
		      <input name="webReference" ng-model="client.webReference" type="text" id="webReference" class="form-control" placeholder="Web Reference">
		      <label for="policyNumber">Policy Number</label>
		      <input name="policyNumber" ng-model="client.policyNumber" type="text" id="policyNumber" class="form-control" placeholder="Policy Number">
		      <label for="email">Email</label>
		      <input name="email" ng-model="client.email" type="email" id="inputEmail" class="form-control" placeholder="Email address">
		      <p class="help-block" ng-if="strataclientsearch.email.$error.email">The email address is invalid</p>
      
		      <label for="surname">Surname</label>
		      <input name="surname" ng-model="client.surname" type="text" id="surname" class="form-control" placeholder="Surname">
                      <br>
	              <div class="btn-group" role="group">
		        <button type="button" class="btn btn-primary" ng-click="search()">Search</button>
	              </div>
                    </form>
                  </div>
                </div>
              </div>
              <div class="col-sm-6">
                <div class="row">
		  <table class="table" ng-if="results.length != 0">
	            <thead>
                      <tr>
			<th><i> Results </i></th>
			<th>  </th>
	              </tr>
		    </thead>
		    <tbody>
		      <tr ng-class="{ active : result === selectedResult }" ng-repeat="result in results" ng-click="setSelected(result)">
		        <td><label> {{ result.nameline }} </label></td>
			<td>
			  <button type="button" class="btn btn-primary btn-sm" ng-click="visible('showDetail')" ng-disabled="selectedResult === null || selectedResult !== results[$index]">
			    <span class="glyphicon glyphicon-edit" aria-hidden="true"></span> Select
			  </button>
			</td>
	              </tr>
		    </tbody>
		  </table>
		</div>
              </div>
	    </div>
          </div>
        </div>

      <div class="row" ng-if="toggler.showDetail">
	<table class="table">
	  <thead>
	    <tr>
	      <th>  </th>
	      <th><i> Client Details </i></th>
	    </tr>
	  </thead>
	  <tbody>
            <tr><td>Name Line: </td><td>{{ selectedResult.nameline }}</td></tr>
            <tr><td>Address Line: </td><td>{{ selectedResult.addressLine }}</td></tr>
            <tr><td>Post Code: </td><td>{{ selectedResult.postcode }}</td></tr>
            <tr><td>Date of Birth: </td><td>{{ selectedResult.dateOfBirth }}</td></tr>
            <tr><td>Email: </td><td> {{ selectedResult.emailAddress }} </td></tr>
            <tr><td>Status: </td><td> {{ selectedResult.clientStatus }} </td></tr>
            <tr><td>Proposer Id: </td><td> {{ selectedResult.proposerID }} </td></tr>
            <tr><td>Web Reference: </td><td> {{ selectedResult.webReference }} </td></tr>
            <tr><td>Client Source: </td><td> {{ selectedResult.clientSource }} </td></tr>
	  </tbody>
	</table>
      </div>

    </div> <!-- ./main -->
  </div>
</div>

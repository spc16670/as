 
    <div class="container">
      <!-- REGISTRATION -->
      <div id="ViperReg"> 
        <form name="viperRegForm" class="form-signin viperemail">
          <div class="form-group">  
            <div class="well">{{ regMsg }}</div> 
            <label for="inputReg" class="sr-only">Vehicle Registration</label>
            <input name="reg" ng-model="viper.reg" car-registration="reg" id="inputReg" class="form-control" placeholder="Registration" capitalize required autofocus>
            <p class="help-block" ng-if="viperRegForm.reg.$error.required">The user's registration is required</p>

            <div class="btn-group btn-group-justified viper" role="group" aria-label="...">
              <div class="btn-group" role="group">
                <button type="button" class="btn btn-primary" ng-click="addReg(viper)">Add</button>
              </div>
              <div class="btn-group" role="group">
                <button type="button" class="btn btn-warning" ng-click="removeReg(viper)">Remove</button>
              </div>
              <div class="btn-group" role="group">
                <button type="button" class="btn btn-success" ng-click="searchReg(viper)">Search</button>
              </div>
            </div>

          </div>  
        </form>
      </div>
    </div>

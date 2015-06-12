
    <div class="container">
      <!-- EMAIL -->
      <div id="ViperEmail"> 
        <form name="viperEmailForm" class="form-signin">
          <div class="form-group" show-errors>  
            <div class="well">{{ emailMsg }}</div> 
            <label for="inputEmail" class="sr-only">Email address</label>
            <input name="email" ng-model="viper.email" type="email" id="inputEmail" class="form-control" placeholder="Email address" capitalize required autofocus>
            <p class="help-block" ng-if="viperEmailForm.email.$error.required">The user's email is required</p>
            <p class="help-block" ng-if="viperEmailForm.email.$error.email">The email address is invalid</p>

            <div class="btn-group btn-group-justified viper" role="group" aria-label="...">
              <div class="btn-group" role="group">
                <button type="button" class="btn btn-primary" ng-click="addEmail(viper)">Add</button>
              </div>
              <div class="btn-group" role="group">
                <button type="button" class="btn btn-warning" ng-click="removeEmail(viper)">Remove</button>
              </div>
              <div class="btn-group" role="group">
                <button type="button" class="btn btn-success" ng-click="searchEmail(viper)">Search</button>
              </div>
            </div>

          </div>  
        </form>
      </div>
    </div>

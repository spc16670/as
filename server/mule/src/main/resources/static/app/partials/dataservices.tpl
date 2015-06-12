
  <div class="container">
    <!-- DI -->
    <div ng-controller="DiController">
      <div id="DiBatch"> 
        <form name="diBatchForm" class="form-signin" ng-submit="runBatch()">
          <div class="form-group"> 
            <div class="well">{{ msg }}</div> 
            <label for="inputEmail" class="sr-only">Di Batch Job</label>
          </div>  
          <button ng-disabled="disabled" class="btn btn-lg btn-primary btn-block" type="submit">Run Batch Job</button>
        </form>
      </div>

    </div> <!-- ./di -->
  </div>


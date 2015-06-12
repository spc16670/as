var Validate = angular.module('ageascope.directives.Validate',[]);

Validate.directive('showErrors', function(){
  return {
    restrict: 'A',
    require: '^form',
    link: function(scope, el, attrs, formCtrl){
        // find the input text box element, which has the 'name' attribute
        var inputEl = el[0].querySelector("[name]");
        // convert the native text box element to an angular element
        var inputNgEl = angular.element (inputEl);
        // get the name on the text box so we know the property to check on the form controller 
        var inputName  = inputNgEl.attr('name');
        // only apply has error class after user leaves text-box-has error class gets added to surrounding-div with form-group class
        inputNgEl.bind('blur', function(){
          el.toggleClass('has-error', formCtrl[inputName].$invalid);                                            
        })
        // directive subscribes to 'show-errors-check-validity' event and check validity when it is fired.
        scope.$on('show-errors-check-validity', function(){
          el.toggleClass('has-error', formCtrl[inputName].$invalid);
        });
      }
    };
});

Validate.directive('carRegistration', function(){
  //reg expression from - gitHub-danielrbradley/uk-number-plate-validation.md
  var REGRE = /^[A-Z]{2}[0-9]{2}[A-Z]{3}$|^[A-Z][0-9]{1,3}[A-Z]{3}$|^[A-Z]{3}[0-9]{1,3}[A-Z]$|^[0-9]{1,4}[A-Z]{1,2}$|^[0-9]{1,3}[A-Z]{1,3}$|^[A-Z]{1,2}[0-9]{1,4}$|^[A-Z]{1,3}[0-9]{1,3}$/; 

  return {
    require: 'ngModel',// inject ngModel 
    // link function is for setting up listeners on the DOM  
    link: function(scope, el, attrs, formCtrl) {
      // watch the model defined on the element 
      scope.$watch(attrs.ngModel, function(newVal) {
        var result = REGRE.test(newVal);
        formCtrl.$setValidity('invalid',result);
        if (newVal == undefined || newVal === "") {
          scope.regMsg = "Please enter a valid car registration";
        } else {
          if (!result) {
            scope.regMsg = "Invalid car registration";
          } else {
            scope.regMsg = "Add " + newVal + " to the list of blocked car registration numbers?";
          }
        }
      });
    }
  }
});

Validate.directive('capitalize', function() {
   return {
     require: 'ngModel',
     link: function(scope, element, attrs, modelCtrl) {
        var capitalize = function(inputValue) {
           if(inputValue == undefined) inputValue = '';
           var capitalized = inputValue.toUpperCase();
           if(capitalized !== inputValue) {
              modelCtrl.$setViewValue(capitalized);
              modelCtrl.$render();
            }         
            return capitalized;
         }
         modelCtrl.$parsers.push(capitalize);
         capitalize(scope[attrs.ngModel]);  // capitalize initial value
     }
   };
});

(function() {
  var showErrorsModule;

  showErrorsModule = angular.module('ui.bootstrap.showErrors', []);

  showErrorsModule.directive('showErrors', [
    '$timeout', 'showErrorsConfig', '$interpolate', function($timeout, showErrorsConfig, $interpolate) {
      var getShowSuccess, getTrigger, linkFn;
      getTrigger = function(options) {
        var trigger;
        trigger = showErrorsConfig.trigger;
        if (options && (options.trigger != null)) {
          trigger = options.trigger;
        }
        return trigger;
      };
      getShowSuccess = function(options) {
        var showSuccess;
        showSuccess = showErrorsConfig.showSuccess;
        if (options && (options.showSuccess != null)) {
          showSuccess = options.showSuccess;
        }
        return showSuccess;
      };
      linkFn = function(scope, el, attrs, formCtrl) {
        var blurred, inputElement, inputElements, inputName, inputNames, isBlurred, isValid, options, showSuccess, toggleClasses, trigger, _i, _len, _ref;
        blurred = {};
        inputNames = [];
        options = scope.$eval(attrs.showErrors);
        showSuccess = getShowSuccess(options);
        trigger = getTrigger(options);
        inputElements = {};
        _ref = el[0].querySelectorAll('.'+showErrorsConfig.class.formControl+'[name]');
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          inputElement = _ref[_i];
          if (inputName = $interpolate(inputElement.name || '')(scope)) {
            (inputElements[inputName] || (inputElements[inputName] = [])).push(inputElement);
          }
        }
        isBlurred = function() {
          var allBlurred;
          allBlurred = true;
          angular.forEach(blurred, function(elementBlurred) {
            return allBlurred = allBlurred && elementBlurred;
          });
          return allBlurred;
        };
        isValid = function() {
          var allValid;
          allValid = true;
          angular.forEach(inputNames, function(inputName) {
            return allValid = allValid && formCtrl[inputName].$valid;
          });
          return allValid;
        };
        angular.forEach(inputElements, function(inputEl, inputName) {
          var inputNgEl;
          inputNames.push(inputName);
          blurred[inputName] = false;
          inputNgEl = angular.element(inputEl);
          inputNgEl.bind(trigger, function() {
            blurred[inputName] = true;
            if (isBlurred()) {
              return toggleClasses(!isValid());
            }
          });
          return scope.$watch(function() {
            return formCtrl[inputName] && formCtrl[inputName].$invalid;
          }, function(invalid) {
            if (!isBlurred()) {
              return;
            }
            return toggleClasses(!isValid());
          });
        });
        if (!inputNames.length) {
          throw "show-errors element has no child input elements with a 'name' attribute and a '" + showErrorsConfig.class.formControl + "' class";
        }
        scope.$on('show-errors-check-validity', function() {
          return toggleClasses(!isValid());
        });
        scope.$on('show-errors-reset', function() {
          return $timeout(function() {
            el.removeClass(showErrorsConfig.class.hasError);
            el.removeClass(showErrorsConfig.class.hasSuccess);
            return angular.forEach(inputNames, function(inputName) {
              return blurred[inputName] = false;
            });
          }, 0, false);
        });
        return toggleClasses = function(invalid) {
          el.toggleClass(showErrorsConfig.class.hasError, invalid);
          if (showSuccess) {
            return el.toggleClass(showErrorsConfig.class.hasSuccess, !invalid);
          }
        };
      };
      return {
        restrict: 'A',
        require: '^form',
        compile: function(elem, attrs) {
          if (attrs['showErrors'].indexOf('skipFormGroupCheck') === -1) {
            if (!(elem.hasClass(showErrorsConfig.class.formGroup) || elem.hasClass(showErrorsConfig.class.inputGroup))) {
              throw "show-errors element does not have the '" + showErrorsConfig.class.formGroup + "' or '" + showErrorsConfig.class.inputGroup + "' class";
            }
          }
          return linkFn;
        }
      };
    }
  ]);

  showErrorsModule.provider('showErrorsConfig', function() {
    var _showSuccess, _trigger, _class;
    _showSuccess = false;
    _trigger = 'blur';
    _class = {
      formGroup: 'form-group',
      inputGroup: 'input-group',
      formControl: 'form-control',
      hasError: 'has-error',
      hasSuccess: 'has-success',
    };
    this.showSuccess = function(showSuccess) {
      return _showSuccess = showSuccess;
    };
    this.trigger = function(trigger) {
      return _trigger = trigger;
    };
    this.class = function(cssClassObj) {
      return _class = cssClassObj;
    };
    this.$get = function() {
      return {
        showSuccess: _showSuccess,
        trigger: _trigger,
        class: _class,
      };
    };
  });

}).call(this);

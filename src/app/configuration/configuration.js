angular.module('passmaker.configuration', [
  'ui.router',
  'ui.bootstrap.modal'
])

.config(["$stateProvider", function($stateProvider) {
  $stateProvider.state('configuration', {
    url: '/configuration',
    templateUrl: 'configuration/configuration.tpl.html',
    controller: 'ConfigurationCtrl',
    data: { pageTitle: 'Configuration' }
  });
}])

.controller('ConfigurationCtrl', ["$scope", "profile", "pMaker", "passMakerConf", "$modal", function($scope, profile, pMaker, passMakerConf, $modal) {

  $scope.hashAlgorithms = pMaker.supportedAlgorithms();

  $scope.profile = profile;

  $scope.addException = function() {
    $scope.profile.exceptions = $scope.profile.exceptions || [];
    $scope.profile.exceptions.push({
      'service': 'New service name',
      'passwordLength': { 'override': false, 'value': ''},
      'modifier': { 'override': false, 'value': ''}
    });
  };

  $scope.removeException = function(i) {
    $scope.profile.exceptions.splice(i, 1);
  };

  $scope.restoreConfiguration = function() {
    passMakerConf.load();
  };


  $scope.showConfiguration = function() {
    var stringProfile = angular.toJson(profile, true);
    $modal({
      title: 'Configuration',
      content:'<pre>' + stringProfile + '</pre>',
      html: true
    });
  };

  $scope.saveConfiguration = function() {
    passMakerConf.save();
  };
}])

.service('profileManager', ["profile", function(profile) {
  this.getProfile = function(inputText) {
    var p = {
      custom: false,
      hashAlgorithm: profile.hashAlgorithm,
      characters: profile.characters,
      passwordLength: profile.passwordLength
    };
    angular.forEach(profile.exceptions, function(exception) {
      if (inputText && inputText == exception.service) {
        p.custom = true;
        if (exception.passwordLength.override === true) {
          p.passwordLength = exception.passwordLength.value;
        }
        if (exception.modifier.override === true) {
          p.modifier = exception.modifier.value;
        }
      }
    });
    return p;
  };
}])

;

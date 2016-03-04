'use strict';

var mdrlMigrationApp = angular.module('mdrlMigrationApp', ['migrationControllers', 'ui.bootstrap']);

var migrationControllers = angular.module('migrationControllers', []);

migrationControllers.controller('MigratorControl', ['$scope', '$http', '$log', 
  function($scope, $http, $log) {
    $scope.loading = false;
    $scope.mdrlAPIKey = '';
    $scope.mdrlTpl = '';
    $scope.spAPIKey = '';
    $scope.useHerokuSPAPIKey = false;
    $scope.migrate = function(formIsValid) {
      if (!formIsValid) {
        return;
      }
      $scope.loading = true;
      $http({
        method: 'POST',
        url: '/api/migrate',
        data: {
          mandrillAPIKey: $scope.mdrlAPIKey,
          mandrillTemplateName: $scope.mdrlTpl,
          useHerokuSPAPIKey: $scope.useHerokuSPAPIKey,
          sparkPostAPIKey: $scope.spAPIKey
        }
      }).then(function(result) {
        if (result.errors) {
          console.log('Error: ' + JSON.stringify(result.errors, null, '  '));
        } else {
          showInfo('Migration of ' + $scope.mdrlTpl + ' succeeded!');
        }
      }).catch(function(err) {
        if (err.data.errors) {
          err.data.errors.forEach(function(error) {
            showError(error.message);
          });
        } else {
          console.error(err);
          showError('Internal error HTTP=' + err.statusText +
            '.  Check your console for detail and please ping us on Slack in #template-migration for help.'
          );
        }
      }).finally(function() {
        $scope.loading = false;
      });
    };

    $scope.alerts = [];
    $scope.closeAlert = function(idx) {
      $scope.alerts.splice(idx, 1);
    };

    function showInfo(msg) {
      $scope.alerts.unshift({type: 'success', msg: msg});
    }

    function showWarning(msg) {
      $scope.alerts.unshift({type: 'warning', msg: msg});
    }

    function showError(msg) {
      $scope.alerts.unshift({type: 'danger', msg: msg});
    }
  }]);


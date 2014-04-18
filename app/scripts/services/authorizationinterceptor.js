'use strict';

angular.module('commonsCloudAdminApp')
  .factory('AuthorizationInterceptor', function ($rootScope, $q, ipCookie) {

    //
    // Before we do anything else we should check to make sure
    // the users is authenticated with the CommonsCloud, otherwise
    // the this Client Application will not work properly. We must
    // have already authenticated the user (Resource Owner) with
    // the API through OAuth 2.0
    //
    // We set the default value to `false` and then check if the
    // session cookie for our domain exists.
    //
    $rootScope.auth = {
      'is_authenticated': false
    };

    if (ipCookie('session')) {
      $rootScope.auth.is_authenticated = true;
    }

    return {
        request: function(config) {
            var sessionCookie = ipCookie('session');
            config.headers = config.headers || {};
            if (sessionCookie) {
                config.headers.Authorization = 'Bearer ' + sessionCookie;
            }
            console.log('config',config || $q.when(config));
            return config || $q.when(config);
        },
        response: function(response) {
            if (response.status === 401) {
                console.log('// TODO: Redirect user to login page.');
            }
            console.log('response',response || $q.when(response));
            return response || $q.when(response);
        }
    };

  }).config(function ($httpProvider) {
    $httpProvider.interceptors.push('AuthorizationInterceptor');
  });
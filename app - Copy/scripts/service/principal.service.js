(function() {
    'use strict';

    angular
        .module('vietteltv')
        .factory('Principal', Principal);

    Principal.$inject = ['$q', 'Account', 'localStorageService'];

    function Principal($q, Account, localStorageService) {
        var _identity,
            _authenticated = false;

        var service = {
            authenticate: authenticate,
            hasAnyAuthority: hasAnyAuthority,
            hasAuthority: hasAuthority,
            identity: identity,
            isAuthenticated: isAuthenticated,
            isIdentityResolved: isIdentityResolved
        };

        return service;

        function authenticate(identity) {
            _identity = identity;
            _authenticated = identity !== null;
        }

        function hasAnyAuthority(authorities) {
            if (!_authenticated || !_identity || !_identity.authorities) {
                return false;
            }

            for (var i = 0; i < authorities.length; i++) {
                if (_identity.authorities.indexOf(authorities[i]) !== -1) {
                    return true;
                }
            }

            return false;
        }

        function hasAuthority(authority) {
            if (!_authenticated) {
                return $q.when(false);
            }

            return this.identity().then(function(_id) {
                return _id.authorities && _id.authorities.indexOf(authority) !== -1;
            }, function() {
                return false;
            });
        }

        function identity(force) {
            var deferred = $q.defer();

            if (force === true) {
                _identity = undefined;
            }

            // check and see if we have retrieved the identity data from the server.
            // if we have, reuse it by immediately resolving
            if (angular.isDefined(_identity)) {
                deferred.resolve(_identity);

                return deferred.promise;
            }

            // retrieve the identity data from the server, update the identity object, and then resolve.
            // Account.get().$promise
            //     .then(getAccountThen)
            //     .catch(getAccountCatch);

            if (localStorageService.get('token')) {
                _identity = 'LOGIN_SUCCESS';
                _authenticated = true;
            } else {
                _identity = 'LOGIN_FAILED';
                _authenticated = false;
            }


            deferred.resolve(_identity);

            return deferred.promise;

            function getAccountThen(account) {
                _identity = account.data;
                _authenticated = true;
                deferred.resolve(_identity);
                // JhiTrackerService.connect();
            }

            function getAccountCatch() {
                _identity = null;
                _authenticated = false;
                deferred.resolve(_identity);
            }
        }

        function isAuthenticated() {
            return _authenticated;
        }

        function isIdentityResolved() {
            return angular.isDefined(_identity);
        }
    }
})();
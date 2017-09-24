/* global angular:true, WebSocket:true */

/**
 * EF - CTX QA test task
 */

angular.module('testTaskApp.services', [])

.factory('testTaskService', function ($rootScope, CONFIG) {
    'use strict';

    var socket;

    function connectWebSocket() {
        socket = new WebSocket(CONFIG.serverEndpoint);
    }

    function isValidMeasurementData(obj) {
        //validate structure
        if( obj === null
        || !obj.hasOwnProperty('control')              || !obj.hasOwnProperty('telemetry')
        || !obj.control.hasOwnProperty('landing_gear') || !obj.control.hasOwnProperty('flaps')
        || !obj.telemetry.hasOwnProperty('altitude')   || !obj.telemetry.hasOwnProperty('airspeed')) {
            return false;
        }

        // poor man's type safety
        if(!angular.isNumber(obj.control.landing_gear) || !angular.isNumber(obj.control.flaps)
        || !angular.isNumber(obj.telemetry.altitude)   || !angular.isNumber(obj.telemetry.airspeed)) {
            return false;
        }

        // landing gear and flaps ranges
        if((obj.control.landing_gear < 0        || obj.control.landing_gear > 1)
        || (obj.control.flaps < CONFIG.minFlaps || obj.control.flaps > CONFIG.maxFlaps)) {
            return false;
        }

        // altitude and airspeed ranges
        if((obj.telemetry.altitude < CONFIG.minAltitude || obj.telemetry.altitude > CONFIG.maxAltitude)
        || (obj.telemetry.airspeed < CONFIG.minAirSpeed || obj.telemetry.airspeed > CONFIG.maxAirSpeed)) {
            return false;
        }

        return true;
    }

    connectWebSocket();

    return {
        connect: function() {
            connectWebSocket();
        },

        onopen: function (callback) {
            socket.onopen = function () {
                $rootScope.$apply(callback.apply(socket, arguments));
            };
        },

        onclose: function (callback) {
            socket.onclose = function () {
                $rootScope.$apply(callback.apply(socket, arguments));
            };
        },

        onmessage: function (callback) {
            socket.onmessage = function (event) {
                var message = null;

                try {
                    message = JSON.parse(event.data);

                    if(message !== null && isValidMeasurementData(message)) {
                        $rootScope.$apply(callback.apply($rootScope, [message]));
                    }
                    else {
                        console.debug('onmessage --', 'WARNING! discarded invalid message - ', event.data);
                    }
                }
                catch(exception) {
                    console.debug('onmessage --', 'ERROR: JSON.Parse (', exception, ') - ', event.data);
                }
            };
        },

        onerror: function (callback) {
            socket.onerror = function () {
                $rootScope.$apply(callback.apply(socket, arguments));
            };
        },

        send: function (data) {
            socket.send(data);
        },

        setFlaps: function (newVal) {
            if(isNaN(newVal) || Math.floor(newVal) != newVal)
                return;

            if(newVal < CONFIG.minFlaps || newVal > CONFIG.maxFlaps)
                return;

            socket.send(JSON.stringify({ type: 'flaps', value: newVal }));
        },

        setLandingGearDeployed: function (newVal) {
            if(typeof newVal != 'boolean')
                return;

            socket.send(JSON.stringify({ type: 'landing_gear', value: (newVal ? 1 : 0) }));
        },

        getStatus: function() {
            return socket.readyState;
        }
    };
});
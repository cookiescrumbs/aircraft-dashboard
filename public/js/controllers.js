/* global angular:true */

/**
 * EF - CTX QA test task
 */

angular.module('testTaskApp.controllers', ['testTaskApp.services']).

controller('TestTaskController', ['$scope', 'testTaskService', 'CONFIG', function($scope, testTaskService, CONFIG) {
    'use strict';

    $scope.safeApply = function(fn) {
        var phase = this.$root.$$phase;
        if(phase === '$apply' || phase === '$digest') {
            if(fn && (typeof(fn) === 'function')) {
                fn();
            }
        } else {
            this.$apply(fn);
        }
    };

    /**
     * INIT SCOPE
     */

    // export applicable config directives to the scope
    $scope.config = {
        minAltitude:      CONFIG.minAltitude,
        maxAltitude:      CONFIG.maxAltitude,
        minAirSpeed:      CONFIG.minAirSpeed,
        maxAirSpeed:      CONFIG.maxAirSpeed,
        minFlaps:         CONFIG.minFlaps,
        maxFlaps:         CONFIG.maxFlaps,
        connectionStatus: CONFIG.connectionStatus
    };

    // export starting values to the scope
    $scope.isGraphVisible      = false;
    $scope.currentSpeed        = 0;
    $scope.currentAltitude     = 0;
    $scope.currentFlaps        = 0;
    $scope.landingGearDeployed = false;
    $scope.connectionStatus    = CONFIG.connectionStatus.connecting;
    $scope.telemetryHistory    = [];

    $scope.telemetryHistorySummary = {
        minAirSpeed: null,
        maxAirSpeed: null,
        avgAirSpeed: null,
        minAltitude: null,
        maxAltitude: null,
        avgAltitude: null
    };

    // explode flap levels into an array and export it to the scope
    var flapLevels = [];
    for(var i = CONFIG.minFlaps; i <= CONFIG.maxFlaps; i++) {
        flapLevels.push(i);
    }
    $scope.flapLevels = flapLevels;

    /**
     * QA Test task controls
     */
    $scope.updateAirspeedGauge   = true;
    $scope.updateAltitudeGauge   = true;
    $scope.reconnectOnDisconnect = true;


    /**
     * TELEMETRY HISTORY MANIPULATION
     */

    function purgeObsoleteTelemetryHistory(now) {
        if($scope.telemetryHistory.length === 0) {
            return;
        }

        while($scope.telemetryHistory[0] !== undefined && $scope.telemetryHistory[0].timestamp < now - CONFIG.historySeconds) {
            console.debug('removed obsolete telemetry values: ', $scope.telemetryHistory.shift());
        }
    }

    function updateTelemetryHistory(measurement) {
        $scope.telemetryHistory.push(measurement);

        // mins & maxs
        if($scope.telemetryHistorySummary.minAirSpeed === null || $scope.telemetryHistorySummary.minAirSpeed > measurement.telemetry.airspeed) {
            $scope.telemetryHistorySummary.minAirSpeed = measurement.telemetry.airspeed;
        }

        if($scope.telemetryHistorySummary.maxAirSpeed === null || $scope.telemetryHistorySummary.maxAirSpeed < measurement.telemetry.airspeed) {
            $scope.telemetryHistorySummary.maxAirSpeed = measurement.telemetry.airspeed;
        }

        if($scope.telemetryHistorySummary.minAltitude === null || $scope.telemetryHistorySummary.minAltitude > measurement.telemetry.altitude) {
            $scope.telemetryHistorySummary.minAltitude = measurement.telemetry.altitude;
        }

        if($scope.telemetryHistorySummary.maxAltitude === null || $scope.telemetryHistorySummary.maxAltitude < measurement.telemetry.altitude) {
            $scope.telemetryHistorySummary.maxAltitude = measurement.telemetry.altitude;
        }

        // calculate averages
        var totalMeasurements = $scope.telemetryHistory.length,
            averageAirSpeed   = 0.0,
            averageAltitude   = 0.0;
        for(i = 0; i < totalMeasurements; i++) {
            averageAirSpeed += measurement.telemetry.airspeed;
            averageAltitude += measurement.telemetry.altitude;
        }

        $scope.telemetryHistorySummary.avgAirSpeed = averageAirSpeed / totalMeasurements;
        $scope.telemetryHistorySummary.avgAltitude = averageAltitude / totalMeasurements;
    }

    /**
     * SERVICE BINDINGS
     */

    var attachServiceEventListeners = function() {
        testTaskService.onopen(function() {
            $scope.safeApply(function() {
                $scope.connectionStatus = testTaskService.getStatus();
            });
        });

        testTaskService.onclose(function(event) {
            //console.debug('onclose --', 'readystate:', testTaskService.getStatus(), event);
            $scope.safeApply(function() {
                $scope.connectionStatus = testTaskService.getStatus();
            });

            if($scope.reconnectOnDisconnect && testTaskService.getStatus() === CONFIG.connectionStatus.closed) {
                testTaskService.connect();
                attachServiceEventListeners();
            }
        });

        testTaskService.onmessage(function(message) {
            var now = Math.floor(new Date().getTime() / 1000);

            purgeObsoleteTelemetryHistory(now);
            updateTelemetryHistory({timestamp: now, telemetry: message.telemetry });

            $scope.currentSpeed        = message.telemetry.airspeed;
            $scope.currentAltitude     = message.telemetry.altitude;
            $scope.landingGearDeployed = message.control.landing_gear === 1;
            $scope.currentFlaps        = message.control.flaps;
        });

        testTaskService.onerror(function(event) {
            //console.debug('onerror --', 'readystate:', testTaskService.getStatus(), event);
            $scope.safeApply(function() {
                $scope.connectionStatus = testTaskService.getStatus();
            });

            if($scope.reconnectOnDisconnect && testTaskService.getStatus() === CONFIG.connectionStatus.closed) {
                testTaskService.connect();
                attachServiceEventListeners();
            }
        });
    };

    attachServiceEventListeners();

    /**
     * USER INPUT HANDLERS
     */

    $scope.$watch('reconnectOnDisconnect', function() {
        var qaDiceRoll = Math.floor(Math.random() * 6) + 1;

        // getting 5 or 6 on a roll will actally make this control work
        if(qaDiceRoll >= 5 && $scope.reconnectOnDisconnect && testTaskService.getStatus() === CONFIG.connectionStatus.closed) {
            testTaskService.connect();
            attachServiceEventListeners();
        }
    });

    $scope.onFlapsValueChangedByUser = function (newVal) {
        $scope.safeApply(function(){
            $scope.currentFlaps = newVal;
            testTaskService.setFlaps(newVal);
        });
    };

    $scope.onLandingGearToggledByUser = function () {
        testTaskService.setLandingGearDeployed($scope.landingGearDeployed);
    };
}]);
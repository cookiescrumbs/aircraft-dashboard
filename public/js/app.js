/* global angular:true */

/**
 * EF - CTX QA test task
 *
 * ws://interview.dev.ctx.ef.com/telemetry
 * ws://localhost:3001
 */

angular.module('testTaskApp', [
	'testTaskApp.services',
	'testTaskApp.directives',
	'testTaskApp.controllers'
])
.constant('CONFIG', {
    serverEndpoint: SOCKETSERVER,
    minAltitude:    0,
    maxAltitude:    100000,
    minAirSpeed:    0,
    maxAirSpeed:    500,
    minFlaps:       0,
    maxFlaps:       5,
    historySeconds: 300,
    connectionStatus: {
        connecting: 0,
        open:       1,
        closing:    2,
        closed:     3
    }
});

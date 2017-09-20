/* global $:true, angular:true, setInterval:true, clearInterval:true */

/**
 * EF - CTX QA test task
 */

angular.module('testTaskApp.directives', [])

.directive('testTaskGauge', function () {
    'use strict';

    return {
        restrict: 'A',
        link: function (scope, element, attrs) {

            var Gauge = {
                // instance variables
                element:            null,
                context:            null,
                currentValue:       0,
                transitionValue:    0,
                animationTimer:     0,
                elementWidth:       0,
                elementHeight:      0,
                drawStartX:         0,
                drawStartY:         0,
                radius:             0,

                // default options - a simple 1-100 gauge
                options: {
                    minValue:           0,
                    maxValue:           100,
                    animated:           true,
                    animationMs:        300,
                    animationFPS:       60,
                    displayUnit:        1,
                    pointers:           1,
                    largePointerUnit:   1,
                    smallPointerUnit:   1,
                    indicatorDecimals:  1,
                    indicatorUnit:      1
                },

                // the constructor
                bind: function(element) {
                    this.element = element;
                    this.context = element.getContext('2d');

                    // bootstrap
                    this.elementWidth   = this.element.width;
                    this.elementHeight  = this.element.height;
                    this.drawStartX     = this.elementWidth / 2;
                    this.drawStartY     = this.elementHeight / 2;
                    this.radius         = Math.floor(Math.min(this.elementWidth, this.elementHeight) / 2);
                },

                _cubicEase: function(t, p0, p1) {
                    return Math.pow(1-t,3)*p0 + 3*(Math.pow(1-t,2))*t*p0 + 3*(1-t)*Math.pow(t,2)*p1 + Math.pow(t,3)*p1;
                },

                _drawGauge: function(values, indicatorValueText) {
                    var ctx = this.context;

                    // clear & reset the canvas
                    ctx.save();
                    ctx.clearRect(0, 0, this.elementWidth, this.elementHeight);
                    ctx.globalAlpha = 1.0;

                    // translate context to center of canvas
                    ctx.translate(this.drawStartX, this.drawStartY);

                    // draw the background circle
                    ctx.beginPath();
                    ctx.fillStyle = 'rgba(0,0,0,1)';
                    ctx.arc(0, 0, this.elementWidth / 2, 0, 2 * Math.PI, false);
                    ctx.fill();

                    if(this.options.pointers == 2) {
                        ctx.font = '10px sans-serif';
                        ctx.textAlign       = 'center';
                        ctx.textBaseline    = 'bottom';
                        ctx.fillStyle       = 'red';
                        ctx.fillText('x' + this.options.smallPointerUnit, 0, -20);
                        ctx.fillStyle = 'white';
                        ctx.fillText('x' + this.options.largePointerUnit, 0, -10);
                    }

                    // draw reference values and lines
                    ctx.beginPath();
                    ctx.font = 'bold 10px sans-serif';
                    ctx.fillStyle = '#fff';
                    ctx.strokeStyle = 'rgba(255,255,255,0.33)';

                    for(var i = 0; i < 10; i++)
                    {
                        switch(i)
                        {
                            case 0:
                                ctx.textAlign    = 'center';
                                ctx.textBaseline = 'top';
                                break;
                            case 1:
                                ctx.textAlign    = 'right';
                                ctx.textBaseline = 'top';
                                break;
                            case 2:
                            case 3:
                                ctx.textAlign    = 'right';
                                ctx.textBaseline = 'middle';
                                break;
                            case 4:
                                ctx.textAlign    = 'right';
                                ctx.textBaseline = 'bottom';
                                break;
                            case 5:
                                ctx.textAlign    = 'center';
                                ctx.textBaseline = 'bottom';
                                break;
                            case 6:
                                ctx.textAlign    = 'left';
                                ctx.textBaseline = 'bottom';
                                break;
                            case 7:
                            case 8:
                                ctx.textAlign    = 'left';
                                ctx.textBaseline = 'middle';
                                break;
                            case 9:
                                ctx.textAlign    = 'left';
                                ctx.textBaseline = 'top';
                                break;
                        }

                        if(i > 0)
                            ctx.rotate(Math.PI / 5);

                        // reference lines
                        ctx.beginPath();
                        ctx.lineWidth = 2;
                        ctx.moveTo(0, -1 * this.radius + this.elementWidth / 8);
                        ctx.lineTo(0, -1 * this.radius + this.elementWidth / 4);
                        ctx.stroke();

                        // reference values
                        ctx.translate(0, -1 * this.radius + 5);
                        ctx.rotate(-1 * Math.PI / 5 * i);
                        ctx.fillText((i *  (this.options.maxValue / 10 / this.options.displayUnit)).toString(), 0, 0);
                        ctx.rotate(Math.PI / 5 * i);
                        ctx.translate(0, this.radius - 5);
                    }

                    // reset rotation
                    ctx.rotate(Math.PI / 5);

                    var value = values[0];

                    // draw the value indicator
                    ctx.beginPath();
                    ctx.rect(-25, 20, 50, 20);
                    ctx.strokeStyle = '#fff';
                    ctx.fillStyle = '#999';
                    ctx.fill();
                    ctx.stroke();
                    ctx.fillStyle = '#000';
                    ctx.textAlign    = 'center';
                    ctx.textBaseline = 'top';
                    ctx.font = 'bold 16px sans-serif';
                    ctx.fillText(indicatorValueText, 0, 22);

                    // draw the large needle
                    ctx.beginPath();
                    ctx.fillStyle = 'white';
                    ctx.rotate((2 * Math.PI * value * (this.options.pointers == 2 ? this.options.displayUnit : 1)) / (this.options.maxValue));
                    ctx.arc(0, 0, Math.max(this.elementWidth / 33, 4), Math.PI * 1.3, Math.PI * 1.7, true);
                    ctx.lineTo(1, this.elementWidth / 2.8 * -1);
                    ctx.lineTo(-1, this.elementWidth / 2.8 * -1);
                    ctx.closePath();
                    ctx.fill();

                    // draw the small needle, if applicable
                    if(this.options.pointers == 2) {

                        ctx.rotate(-1 * (2 * Math.PI * value * (this.options.pointers == 2 ? this.options.displayUnit : 1)) / (this.options.displayUnit * 10));

                        ctx.beginPath();
                        value = values[1];
                        ctx.rotate((2 * Math.PI * value * (this.options.pointers == 2 ? this.options.displayUnit : 1)) / (this.options.displayUnit * 10));
                        ctx.fillStyle = 'red';
                        ctx.arc(0, 0, Math.max(this.elementWidth / 42, 3), Math.PI * 1.4, Math.PI * 1.6, true);
                        ctx.lineTo(1, this.elementWidth / 4 * -1);
                        ctx.lineTo(-1, this.elementWidth / 4 * -1);
                        ctx.closePath();
                        ctx.fill();
                    }

                    // finally, draw the small circle in the middle, for a bit of visual effect
                    ctx.beginPath();
                    ctx.fillStyle = 'rgba(0,0,0,1)';
                    ctx.arc(0, 0, Math.max(this.elementWidth / 60, 2), 0, 2 * Math.PI, false);
                    ctx.fill();

                    ctx.restore();
                },

                _getIndicatorValueText: function(value) {
                    return parseFloat(value / this.options.indicatorUnit).toFixed(this.options.indicatorDecimals).toString();

                },

                setValue: function(value) {

                    // QA test task hack
                    this.element.setAttribute("last-rendered-value", value);

                    // sanatize values according to min & max values
                    value = Math.min(this.options.maxValue, Math.max(this.options.minValue, value));

                    clearInterval(this.animationTimer);

                    var elapsedMs   = 0,
                        refreshRate = 1000 / this.options.animationFPS,
                        self        = this;

                    // I've kept the animations separate, due to lack of time. this could be much cleaner!

                    if(this.options.pointers == 2) { // 2 pointer animation
                        this.animationTimer = setInterval(function() {
                            var largePointerValue;

                            if (elapsedMs < self.options.animationMs) {
                                var easedValue = self._cubicEase(elapsedMs / self.options.animationMs, self.transitionValue, value);
                                largePointerValue = (easedValue % self.options.smallPointerUnit) / self.options.largePointerUnit;

                                self._drawGauge([largePointerValue, easedValue / self.options.smallPointerUnit], self._getIndicatorValueText(easedValue));
                                self.transitionValue = easedValue;

                                elapsedMs = elapsedMs + refreshRate;
                            } else {
                                clearInterval(self.animationTimer);

                                largePointerValue = (value % self.options.smallPointerUnit) / self.options.largePointerUnit;

                                self.currentValue = self.transitionValue = value;
                                self._drawGauge([largePointerValue, value / self.options.smallPointerUnit], self._getIndicatorValueText(value));
                                return;
                            }
                        }, refreshRate);

                    }
                    else { // 1 pointer animation
                        this.animationTimer = setInterval(function() {
                            if (elapsedMs < self.options.animationMs) {
                                var easedValue = self._cubicEase(elapsedMs / self.options.animationMs, self.transitionValue, value);

                                self._drawGauge([easedValue], self._getIndicatorValueText(easedValue));
                                self.transitionValue = easedValue;

                                elapsedMs = elapsedMs + refreshRate;
                            } else {
                                clearInterval(self.animationTimer);

                                self.currentValue = self.transitionValue = value;
                                self._drawGauge([value], self._getIndicatorValueText(value));

                                return;
                            }
                        }, refreshRate);
                    }
                },

                setOptions: function(opts)
                {
                    angular.extend(this.options, opts);
                    this.setValue(this.currentValue);
                }

            };

            // Initialize a gauge instance
            Gauge.bind(element[0]);

            scope.$watch(function (){

                Gauge.setOptions({
                    minValue:           attrs.minValue,
                    maxValue:           attrs.maxValue,
                    displayUnit:        attrs.displayUnit,
                    pointers:           attrs.pointers,
                    largePointerUnit:   attrs.largePointerUnit,
                    smallPointerUnit:   attrs.smallPointerUnit,
                    indicatorDecimals:  attrs.indicatorDecimals,
                    indicatorUnit:      attrs.indicatorUnit
                });

                if(attrs.renderUpdates === 'true') {
                    Gauge.setValue(attrs.gaugeValue);
                }

            }, true);

        }
    };
})

.directive('testTaskGraph',['CONFIG', function (CONFIG) {
    'use strict';

    return {
        restrict: 'A',
        link: function (scope, element) {

            var Graph = {

                // instance variables
                element:            null,
                context:            null,
                elementWidth:       0,
                elementHeight:      0,
                // default options
                options: {
                    backgroundColor:    '#000',
                    guideWidth:     1,
                    guideColor:     '#fff',
                    lineColor:          '#f00',
                    lineWidth:          2,
                    useCurvedLine:      false
                },

                // the constructor
                bind: function(element) {
                    this.element = element;
                    this.context = element.getContext('2d');

                    // bootstrap
                    this.elementWidth   = this.element.width;
                    this.elementHeight  = this.element.height;
                },

                _drawGuides: function(data) {
                    var i; // iterator
                    var ctx = this.context;
                    ctx.save();
                    ctx.clearRect(0, 0, this.elementWidth, this.elementHeight);
                    ctx.globalAlpha = 1.0;

                    // draw the background rectangle
                    /*
                    ctx.beginPath();
                    ctx.rect(0, 0, this.elementWidth, this.elementHeight);
                    ctx.fillStyle = this.options.backgroundColor;
                    ctx.fill();
                    */

                    // translate context to our (0,0)
                    ctx.translate(60, this.elementHeight - 25);

                    // Draw the axis
                    ctx.beginPath();
                    ctx.moveTo(0, 0);
                    ctx.lineTo(this.elementWidth - 70, 0);
                    ctx.moveTo(0, 0);
                    ctx.lineTo(0, -1 * this.elementHeight + 35);
                    ctx.lineWidth = this.options.guideWidth;
                    ctx.strokeStyle = this.options.guideColor;
                    ctx.stroke();

                    ctx.strokeStyle = 'rgba(255,255,255,0.4)';
                    ctx.font = '10px sans-serif';
                    ctx.fillStyle = '#ccc';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'top';

                    // Draw vertical guides and labels
                    var xGuidePos = 0;
                    for(i = 0; i < 6; i++) {
                        xGuidePos = (this.elementWidth - 60) / 6 * i;
                        ctx.moveTo(xGuidePos, -1 * this.elementHeight + 35);
                        ctx.lineTo(xGuidePos, 0);
                        ctx.lineTo(xGuidePos, 3);
                        ctx.fillText('t-' + (5 - i), xGuidePos, 6);
                    }

                    ctx.textAlign = 'right';
                    ctx.textBaseline = 'bottom';

                    // Draw horizaontal guides and labels
                    var yGuidePos = 0;
                    for(i = 0; i < 10; i++) {
                        yGuidePos = (this.elementHeight - 35) / 10 * -i;
                        ctx.moveTo(this.elementWidth - 70, yGuidePos);
                        ctx.lineTo(0, yGuidePos);
                        ctx.lineTo(-3, yGuidePos);
                        ctx.fillText((50 * i) + ' ktas', -6, yGuidePos + 4);

                        if(i<8)
                            i++;
                    }

                    ctx.stroke();

                    var maxSeconds = CONFIG.historySeconds;
                    var xAxisLength = (this.elementWidth - 60) / 6 * 5;
                    var yAxisLength = (this.elementHeight - 20) / 10 * 9;

                    ctx.beginPath();
                    ctx.strokeStyle = this.options.lineColor;
                    ctx.lineWidth = this.options.lineWidth;

                    if(data.length > 0) {
                        if(this.options.useCurvedLine)
                        {
                            ctx.moveTo(data[0].t / maxSeconds * xAxisLength , data[0].v * yAxisLength / 450 * -1);

                            for (i = 1; i < data.length - 2; i++)
                            {
                                var xc = (data[i].t * xAxisLength / maxSeconds + data[i + 1].t * xAxisLength / maxSeconds) / 2;
                                var yc = (data[i].v * yAxisLength / 450 * -1 + data[i + 1].v * yAxisLength / 450 * -1) / 2;
                                ctx.quadraticCurveTo(data[i].t * xAxisLength / maxSeconds, data[i].v * yAxisLength / 450 * -1, xc, yc);
                            }

                            ctx.quadraticCurveTo(data[i].t * xAxisLength / maxSeconds, data[i].v * yAxisLength / 450 * -1, data[i + 1].t * xAxisLength / maxSeconds, data[i + 1].v * yAxisLength / 450 * -1);
                        }
                        else
                        {
                            ctx.moveTo(data[0].t / maxSeconds * xAxisLength , data[0].v * yAxisLength / 450 * -1);

                            for (i = 1; i < data.length; i++) {
                                ctx.lineTo(data[i].t * xAxisLength / maxSeconds, data[i].v * yAxisLength / 450 * -1);
                            }
                        }
                    }

                    ctx.stroke();
                    ctx.translate(-60, -1 * (this.elementHeight - 25));
                    ctx.restore();
                },

                plotData: function(data) {
                    // dirty hack ensuring the minimum number of points to draw a line on the graph
                    // ideally I would draw single points, or straight lines as a fallback
                    // not enough time :)
                    if(data.length < 2 || (this.options.useCurvedLine && data.length < 4)) {
                        this._drawGuides([]);
                        return;
                    }

                    var graphData = [];
                    var now = data[data.length - 1].timestamp;
                    for(var i = 0; i < data.length; i++) {
                        graphData.push({
                            t: data[i].timestamp - now + 300,
                            v: data[i].telemetry.airspeed
                        });
                    }

                    this._drawGuides(graphData);
                }
            };

            Graph.bind(element[0]);

            // deep watch for atribute updates - options / value / dimensions
            scope.$watch('telemetryHistory', function () {
                Graph.plotData(scope.telemetryHistory);
            }, true);
        }
    };
}])

.directive('testTaskSlider', function() {
    'use strict';

    return {
        link: function(scope, elem) {

        $(elem).slider({
                range:  false,
                min:    scope.flapLevels[0],
                max:    scope.flapLevels[scope.flapLevels.length-1],
                value:  scope.flapLevels[0],

                slide: function(event, ui) {
                    scope.$apply(function() {
                        scope.currentFlaps = ui.value;
                        scope.onFlapsValueChangedByUser(ui.value);
                    });
                }
            });

            scope.$watch('currentFlaps', function() {
                $(elem).slider('value', scope.currentFlaps);
                $(elem).find('a').html(scope.currentFlaps);
            });
        }
    };
});




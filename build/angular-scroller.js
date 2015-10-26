(function() {
   'use strict';

    var app = angular.module('scroller', []);
    
    app.directive('scroller', function($rootScope, $window, $interval) {
        return {
            restrict: 'EA',
        		scope: {
        			getNextNode: '&next',
        			buffer_status: "=status"
        		},
            link: linkFn
        }

        function linkFn($scope, $elem, $attrs) {
            
            var win, container, scrollDistance, scrollEnabled, checkWhenEnabled, throttle_ms, immediateCheck;
            
            win = angular.element($window);
            //scroll events a maximum of once every x milliseconds, optimal 250ms
            throttle_ms = null;
            /*	if set as false, the first call of manually 
            	(eg scrolling or pressing the button) 	*/
            immediateCheck = true;
            
            var getElemByHeight = function(elem) {
                elem = elem[0] || elem;
                if (isNaN(elem.offsetHeight)) {
                    return elem.document.documentElement.clientHeight;
                } else {
                    return elem.offsetHeight;
                }
            };

            var offsetTop = function(elem) {
                if (!elem[0].getBoundingClientRect || elem.css('none')) {
                    return;
                }
                return elem[0].getBoundingClientRect().top + pageYOffset(elem);
            };

            var pageYOffset = function(elem) {
                elem = elem[0] || elem;
                if (isNaN(window.pageYOffset)) {
                    return elem.document.documentElement.scrollTop;
                } else {
                    return elem.ownerDocument.defaultView.pageYOffset;
                }
            };
            var handler = function() {
                var containerBottom, elementBottom, remaining, shouldScroll, containerTopOffset;

                if (container === win) {
                    containerBottom = getElemByHeight(container) + pageYOffset(container[0].document.documentElement);
                    elementBottom = offsetTop($elem) + getElemByHeight($elem);
                } else {
                    containerBottom = getElemByHeight(container);
                    containerTopOffset = 0;
                    if (offsetTop(container) !== void 0) {
                        containerTopOffset = offsetTop(container);
                    }
                    elementBottom = offsetTop($elem) - containerTopOffset + getElemByHeight($elem);
                }

                remaining = elementBottom - containerBottom;
                shouldScroll = remaining < getElemByHeight(container) * scrollDistance + 1;
                
                if (shouldScroll) {
                    checkWhenEnabled = true;
                    if (scrollEnabled) {
                        if ($scope.$$phase || $rootScope.$$phase) {
                            return $scope.getNextNode();
                        } else {
                            return $scope.$digest($scope.getNextNode());
                        }
                    }
                } else {
                    return checkWhenEnabled = false;
                }
            };
            
            var throttle = {
                timeout: null,
                previous: 0,
                later: function(callback) {
                    this.previous = new Date().getTime();
                    $interval.cancel(this.timeout);
                    this.timeout = null;
                    callback.call();
                    return null;
                },
                func: function(callback, wait) {
                    var now, remaining, timeout = this.timeout;
                    now = new Date().getTime();
                    remaining = wait - (now - this.previous);
                    if (remaining <= 0) {
                        $interval.cancel(timeout);
                        timeout = null;
                        this.previous = now;
                        return callback.call();
                    } else {
                        if (!timeout) {
                            return timeout = $interval(this.later(callback), remaining, 1);
                        }
                    }
                },
                get: function(callback, wait) {
                    return function() {
                        throttle.func(callback, wait);
                    }
                }
            };

            if (throttle_ms != null) {
                handler = throttle.get(handler, throttle_ms);
            };

            $scope.$on('$destroy', function() {
                container.unbind('scroll', handler);
            });

            var handleScrollDistance = function(v) {
                return scrollDistance = parseFloat(v) || 0;
            };
            handleScrollDistance($attrs.distance);

            var changeContainer = function(newContainer) {
                if (container != null) {
                    container.unbind('scroll', handler);
                }
                container = newContainer;
                if (newContainer != null) {
                    return container.bind('scroll', handler);
                }
            };
            /*
            	tracking the parent element or global window
            	<div class="parent" scroll-parent="1" style="height: 150px; overflow: scroll...
            */
            if ($attrs.scrollParent != null) {
                changeContainer(angular.element($elem.parent()));
            } else {
                changeContainer(win);
            };

            var handleScrollDisabled = function(v) {
                scrollEnabled = !v;
                if (scrollEnabled && checkWhenEnabled) {
                    checkWhenEnabled = false;
                    return handler();
                }
            };

            $scope.$watch('buffer_status', handleScrollDisabled);
            handleScrollDisabled($scope.buffer_status);
            
            if ($attrs.immediateCheck != null) {
                immediateCheck = $scope.$eval($attrs.immediateCheck);
            };

            return $interval((function() {
                if (immediateCheck)
                    return handler();
            }), 0, 1);
        }
    });
}());

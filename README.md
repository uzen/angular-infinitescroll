# angular-infinitescroll

Demos
-----

[demo web site](http://uzen.github.io/)


Getting Started
---------------

 * Libraries
        <script type='text/javascript' src='path/to/angular.min.js'></script>
        <script type='text/javascript' src='path/to/angular-scroller.min.js'></script>

 * Ensure that your application module specifies `infinite-scroll` as a dependency:

        angular.module('myApplication', ['infinite-scroll']);

 * Use the directive by specifying an `scroller` attribute on an element.

        <div next="myPagingFunction()" status="StatusTrueFalse" distance="3"></div>

Note that neither the module nor the directive use the `ng` prefix, as that prefix is reserved for the core Angular module.

Detailed Documentation
----------------------

accepts several attributes to customize the behavior of the directive; detailed instructions can be found [on the ngInfiniteScroll web site](http://sroze.github.com/ngInfiniteScroll/documentation.html). (some of them have changed name)


License
-------

ngInfiniteScroll is licensed under the MIT license. See the LICENSE file for more details.

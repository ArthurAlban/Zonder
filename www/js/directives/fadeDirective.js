zonder.directive('fadeDirective', function($timeout,$ionicSideMenuDelegate) {
       return {
            restrict: 'A',
            link: function ($scope, $element, $attr) {
            // Run in the next scope digest
              $timeout(function () { 

                $scope.$watch(function () {
                        return $ionicSideMenuDelegate.getOpenRatio();
                    },
                    function (ratio) {
                        $element[0].style.opacity = Math.abs(ratio);
                    });
            });
        }
    };
});
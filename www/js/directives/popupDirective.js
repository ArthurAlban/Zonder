zonder.directive('popupZonder', function() {
	return {
		restrict: 'E',
		scope: {
			title: '=title',
			text: '=text',
			closepopups: '&'
		},
		templateUrl: 'templates/popupZonder.html'
	};
});


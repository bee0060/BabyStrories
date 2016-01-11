'use strict';


var drawBoard = angular.module('drawBoard', []);

drawBoard.controller('drawBoardCtrl', function($scope) {
	$scope.name = "Board";
	$scope.blockes = [];



	(function() {
		var blockes = new Array(81);

		for (var i = 0, len = 81; i < len; i++) {
			blockes[i] = false;
		}
		$scope.blockes = blockes;
		$scope.selectBlock = selectBlock;


	})();

	function selectBlock(blockes, index) {
		// blockes[index] = 1 - blockes[index];
		blockes[index] = !blockes[index];
	}

});
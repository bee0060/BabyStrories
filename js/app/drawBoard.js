'use strict';


var drawBoard = angular.module('drawBoard', []);

drawBoard.controller('drawBoardCtrl', function($scope, $interval) {
	$scope.name = "Board";
	$scope.size = 9;
	$scope.interval = 500;
	$scope.flagIndex = null;
	$scope.templates = [{
		name: 'sample',
		content: '00000000g00000000,000000s1810000000,0000v12242g200000,00dh4i142848ge000,6ovr4u1s3o6ooh0s0,00dh4i142848ge000,6ovr4u1s3o6ooh0s0,00dh4i142848ge000,6ovr4u1s3o6ooh0s0,00dh4i15q948ge000,6ovr4u1trp6qoh0s0,00dh4i15q948ge000,6ovrvvvvvvuvov0s0,',
		interval: 300
	}];
	$scope.templateIndex = null;
	$scope.flagStack = [];
	$scope.blockes = [];
	$scope.playing = false;

	$scope.zipped = "";

	var blockCount = $scope.size * $scope.size,
		timer = null;

	(function() {
		$scope.blockes = initalBlockes();
		$scope.flagStack.push($scope.blockes);
		$scope.flagIndex = 0;

		$scope.newTemplate = newTemplate;

		$scope.selectBlock = selectBlock;
		$scope.resetBlockes = resetBlockes;
		$scope.newFlag = newFlag;
		$scope.saveFlag = saveFlag;
		$scope.copyFlag = copyFlag;
		$scope.selectFlag = selectFlag;

		$scope.play = play;
		$scope.stop = stop;

		$scope.zipAndExport = zipAndExport;
		$scope.unzipAndImport = unzipAndImport;

		$scope.selectTemplate = selectTemplate;

	})();

	function initalBlockes() {
		var blockes = new Array(blockCount);

		for (var i = 0, len = blockCount; i < len; i++) {
			blockes[i] = 0;
		}
		return blockes;
	}

	function resetBlockes() {
		// if(confirm('Are you sure to reset?')) {
		// 	$scope.blockes = initalBlockes();
		// }
		$scope.blockes = initalBlockes();
		if ($scope.flagIndex > -1) {
			$scope.flagStack[$scope.flagIndex] = $scope.blockes;
		}
	}

	function selectBlock(blockes, index) {
		blockes[index] = 1 - blockes[index];
	}

	function newFlag() {
		$scope.blockes = initalBlockes();
		$scope.flagIndex = null;
	}

	function saveFlag(blockes) {
		if ($scope.flagIndex == null) {
			$scope.flagStack.push(blockes || []);
			$scope.blockes = initalBlockes();
		} else {
			setFlagByIndex(blockes, $scope.flagIndex);
		}
	}

	function copyFlag() {
		if ($scope.flagIndex !== null && $scope.blockes instanceof Array) {
			$scope.blockes = $scope.blockes.slice();
			setFlagByIndex($scope.blockes, ++$scope.flagIndex);
		}
	}

	function selectFlag(index) {
		$scope.flagIndex = index;
		$scope.blockes = getFlagByIndex(index);
	}

	function getFlagByIndex(index) {
		var flag = $scope.flagStack[index];
		if (!(flag instanceof Array)) {
			flag = initalBlockes();
			$scope.flagStack[index] = flag;
		}
		return flag;
	}

	function setFlagByIndex(flag, index) {
		$scope.flagStack[index] = flag;
	}

	function play() {
		$scope.flagIndex = -1;
		$scope.playing = true;
		timer = $interval(function() {
			$scope.blockes = getFlagByIndex(++$scope.flagIndex);
			if ($scope.flagIndex === $scope.flagStack.length - 1) {
				$interval.cancel(timer);
				$scope.playing = false;
			}
		}, $scope.interval);
	}

	function stop() {
		$scope.flagIndex = null;
		$scope.playing = false;
		$interval.cancel(timer);

		$scope.blockes = initalBlockes();
	}

	function zipAndExport() {
		var stack = $scope.flagStack.slice();
		var zipped = "";

		// remove comma
		for (var i = 0, len = stack.length; i < len; i++) {
			var tempStr = stack[i].join(''),
				tempZippedStr = '';
			for (var j = 0, jLen = tempStr.length; j < jLen; j += 5) {
				tempZippedStr = padRight(tempStr.substr(j, 5), 5, '0');
				tempZippedStr = zipByBit(tempZippedStr);
				zipped += tempZippedStr;
			}
			zipped += ',';
		}

		$scope.zipped = zipped;
	}

	function unzipAndImport(str) {
		if (!str) {
			return false;
		}

		var flag = [],
			zipped = str.replace(/,$/, ''),
			unzippedStr = '',
			flags = zipped.split(',');

		for (var i = 0, len = flags.length; i < len; i++) {
			var chars = flags[i].split(''),
				unzippedStr = '',
				temp = '';
			for (var j = 0, jLen = chars.length; j < jLen; j++) {
				unzippedStr += padLeft(unzipByBit(chars[j]), 5, 0);
			}
			unzippedStr = unzippedStr.substr(0, 81);
			flag.push(unzippedStr.split(''));
		}
		$scope.flagStack = flag;
	}

	// from 2 bits zip to 32 bits
	function zipByBit(str) {
		return parseInt(str, 2).toString(32);
	}

	function unzipByBit(str) {
		return parseInt(str, 32).toString(2);
	}

	function selectTemplate(template, index) {
		unzipAndImport(template.content);
		$scope.templateIndex = index;
		$scope.interval = template.interval;
		console.log($scope.templateIndex, $scope.flagStack.length);
	}

	function newTemplate() {
		var newTemplateName = prompt('Your new template name:', 'aa');

		$scope.templates.push({
			name: newTemplateName,
			content: '',
			interval: 500
		});

		$scope.blockes = initalBlockes();
		$scope.flagStack = [$scope.blockes];
		$scope.flagIndex = 0;
	}



	/************* common functions ***********************/
	function padLeft(str, len, char) {
		var result = str,
			originLen = str.length,
			leftLen = len - originLen;

		if (leftLen > 0) {
			result = new Array(leftLen + 1).join(char) + result;
		}
		return result;
	}

	function padRight(str, len, char) {
		var result = str,
			originLen = str.length,
			leftLen = len - originLen;

		if (leftLen > 0) {
			result += new Array(leftLen + 1).join(char);
		}
		return result;
	}
});
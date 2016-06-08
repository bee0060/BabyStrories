;
(function(global) {
	'use strict';
	global = global || {};

	var head = document.getElementsByTagName('head')[0],
		REMOTE_SCRIPT_SRC = ['http://bee0060.github.io/BabyStrories/js/app/common.js',
			'http://bee0060.github.io/BabyStrories/js/app/zip-unzip/unzip.js',
			'http://bee0060.github.io/BabyStrories/js/app/single-flag-board-draw.js'
		],
		LOCAL_SCRIPT_SRC = [
			'js/app/common.js',
			'js/app/zip-unzip/unzip.js',
			'js/app/single-flag-board-draw.js'
		],
		isUnderSameDomain = /^(file:\/\/|http:\/\/bee0060.github.io\/BabyStrories)/.test(location.href),
		actualScriptSrc = isUnderSameDomain ? LOCAL_SCRIPT_SRC : REMOTE_SCRIPT_SRC;

	// load the require js files
	for (var i = 0, len = REMOTE_SCRIPT_SRC.length; i < len; i++) {
		var script = document.createElement('script');

		script.type = "text/javascript";
		script.src = REMOTE_SCRIPT_SRC[i];
		head.appendChild(script);
	}

	function importByZippedStr(board, str) {
		try {
			var fullBoardInfo = analyzeImportStr(str);

			buildBoard(board, fullBoardInfo);
		} catch (ex) {
			console.error(ex.toString());
			clearBoard(board);
		}
	}

	function clearBoard(container) {
		if (!container || !container.nodeType || container.nodeType !== 1) {
			throw new Error('Could not find container when building board');
		}
		container.innerHTML = "";
	}

	global.importByZippedStr = importByZippedStr;

})(window);
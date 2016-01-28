;
(function(global) {
	'use strict';
	global = global || {};


	function importByZippedStr(board, str) {
		try {
			var fullBoardInfo = analyzeImportStr(str);
			buildBoard(board, fullBoardInfo.x, fullBoardInfo.y, fullBoardInfo.dimension, fullBoardInfo.contentInfo);
		} catch (ex) {
			console.error(ex.toString());
			clearBoard(board);
		}
	}

	function analyzeImportStr(str) {
		try {
			var infoArr = str.split(':'),
				dimensionInfoArr = infoArr[0].split('-'),
				x = dimensionInfoArr[0],
				y = dimensionInfoArr[1],
				dimension = dimensionInfoArr[2],
				contentInfo = infoArr[1].split('');

			return {
				x: x,
				y: y,
				dimension: dimension,
				contentInfo: contentInfo
			};
		} catch (ex) {
			throw new Error('Invalid import string format. Valid Format as: x-y-dimension:{contentInfoay.join()}');
		}
	}

	function clearBoard(container) {
		if (!container || !container.nodeType || container.nodeType !== 1) {
			throw new Error('Could not find container when building board');
		}
		container.innerHTML = "";
	}

	function buildBoard(container, x, y, dimension, contentInfo) {
		var count, frag, span;

		if (!isInt(x) || !isInt(y) || !isInt(dimension)) {
			throw new Error('Not valid x, y or dimension');
		}

		if (!container || !container.nodeType || container.nodeType !== 1) {
			throw new Error('Could not find container when building board');
		}

		count = x * y;
		frag = document.createDocumentFragment();

		for (var i = 0; i < count; i++) {
			span = createBlock(dimension);
			frag.appendChild(span);
		}

		container.style.display = "none";
		container.innerHTML = "";
		container.appendChild(frag);

		container.style.width = dimension * x + 'px';
		container.style.height = dimension * y + 'px';

		if (contentInfo && contentInfo instanceof Array && contentInfo.length === count) {
			fillBoardContent(container, contentInfo);
		}

		container.style.display = "";
	}

	function fillBoardContent(container, contentInfo) {
		var spans;

		if (!container || !container.nodeType || container.nodeType !== 1) {
			throw new Error('Could not find container when building board');
		}

		if (!contentInfo || !(contentInfo instanceof Array) || !contentInfo.length) {
			throw new Error('Invalid content info.');
		}

		spans = container.childNodes;

		if (spans.length !== contentInfo.length) {
			throw new Error('The length of content info does not match the span count of board.');
		}

		for (var i = 0, len = spans.length; i < len; i++) {
			if (contentInfo[i] == 1) {
				spans[i].style.background = "gray";
			}
		}
	}

	/*-------------------------- 基础公用方法 --------------------------*/

	function isInt(n) {
		return parseInt(n) == n;
	}

	function createBlock(dimension) {
		var span = $c('span');
		span.style.width = dimension + 'px';
		span.style.height = dimension + 'px';
		span.style.boxSizing = 'border-box';
		span.style.border = '1px solid #000';
		span.style.background = '#fff';
		span.style.display = 'block';
		span.style.float = 'left';
		span.style.margin = '0';
		span.style.padding = '0';
		return span;
	}

	function $c(tag) {
		return document.createElement(tag);
	}

	global.importByZippedStr = importByZippedStr;

})(window);
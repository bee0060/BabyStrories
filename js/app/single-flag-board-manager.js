;
(function(global) {
	'use strict';
	global = global || {};
	var usingPaintingTool = "NONE",
		enablePaintingTool = false;

	function initalBoard() {
		var board = $('.board');
		registerBoardEvents(board);
	}

	function registerBoardEvents(container) {
		var $container = $(container);
		$container.on('click', 'span', selectBlock);

		$(document).on('click', 'span', function(ev) {
			enablePaintingTool = !enablePaintingTool;

			if (usingPaintingTool !== "NONE") {
				selectBlock.call(this, ev);
			}
		});
	}

	function bootStrap() {
		var board = $('.board'),
			txtX = $('#txtX'),
			txtY = $('#txtY'),
			txtDimension = $('#txtDimension'),
			txtBorderWidth = $('#txtBorderWidth'),
			txtBacc = $('#txtBacc');

		buildBoard(board[0], {
			x: txtX.val(),
			y: txtY.val(),
			dimension: txtDimension.val(),
			borderWidth: txtBorderWidth.val(),
			bacc: txtBacc.val()
		});
	}

	function exportInfo() {
		var txaOutput = $('.output'),
			boardDetailInfo = getBoardDetailInfo(),
			outputResult = generateExportStr(boardDetailInfo);

		txaOutput.val(outputResult);
	}

	function importInfo() {
		var txaOutput = $('.output'),
			str = txaOutput.val(),
			fullBoardInfo = analyzeImportStr(str),
			board = $('.board');

		buildBoard(board[0], fullBoardInfo);
		bindBoardInfo(fullBoardInfo);
	}

	function bindBoardInfo(boardInfo) {
		var txtX = $('#txtX'),
			txtY = $('#txtY'),
			txtDimension = $('#txtDimension'),
			txtBorderWidth = $('#txtBorderWidth'),
			txtBacc = $('#txtBacc');

		txtX.val(boardInfo.x);
		txtY.val(boardInfo.y);
		txtDimension.val(boardInfo.dimension);
		txtBorderWidth.val(boardInfo.borderWidth);
		txtBacc.val(boardInfo.bacc);
	}

	function getBoardDetailInfo() {
		var board = $('.board'),
			spans = board.find('span'),
			txtX = $('#txtX'),
			txtY = $('#txtY'),
			txtDimension = $('#txtDimension'),
			txtBorderWidth = $('#txtBorderWidth'),
			txtBacc = $('#txtBacc'),
			contentInfo = [];

		spans.each(function(i, span) {
			contentInfo.push(span.className ? 1 : 0);
		});

		return {
			x: txtX.val(),
			y: txtY.val(),
			dimension: txtDimension.val(),
			borderWidth: txtBorderWidth.val(),
			bacc: txtBacc.val(),
			contentInfo: contentInfo
		};
	}


	function generateExportStr(options) {
		var x = options.x,
			y = options.y,
			borderWidth = (options.borderWidth || '1'),
			dimension = options.dimension,
			bacc = options.bacc || 'gray', // background-color
			contentInfo = options.contentInfo,
			zippedInfo = zipMainControl(contentInfo),
			zippedString = combineZippedInfoIntoString(zippedInfo);

		checkOptionAttrsFormatValid(options);

		return x + '-' + y + '-' + dimension + '-' + borderWidth + '-' + bacc + ':' + zippedString;
	}

	function checkOptionAttrsFormatValid(options) {
		var x = options.x,
			y = options.y,
			borderWidth = (options.borderWidth || '1'),
			dimension = options.dimension,
			bacc = options.bacc || 'gray', // background-color
			contentInfo = options.contentInfo,
			letterColorNameReg = /^[a-z]+(-[a-z]+)*$/i,
			HEXReg = /^#[0-9a-f]{6}$/i,
			rgbReg = /^rgb *\((\d{1,3})( *\, *\d{1,3}){2} *\)$/i,
			rgbaReg = /^rgba *\((\d{1,3})( *\, *\d{1,3}){2} *\, *(1|0?\.\d{1,}|0)\)$/i,
			count = x * y;

		if (!isInt(x) || !isInt(y) || !isInt(dimension) || !isInt(borderWidth)) {
			throw new Error('Not valid x, y, dimension or border-width, all should be Int.');
		}

		if (!letterColorNameReg.test(bacc) &&
			!HEXReg.test(bacc) &&
			!rgbReg.test(bacc) &&
			!rgbaReg.test(bacc)
		) {
			throw new Error(bacc + ' - is not valid background color name inputed.');
		}

		if (typeof contentInfo !== 'undefined') {
			if (!contentInfo || !(contentInfo instanceof Array) || !contentInfo.length) {
				throw new Error('Invalid content info.');
			}

			if (count !== contentInfo.length) {
				throw new Error('The length of content info does not match the blockes\' count of board.');
			}
		}

		return true;
	}

	function analyzeImportStr(str) {
		try {
			var infoArr = str.split(':'),
				dimensionInfoArr = infoArr[0].split('-'),
				x = dimensionInfoArr[0],
				y = dimensionInfoArr[1],
				dimension = dimensionInfoArr[2],
				borderWidth = dimensionInfoArr[3],
				bacc = dimensionInfoArr[4],
				contentInfo = unzipMainControl(infoArr[1], x, y);

			return {
				x: x,
				y: y,
				dimension: dimension,
				borderWidth: borderWidth,
				bacc: bacc,
				contentInfo: contentInfo
			};
		} catch (ex) {
			throw new Error('Invalid import string format. Valid Format as: x-y-dimension-borderWidth-bacc:{contentInfo.join(\'\')}[|{zipTypes.join(\'\')}]');
			console.error(ex);
		}
	}

	function selectBlock(ev, select) {
		var me = this;
		if (typeof select === 'boolean') {
			me.className = select ? 'selected' : '';
		} else {
			me.className = me.className ? '' : 'selected';
		}
		event.preventDefault();
	}

	function usePen(ev) {
		usingPaintingTool = "PEN";
		enablePaintingTool = false;

		$('.board').off('mousemove', 'span');

		$('.board').on('mousemove', 'span', function(ev) {
			if (usingPaintingTool == "PEN" && enablePaintingTool) {
				selectBlock.call(this, ev, true);
			}
		});
	}

	function useEraser(ev) {
		usingPaintingTool = "ERASER";
		enablePaintingTool = false;

		$('.board').off('mousemove', 'span');

		$('.board').on('mousemove', 'span', function(ev) {
			if (usingPaintingTool == "ERASER" && enablePaintingTool) {
				selectBlock.call(this, ev, false);
			}
		});
	}

	function clearPaintTool() {
		usingPaintingTool = "NONE";
		enablePaintingTool = false;

		$('.board').off('mousemove', 'span');
	}

	function buildBoard(container, options) {
		var x = options.x,
			y = options.y,
			borderWidth = (options.borderWidth || '1'),
			dimension = options.dimension - 2 + borderWidth * 2,
			bacc = options.bacc || 'gray', // background-color
			contentInfo = options.contentInfo,
			count, frag, span;

		if (!checkOptionAttrsFormatValid(options)) {
			return false;
		}

		count = x * y;
		frag = document.createDocumentFragment();

		for (var i = 0; i < count; i++) {
			span = createBlock(dimension);
			frag.appendChild(span);
		}

		container.style.display = "none";
		container.innerHTML = "";
		container.className = "board";
		container.appendChild(frag);


		container.style.width = dimension * x + 'px';
		container.style.height = dimension * y + 'px';

		insertBoardStyle(borderWidth, bacc);

		if (contentInfo && contentInfo instanceof Array && contentInfo.length === count) {
			fillBoardContent(container, contentInfo);
		}

		container.style.display = "";
	}

	function insertBoardStyle(borderWidth, backgroundColor) {
		var head = document.getElementsByTagName('head')[0],
			style = $c('style'),
			cssText = [];

		cssText.push(
			'.board { border: 1px solid #000; float: left; margin-left: 30px; }',
			'.board span {',
			' background-color: #fff;',
			' border: 1px solid #000;',
			' border-width: ', borderWidth, 'px!important;',
			' display: block;',
			' box-sizing: border-box;',
			' float:left;',
			' margin: 0;',
			' padding: 0; ',
			'}',
			'.board span.selected { background-color: ', backgroundColor, '!important; }'
		);

		style.innerHTML = cssText.join('');
		head.appendChild(style);
	}

	function fillBoardContent(container, contentInfo) {
		var spans;

		if (!container || container.nodeType !== 1) {
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
				spans[i].className = "selected";
			}
		}
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

	global.initalBoard = initalBoard;
	global.bootStrap = bootStrap;
	global.exportInfo = exportInfo;
	global.importInfo = importInfo;
	global.usePen = usePen;
	global.useEraser = useEraser;
	global.clearPaintTool = clearPaintTool;
	
	global.importByZippedStr = importByZippedStr;

})(window);
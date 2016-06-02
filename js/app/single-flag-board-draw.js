var usingPaintingTool = "NONE",
	enablePaintingTool = false;

function initalBoard() {
	var board = $('.board');
	registerBoardEvents(board);
}

function registerBoardEvents(container) {
	var $container = $(container);
	$container.on('click', 'span', selectBlock);

	$container.on('click', 'span', function(ev) {
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
		txtBacc = $('#txtBacc'),
		x = txtX.val(),
		y = txtY.val(),
		dimension = txtDimension.val()
	borderWidth = txtBorderWidth.val(),
		bacc = txtBacc.val();

	buildBoard(board[0], {
		x: x,
		y: y,
		dimension: dimension,
		borderWidth: borderWidth,
		bacc: bacc
	});
}

function exportInfo() {
	var board = $('.board'),
		spans = board.find('span'),
		txtX = $('#txtX'),
		txtY = $('#txtY'),
		txtDimension = $('#txtDimension'),
		txtBorderWidth = $('#txtBorderWidth'),
		txtBacc = $('#txtBacc'),
		txaOutput = $('.output'),
		x = txtX.val(),
		y = txtY.val(),
		dimension = txtDimension.val(),
		borderWidth = txtBorderWidth.val(),
		bacc = txtBacc.val(),
		contentInfo = [];

	spans.each(function(i, span) {
		contentInfo.push(span.className ? 1 : 0);
	});
	result = generateExportStr({
		x: x,
		y: y,
		dimension: dimension,
		borderWidth: borderWidth,
		bacc: bacc,
		contentInfo: contentInfo
	});

	txaOutput.val(result);
}

function importInfo() {
	var txaOutput = $('.output'),
		str = txaOutput.val(),
		fullBoardInfo = analyzeImportStr(str),
		board = $('.board'),
		txtX = $('#txtX'),
		txtY = $('#txtY'),
		txtDimension = $('#txtDimension');

	txtX.val(fullBoardInfo.x);
	txtY.val(fullBoardInfo.y);
	txtDimension.val(fullBoardInfo.dimension);

	buildBoard(board[0], fullBoardInfo);
}

function generateExportStr(options) {
	var x = options.x,
		y = options.y,
		borderWidth = (options.borderWidth || '1'),
		dimension = options.dimension,
		bacc = options.bacc || 'gray', // background-color
		contentInfo = options.contentInfo;

	if (!isInt(x) || !isInt(y) || !isInt(dimension)) {
		throw new Error('Not valid x, y or dimension');
	}

	if (!contentInfo || !(contentInfo instanceof Array) || !contentInfo.length) {
		throw new Error('Invalid content info.');
	}

	var count = x * y;

	if (count !== contentInfo.length) {
		throw new Error('The length of content info does not match the blockes\' count of board.');
	}

	return x + '-' + y + '-' + dimension + '-' + borderWidth + '-' + bacc + ':' + contentInfo.join('');
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

function analyzeImportStr(str) {
	try {
		var infoArr = str.split(':'),
			dimensionInfoArr = infoArr[0].split('-'),
			x = dimensionInfoArr[0],
			y = dimensionInfoArr[1],
			dimension = dimensionInfoArr[2],
			borderWidth = dimensionInfoArr[3],
			bacc = dimensionInfoArr[4],
			contentInfo = infoArr[1].split('');

		return {
			x: x,
			y: y,
			dimension: dimension,
			borderWidth: borderWidth,
			bacc: bacc,
			contentInfo: contentInfo
		};
	} catch (ex) {
		throw new Error('Invalid import string format. Valid Format as: x-y-dimension:{contentInfoay.join()}');
	}
}

function buildBoard(container, options) {
	var x = options.x,
		y = options.y,
		borderWidth = (options.borderWidth || '1'),
		dimension = options.dimension - 2 + borderWidth * 2,
		bacc = options.bacc || 'gray', // background-color
		contentInfo = options.contentInfo,
		count, frag, span;

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
		'.board span { border-width: ', borderWidth, 'px!important; }',
		'.board span.selected { background-color: ', backgroundColor, '!important; }'
	);

	style.innerHTML = cssText.join('');
	head.appendChild(style);
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
			spans[i].className = "selected";
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
	return span;
}

function $c(tag) {
	return document.createElement(tag);
}
(function(global) {
	var width, height, size, count, infoArr;



})(window);


var enablePen = false,
	enableSelector = false,
	usingPen = false;

function initalBoard() {
	var board = $('.board');
	registerBoardEvents(board);
}

function registerBoardEvents(container) {
	var $container = $(container);
	$container.on('click', 'span', selectBlock);
}

function bootStrap() {
	var board = $('.board'),
		txtX = $('#txtX'),
		txtY = $('#txtY'),
		txtDimension = $('#txtDimension'),
		x = txtX.val(),
		y = txtY.val(),
		dimension = txtDimension.val();

	buildBoard(board[0], x, y, dimension);
}

function exportInfo() {
	var board = $('.board'),
		spans = board.find('span'),
		txtX = $('#txtX'),
		txtY = $('#txtY'),
		txtDimension = $('#txtDimension'),
		txaOutput = $('.output'),
		x = txtX.val(),
		y = txtY.val(),
		dimension = txtDimension.val(),
		contentInfo = [];

	spans.each(function(i, span) {
		contentInfo.push(span.className ? 1 : 0);
	});
	result = generateExportStr(x, y, dimension, contentInfo);

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

	buildBoard(board[0], fullBoardInfo.x, fullBoardInfo.y, fullBoardInfo.dimension, fullBoardInfo.contentInfo);
}

function generateExportStr(x, y, dimension, contentInfo) {
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

	return x + '-' + y + '-' + dimension + ':' + contentInfo.join('');
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
	enablePen = true;
	enableSelector = false;

	$('.board').off('mousemove');

	$('.board').on('click', 'span', function(ev) {
		usingPen = !usingPen;
		selectBlock.call(this, ev);
	});

	$('.board').on('mousemove', 'span', function(ev) {
		if (enablePen && usingPen) {
			selectBlock.call(this, ev, true);
		}
	});
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
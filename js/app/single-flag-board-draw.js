/*
	Zip & Unzip

	Zip and unzip algorithm, could combine use.

	Algorithm Name	|	Suffix	|	Remark
	0. Prefix		-	~		-	去掉0前缀，改压缩模式一共且默认会使用一次，在进行进制转换前需要执行
	1. Coordinate	-	！		-	坐标, 语法： x.y[,x.y]{0,n}
	2. Mirror		-	@		-	镜面，将所有0变成1,1变成0.
	3. Reversion	-	#		-	反转
	4. 64bit		-	$		-	用64个字符形成64进制压缩
	5. 16bit		-	%		-	16进制压缩
	
	After use the algorithm, should add suffix to contentInfo, separate by char '|'.
	Could multi combine use algorithms, and add the suffix by algorithm's order.
	e.g.:

	Origin: 1000001000000000000000000
	Coordinate:		1.1,2.2|!

	Origin: 0111110111111111111111111
	Mirror： 1000001000000000000000000|@
	Mirror & Coordinate: 1.1,2.2|@!
	Mirror & Reversion: 1000001|@#
	Mirror & Reversion & 64bit: 11|@#~$

	Origin: 1110000100000000000000000
	Reversion: 10000111|#
	Reversion & 64bit: 2H|#~$

 */

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
		board = $('.board'),
		txtX = $('#txtX'),
		txtY = $('#txtY'),
		txtDimension = $('#txtDimension');

	txtX.val(fullBoardInfo.x);
	txtY.val(fullBoardInfo.y);
	txtDimension.val(fullBoardInfo.dimension);

	buildBoard(board[0], fullBoardInfo);
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


// 1. Coordinate	-	！		-	坐标, 语法： x.y[,x.y]{0,n}
// 2. Mirror		-	@		-	镜面
// 3. Reversion		-	#		-	反转
// 4. 64bit			-	$		-	用64个字符形成64进制压缩
// 5. 16bit			-	%		-	16进制压缩

var CHARS_SET_OF_64_BIT = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';



/*
	1. 计算开头和结尾的连续相同的字符数量，并以此决定是否使用镜面、反转和去前缀以及使用前缀。
	2. 
 */
function zipMainControl(originChars, x, y) {
	var consecutiveCharsReg = /(^0+)|(^1+)|(1+$)|(0+$)/,
		mc = originChars.join('').match(continueCharsReg),
		maxConsecutiveCharsLength = 0,
		maxLengthMatch = '',
		needMirrored = false,
		needReversioned = false,
		hasMirrored = false,
		hasReversioned = false,
		zipType = [];


	mc.map(function(m) {
		var lenOfMatch = typeof m === 'undefined' ? 0 : m.length;
		if (lenOfMatch > maxConsecutiveCharsLength) {
			maxConsecutiveCharsLength = lenOfMatch;
			maxLengthMatch = m;
		}
	});


	if (mc[1] === maxLengthMatch) {


	} else if (mc[2] === maxLengthMatch) {

	} else if (mc[3] === maxLengthMatch) {

	} else if (mc[4] === maxLengthMatch) {

	}



	var originClearedPrefix = removeZeroPrefix(originChars),
		mirrorResult = removeZeroPrefix(zipMirror(originChars)),
		reversionResult = removeZeroPrefix(zipReversion(originChars)),
		needMirrored = false,
		needReversioned = false,
		hasMirrored = false,
		hasReversioned = false,
		zipType = [];

	if (originClearedPrefix.length < Math.min(mirrorResult.length, reversionResult.length)) {

	}



}

function zipCoordinate(origin, x, y) {

}

function zipMirror(originChars) {
	if (!isIn2Bit(originChars)) {
		throw new Error('Input text is not in 2 bit.');
	}

	var zipped = [];

	originChars.map(function(i) {
		zipped.push(i == '0' ? '1' : '0');
	});
	return zipped;
}

function zipReversion(originChars) {
	if (!isIn2Bit(originChars)) {
		throw new Error('Input text is not in 2 bit.');
	}

	return originChars.slice().reverse();
}

function zip64Bit(originChars) {
	if (!isIn2Bit(originChars.join(''))) {
		throw new Error('Input text is not in 2 bit.');
	}

	var zipped = [],
		len = originChars.length,
		BITS_COUNT_PROPORTION = 6,
		remainder = len % 6,
		prefixFillingBitsCount = 6 - remainder,
		sourceChars = buildAllZeroCharArray(prefixFillingBitsCount).concat(originChars),
		temp64BitChar = [],
		counter = 0;

	sourceChars.map(function(chr) {
		temp64BitChar.push(chr);
		counter++

		if (counter % 4 === 0) {
			zipped.push(zipOneCharFrom2BitTo64Bit(temp64BitChar.join('')));

			temp64BitChar = [];
		}
	});

	return zipped;
}

function zipOneCharFrom2BitTo64Bit(chrIn2Bit) {
	return CHARS_SET_OF_64_BIT[parseInt(chrIn2Bit, 2)];
}

function zip16Bit(originChars) {

}

function isIn2Bit(originChars) {
	return /^[01]+$/.test(originChars.join(''));
}

function buildAllZeroCharArray(length) {
	return Array.apply(null, {
		length: length
	}).map(function() {
		return 0;
	}, Number);
}

function removeZeroPrefix(originChars) {
	var chars = typeof originChars === 'string' ? originChars.split('') : originChars,
		clone = chars.slice(),
		originStr = clone.join(''),
		prefixZeroReg = /^0*/,
		strWithoutZeroPrefix = originStr.replace(prefixZeroReg, ''),
		result = strWithoutZeroPrefix.split('');

	return result;
}

function generateExportStr(options) {
	var x = options.x,
		y = options.y,
		borderWidth = (options.borderWidth || '1'),
		dimension = options.dimension,
		bacc = options.bacc || 'gray', // background-color
		contentInfo = options.contentInfo;

	checkOptionAttrsFormatValid(options);

	return x + '-' + y + '-' + dimension + '-' + borderWidth + '-' + bacc + ':' + contentInfo.join('');
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
		throw new Error('Invalid import string format. Valid Format as: x-y-dimension-borderWidth-bacc:{contentInfoay.join()}');
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
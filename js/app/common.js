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

function buildAllZeroCharArray(length) {
	return buildSameCharArray(length, 0);
}

function buildSameCharArray(length, chr) {
	return Array.apply(null, {
		length: length
	}).map(function() {
		return chr;
	}, Number);
}

function getCharsArray(chars) {
	if (chars && chars instanceof Array) {
		return chars;
	} else if (typeof chars === 'string') {
		return chars.split('');
	} else {
		return [];
	}
}

function padLeft(src, len, stuff) {
	var srcLen = src.length;

	if (srcLen >= len) {
		return src;
	} else {
		return buildSameCharArray(len - srcLen, stuff).join('') + src;
	}
}
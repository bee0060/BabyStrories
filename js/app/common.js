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
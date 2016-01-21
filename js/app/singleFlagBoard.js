var enablePen = false,
	enableSelector = false,
	usingPen = false;

function bootStrap() {
	var board = $('.board'),
		txtWidth = $('#txtWidth'),
		txtHeight = $('#txtHeight'),
		txtSize = $('#txtSize'),
		width = txtWidth.val(),
		height = txtHeight.val(),
		size = txtSize.val(),
		count = width * height,
		frag = document.createDocumentFragment(),
		span;

	for (var i = 0; i < count; i++) {
		span = document.createElement('span');
		span.style.width = size + 'px';
		span.style.height = size + 'px';
		frag.appendChild(span);
	}

	board.hide();
	board.html('');
	board.css('width', size * width);
	board.css('height', size * height);
	board.append(frag);
	board.show();

	board.on('click', 'span', selectBlock);
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

function exportInfo() {
	var board = $('.board'),
		txtWidth = $('#txtWidth'),
		txtHeight = $('#txtHeight'),
		txtSize = $('#txtSize'),
		output = $('.output'),
		width = txtWidth.val(),
		height = txtHeight.val(),
		size = txtSize.val(),
		count = width * height,
		infoArr = [],
		result = width + '-' + height + '-' + size + ':';

	board.find('span').each(function(i, span) {
		console.log(i, span);
		infoArr.push(span.className ? 1 : 0);
	});
	console.log(infoArr.join());
	result += infoArr.join();

	output.val(result);
}

function importInfo(str){
	
}
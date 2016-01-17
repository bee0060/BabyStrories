var enablePen = false,
	enableSelector = false,
	usingPen = false;

function bootStrap() {
	// body...

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

	console.log(width, height, count);

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
		event.preventDefault();
		event.stopPropagation();
	});

	$('.board').on('mousemove', 'span', function(ev) {
		if (enablePen && usingPen) {
			selectBlock.call(this, ev, true);
		}
	});
}
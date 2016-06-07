/*
	Zip & Unzip

	Zip and unzip algorithm, could combine use.

	Algorithm Name	|	Suffix	|	Remark
	0. Prefix		-	~		-	去掉0前缀，改压缩模式一共且默认会使用一次，在进行进制转换前需要执行
	1. Coordinate	-	！		-	坐标, 语法： x.y[,x.y]{0,n}, TODO 暂未实现
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

/*
	1. 将content字符串拆分成内容字符串（zippedString）和压缩方式集合(zipTypes)
	2. 从后向前遍历zipTypes，并对zippedString进行解压。
	3. 返回生成图画所需的二进制字符串数组


	PS: 其中镜面和反转的解压只需要再执行一次压缩方法即可。

	@param zippedString {string/array}
	@param x {int} - blockes x coordinate
	@param y {int} - blockes y coordinate
	@return array - in 2 bit.
 */
function unzipMainControl(zippedString, x, y) {
	var zippedInfo = zippedString.split('|'),
		zippedChars = zippedInfo[0].split(''),
		zipTypes = zippedInfo.length > 1 ? zippedInfo[1].split('') : [],
		unzippedChars = runUnzippingByTypes(zippedChars, zipTypes, x, y);

	return unzippedChars;
}


function runUnzippingByTypes(zippedChars, zipTypes, x, y) {
	var sourceChars = getCharsArray(zippedChars),
		unzippedChars = sourceChars.slice(),
		charsCount = x * y;

	if (!zipTypes || !zipTypes.length) {
		return sourceChars;
	}

	zipTypes.reverse();

	zipTypes.map(function(type) {

		switch (type) {
			case '~':
				// Prefix
				unzippedChars = padLeft(unzippedChars.join(''), charsCount, 0).split('');
				break;

			case '@':
				// Mirror
				unzippedChars = zipMirror(unzippedChars);
				break;

			case '#':
				// Reversion
				unzippedChars = zipReversion(unzippedChars);
				break;

			case '$':
				// 64 bit
				unzippedChars = unzip64Bit(unzippedChars);
				break;

			case '%':
				// 16 bit - TODO
				break;
			default:
				break;
		}
	});
	return unzippedChars;
}

function unzip64Bit(zippedChars) {
	if (!isIn64Bit(zippedChars)) {
		throw new Error('Input text is not in 64 bit.');
	}

	var sourceChars = getCharsArray(zippedChars),
		unzipped = [],
		temp2BitChar = '';

	sourceChars.map(function(chr) {
		temp2BitChar = unzipOneCharFrom64BitTo2Bit(chr);
		unzipped = unzipped.concat(temp2BitChar.split(''));
	});

	return unzipped;
}

function unzipOneCharFrom64BitTo2Bit(chrIn64Bit) {
	var indexOf64BitChar = CHARS_SET_OF_64_BIT.indexOf(chrIn64Bit),
		charIn2Bit = '';

	if (indexOf64BitChar >= 0) {
		charIn2Bit = indexOf64BitChar.toString(2);
		charIn2Bit = padLeft(charIn2Bit, 6, 0);
	}
	return charIn2Bit;
}

function isIn64Bit(zippedChars) {
	return /^[ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789\+\/]+$/.test(zippedChars.join(''));
}
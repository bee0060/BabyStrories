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

// 64进制字符集
var CHARS_SET_OF_64_BIT = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';


/*
	1. 计算开头和结尾的连续相同的字符数量，并以此决定是否使用镜面、反转和去前缀以及使用前缀。
	2. 选择性使用镜面和反转压缩
	3. 去掉连续0前缀
	4. 使用64进制压缩
 */
function zipMainControl(originChars, x, y) {
	var sourceChars = getCharsArray(originChars),
		zipTypes = zipTypesAnalysis(sourceChars),
		zippedChars = runZippingByTypes(sourceChars, zipTypes);

	return {
		zippedChars: zippedChars,
		zipTypes: zipTypes
	};
}

function zipTypesAnalysis(originChars) {
	var zipType = null,
		sourceChars = getCharsArray(originChars),
		sourceString = sourceChars.join(''),
		zeroPrefixReg = /(^0+)/,
		zeroSuffixReg = /(0+$)/,
		onePrefixReg = /(^1+)/,
		oneSuffixReg = /(1+$)/,
		zeroPrefixMatch = sourceString.match(zeroPrefixReg),
		zeroSuffixMatch = sourceString.match(zeroSuffixReg),
		onePrefixMatch = sourceString.match(onePrefixReg),
		oneSuffixMatch = sourceString.match(oneSuffixReg),
		zeroPrefixLength = !!zeroPrefixMatch ? zeroPrefixMatch[0].length : 0,
		zeroSuffixLength = !!zeroSuffixMatch ? zeroSuffixMatch[0].length : 0,
		onePrefixLength = !!onePrefixMatch ? onePrefixMatch[0].length : 0,
		oneSuffixLength = !!oneSuffixMatch ? oneSuffixMatch[0].length : 0,
		maxMatchLength = Math.max(zeroPrefixLength, zeroSuffixLength, onePrefixLength, oneSuffixLength);

	// 连续0前缀最长，不需要镜面和反转
	if (zeroPrefixLength === maxMatchLength) {
		zipType = [];
	}
	// 连续0后缀最长，需要反转压缩	
	else if (zeroSuffixLength === maxMatchLength) {
		zipType = ['#'];
	}
	// 连续1前缀最长，需要镜面压缩
	else if (onePrefixLength === maxMatchLength) {
		zipType = ['@'];
	}
	// 连续1后缀最长，需要镜面+反转压缩
	else if (oneSuffixLength === maxMatchLength) {
		zipType = ['@#'];
	}

	// 去掉连续0前缀
	zipType.push('~');

	// 64位压缩
	zipType.push('$');

	return zipType;
}

function runZippingByTypes(originChars, zipTypes) {
	var sourceChars = getCharsArray(originChars),
		zippedChars = sourceChars.slice();

	if (!zipTypes || !zipTypes.length) {
		return sourceChars;
	}

	zipTypes.map(function(type) {
		switch (type) {
			case '~':
				// Prefix
				zippedChars = removeZeroPrefix(zippedChars);
				break;

			case '@':
				// Mirror
				zippedChars = zipMirror(zippedChars);
				break;

			case '#':
				// Reversion
				zippedChars = zipReversion(zippedChars);
				break;

			case '$':
				// 64 bit
				zippedChars = zip64Bit(zippedChars);
				break;

			case '%':
				// 16 bit - TODO
				break;
			default:
				break;
		}
	});
	return zippedChars;
}


// TODO 暂未实现
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
	if (!isIn2Bit(originChars)) {
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

		if (counter % 6 === 0) {
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

function removeZeroPrefix(originChars) {

	var chars = getCharsArray(originChars),
		clone = chars.slice(),
		originStr = clone.join(''),
		prefixZeroReg = /^0*/,
		strWithoutZeroPrefix = originStr.replace(prefixZeroReg, ''),
		result = strWithoutZeroPrefix.split('');
	return result;
}

function combineZippedInfoIntoString(zippedInfo) {
	var zippedChars = zippedInfo.zippedChars || [],
		zipTypes = zippedInfo.zipTypes || [];

	return zippedChars.join('') + (zipTypes.length ? ('|' + zipTypes.join('')) : '');
}
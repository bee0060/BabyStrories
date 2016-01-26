'use strict';

var storiesLoader = (function() {
    var DEFAULT_INDEX = 0,
        DEFAULT_CULTURE = 'cn';


    var initial = function(storyObj, index, culture) {
        if (typeof storyObj != "object") {
            return false;
        }
        index = index || DEFAULT_INDEX;
        culture = culture || DEFAULT_CULTURE;

        loadPage(storyObj, index, culture);

        var board = document.getElementById('mask-flag');
        importByZippedStr(board, '50-40-15:00000000000000000000000000000000000000000000000000000000000000000000000000000000000001111111100000000011100000000000000000000000000000010000001000000001101100000000000000000000000000001100000001000000110000100000011111111110000000000010000000011000001000001101111100000000111111111001100000000010000010000001110000000000000011110011110000000000100000100000010000000111100000100110001100000000001100001000001000000001001100001000100011000000000001000010000010000000011001000010001000010000000000010000100001100000000011110000110110000100000000000100001000010000000000000000000111000001000000000001000010000100000000000000000000000000010000000000010000100001000000000001111111000000000100000000000100001000010000000001110000011111000001000000000001000010000100000000110010001000010000110000000000010000100000100000001000100010000100001000000000001100001000001100000010001000100001100110000000000010000010000001000000100000000000011001100000000001100000110001111100001111111111111100111110000000110000000110110001111100000000000000011000110000011000000000111000000001111111111111111000000011111100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000111000000000000000000000000000000011111100011000010011000000000001111100000000011100100000011101111100010000000001110001100000000101101001111100000110000100111110110000001111100010001010000110001000100001001000111001100011001000100001100011100010001100010010001100011100110010001000011001101000100001000100100110000001001000110010000100001110001000010001001001000001100010000100010001000001100000001100010010010000111110100001000100011001111000000111000100110110000000001111110001101110000010011110011111000111111000001110000000001110011111111100000000000000000001111110000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000');
    };

    var loadPage = function(storyObj, index, culture) {
        var name = storyObj.name[culture],
            chapterCount = storyObj.chapters.length,
            chapterObj = storyObj.chapters[index],
            number = chapterObj.number,
            contentArr = chapterObj.content[culture],
            illSrc = chapterObj.img,
            contentLength = contentArr.length;

        setTitle(name);
        setChapterName(name, number);
        setContent(contentArr);
        setIllustration(illSrc);
        setPrevButton(chapterCount, index, function() {
            loadPage(storyObj, index - 1, culture);
        });
        setNextButton(chapterCount, index, function() {
            loadPage(storyObj, +index + 1, culture);
        });
    };


    var setTitle = function(title) {
        $('title').html(title);
    };

    var setChapterName = function(storyName, charpterIndex) {
        $('#storyCapter').text(storyName + "-" + charpterIndex);
    };

    var setContent = function(contents) {
        var contentLength = contents.length,
            storyContainer = $('#storyContainer'),
            frag = document.createDocumentFragment();

        storyContainer.find('dd').remove();

        for (var i = 0; i < contentLength; i++) {
            var dd = document.createElement("dd");
            dd.innerHTML = contents[i];
            frag.appendChild(dd);
        }
        storyContainer.append(frag);
    };

    var setIllustration = function(illSrc) {
        var illustrationContainer = $('.illustrationContainer');
        illustrationContainer.css('background-image', "url('" + illSrc + "')");
    };

    var setPrevButton = function(chapterCount, index, clickEvent) {
        var prevPage = $('#prevPage');
        if (index === 0) {
            prevPage.hide();
        } else {
            prevPage.show();
            prevPage[0].onclick = clickEvent;
        }
    };

    var setNextButton = function(chapterCount, index, clickEvent) {
        var nextPage = $('#nextPage');
        if (index === chapterCount - 1) {
            nextPage.hide();
        } else {
            nextPage.show();
            nextPage[0].onclick = clickEvent;
        }
    };

    return {
        initial: initial
    };
})();
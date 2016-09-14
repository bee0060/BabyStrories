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
    };

    var loadPage = function(storyObj, index, culture) {
        var name = storyObj.name[culture],
            chapterCount = storyObj.chapters.length,
            chapterObj = storyObj.chapters[index],
            number = chapterObj.number,
            contentArr = chapterObj.content[culture],
            illSrc = chapterObj.img,
            mosaics = chapterObj.mosaics,
            contentLength = contentArr.length;

        setTitle(name);
        setChapterName(name, number);
        setContent(contentArr);
        setIllustration(illSrc);
        setMosaics(mosaics);
        
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

    var setMosaics = function(mosaics) {
        var board = document.getElementById('mosaics-flag');
        importByZippedStr(board, mosaics);
    };

    var setPrevButton = function(chapterCount, index, clickEvent) {
        var prevPage = $('#prevPage');
        if (index === 0) {
            prevPage.css('visibility', 'hidden');
        } else {
            prevPage.css('visibility', 'visible');
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
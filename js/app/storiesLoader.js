var storiesLoader = (function () {
    var DEFAULT_INDEX = 0,
        DEFAULT_CULTURE = 'cn';
    

    var initial = function (storyObj, index, culture) {
        if (typeof storyObj != "object") {
            return false;
        }
        index = index || DEFAULT_INDEX;
        culture = culture || DEFAULT_CULTURE;

        var name = storyObj.name[culture],
            chapterCount = storyObj.chapters.length,
            chapterObj = storyObj.chapters[index],
            number = chapterObj.number,
            contentArr = chapterObj.content[culture],
            contentLength = contentArr.length,
            storyContainer = $('#storyContainer'),
            nextPage = $('#nextPage');

        $('title').html(name);
        $('#storyCapter').text(name + "-" + number);

        storyContainer.find('dd').remove();
        var frag = document.createDocumentFragment();


        for (var i = 0; i < contentLength; i++) {
            var dd = document.createElement("dd");
            dd.innerHTML = contentArr[i];
            frag.appendChild(dd);
        }
        storyContainer.append(frag);

        if (index == chapterCount - 1) {
            nextPage.hide();
        }
        else {
            nextPage.show();
            nextPage[0].onclick = function () {
                initial(storyObj, +index + 1, culture);
            };
        }
    }

    return { initial: initial };
})();
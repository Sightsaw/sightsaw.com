function getPageAttributes() {
    var delimiter = "&";
    
    var currHash = document.location.hash.substr(1);
    var assignments = currHash.split(delimiter);

    var map = {};
    for (var i = 0; i < assignments.length; i++) {
        var pair = assignments[i].split("=");
        if (pair.length >= 2 && pair[0].length > 0 && pair[1].length > 0) {
            map[pair[0]] = pair[1];
        }
    }

    // Defaults
    // Language
    if (!map["l"] || map["l"].length <= 0) {
        map["l"] = "en";
    }

    // Page
    if (!map["p"] || map["p"].length <= 0) {
        map["p"] = "pivot-home";
    }

    return map;
}

function getPageAttribute(attr) {
    var map = getPageAttributes();
    return map[attr];
}

function getHashForMap(map) {
    var newHash = "#";
    var delim = "";
    for (var key in map) {
        if (key.length > 0 && map[key] && map[key].length > 0) {
            newHash = newHash + delim + key + "=" + map[key];
            delim = "&";
        }
    }

    return newHash;
}

function updateHash(keyToUpdate, newValue) {
    var map = getPageAttributes();

    if (keyToUpdate && keyToUpdate.length > 0)
        map[keyToUpdate] = newValue;

    document.location.hash = getHashForMap(map);
    window.scrollTo(0, 0);
}

function getAdId() {
    var adId = getPageAttribute("adid");
    var hasAdId = !(typeof adId === "undefined");
    if (!hasAdId) {
        adId = getPageAttribute("partner");
    }

    return adId;
}

function analyticsTrackEvent(action, label, value, nonInteraction) {
    /*
    if (_gaq) {
        if (typeof value === "undefined" || isNaN(parseInt(value))) {
            value = -1;
        }

        _gaq.push(['_trackEvent', "taianfinancial", action, label, parseInt(value), nonInteraction]);
    }
    */
}

function analyticsTrackAdView(pageName) {
    /*
    var adId = getAdId();
    if (typeof adId === "undefined") {
        // No tracking to be done
    } else {
        analyticsTrackEvent("ad-"+adId, pageName, 1, true);
    }
    */
}

function analyticsTrackLanguageView(pageName) {
    /*
    var lstr = getPageAttribute("l");
    analyticsTrackEvent("viewLanguage", lstr+"-"+pageName, 1, true);
    */
}

function showPivot(pivotName) {
    // If the hash doesn't have an =, try to treat it as a redirect.
    var currHash = document.location.hash.substr(1);

    var referrals = {
        wordmunchers: "p=pivot-word-munchers"
    }; 

    var newHash = referrals[currHash];
    if (!(typeof newHash === "undefined")) {
        document.location.hash = "#"+newHash;
        document.location.reload(true)
        return;
    }

    // Otherwise, process the hash attributes normally
    var defaultTab = "pivot-home";
    if (pivotName.length == 0)
        pivotName = defaultTab;

    updateHash("p", pivotName);
    var toHide = $(".pivot");
    for (var i = 0; i < toHide.length; i++) {
        toHide[i].style.display = "none";
    }
    var toShow = $("#"+pivotName)[0];
    toShow.style.display = "block";

    // Special behaviors for the various pages upon being shown:
    // None so far.
}

function makeStartPivotURLWithIsTopLevel(divID, isTopLevel) {
    return '<a href="#" onclick="showPivot(\''+divID+'\'); return false;"'+ (isTopLevel ? 'class="pivot-switch">' : '>');
}

function startPivotURL(divID) {
    document.write(makeStartPivotURLWithIsTopLevel(divID, false));
}

function endPivotURL() {
    document.write('</a>');
}

function makeEndPivotURL() {
    return '</a>';
}

function makePivotURL(divID, title) {
    var urlCode = "";
    urlCode += makeStartPivotURLWithIsTopLevel(divID, false);
    urlCode += loc(title);
    urlCode += '</a>';
    return urlCode;
}

function makeSubsectionURL(subsectionsName, section, title) {
    var urlCode = "";
    urlCode += '<a href="#" id="'+section+'Link" onclick="showSubsection(\''+subsectionsName+'\', \''+section+'\'); return false;">';
    urlCode += loc(title);
    urlCode += '</a>';
    return urlCode;
}

function makeBold(str) {
    return "<strong>" + loc(str) + "</strong>";
}

function makeTopLevelURL(divID, titleString) {
    var code = "<h2>";
    code += makeStartPivotURLWithIsTopLevel(divID, true);
    code += makeBold(titleString);
    code += makeEndPivotURL();
    code += "</h2>";
    return code;
}

function writeTopLevelURL(divID, titleString) {
    document.write(makeTopLevelURL(divID, titleString));
}

function startSubsections(className) {
    document.write('<div class="'+className+'">');
}

function endSubsections() {
    document.write('</div>');
}

function startSubsection(sectionName) {
    document.write('<div id="'+sectionName+'">');
}

function endSubsection() {
    document.write('</div>');
}

function showSubsection(className, sectionName) {
    var trackName = className+"-"+sectionName;
    analyticsTrackEvent("view", trackName, 1, false);
    analyticsTrackAdView(trackName);
    analyticsTrackLanguageView(trackName);

    var relevantSubsections = $("."+className+" > div");
    for (var i = 0; i < relevantSubsections.length; i++) {
        var oldUnlink = document.getElementById(relevantSubsections[i].id+"Unlink");
        if (oldUnlink)
            oldUnlink.parentNode.removeChild(oldUnlink);

        if (relevantSubsections[i].id == sectionName) {
            relevantSubsections[i].style.display = "block";

            var link = document.getElementById(relevantSubsections[i].id+"Link");
            link.parentNode.style.backgroundColor = "#D6D6D6";
            link.style.display = "none";

            var plainText = document.createElement('div');
            plainText.setAttribute('id', relevantSubsections[i].id+"Unlink");
            plainText.innerHTML = link.innerHTML;
            link.parentNode.appendChild(plainText);
        } else {
            relevantSubsections[i].style.display = "none";

            var link = document.getElementById(relevantSubsections[i].id+"Link");
            link.parentNode.style.backgroundColor = "transparent";
            link.style.display = "block";
        }
    }
}

function startSection(divID, titleString) {
    document.write('<div id="'+divID+'" class="pivot " bi:type="pivot">');
    document.write('<h2 bi:titleflag="t1" bi:title="t1" class="heading">'+loc(titleString)+'</h2>');
}

function endSection() {
    document.write('</div>');
}

function startRow() {
    document.write('<div class="grid-row row-3">');
}

function endRow() {
    document.write('</div>');
}

function makeText(text) {
    text = loc(text);
    text = text.replace(/\n/g, '<br />');
    return '<p align="left">'+text+'</p>';
}

function writeText(text) {
    document.write(makeText(text));
}

function writeTextArea(text) {
    document.write("<div id='faketextarea' style='border: 1px solid black; width:900px; overflow:auto; margin-left:auto; margin-right:auto; ' contenteditable>");
    text = loc(text);
    text = text.replace(/\n/g, '<br />');
    document.write(text);
    document.write("</div>");
}

function makeImage(filename) {
    return '<img src="'+filename+'" width="100%"></img>';
}

function writeImage(filename) {
    document.write(makeImage(filename));
}

function makeTableWithStyle(styleClass, numColumns, cells) {
    var mergedCells = [];
    mergedCells = mergedCells.concat.apply(mergedCells, cells); // Flatten the array
    var tableCode = "";
    tableCode += '<div bi:type="highlight">';
    tableCode += '<table class="'+styleClass+'">';
    for (var i = 0; i < mergedCells.length; i++) {
        var isHeader = (i / numColumns) < 1;
        var isLeftCol = (i % numColumns) == 0;

        if (isLeftCol) {
            if (i != 0) {
                tableCode += '</tr>';
                tableCode += '<tr>';
            } else {
                tableCode += '<tr>';
            }
        }

        var style = styleClass;
        if (isHeader) {
            style += 'Header';
        } else if (isLeftCol) {
            style += 'Left';
        }

        tableCode += '<td class="' + style + '">';
        tableCode += loc(mergedCells[i]);
        tableCode += '</td>';
    }
    tableCode += '</tr>';
    tableCode += '</table>';
    tableCode += '</div>';
    return tableCode;
}

function makeTable(numColumns, cells) {
    return makeTableWithStyle("styledTable", numColumns, cells);
}

function makeRawURL(title, url) {
    var adId = getAdId();
    var hasAdId = !(typeof adId === "undefined");

    if (url.indexOf(".imglobal.com") >= 0 && hasAdId) {
        url += "&uservar="+adId;
    }
    return '<a href="'+url+'" bi:cpid="workHighlight">'+loc(title)+'</a>';
}

function makeURLWithBuyStyle(title, url, buyStyle) {
    var outputURL = makeRawURL(title, url);
    if (buyStyle) {
        outputURL = makeBuyStyle(outputURL);
    }
    
    return outputURL;
}

function makeURL(title, url) {
    return makeURLWithBuyStyle(title, url, false);
}

function makeBuyURL(title, url) {
    return makeURLWithBuyStyle(title, url, true);
}

function makeBuyStyle(text) {
    return "<h2 class=\"uglyBuyStyle\">" + text + "</h2>";
}

function makeBulletedListWithTitle(title, list) {
    var listCode = '<h2>'+loc(title)+'</h2>';
    listCode += '<ul class="styled-ul">';

    for (var i = 0; i < list.length; i++) {
        listCode += '<li class="styled-li">'+loc(list[i])+"</li>";
    }
    
    listCode += "</ul>";
    return listCode;
}

function makeLinesWithTitle(title, lines) {
    var code = "";

    code += makeBold(title);
    for (var i = 0; i < lines.length; i++) {
        code += "<br />" + loc(lines[i]);
    }
    
    return makeText(code);
}

function writeLinesWithTitle(title, lines) {
    document.write(makeLinesWithTitle(title, lines));
}

function writeLogoAndTitle() {
    var partnerShip = getPartnership(getPageAttribute("partner"));

    var windowTitle = partnerShip["windowTitle"];
    var logoImage = partnerShip["logoImage"];
    var logoHeight = partnerShip["logoHeight"];
    var logoWidth = partnerShip["logoWidth"];
    var pageTitle = partnerShip["pageTitle"];

    document.title = loc(windowTitle);
    if (logoImage.length > 0) {
        document.write('<img src="'+logoImage+'" width="'+logoWidth+'" height="'+logoHeight+'" alt="'+loc(pageTitle)+'" />&nbsp;');
    }
    document.write(loc(pageTitle));
}

function writeHeaderNote() {
    document.write("<br />");
}

function makeContactInfo() {
    var partnerShip = getPartnership(getPageAttribute("partner"));
    var contactInfo = partnerShip["contactInfo"];

    var ret = "";
    ret += "<ul>";

    for (var i = 0; i < contactInfo.length; i++) {
        ret += "<li>";
        ret += loc(contactInfo[i]);
        ret += "</li>";
    }

    ret += '<li id=\"mscom-legal-copyright\">';
    ret += loc("2013 Sightsaw LLC. All rights reserved.");
    ret += "</li>";
    ret += "</ul>";

    return ret;
}

function writeContactInfo() {
    document.write(makeContactInfo());
}

function writeTabs() {
    var topLevelNames = {
        "pivot-home": "Home",
        "pivot-number-munchers-1st": "Number Munchers: First Grade",
        "pivot-number-munchers-3rd": "Number Munchers: Third Grade",
        "pivot-word-munchers": "Word Munchers",
        "pivot-word-munchers-pos": "Word Munchers: Parts of Speech",
        "pivot-spanish-munchers-verbs": "Spanish Munchers: Verbs",
        "pivot-spanish-munchers-nouns": "Spanish Munchers: Nouns",
        "pivot-acorns": "Acorns",
        "pivot-lettermind": "Lettermind"
    };

    var partnership = getPartnership(getPageAttribute("partner"));
    var tabs = partnership["tabs"];

    var topLevelLinks = [];

    if (tabs.length > 1) {
        for (var i = 0; i < tabs.length; i++) {
            topLevelLinks.push(makeTopLevelURL(tabs[i], topLevelNames[tabs[i]]));
        }
        document.write(makeTableWithStyle("invisibleTable", topLevelLinks.length, topLevelLinks));
    }
}

function getContactInfo() {
    var partnerShip = getPartnership(getPageAttribute("partner"));
    var contactInfo = partnerShip["contactInfo"];
    return contactInfo;
}

function writeSections() {
    startSection("pivot-home", "");

    startRow();

    document.write(makeTableWithStyle("invisibleTableNormalText", 3, [
                makeStartPivotURLWithIsTopLevel("pivot-number-munchers-1st", false) + makeImage("numbermunchers1st.png") + makeText("Number Munchers: First Grade tests the basics of arithmetic with addition and subtraction") + makeEndPivotURL(),
                makeStartPivotURLWithIsTopLevel("pivot-number-munchers-3rd", false) + makeImage("numbermunchers3rd.png") + makeText("Number Munchers: Third Grade tests the multiplication tables") + makeEndPivotURL(),
                makeStartPivotURLWithIsTopLevel("pivot-word-munchers", false) + makeImage("wordmunchers.png") + makeText("Word Munchers tests reading and vowel sounds") + makeEndPivotURL(),
                makeStartPivotURLWithIsTopLevel("pivot-word-munchers-pos", false) + makeImage("wordmuncherspos.png") + makeText("Word Munchers: Parts of Speech tests grammar through word classification") + makeEndPivotURL(),
                makeStartPivotURLWithIsTopLevel("pivot-spanish-munchers-verbs", false) + makeImage("spanishmunchersverbs.png") + makeText("Spanish Munchers: Verbs tests conjugation of common Spanish verbs") + makeEndPivotURL(),
                makeStartPivotURLWithIsTopLevel("pivot-spanish-munchers-nouns", false) + makeImage("spanishmunchersnouns.png") + makeText("Spanish Munchers: Nouns tests gender of common Spanish nouns") + makeEndPivotURL(),
                makeStartPivotURLWithIsTopLevel("pivot-acorns", false) + makeImage("acorns.png") + makeText("Blow off steam by catching acorns!") + makeEndPivotURL(),
                makeStartPivotURLWithIsTopLevel("pivot-lettermind", false) + makeImage("lettermind-short.png") + makeText("Lettermind is a word game inspired by Mastermind") + makeEndPivotURL()
                ]));

    endRow();

    endSection();



    
    
    startSection("pivot-number-munchers-1st", "Number Munchers: First Grade");

    startRow();
    document.write(makeTableWithStyle("invisibleTableNormalText", 3, [
                makeImage("numbermunchers1st.png"),

                makeText(
                    makeURL("Available on iOS (iPhone, iPad, iPod Touch)!\n", "https://itunes.apple.com/us/app/number-munchers-first-grade/id662802108?ls=1&mt=8") +
                    "Munch on mathematical expressions without getting munched on by troggles!\n" +
                    "Learn 1st grade math concepts such as:\n" +
                    "Even/odd\n" +
                    "Greater Than/Less than inequalities\n" +
                    "Addition/Subtraction of small numbers\n\n" + 
                    "Reinforce these first grade math concepts while keeping your muncher safe!\n\n" +
                    "Eat numbers to gain points and advance to the next round. Use randomly appearing safe boxes to avoid the troggles!"
                    )
                ]));
    endRow();

    endSection();
    

    startSection("pivot-number-munchers-3rd", "Number Munchers: Third Grade");

    startRow();
    document.write(makeTableWithStyle("invisibleTableNormalText", 3, [
                makeImage("numbermunchers3rd.png"),

                makeText(
                    makeURL("Available on iOS (iPhone, iPad, iPod Touch)!\n", "https://itunes.apple.com/us/app/number-munchers-third-grade/id663670946?mt=8") +
                    "Munch on mathematical expressions without getting munched on by troggles!\n" +
                    "Learn the multiplication tables -- perfect for 3rd graders learning to multiply numbers 1 through 12 and beyond.\n" +
                    "Reinforce these third grade math concepts while keeping your muncher safe!\n\n" +
                    "Eat multiples to gain points and advance to the next round. Use randomly appearing safe boxes to avoid the troggles!"
                    )
                ]));
    endRow();

    endSection();
    

    startSection("pivot-word-munchers", "Word Munchers");

    startRow();
    document.write(makeTableWithStyle("invisibleTableNormalText", 3, [
                makeImage("wordmunchers.png"),

                makeText(
                    makeURL("Available on iOS (iPhone, iPad, iPod Touch)!\n", "https://itunes.apple.com/us/app/word-munchers/id660115371?mt=8") +
                    "Munch on words without getting munched on by troggles!\n" +
                    "Learn to sound out words to eat the ones that match the current level's theme!\n" +
                    "Eat words to gain points and advance to the next round. Use randomly appearing safe boxes to avoid the troggles!"
                    )
                ]));
    endRow();

    endSection();
    


    startSection("pivot-word-munchers-pos", "Word Munchers: Parts of Speech");

    startRow();
    document.write(makeTableWithStyle("invisibleTableNormalText", 3, [
                makeImage("wordmuncherspos.png"),

                makeText(
                    makeURL("Available on iOS (iPhone, iPad, iPod Touch)!\n", "https://itunes.apple.com/us/app/word-munchers-parts-of-speech/id684066653?mt=8") +
                    "Munch on words without getting munched on by troggles!\n" +
                    "Learn the parts of speech to eat the words that match the current level's theme!\n" +
                    "Eat words to gain points and advance to the next round. Use randomly appearing safe boxes to avoid the troggles!\n\n" +
                    "Great for students learning or practicing grammar with these parts of speech:\n" +
                    "Verbs\n" +
                    "Nouns\n" +
                    "Pronouns\n" +
                    "Adverbs\n" +
                    "Adjectives\n" +
                    "Prepositions\n" +
                    "Interjections\n" +
                    "Conjunctions"
                    )
                ]));
    endRow();

    endSection();
    

    startSection("pivot-spanish-munchers-verbs", "Spanish Munchers: Verbs");

    startRow();
    document.write(makeTableWithStyle("invisibleTableNormalText", 3, [
                makeImage("spanishmunchersverbs.png"),

                makeText(
                    makeURL("Available on iOS (iPhone, iPad, iPod Touch)!\n", "https://itunes.apple.com/us/app/spanish-munchers-verbs/id690342300?mt=8") +
                    "Munch on conjugated verbs without getting munched on by troggles!\n" +
                    "Learn to conjugate verbs to agree with the subject of the current level's theme! Eat words to gain points and advance to the next round. Use randomly appearing safe boxes to avoid the troggles!\n" +
                    "This game is a great study tool for students learning Spanish verbs and grammar.\n\n" +
                    "¡Come los verbos conjugados sin ser comido por los troggles!\n" +
                    "¡Aprende a conjugar verbos para que concuerden con el sujeto de acuerdo con el nivel en el que estás! Come palabras para ganar puntos y subir al siguiente nivel. Usa las cajas de protección que aparecen para evadir a los troggles.\n" +
                    "Este juego es una gran herramienta para estudiantes que quieren aprender verbos y gramática en español."
                    )
                ]));
    endRow();

    endSection();
    

    startSection("pivot-spanish-munchers-nouns", "Spanish Munchers: Nouns");

    startRow();
    document.write(makeTableWithStyle("invisibleTableNormalText", 3, [
                makeImage("spanishmunchersnouns.png"),

                makeText(
                    makeURL("Available on iOS (iPhone, iPad, iPod Touch)!\n", "https://itunes.apple.com/us/app/spanish-munchers-nouns/id710204926?mt=8") +
                    "Munch on nouns without getting munched on by troggles!\n" +
                    "Learn which nouns go with \"el\", \"la\", \"los\", and \"las\". Watch out for tricky words that don't follow patterns!\n" +
                    "Eat words to gain points and advance to the next round. Use randomly appearing safe boxes to avoid the troggles!\n" +
                    "This game is a great study tool for students learning Spanish nouns and gender agreement.\n\n" +
                    "¡Come los sustantivos sin ser comido por los troggles!\n" +
                    "Aprende cuales sustantivos usan el, la, los, o las.\n" +
                    "¡Cuidado con las palabras engañosas que no siguen el patrón básico!\n" +
                    "Come palabras para ganar puntos y subir al siguiente nivel. ¡Usa las cajas de protección que aparecen para evadir a los troggles!\n" +
                    "Este juego es una gran herramienta para estudiantes que están aprendiendo sustantivos y géneros."
                    )
                ]));
    endRow();

    endSection();
    

    startSection("pivot-acorns", "Acorns");

    startRow();
    document.write(makeTableWithStyle("invisibleTableNormalText", 3, [
                makeImage("acorns.png"),

                makeText(
                    makeURL("Available on iOS (iPhone, iPad, iPod Touch)!\n", "https://itunes.apple.com/us/app/acorns-by-sightsaw/id641419094?ls=1&mt=8") +
                    "Avoid the rocks, catch the acorns, and above all, beat the squirrel!\n" +
                    "Slip up and be taunted mercilessly. Persevere for some sweet, sweet acorn pie.\n" +
                    "(Is the pie a lie?)"
                    )
                ]));
    endRow();

    endSection();


    startSection("pivot-lettermind", "Lettermind");

    startRow();
    document.write(makeTableWithStyle("invisibleTableNormalText", 3, [
                makeImage("lettermind.png"),

                makeText(
                    makeURL("Available on iOS (iPhone, iPad, iPod Touch)!\n", "https://itunes.apple.com/us/app/lettermind/id642750394?ls=1&mt=8") +
                    "The only thing standing between you and Bingo is a simple, 5-letter word. Can you guess what it is? Be smart, stay alert: after all, you've only got three tries to get it right."
                    )
                ]));
    endRow();

    endSection();


}



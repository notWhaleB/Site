var letters = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユ4" +
    "2ヨラリルレロワヰヱヲンㄅㄆㄇㄈㄉㄊㄋㄌㄍㄎㄏㄐㄒㄓㄔㄕㄗㄘㄙㄚㄛㄜㄝㄞㄠㄡㄢㄣㄤㄥㄦㄨㄩㄪㄫㄬ";
var chrSetPow = letters.length;
var fontSize, textX, textY;
var currentTime;
var context;
var timer;
var mapW, mapH;
var maxPause, maxDropRdmArg, maxDropsINColumn, refreshDelay;
var matrixMap = [];

var windowWidth, windowHeight;
var canvas;

var charText = ["▤   ▤ ▤▤▤ ▤  ▤ ▤▤▤ ▤▤▤▤▤   ▤     ▤▤▤   ▤▤▤▤  ▤▤▤ ▤▤▤  ▤▤▤ ▤  ▤ ▤▤▤▤ ▤   ▤",
                "▤▤  ▤  ▤  ▤ ▤   ▤    ▤    ▤ ▤    ▤  ▤  ▤    ▤     ▤  ▤    ▤  ▤ ▤    ▤   ▤",
                "▤ ▤ ▤  ▤  ▤▤    ▤    ▤   ▤   ▤   ▤▤▤▤  ▤▤▤▤ ▤ ▤▤  ▤   ▤▤  ▤▤▤▤ ▤▤▤▤ ▤   ▤",
                "▤  ▤▤  ▤  ▤ ▤   ▤    ▤   ▤▤▤▤▤   ▤   ▤ ▤    ▤  ▤  ▤     ▤ ▤  ▤ ▤     ▤ ▤ ",
                "▤   ▤ ▤▤▤ ▤  ▤ ▤▤▤   ▤   ▤   ▤   ▤▤▤▤  ▤▤▤▤  ▤▤▤ ▤▤▤ ▤▤▤  ▤  ▤ ▤▤▤▤   ▤  ",
                "                                                                         ",
                "                          PROGRAMMER, WEB DEV                            ",
                "                                                                         ",
                "                                                                         ",
                "                    nikita@begishev.me | GitHub | CV                     "];

var mDropsCount = "mDropsCount", mActive = "mActive", mType = "mType", mPauseValue = "mPauseValue",
    mCurrentPause = "mCurrentPause", mGreen = "mGreen", mWhite = "mWhite", mSymbol = "mSymbol", mFade = "mFade",
    mText = "mText", mTextActive = "mTextActive", mColumnUsed = "mColumnUsed", mColumnUsedCount = "mColumnUsedCount";

function get_random_int(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function get_random_char() {
    var idx = get_random_int(0, chrSetPow - 1);
    return letters.slice(idx, idx + 1);
}

function config_second_phase() {
    maxDropRdmArg = 5;
    maxDropsINColumn = 1;
    refreshDelay = 33;
}

function spawn_new_drop() {
    var randPosX = get_random_int(0, mapW);

    for (var i = 0; i != 10 && matrixMap[randPosX][mDropsCount] >= maxDropsINColumn; ++i)
        randPosX = get_random_int(0, mapW);

    if (matrixMap[randPosX][mDropsCount] < maxDropsINColumn) {
        matrixMap[randPosX][0][mType] = 1;
        matrixMap[randPosX][0][mPauseValue] = get_random_int(0, maxPause);
        matrixMap[randPosX][0][mCurrentPause] = matrixMap[randPosX][0][mPauseValue];
        matrixMap[randPosX][0][mWhite] = 250;
        matrixMap[randPosX][0][mGreen] = 0;
        matrixMap[randPosX][0][mSymbol] = get_random_char();
        matrixMap[randPosX][0][mFade] = get_random_int(5, 10);

        matrixMap[randPosX][mDropsCount]++;
        matrixMap[randPosX][mActive] = true;

        if (!matrixMap[randPosX][mColumnUsed]) {
            matrixMap[randPosX][mColumnUsed] = true;
            matrixMap[mColumnUsedCount]++;
            if (matrixMap[mColumnUsedCount] >= mapW + 1) {
                config_second_phase();
            }
        }
    }
}

function update() {
    for (var i = 0; i <= mapW; ++i) {
        if (matrixMap[i][mActive]) {
            var flag = false;
            for (var j = 0; j <= mapH; ++j) {
                if (matrixMap[i][j][mType] != 0) {
                    flag = true;

                    if (matrixMap[i][j][mCurrentPause] > 0) {
                        matrixMap[i][j][mCurrentPause]--;
                        continue;
                    }
                    matrixMap[i][j][mCurrentPause] = matrixMap[i][j][mPauseValue];

                    switch (matrixMap[i][j][mType]) {
                        case 1:
                            if (j < mapH && !(matrixMap[i][j][mTextActive] && (matrixMap[i][j][mText] != " " && matrixMap[i][j][mText].length > 0))) {
                                for (var key in matrixMap[i][j])
                                    if (key != "mText" && key != "mTextActive")
                                        matrixMap[i][j + 1][key] = matrixMap[i][j][key];
                            } else
                                matrixMap[i][mDropsCount]--;

                            matrixMap[i][j][mSymbol] = get_random_char();
                            matrixMap[i][j][mType] = 2;
                            matrixMap[i][j][mCurrentPause] = matrixMap[i][j][mPauseValue];
                            matrixMap[i][j][mWhite] = 200;
                            matrixMap[i][j][mGreen] = 0;
                            matrixMap[i][j][mTextActive] = true;

                            if (j < mapH)
                                j++;

                            break;
                        case 2:
                            if (get_random_int(1, 100) == 42)
                                matrixMap[i][j][mSymbol] = get_random_char();

                            if (matrixMap[i][j][mWhite] > 150) {
                                matrixMap[i][j][mWhite] -= 50;
                                if (matrixMap[i][j][mWhite] <= 150) {
                                    matrixMap[i][j][mWhite] = 0;
                                    matrixMap[i][j][mGreen] = 250;
                                }
                            } else if (matrixMap[i][j][mGreen] > 0) {
                                matrixMap[i][j][mGreen] -= matrixMap[i][j][mFade];
                                if (matrixMap[i][j][mGreen] <= 0) {
                                    matrixMap[i][j][mGreen] = 0;
                                    matrixMap[i][j][mType] = 0;
                                }
                            }

                            break;
                    }
                }
            }
            if (!flag)
                matrixMap[i][mActive] = false;
        }
    }

    if (get_random_int(1, maxDropRdmArg) == 1)
        spawn_new_drop();
}

function draw() {
    context.fillStyle = "black";
    context.fillRect(0, 0, canvasW, canvasH);
    context.font = "bold 14px monaco, consolas, courier, monospace";
    var i, j;

    for (i = 0; i <= mapW; ++i) {
        if (matrixMap[i][mActive]) {
            for (j = 0; j <= mapH; ++j) {
                if (matrixMap[i][j][mType] != 0) {
                    context.fillStyle = "rgb(" + matrixMap[i][j][mWhite] + ", " +
                    Math.max(matrixMap[i][j][mGreen], matrixMap[i][j][mWhite]) + ", " + matrixMap[i][j][mWhite] + ")";

                    if (!matrixMap[i][j][mTextActive] || matrixMap[i][j][mText] == " " || matrixMap[i][j][mText].length == 0) {
                        context.fillText(matrixMap[i][j][mSymbol], i * fontSize, j * fontSize);
                    }
                }
            }
        }
    }

    for (i = textX; i != charText[0].length + textX; ++i) {
        for (j = textY; j != charText.length + textY; ++j) {
            if (matrixMap[i][j][mTextActive] && matrixMap[i][j][mText] != " " && matrixMap[i][j][mText].length > 0) {
                context.fillStyle = "rgb(0, 250, 0)";
                // context.fillStyle = "rgb("+get_random_int(0, 250)+","+get_random_int(0, 250)+","+get_random_int(0,250)+")";
                context.fillText(matrixMap[i][j][mText], i * fontSize, j * fontSize);
            }
        }
    }
}

function matrix() {
    clearInterval(timer);
    var start = currentTime.getMilliseconds();

    update();

    draw();

    timer = setInterval(matrix, refreshDelay - (currentTime.getMilliseconds() - start));
}

function init() {
    clearInterval(timer);
    fontSize = 14;
    currentTime = new Date();

    canvas = document.getElementById("mainCanvas");

    windowWidth = Math.max(document.body.offsetWidth, 1024);
    windowHeight = Math.max(document.body.offsetHeight - 5, 400);

    canvas.width = parseInt(windowWidth / fontSize) * fontSize;
    canvas.height = parseInt(windowHeight / fontSize) * fontSize;

    canvasW = canvas.width;
    canvasH = canvas.height;

    context = canvas.getContext("2d");

    mapW = parseInt(canvasW / fontSize);
    mapH = parseInt(canvasH / fontSize);

    maxPause = 1;
    maxDropRdmArg = 1;
    maxDropsINColumn = 2;
    refreshDelay = 25;

    timer = setInterval(matrix, refreshDelay);

    canvas.style.margin = 0;
    canvas.style.marginLeft = parseInt((windowWidth - canvasW) / 2) + "px";
    canvas.style.marginTop = parseInt((windowHeight - canvasH) / 2) + "px";

    if (canvas.style.marginLeft % 2 != 0) canvas.style.marginLeft--;
    canvas.style.marginLeft += "px";

    textX = parseInt((mapW - charText[0].length) / 2);
    textY = parseInt((mapH - charText.length) / 2);

    var tElem = document.getElementById("github-link");
    tElem.style.left = ((textX + 40) * fontSize) + "px";
    tElem.style.top = ((textY + 8) * fontSize) + "px";
    tElem.style.width = (8 * fontSize) + "px";

    tElem = document.getElementById("cv-link");
    tElem.style.left = ((textX + 50) * fontSize) + "px";
    tElem.style.top = ((textY + 8) * fontSize) + "px";
    tElem.style.width = (4 * fontSize) + "px";

    matrixMap[mColumnUsedCount] = 0;
    for (var i = 0; i <= mapW; ++i) {
        matrixMap[i] = [];
        matrixMap[i][mDropsCount] = 0;
        matrixMap[i][mColumnUsed] = false;

        matrixMap[i][mActive] = false;
        for (var j = 0; j <= mapH; ++j) {
            matrixMap[i][j] = [];
            matrixMap[i][j][mType] = 0;
            matrixMap[i][j][mPauseValue] = 0;
            matrixMap[i][j][mCurrentPause] = 0;
            matrixMap[i][j][mGreen] = 0;
            matrixMap[i][j][mWhite] = 0;
            matrixMap[i][j][mSymbol] = '';
            matrixMap[i][j][mFade] = 0;
            matrixMap[i][j][mText]= '';
            matrixMap[i][j][mTextActive] = false;
        }
    }

    for (var i = 0, x = textX; i != charText[0].length; ++i, ++x) {
        for (var j = 0, y = textY; j != charText.length; ++j, ++y) {
            matrixMap[x][y][mText] = charText[j][i];
        }
    }
}

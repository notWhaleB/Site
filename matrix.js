var fontSize = 14;
var letters = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユ4" +
    "2ヨラリルレロワヰヱヲンㄅㄆㄇㄈㄉㄊㄋㄌㄍㄎㄏㄐㄒㄓㄔㄕㄗㄘㄙㄚㄛㄜㄝㄞㄠㄡㄢㄣㄤㄥㄦㄨㄩㄪㄫㄬ";
var chrSetPow = letters.length;
var currentTime = new Date();

var mDropsCount = "mDropsCount", mActive = "mActive", mType = "mType", mPauseValue = "mPauseValue",
    mCurrentPause = "mCurrentPause", mGreen = "mGreen", mWhite = "mWhite", mSymbol = "mSymbol", mFade = "mFade";

function get_random_int(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function get_random_char() {
    var idx = get_random_int(0, chrSetPow - 1);
    return letters.slice(idx, idx + 1);
}

canvas = document.querySelector("mainCanvas");
canvas = document.getElementById("mainCanvas");
canvas.width = parseInt(window.innerWidth / fontSize + 1) * fontSize - 10;
canvas.height = parseInt(window.innerHeight / fontSize + 1) * fontSize;
canvasW = canvas.width;
canvasH = canvas.height;

var context = canvas.getContext("2d");

var mapW = parseInt(canvasW / fontSize);
var mapH = parseInt(canvasH / fontSize);

var matrixMap = [];
for (var i = 0; i <= mapW; ++i) {
    matrixMap[i] = [];
    matrixMap[i][mDropsCount] = 0;

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
    }
}

function spawn_new_drop() {
    var randPosX = get_random_int(0, mapW);

    for (var i = 0; i != 10 && matrixMap[randPosX][mDropsCount] >= 2; ++i)
        randPosX = get_random_int(0, mapW);

    if (matrixMap[randPosX][mDropsCount] < 2) {
        matrixMap[randPosX][0][mType] = 1;
        matrixMap[randPosX][0][mPauseValue] = get_random_int(0, 2);
        matrixMap[randPosX][0][mCurrentPause] = matrixMap[randPosX][0][mPauseValue];
        matrixMap[randPosX][0][mWhite] = 250;
        matrixMap[randPosX][0][mGreen] = 0;
        matrixMap[randPosX][0][mSymbol] = get_random_char();
        matrixMap[randPosX][0][mFade] = get_random_int(5, 10);

        matrixMap[randPosX][mDropsCount]++;
        matrixMap[randPosX][mActive] = true;
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
                            if (j < mapH) {
                                for (var key in matrixMap[i][j])
                                    matrixMap[i][j + 1][key] = matrixMap[i][j][key];
                            } else
                                matrixMap[i][mDropsCount]--;

                            matrixMap[i][j][mSymbol] = get_random_char();
                            matrixMap[i][j][mType] = 2;
                            matrixMap[i][j][mCurrentPause] = matrixMap[i][j][mPauseValue];
                            matrixMap[i][j][mWhite] = 200;
                            matrixMap[i][j][mGreen] = 0;

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

    if (get_random_int(1, 4) == 2)
        spawn_new_drop();
}

function draw() {
    context.fillStyle = "black";
    context.fillRect(0, 0, canvasW, canvasH);
    context.font = "bold 14px sans-serif";

    for (var i = 0; i <= mapW; ++i) {
        if (matrixMap[i][mActive]) {
            for (var j = 0; j <= mapH; ++j) {
                if (matrixMap[i][j][mType] != 0) {
                    context.fillStyle = "rgb(" + matrixMap[i][j][mWhite] + ", " +
                    Math.max(matrixMap[i][j][mGreen], matrixMap[i][j][mWhite]) + ", " + matrixMap[i][j][mWhite] + ")";

                    context.fillText(matrixMap[i][j][mSymbol], i * 16, 12 + j * 16);
                }
            }
        }
    }
}

function matrix() {
    clearInterval(timer);
    var start = currentTime.getMilliseconds();

    update();

    draw();

    timer = setInterval(matrix, 25 - (currentTime.getMilliseconds() - start));
}

var timer = setInterval(matrix, 25);

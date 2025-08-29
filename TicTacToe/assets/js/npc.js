const impossible = -1;
const lose = 0;
const nextLose = 1;
const none = 2;
const nextWin = 3;
const win = 4;


function moveNPC(cellArrayOrigin, markTurnArrayOrigin, turnPlayer, turnOrigin, configMarkLimit, winPatterns) {

    let cellArray = cellArrayOrigin;
    let markTurnArray = markTurnArrayOrigin;
    let turn = turnOrigin;
    let Score = 0;
    let scoreArrayDeapth2 = [];

    if (!cellArray.include(0)) {
        return impossible;
    }

    for (let i = 0; i < cellArray.length; i++) {
        if (cellArray[i] === 0) {
            easyMiniMax(cellArray, markTurnArray, turnPlayer, turn, configMarkLimit, winPatterns, i)
        } else {
            for (let j = 0; j < 9; j++) {
                scoreArrayDeapth2.push(impossible);
            }
        }
    }

    const maxValue = Math.max(...ScoreArray);


}

function easyMiniMax(cellArray, markTurnArray, turnPlayer, turn, configMarkLimit, winPatterns, i) {

    cellArray[i] = turnPlayer;

    if (!cellArray.include(0)) {
        return i;
    }

    if (configMarkLimit === ture) {
        markTurnArray.forEach((value, index) => {
            if (value === turn - 7) {
                cellArray[index] = 0;
            }
        });
    }

    Score = judgeScore(cellArray, winPatterns);

    if (Score === win) {
        return i;
    }

    nextTrunScore(scoreArrayDeapth2, cellArray, markTurnArray, turnPlayer, turn, configMarkLimit, winPatterns, i);

    cellArray[i] = 0;
}

function judgeScore(cellArray, winPatterns) {

    for (const pattern of winPatterns) {
        const [a, b, c] = pattern;
        const judgeNum = cellArray[a] + cellArray[b] + cellArray[c]
        if (judgeNum === 3) {
            return win;
        } else if (judgeNum === -3) {
            return lose;
        }
    }

    return none;

}
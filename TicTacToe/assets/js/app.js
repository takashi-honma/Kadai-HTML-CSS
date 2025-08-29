const cellArray = Array(9).fill(0);
const markTurnArray = Array(9).fill(0);
let turn = 0;
let turnPlayer = 0;
MAX_DEPTH = 10;

const underText = document.getElementById("underText");
const turnText = document.getElementById("turnText");
const playerText = document.getElementById("playerText");

const cells = document.querySelectorAll(".cell");
const button = document.getElementById("button");
const buttonConfig = document.getElementById("buttonConfig");
const buttonClose = document.getElementById("buttonClose");

const config = document.getElementById("config");
const configBackGround = document.getElementById("configBackGround");
const ruleText = document.getElementById("ruleText");
const idOfNewWinPattern = document.getElementById("new-win-pattern");

let configMarkLimit = false;
let configAddWinPattern = false;
let configNPC = false;
let clickCT = false;

let winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // 横
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // 縦
    [0, 4, 8], [2, 4, 6]           // 斜め
];

button.addEventListener("click", clickStartButton);
buttonConfig.addEventListener("click", clickConfigButton);
buttonClose.addEventListener("click", configClose);

configBackGround.addEventListener("click", function (e) {
    if (e.target === configBackGround) {
        configClose();
    }
});

cells.forEach(cell => {
    cell.addEventListener("click", markCell);
});

document.querySelectorAll('input[name="config-MarkLimit"], input[name="config-AddWinPattern"], input[name="config-NPC"]').forEach(input => {
    input.addEventListener("change", () => {
        changeRuleText();
    });
});


function clickStartButton() {

    if (turnPlayer !== 0) {
        underText.textContent = "ノーゲーム！";
        gameEndFunc();
        return;
    }

    configMarkLimit = document.querySelector('input[name="config-MarkLimit"]:checked').value === "true";
    configAddWinPattern = document.querySelector('input[name="config-AddWinPattern"]:checked').value === "true";
    configNPC = document.querySelector('input[name="config-NPC"]:checked').value === "true";
    cellArray.fill(0);
    markTurnArray.fill(0);
    turn = 1;
    button.textContent = "ゲームをやめる"
    buttonConfig.classList.add("hidden");
    underText.textContent = null

    //勝利パターンのリセット
    if (winPatterns.length > 8) {
        winPatterns.pop();
    }

    //プレイヤー（○ = 1, × = -1）をランダムに決定する。
    turnPlayer = Math.random() < 0.5 ? -1 : 1;

    if (configAddWinPattern === true) {
        //コンフィグ設定に応じて勝利パターンを追加する設定を行う
        addWinPattern();
        showNewPattern();
        idOfNewWinPattern.classList.remove("hidden");
    } else {
        idOfNewWinPattern.classList.add("hidden");
    }
    updateText();

    if (configNPC === true && turnPlayer === 1) {
        aiMove();
    }
}

function clickConfigButton() {
    config.classList.remove("hidden");
}

function configClose() {
    config.classList.add("hidden");
}

function markCell(event) {
    const cell = event.currentTarget;
    const index = parseInt(cell.dataset.index);

    //ゲーム開始前かすでにマークが記入されているならreturn
    if (turnPlayer === 0 || cellArray[index] !== 0 || clickCT === true) {
        return;
    }

    clickCT = true;
    cellArray[index] = turnPlayer;
    markTurnArray[index] = turn;
    turn += 1;

    //ターンプレイヤーの変更処理
    if (turnPlayer === 1) {
        turnPlayer = -1;
    } else {
        turnPlayer = 1;
    }

    if (configMarkLimit === true) {
        cellLifeSpan();
    }
    updateText();
    judgeGame();

    if (configNPC === true && turnPlayer === 1) {
        setTimeout(function () {
            aiMove();
            clickCT = false;
        }, 500);
    }else{
        clickCT = false;
    }
}

function updateText() {
    let playerName = ""

    //左側で表示するプレイヤー名の表示切替
    if (turnPlayer === 1) {
        playerName = "○"

        playerText.classList.remove("mark-×");
        playerText.classList.add("mark-○");
    } else {
        playerName = "×"

        playerText.classList.remove("mark-○");
        playerText.classList.add("mark-×");
    }

    turnText.textContent = turn;
    playerText.textContent = playerName;

    cells.forEach(cell => {
        const index = parseInt(cell.dataset.index);
        const markSpan = cell.querySelector(".mark");
        cell.classList.remove("mark-○", "mark-×", "mark-old");

        if (cellArray[index] === 1) {
            markSpan.textContent = "○";
            cell.classList.add("mark-○");
        } else if (cellArray[index] === -1) {
            markSpan.textContent = "×";
            cell.classList.add("mark-×");
        } else {
            markSpan.textContent = "-";
        }

        //次のターン消えるマークの表示を切り替える。
        if (configMarkLimit === true) {
            if (markTurnArray[index] === turn - 6 && cellArray[index] !== 0) {
                cell.classList.add("mark-old");
            }
        }
    });
}

function judgeGame() {
    let winner = null

    for (const pattern of winPatterns) {
        const [a, b, c] = pattern;
        const judgeNum = cellArray[a] + cellArray[b] + cellArray[c]
        if (judgeNum === 3) {
            winner = "○"
            break
        } else if (judgeNum === -3) {
            winner = "×"
            break
        }
    }

    if (winner !== null) {
        underText.textContent = `ゲーム終了！ 勝者は『${winner}』です！`;
        gameEndFunc();
        return;
    }

    if (!cellArray.includes(0)) {
        underText.textContent = "引き分け！";
        gameEndFunc();
    }
}

function cellLifeSpan() {
    markTurnArray.forEach((value, index) => {
        if (value === turn - 7) {
            cellArray[index] = 0;
        }
    });
}

function gameEndFunc() {
    turnPlayer = 0;
    button.textContent = "もう一度"
    buttonConfig.classList.remove("hidden");
}

function addWinPattern() {
    let rand_a = Math.floor(Math.random() * 9);
    let rand_b = Math.floor(Math.random() * 9);
    let rand_c = Math.floor(Math.random() * 9);

    let newPattern = [rand_a, rand_b, rand_c];
    let isSuccess = true;

    //生成した勝利パターンに、マスの重複がないか、完全一致している勝利パターンが既に設定されていないかを探索する。
    if (new Set(newPattern).size === newPattern.length) {
        for (let i = 0; i < winPatterns.length; i++) {
            let sortedNew = [...newPattern].sort();
            if (sortedNew[0] === winPatterns[i][0] && sortedNew[1] === winPatterns[i][1] && sortedNew[2] === winPatterns[i][2]) {
                isSuccess = false;
                break;
            }
        }
    } else {
        isSuccess = false;
    }

    if (isSuccess === false) {
        addWinPattern()
    } else {
        winPatterns.push(newPattern)
    }
}

function showNewPattern() {
    const newPattern = winPatterns[8];

    document.querySelectorAll(".cell-newPattern").forEach((cell, index) => {
        const markSpan = cell.querySelector(".mark-newPattern");

        if (newPattern.includes(index)) {
            markSpan.textContent = "★";
            cell.classList.add("mark-star");
        } else {
            markSpan.textContent = "-";
            cell.classList.remove("mark-star");
        }
    });
}

function changeRuleText() {
    configMarkLimit = document.querySelector('input[name="config-MarkLimit"]:checked').value === "true";
    configAddWinPattern = document.querySelector('input[name="config-AddWinPattern"]:checked').value === "true";
    configNPC = document.querySelector('input[name="config-NPC"]:checked').value === "true";
    let MarkLimitText = ""
    let WinPatternText = ""
    let npcText = ""

    if (configMarkLimit === false) {
        MarkLimitText = "・○と×のマークを交互に置き合って戦う、一般的な○×ゲームです。<br><br>"
    } else {
        MarkLimitText = "・同時に6つまでしかマークの置けない、特殊な○×ゲームです。7つ目のマークが置かれる時一番古いマークが消失します。<br><br>"
    }

    if (configAddWinPattern === false) {
        WinPatternText = "・縦・横・斜めに3つのマークを揃えたら勝ちです。<br><br>"
    } else {
        WinPatternText = "・縦・横・斜めに加え、その通りに置いたら勝利になるマスの組み合わせが1パターン追加されます。<br><br>"
    }

    if (configNPC === false) {
        npcText = "・プレイヤーとプレイヤーによるローカル対戦です。"
    } else {
        npcText = "・プレイヤーが×、NPCが○を担当します。"
    }

    ruleText.innerHTML = `${MarkLimitText}${WinPatternText}${npcText}`;
}
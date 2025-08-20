let cellArray = Array(9).fill(0);
let markTurnArray = Array(9).fill(0);
let turn = 0;
let turnPlayer = 0;

let underText = document.getElementById("underText");
let turnText = document.getElementById("turnText");
let playerText = document.getElementById("playerText");
const button = document.getElementById("button");

button.addEventListener("click", StartGame);

document.querySelectorAll(".cell").forEach(cell => {
    cell.addEventListener("click", MarkCell);
});

function StartGame() {
    cellArray.fill(0);
    markTurnArray.fill(0);
    turn = 1;
    button.textContent = "リセット"
    underText.textContent = null

    turnPlayer = Math.floor(Math.random() * 2);
    if (turnPlayer === 0) {
        turnPlayer -= 1;
    }

    updateText();
}

function MarkCell(event) {
    if (turnPlayer === 0) {
        return;
    }

    const cell = event.currentTarget;
    const index = parseInt(cell.dataset.index);

    if (cellArray[index] !== 0) {
        return;
    }

    cellArray[index] = turnPlayer;
    markTurnArray[index] = turn;
    turn += 1;

    if (turnPlayer === 1) {
        turnPlayer = -1;
    } else {
        turnPlayer = 1;
    }

    cellLifeSpan();
    updateText();
    judgeGame();
}

function updateText() {
    const cells = document.querySelectorAll(".cell");
    let playerName = "null"

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

        if (markTurnArray[index] === turn - 6 && cellArray[index] !== 0) {
            cell.classList.add("mark-old");
        }
    });
}

function judgeGame() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // 横
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // 縦
        [0, 4, 8], [2, 4, 6]           // 斜め
    ];

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
        underText.textContent = `ゲーム終了！ 勝者は『${winner}』です！`
        turnPlayer = 0;
        button.textContent = "もう一度"
        return;
    }

    if (!cellArray.includes(0)) {
        underText.textContent = "引き分け！";
        turnPlayer = 0;
        button.textContent = "もう一度"
    }
}

function cellLifeSpan() {
    markTurnArray.forEach((value, index) => {
        if (value === turn - 7) {
            cellArray[index] = 0;
        }
    });
}
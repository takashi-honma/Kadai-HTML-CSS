function evaluateBoard(board) {
    for (const pattern of winPatterns) {
        const [a, b, c] = pattern;
        const line = [board[a], board[b], board[c]];
        const sum = board[a] + board[b] + board[c];
        if (sum === 3) {
            return +10;
        } else if (sum === -3) {
            return -10;
        }

        if (line.filter(v => v === -1).length === 2 && line.includes(0)) {
            return -3;
        }
    }
    return 0;
}

function minimax(board, markTurn, depth, isMaximizing) {
    const score = evaluateBoard(board);
    if (score === 10 || score === -10 || !board.includes(0) || depth > MAX_DEPTH) {
        return score;
    }

    const virtualTurn = turn + depth;

    if (isMaximizing === true) {
        let best = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === 0) {
                const newBoard = [...board];
                const newMarkTurn = [...markTurn];

                newBoard[i] = 1;
                newMarkTurn[i] = virtualTurn;

                if (configMarkLimit === true) {
                    for (let j = 0; j < newBoard.length; j++) {
                        if (newMarkTurn[j] === virtualTurn - 7) {
                            newBoard[j] = 0;
                        }
                    }
                }

                const value = minimax(newBoard, newMarkTurn, depth + 1, false);
                best = Math.max(best, value);
            }
        }
        return best;
    } else {
        let best = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === 0) {
                const newBoard = [...board];
                const newMarkTurn = [...markTurn];

                newBoard[i] = -1;
                newMarkTurn[i] = virtualTurn;

                if (configMarkLimit === true) {
                    for (let j = 0; j < newBoard.length; j++) {
                        if (newMarkTurn[j] === virtualTurn - 7) {
                            newBoard[j] = 0;
                        }
                    }
                }

                const value = minimax(newBoard, newMarkTurn, depth + 1, true);
                best = Math.min(best, value);
            }
        }
        return best;
    }
}

function findBestMove(board, markTurnArrayOrigin) {
    let bestVal = -Infinity;
    let bestMove = -1;

    for (let i = 0; i < board.length; i++) {
        if (board[i] === 0) {
            const newBoard = [...board];
            const newMarkTurn = [...markTurnArrayOrigin];

            if (configMarkLimit === true) {
                for (let j = 0; j < newBoard.length; j++) {
                    if (newMarkTurn[j] === turn - 7) {
                        newBoard[j] = 0;
                    }
                }
            }

            newBoard[i] = 1; // AI（○）
            newMarkTurn[i] = turn;

            if(evaluateBoard(newBoard) === 10){
                return i;
            }

            let moveVal = minimax(newBoard, newMarkTurn, 1, false);

            if (i === 4) {
                moveVal += 1;
            }

            if (winPatterns.length > 8) {
                const [a, b, c] = winPatterns[8];

                if (i === a || i === b || i === c) {
                    moveVal += 1;
                }
            }

            if (moveVal > bestVal) {
                bestMove = i;
                bestVal = moveVal;
            }
        }
    }

    return bestMove;
}

function aiMove() {
    if (turnPlayer !== 1) {
        return;
    } // AIが○の場合のみ実行

    const bestMove = findBestMove([...cellArray], [...markTurnArray]);
    if (bestMove === -1) {
        return;
    }

    cellArray[bestMove] = turnPlayer;
    markTurnArray[bestMove] = turn;
    turn += 1;
    turnPlayer *= -1;

    if (configMarkLimit === true) {
        cellLifeSpan();
    }

    updateText();
    judgeGame();
}


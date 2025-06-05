const Game = function(gameBoard, playerOne, playerTwo) {
    let board = gameBoard;
    let p1 = playerOne;
    let p2 = playerTwo;
    let isPlayerOneTurn = true;
    // 0 -> player, 1 -> board full, 2 -> winner found
    let gameStatus = { status: 0, winningCells: null };

    const play = function(rowPosition, columnPosition) {
        if (gameStatus.status === 0) {
            let successful;

            if (isPlayerOneTurn) {
                successful = p1.move(rowPosition, columnPosition);
            } else {
                successful = p2.move(rowPosition, columnPosition);
            }

            gameStatus = board.checkForEnd();

            isPlayerOneTurn =
                    successful ? !isPlayerOneTurn : isPlayerOneTurn;

            let result = document.getElementById("result");

            switch (gameStatus.status) {
                case 0:
                    return GameCondition(false, Winner.NONE, null);
                case 1:
                    result.textContent = "Board is full! Draw!";
                    return GameCondition(true, Winner.NONE, null);
                case 2:
                    result.textContent = 
                        (isPlayerOneTurn ? playerTwoName : playerOneName)
                        + " wins!";
                    console.log(GameCondition(true, isPlayerOneTurn ? Winner.O : Winner.X, gameStatus.winningCells));
                    return GameCondition(
                        true,
                        isPlayerOneTurn ? Winner.O : Winner.X,
                        gameStatus.winningCells
                    );
            }
        }

        return null;
    };
    const getIsPlayerOneTurn = function() {
        return isPlayerOneTurn;
    };
    const reset = function () {
        isPlayerOneTurn = true;
        gameStatus = { status: 0, winningCells: null };
        gameBoard.reset();
    }

    return { play, gameBoard, getIsPlayerOneTurn, reset };
};

const GameCondition = function(isFull, winner, cells) {
    return { isFull, winner, cells };
};

const Winner = Object.freeze({
    X: "X",
    O: "O",
    NONE: ""
});

const GameBoard = function() {
    let board = [
        [" ", " ", " "],
        [" ", " ", " "],
        [" ", " ", " "]
    ];
    const updateBoard = function(piece, rowPosition, columnPosition) {
        if (rowPosition < 1 || rowPosition > 3) {
            return false;
        } else if (columnPosition < 1 || columnPosition > 3) {
            return false;
        } else if (board[rowPosition - 1][columnPosition - 1] !== " ") {
            return false;
        }
        
        board[rowPosition - 1][columnPosition - 1] = piece;
        return true;
    };
    const checkForEnd = function() {
        // 0 -> n/a, 1 -> board is full, 2 -> winner found

        for (let i = 0; i < board.length; i++) {
            if (
                board[i][0] !== " "
                    && board[i][0] === board[i][1]
                    && board[i][1] === board[i][2]
            ) {
                return { status: 2, winningCells: [ [i, 0], [i, 1], [i, 2] ] };
            } else if (
                board[0][i] !== " "
                    && board[0][i] === board[1][i]
                    && board[1][i] === board[2][i]
            ) {
                return { status: 2, winningCells: [ [0, i], [1, i], [2, i] ] };
            }
        }

        if (
            board[0][0] !== " "
                && board[0][0] === board[1][1]
                && board[1][1] === board[2][2]
        ) {
            return { status: 2, winningCells: [ [0, 0], [1, 1], [2, 2] ] }
        }

        if (
            board[0][2] !== " "
                && board[0][2] === board[1][1]
                && board[1][1] === board[2][0]
        ) {
            return { status: 2, winningCells: [ [0, 2], [1, 1], [2, 0] ] }
        }

        let isBoardFull = true;

        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                if (board[i][j] === " ") {
                    isBoardFull = false;
                    break;
                }
            }

            if (!isBoardFull) break;
        }

        if (isBoardFull) {
            return { status: 1, winningCells: null };
        }

        return { status: 0, winningCells: null };
    };
    const reset = function() {
        board = [
            [" ", " ", " "],
            [" ", " ", " "],
            [" ", " ", " "]
        ];
        document.getElementById("result").textContent = "";
    };

    return { updateBoard, checkForEnd, reset };
};

const Player = function(isPlayerOne, gameBoard) {
    // Change to allow players to choose their own pieces
    let piece = isPlayerOne ? "X" : "O";
    let board = gameBoard;
    const move = function(rowPosition, columnPosition) {
        let successful = board.updateBoard(piece, rowPosition, columnPosition)

        if (successful) {
            return true;
        }

        return false;
    };

    return { move };
};

const Display = function(game) {
    let board = document.getElementById("board");
    let createBoard = function() {
        while (board.firstChild) {
            board.removeChild(board.firstChild);
        }

        for (let i = 0; i < 3; i++) {
            let boardRow = document.createElement("row");
            boardRow.classList.add("board-row");

            for (let j = 0; j < 3; j++) {
                let boardCell = document.createElement("cell");
                boardCell.classList.add("board-cell");

                boardCell.addEventListener("click", function(e) {
                    let gameCondition = game.play(i + 1, j + 1);
                    console.log(gameCondition);
                    
                    if (gameCondition === null) return;

                    if (!game.getIsPlayerOneTurn()) {
                        e.target.textContent = "X";
                    } else {
                        e.target.textContent = "O";
                    }

                    if (gameCondition.winner !== Winner.NONE) {
                        highlightWinningCells(gameCondition.cells);
                    }
                });

                boardRow.appendChild(boardCell);
            }

            board.appendChild(boardRow);
        }
    };
    let reset = function() {
        for (let i = 0; i < board.children.length; i++) {
            for (let j = 0; j < board.children[i].children.length; j++) {
                let cell = board.children[i].children[j];
                cell.textContent = "";

                if (cell.classList.contains("winning-cell")) {
                    cell.classList.remove("winning-cell");
                }
            }
        }
    };
    let highlightWinningCells = function(cells) {
        // [[0, 0], [0, 1], [0, 2]]
        for (let i = 0; i < cells.length; i++) {
            board.children[cells[i][0]].children[cells[i][1]].classList.add("winning-cell");
        }
    };

    return { createBoard, reset };
};

function setPlayerNames(e, board, result, restartButton) {
    e.preventDefault();

    playerOneName = e.target.children[0].value;
    playerTwoName = e.target.children[1].value;

    if (playerOneName.trim() === "") {
        playerOneName = "Player 1";
    }

    if (playerTwoName.trim() === "") {
        playerTwoName = "Player 2";
    }

    e.target.classList.add("hidden");
    
    board.classList.remove("hidden");
    result.classList.remove("hidden");
    restartButton.classList.remove("hidden");
}

let playerOneName;
let playerTwoName;

document.addEventListener("DOMContentLoaded", function() {

    let gameBoard = GameBoard();
    let playerOne = Player(true, gameBoard);
    let playerTwo = Player(false, gameBoard);
    let game = Game(gameBoard, playerOne, playerTwo);
    let display = Display(game);
    display.createBoard();

    let restartButton = document.getElementById("button-restart");
    restartButton.addEventListener("click", function() {
        game.reset();
        display.reset();
    });

    let board = document.getElementById("board");
    let result = document.getElementById("result");

    let nameForm = document.getElementById("names");
    nameForm.addEventListener("submit", function (e) {
        setPlayerNames(e, board, result, restartButton);
    });
});

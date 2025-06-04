const Game = function(gameBoard, playerOne, playerTwo) {
    let board = gameBoard;
    let p1 = playerOne;
    let p2 = playerTwo;
    let isPlayerOneTurn = true;
    // 0 -> player, 1 -> board full, 2 -> winner found
    let gameStatus = 0;

    const play = function(rowPosition, columnPosition) {
        if (gameStatus === 0) {
            let successful;

            if (isPlayerOneTurn) {
                successful = p1.move(rowPosition, columnPosition);
            } else {
                successful = p2.move(rowPosition, columnPosition);
            }

            gameStatus = board.checkForEnd();

            isPlayerOneTurn =
                    successful ? !isPlayerOneTurn : isPlayerOneTurn;

            switch (gameStatus) {
                case 0:
                    return GameCondition(false, Winner.NONE);
                case 1:
                    console.log("Board is full! Draw!");
                    return GameCondition(true, Winner.NONE);
                case 2:
                    console.log(
                        "Player " + (isPlayerOneTurn ? "2" : "1") + " wins!"
                    );
                    return GameCondition(
                        true,
                        isPlayerOneTurn ? Winner.O : Winner.X
                    );
            }
        }

        // return GameCondition(true, isPlayerOneTurn ? Winner.X : Winner.O);
        return null;
    };
    const getIsPlayerOneTurn = function() {
        return isPlayerOneTurn;
    }

    return { play, gameBoard, getIsPlayerOneTurn };
};

const GameCondition = function(isFull, winner) {
    return { isFull, winner };
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
            console.log("Row position out of bounds (must be between 1 and 3)");
            return false;
        } else if (columnPosition < 1 || columnPosition > 3) {
            console.log(
                    "Column position out of bounds (must be between 1 and 3)"
            );
            return false;
        } else if (board[rowPosition - 1][columnPosition - 1] !== " ") {
            console.log(
                    "Position ( " + rowPosition + ", " + columnPosition +
                    " ) is already occupied"
            );
            return false;
        }
        
        board[rowPosition - 1][columnPosition - 1] = piece;
        return true;
    };
    const displayBoard = function() {
        for (let i = 0; i < board.length; i++) {
            let row = "";

            for (let j = 0; j < board[i].length; j++) {
                row += " " + board[i][j];

                if (j != board[i].length - 1) row += " |"
            }

            console.log(row);
            
            if (i != board.length - 1) console.log("-----------");
        }
    };
    const checkForEnd = function() {
        // 0 -> n/a, 1 -> board is full, 2 -> winner found

        let isBoardFull = true;

        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                if (board[i][j] === " ") {
                    isBoardFull = false;
                    break;
                }
            }
        }

        if (
            board[0][0] !== " "
                && board[0][0] == board[0][1]
                && board[0][1] == board[0][2]
            || board[1][0] !== " "
                && board[1][0] == board[1][1]
                && board[1][1] == board[1][2]
            || board[2][0] !== " "
                && board[2][0] == board[2][1]
                && board[2][1] == board[2][2]
            || board[0][0] !== " "
                && board[0][0] == board[1][0]
                && board[1][0] == board[2][0]
            || board[0][1] !== " "
                && board[0][1] == board[1][1]
                && board[1][1] == board[2][1]
            || board[0][2] !== " "
                && board[0][2] == board[1][2]
                && board[1][2] == board[2][2]
            || board[0][0] !== " "
                && board[0][0] == board[1][1]
                && board[1][1] == board[2][2]
            || board[0][2] !== " "
                && board[0][2] == board[1][1]
                && board[1][1] == board[2][0]
        ) {
            return 2;
        } else if (isBoardFull) {
            return 1;
        }

        return 0;
    }

    return { updateBoard, displayBoard, checkForEnd };
};

const Player = function(isPlayerOne, gameBoard) {
    // Change to allow players to choose their own pieces
    let piece = isPlayerOne ? "X" : "O";
    let board = gameBoard;
    const move = function(rowPosition, columnPosition) {
        let successful = board.updateBoard(piece, rowPosition, columnPosition)

        if (successful) {
            board.displayBoard();
            return true;
        }

        return false;
    };

    return { move };
};

const Display = function(game) {
    let createBoard = function() {
        let board = document.getElementById("board");
        
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
                });

                boardRow.appendChild(boardCell);
            }

            board.appendChild(boardRow);
        }
    };

    return { createBoard };
};

document.addEventListener("DOMContentLoaded", function() {
    let gameBoard = GameBoard();
    let playerOne = Player(true, gameBoard);
    let playerTwo = Player(false, gameBoard);
    let game = Game(gameBoard, playerOne, playerTwo);
    let display = Display(game);
    display.createBoard();
});

let userInterface = (function UI() {
    let createBoard = function (board) {
        let container = document.getElementById("board");

        for (let i = 0; i < board.length; i++) {
            let row = document.createElement("div");
            row.classList.add("board-row");

            for (let j = 0; j < board.length; j++) {
                let cell = document.createElement("div");
                cell.classList.add("board-cell");

                row.appendChild(cell);
            }

            container.appendChild(row);
        }
    };

    let updateBoard = function (board) {
        let container = document.getElementById("board");

        for (let i = 0; i < board.length; i++) {
            let row = container.children[i];

            for (let j = 0; j < board[i].length; j++) {
                let cell = row.children[j];
                cell.textContent = board[i][j];
            }
        }
    }

    return { createBoard, updateBoard };
})();

function DOM(game, board, container) {
    let gameController = game;
    let gameBoard = board;
    let displayBoard = container;

    console.log(gameBoard);
    console.log(displayBoard);
    console.log(gameController);

    let addCellEvents = function () {
        for (let i = 0; i < displayBoard.children.length; i++) {
            let displayRow = displayBoard.getElementsByClassName("board-row");

            for (let j = 0; j < displayRow[i].children.length; j++) {
                let cell = displayRow[i].getElementsByClassName("board-cell")[j];

                cell.addEventListener("click", function () {
                    switch (i) {
                        case 0:
                            gameController.play(j + 1);
                            break;
                        case 1:
                            gameController.play(3 + j + 1);
                            break;
                        case 2:
                            gameController.play(6 + j + 1);
                            break;
                    }
                });
            }
        }
    }

    return { addCellEvents };
};

let gameBoard = (function GameBoard() {
    let board = [
        ["", "", ""],
        ["", "", ""],
        ["", "", ""]
    ];
    let fill = function(piece, tileNumber) {
        let row = Math.ceil(tileNumber / this.getBoard()[0].length);
        let column = ((tileNumber + 2) % 3) + 1;

        if (tileNumber < 1 || tileNumber > 9) {
            return 2;
        } else if (this.getBoard()[row - 1][column - 1] !== "") {
            return 1;
        } else {
            this.getBoard()[row - 1][column - 1] = piece;
            return 0
        }
    };
    let getBoard = function() {
        return board;
    };

    // return { board, fill, getBoard };
    return { fill, getBoard };
})();

function Player(playerPiece) {
    let piece = playerPiece;
    let move = function(tileNumber) {
        return { piece, tileNumber };
    };

    return { move };
}

const pieces = Object.freeze({
    X: "X",
    O: "O"
});

let game;

document.addEventListener("DOMContentLoaded", function (e) {    
    game = (function Game() {
        // Allow players to choose their piece
        let playerOne = Player(pieces["X"]);
        let playerTwo = Player(pieces["O"]);
        let board = gameBoard;
        let ui = userInterface;

        let finished = false;
        let playerOneTurn = true;
        let winner;

        ui.createBoard(board.getBoard());
        ui.updateBoard(board.getBoard());

        let play = function(tileNumber) {
            let move;

            if (playerOneTurn) {
                move = playerOne.move(tileNumber);
            } else {
                move = playerTwo.move(tileNumber);
            }

            switch (board.fill(move.piece, move.tileNumber)) {
                case 0:
                    ui.updateBoard(board.getBoard());
                    playerOneTurn = !playerOneTurn;
                    break;
                case 1:
                    console.log("Invalid move (cell is occupied)");
                    break;
                case 2:
                    console.log(
                        "Invalid move (tile number must be between 1 and 9)"
                    );
                    break;

            }
        };

        return { play, board };
    })();

    let container = document.getElementById("board");
    let dom = DOM(game, game.board.getBoard(), container);
    dom.addCellEvents();
});

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
    this.gameController = game;
    this.gameBoard = board;
    this.displayBoard = container;

    console.log(this.gameController);
    console.log(this.gameBoard);
    console.log(this.displayBoard);

    this.addCellEvents = function (game, gameController) {
        console.log("ok");
        for (let i = 0; i < this.displayBoard.children.length; i++) {
            let displayRow = this.displayBoard.getElementsByClassName("board-row");

            for (let j = 0; j < displayRow[i].children.length; j++) {
                let cell = displayRow[i].getElementsByClassName("board-cell")[j];

                cell.addEventListener("click", function () {
                    switch (i) {
                        case 0:
                            gameController.play(
                                j + 1,
                                game.playerOne,
                                game.playerTwo,
                                game.ui
                            );
                            break;
                        case 1:
                            gameController.play(
                                3 + j + 1,
                                game.playerOne,
                                game.playerTwo,
                                game.ui
                            );
                            break;
                        case 2:
                            gameController.play(
                                6 + j + 1,
                                game.playerOne,
                                game.playerTwo,
                                game.ui
                            );
                            break;
                    }
                });
            }
        }
    };
    this.displayWinner = function(isDraw, isPlayerOne) {
        if (isDraw) {

        } else {
            if (isPlayerOne) {

            } else {

            }
        }
    };

    return {
        gameController: this.gameController,
        gameBoard: this.gameBoard,
        displayBoard: this.displayBoard,
        addCellEvents: this.addCellEvents,
        displayWinner: this.displayWinner
    };
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

// let game;

document.addEventListener("DOMContentLoaded", function (e) {    
    function Game() {
        // Allow players to choose their piece
        this.playerOne = Player(pieces["X"]);
        this.playerTwo = Player(pieces["O"]);
        this.board = gameBoard;
        this.ui = userInterface;
        // let container = document.getElementById("board");
        // this.dom = new DOM(this, board.getBoard(), container);
        // this.dom.addCellEvents();

        this.finished = false;
        this.playerOneTurn = true;

        this.ui.createBoard(this.board.getBoard());
        this.ui.updateBoard(this.board.getBoard());

        this.play = function(tileNumber, playerOne, playerTwo, ui) {
            if (this.isWinner() === 0) {
                let move;

                if (this.playerOneTurn) {
                    move = playerOne.move(tileNumber);
                } else {
                    move = playerTwo.move(tileNumber);
                }

                switch (this.board.fill(move.piece, move.tileNumber)) {
                    case 0:
                        ui.updateBoard(this.board.getBoard());
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

                let result = this.isWinner();

                switch (result) {
                    case 0:
                        this.playerOneTurn = !this.playerOneTurn;
                        break;
                    case 1:
                        break;
                    case 2:
                        break;
                }
            }
        };
        this.isWinner = function() {
            let winnerFound =
                    // via top row
                    this.board.getBoard()[0][0] !== "" 
                        && this.board.getBoard()[0][0] === this.board.getBoard()[0][1]
                        && this.board.getBoard()[0][1] === this.board.getBoard()[0][2]
                    // via middle row
                    || this.board.getBoard()[1][0] !== "" 
                        && this.board.getBoard()[1][0] === this.board.getBoard()[1][1]
                        && this.board.getBoard()[1][1] === this.board.getBoard()[1][2]
                    // via bottom row
                    || this.board.getBoard()[2][0] !== "" 
                        && this.board.getBoard()[2][0] === this.board.getBoard()[2][1]
                        && this.board.getBoard()[2][1] === this.board.getBoard()[2][2]
                    // via left column
                    || this.board.getBoard()[0][0] !== "" 
                        && this.board.getBoard()[0][0] === this.board.getBoard()[1][0]
                        && this.board.getBoard()[1][0] === this.board.getBoard()[2][0]
                    // via center column
                    || this.board.getBoard()[0][1] !== "" 
                        && this.board.getBoard()[0][1] === this.board.getBoard()[1][1]
                        && this.board.getBoard()[1][1] === this.board.getBoard()[2][1]
                    // via right column
                    || this.board.getBoard()[0][2] !== "" 
                        && this.board.getBoard()[0][2] === this.board.getBoard()[1][2]
                        && this.board.getBoard()[1][2] === this.board.getBoard()[2][2]
                    // via top left to bottom right diagonal
                    || this.board.getBoard()[0][0] !== "" 
                        && this.board.getBoard()[0][0] === this.board.getBoard()[1][1]
                        && this.board.getBoard()[1][1] === this.board.getBoard()[2][2]
                    // via top right to bottom left diagonal
                    || this.board.getBoard()[0][2] !== "" 
                        && this.board.getBoard()[0][2] === this.board.getBoard()[1][1]
                        && this.board.getBoard()[1][1] === this.board.getBoard()[2][0];

            let boardFull = true;

            for (let i = 0; i < this.board.getBoard().length; i++) {
                for (let j = 0; j < this.board.getBoard()[i].length; j++) {
                    if (this.board.getBoard()[i][j] === "") {
                        boardFull = false;
                        break;
                    }
                }
            }

            // 0 -> continue, 1 -> winner, 2 -> board full
            if (!winnerFound && boardFull) {
                return 2;
            } else if (winnerFound) {
                return 1;
            } else {
                return 0;
            }
        }

        return {
            play: this.play,
            board: this.board,
            isWinner: this.isWinner,
            playerOne: this.playerOne,
            playerTwo: this.playerTwo,
            ui: this.ui
        };
    };
    let game = new Game();
    let container = document.getElementById("board");

    console.log(game.playerOne);
    console.log(game.playerTwo);
    
    // let dom = DOM(game, game.board.getBoard(), container);
    game.dom = new DOM(game, game.board.getBoard(), container);
    game.dom.addCellEvents(game, game.dom.gameController);
});

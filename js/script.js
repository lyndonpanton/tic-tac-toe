let gameBoard = (function GameBoard() {
    this.board = [
        ["", "", ""],
        ["", "", ""],
        ["", "", ""]
    ];
    this.fill = function(piece, tileNumber) {
        let row = Math.ceil(tileNumber / this.board[0].length);
        let column = ((tileNumber + 2) % 3) + 1;

        if (tileNumber < 1 || tileNumber > 9) {
            return 2;
        } else if (this.board[row - 1][column - 1] !== "") {
            return 1;
        } else {
            this.board[row - 1][column - 1] = piece;
            return 0
        }
    };
    this.display = function() {
        for (let i = 0; i < this.board; i++) {
            for (let j = 0; j < this.board[i]; j++) {
                console.log(this.board[i][j] + " ");
            }
        }
    }

    return { board, fill, display };
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

let game = (function Game() {
    // Allow players to choose their piece
    let playerOne = Player(pieces["X"]);
    let playerTwo = Player(pieces["O"]);
    let board = gameBoard;

    let finished = false;
    let playerOneTurn = true;
    let winner;

    let play = function(tileNumber) {
        let move;

        if (playerOneTurn) {
            move = playerOne.move(tileNumber);
        } else {
            move = playerTwo.move(tileNumber);
        }

        console.log(move);
        console.log(board.board);

        switch (board.fill(move.piece, move.tileNumber)) {
            case 0:
                board.display();
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

    return { play };
})();

document.addEventListener("DOMContentLoaded", function (e) {
    
});

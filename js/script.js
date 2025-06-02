let userInterface = (function UI() {
    let updateBoard = function (board) {
        let container = document.getElementById("board");

        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }

        for (let i = 0; i < board.length; i++) {
            let row = document.createElement("div");
            row.classList.add("board-row");

            for (let j = 0; j < board[i].length; j++) {
                let cell = document.createElement("div");
                cell.classList.add("board-cell");
                cell.textContent = board[i][j];

                row.appendChild(cell);
            }

            container.appendChild(row);
        }
    }

    return { updateBoard };
})();

let gameBoard = (function GameBoard() {
    let board = [
        ["", "", ""],
        ["", "", ""],
        ["", "", ""]
    ];
    let fill = function(piece, tileNumber) {
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
    let getBoard = function() {
        return board;
    }

    return { board, fill, getBoard };
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


document.addEventListener("DOMContentLoaded", function (e) {    
    let game = (function Game() {
        // Allow players to choose their piece
        let playerOne = Player(pieces["X"]);
        let playerTwo = Player(pieces["O"]);
        let board = gameBoard;
        let ui = userInterface;

        let finished = false;
        let playerOneTurn = true;
        let winner;

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

        return { play };
    })();
});

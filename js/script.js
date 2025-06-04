const Game = function(gameBoard, playerOne, playerTwo) {
    let board = gameBoard;
    let p1 = playerOne;
    let p2 = playerTwo;
    let isPlayerOneTurn = true;

    const play = function(rowPosition, columnPosition) {
        let successful;

        if (isPlayerOneTurn) {
            successful = p1.move(rowPosition, columnPosition);
        } else {
            successful = p2.move(rowPosition, columnPosition);
        }

        isPlayerOneTurn = successful ? !isPlayerOneTurn : isPlayerOneTurn;
    };

    return { play };
};

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

    return { updateBoard, displayBoard };
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

let gameBoard = GameBoard();
let playerOne = Player(true, gameBoard);
let playerTwo = Player(false, gameBoard);
let game = Game(gameBoard, playerOne, playerTwo);

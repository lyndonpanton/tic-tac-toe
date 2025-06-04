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

            switch (gameStatus) {
                case 0:
                    isPlayerOneTurn =
                            successful ? !isPlayerOneTurn : isPlayerOneTurn;
                    break;
                case 1:
                    console.log("Board is full! Draw!")
                    break;
                case 2:
                    console.log(
                        "Player " + (isPlayerOneTurn ? "1" : "2") + " wins!"
                    );
                    break;
            }
        }
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

let gameBoard = GameBoard();
let playerOne = Player(true, gameBoard);
let playerTwo = Player(false, gameBoard);
let game = Game(gameBoard, playerOne, playerTwo);

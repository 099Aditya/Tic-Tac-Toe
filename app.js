let boxes = document.querySelectorAll(".box");
let resetBtn = document.querySelector("#Reset");
let newGameBtn = document.querySelector("#new-btn");
let msgContainer = document.querySelector(".msg-container");
let msg = document.querySelector("#msg");

let currentPlayerIsO = false; // Player O (AI) starts

// Winning combinations
const winPatterns = [
    [0, 1, 2],
    [0, 3, 6],
    [0, 4, 8],
    [1, 4, 7],
    [2, 5, 8],
    [2, 4, 6],
    [3, 4, 5],
    [6, 7, 8],
];

const resetGame = () => {
    currentPlayerIsO = false; // Start with Player X
    enableBoxes();
    msgContainer.classList.add("hide");
    resetBtn.disabled = false; // Enable reset button when new game starts
};

const disableBoxes = () => {
    boxes.forEach((box) => box.disabled = true);
};

const enableBoxes = () => {
    boxes.forEach((box) => {
        box.disabled = false;
        box.innerText = "";
    });
};

const showWinner = (winner) => {
    msg.innerText = `🎉 Congratulations! Winner is ${winner}`;
    msgContainer.classList.remove("hide");
    disableBoxes();
    resetBtn.disabled = true; // Disable reset button after winner found
};

// Check winner in the board state (without UI)
const checkWinnerInBoard = (board) => {
    for (let pattern of winPatterns) {
        let [a, b, c] = pattern;
        if (board[a] && board[a] === board[b] && board[b] === board[c]) {
            return board[a];
        }
    }
    return null;
};

// Check for draw
const checkDraw = (board) => {
    return !board.includes(""); // If there's no empty box, it's a draw
};

// Minimax Algorithm for AI
const minimax = (board, depth, isMaximizing) => {
    let winner = checkWinnerInBoard(board);
    if (winner !== null) {
        return winner === "X" ? 1 : -1; // X is the computer, O is the player
    }

    if (board.indexOf("") === -1) return 0; // Draw

    if (isMaximizing) {
        let best = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === "") {
                board[i] = "X"; // AI plays X
                best = Math.max(best, minimax(board, depth + 1, false));
                board[i] = "";
            }
        }
        return best;
    } else {
        let best = Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === "") {
                board[i] = "O"; // Player plays O
                best = Math.min(best, minimax(board, depth + 1, true));
                board[i] = "";
            }
        }
        return best;
    }
};

const bestMove = (board) => {
    let bestVal = -Infinity;
    let move = -1;

    for (let i = 0; i < 9; i++) {
        if (board[i] === "") {
            board[i] = "X";
            let moveVal = minimax(board, 0, false);
            board[i] = "";
            if (moveVal > bestVal) {
                move = i;
                bestVal = moveVal;
            }
        }
    }

    return move;
};

// AI move (Computer's turn)
const computerMove = () => {
    let board = Array.from(boxes).map(box => box.innerText);
    let move = bestMove(board);
    boxes[move].innerText = "X";
    boxes[move].disabled = true;
    checkWinner();
    currentPlayerIsO = false; // Change turn to player
};

// Player move
boxes.forEach((box, index) => {
    box.addEventListener("click", () => {
        if (box.innerText !== "" || currentPlayerIsO) return; // If box is already filled or it's the computer's turn, do nothing

        box.innerText = "O"; // Player O plays
        box.disabled = true;

        // Check if the player has won
        checkWinner();

        // If the player hasn't won, it's the computer's turn
        if (!currentPlayerIsO) {
            currentPlayerIsO = true;
            setTimeout(computerMove, 500); // AI moves after 500ms
        }
    });
});

// Check for winner after every move
const checkWinner = () => {
    let board = Array.from(boxes).map(box => box.innerText);
    let winner = checkWinnerInBoard(board);
    if (winner) {
        showWinner(winner);
        return;
    }

    if (checkDraw(board)) {
        msg.innerText = "It's a Draw!";
        msgContainer.classList.remove("hide");
        disableBoxes();
        resetBtn.disabled = true;
        return;
    }
};

// New game button click
newGameBtn.addEventListener("click", resetGame);

// Reset button click
resetBtn.addEventListener("click", resetGame);
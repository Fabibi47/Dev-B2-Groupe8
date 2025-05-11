let board = document.querySelector(".board");
let tour = document.querySelector(".tour");
let banner = document.querySelector(".banner");

let currentBoard = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""]
];

let myTurn = true; // true for player 1, false for player 2
let playerSymbol = "X"; // Player 1 is X, Player 2 is O
let winner = null;

const socket = new WebSocket("ws://localhost:8080");

socket.addEventListener("open", () => {
    console.log("WebSocket connection established");
});

socket.addEventListener("message", (event) => {
    const data = JSON.parse(event.data);

    if (data.type === "init") {
        playerSymbol = data.symbol;
        myTurn = data.turn;
        tour.innerHTML = myTurn ? "C'est votre tour !" : "En attente de l'adversaire...";
    }

    if (data.type === "move") {
        UpdateBoard(data.board);
        if (data.winner) {
            winner = data.winner;
            banner.innerHTML = winner === playerSymbol ? "Vous avez gagné !" : "Vous avez perdu !";
            banner.classList.add("out");
            myTurn = false;
            tour.innerHTML = "Fin du jeu !";
        } else if (data.draw) {
            banner.innerHTML = "Match nul !";
            banner.classList.add("out");
            myTurn = false;
            tour.innerHTML = "Fin du jeu !";
        }
    }
});

// Override cell click to send move to server
board.addEventListener("click", function (event) {
    if (!myTurn) return;
    if (event.target.classList.contains("cell")) {
        let row = event.target.getAttribute("data-row");
        let col = event.target.getAttribute("data-col");
        if (currentBoard[row][col] === "") {
            socket.send(JSON.stringify({
                type: "move",
                row: Number(row),
                col: Number(col),
                symbol: playerSymbol
            }));
            // Do NOT update myTurn or UI here; wait for server response to update state
        }
    }
});

function CreateBoard() {
    // Crée le tableau
    for (let i = 0; i < 3; i++) {
        let row = document.createElement("div");
        row.classList.add("row");
        for (let j = 0; j < 3; j++) {
            let cell = document.createElement("div");
            cell.classList.add("cell");
            cell.setAttribute("data-row", i);
            cell.setAttribute("data-col", j);
            cell.innerHTML = currentBoard[i][j];
            row.appendChild(cell);
        }
        board.appendChild(row);
    }
}

function UpdateCell(row, col, value) {
    // Met à jour la cellule
    let cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
    cell.innerHTML = value;
}

function UpdateBoard(newBoard) {
    // Met à jour le tableau
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            currentBoard[i][j] = newBoard[i][j];
            UpdateCell(i, j, newBoard[i][j]);
        }
    }
    // Only set myTurn and tour if the game is not over
    if (!winner) {
        myTurn = true;
        tour.innerHTML = "C'est votre tour !";
    }
}
function CheckWin() {
    // Vérifie si un joueur a gagné
    for (let i = 0; i < 3; i++) {
        if (currentBoard[i][0] === currentBoard[i][1] && currentBoard[i][1] === currentBoard[i][2] && currentBoard[i][0] !== "") {
            return currentBoard[i][0] == playerSymbol;
        }
        if (currentBoard[0][i] === currentBoard[1][i] && currentBoard[1][i] === currentBoard[2][i] && currentBoard[0][i] !== "") {
            return currentBoard[0][i] == playerSymbol;
        }
    }
    if (currentBoard[0][0] === currentBoard[1][1] && currentBoard[1][1] === currentBoard[2][2] && currentBoard[0][0] !== "") {
        return currentBoard[0][0] == playerSymbol;
    }
    if (currentBoard[0][2] === currentBoard[1][1] && currentBoard[1][1] === currentBoard[2][0] && currentBoard[0][2] !== "") {
        return currentBoard[0][2] == playerSymbol;
    }
    return null;
}

function CheckDraw() {
    // Vérifie si le jeu est un match nul
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (currentBoard[i][j] === "") {
                return false;
            }
        }
    }
    return true;
}

// (Removed duplicate local click event handler. All moves are now handled via WebSocket.)

CreateBoard();
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
    myTurn = true; // Change le tour
    tour.innerHTML = "C'est votre tour !";
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

// On click event for cells
board.addEventListener("click", function (event) {
    if (!myTurn) return; // Only allow if it's the player's turn
    if (event.target.classList.contains("cell")) {
        let row = event.target.getAttribute("data-row");
        let col = event.target.getAttribute("data-col");
        if (currentBoard[row][col] === "") {
            currentBoard[row][col] = playerSymbol; // Use the player's symbol
            UpdateCell(row, col, playerSymbol);
            if (CheckWin()) {
                winner = playerSymbol;
                banner.innerHTML = "Vous avez gagné !";
                banner.classList.add("out");
                myTurn = false; // End player's turn
                tour.innerHTML = "Fin du jeu !";
            }
            if (CheckDraw() && !winner) {
                banner.innerHTML = "Match nul !";
                banner.classList.add("out");
                myTurn = false; // End player's turn
                tour.innerHTML = "Fin du jeu !";
            }
        }
    }
    myTurn = false; // End player's turn
    tour.innerHTML = "En attente de l'adversaire...";
});

CreateBoard();
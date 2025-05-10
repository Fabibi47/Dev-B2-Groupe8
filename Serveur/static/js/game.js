let board = document.querySelector(".board");
let cells = document.querySelectorAll(".cell");

let boardState = [
    ["X", "O", "X"],
    ["O", "X", "O"],
    ["X", "O", "X"]
]

function createBoard() {
    for (let i = 0; i < 3; i++) {
        let row = document.createElement("div");
        row.classList.add("row");
        board.appendChild(row);
        for (let j = 0; j < 3; j++) {
            let cell = document.createElement("div");
            cell.classList.add("cell");
            cell.setAttribute("data-index", i * 3 + j);
            row.appendChild(cell);
        }
    }
}

function drawBoard() {
    cells.forEach((cell, index) => {
        cell.innerText = boardState[Math.floor(index / 3)][index % 3];
    });
}


createBoard();
drawBoard();

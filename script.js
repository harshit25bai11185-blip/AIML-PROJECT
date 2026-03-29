const gridContainer = document.getElementById('grid-container');

const rows = 10;
const cols = 10;

const startRow = 0;
const startCol = 0;
const targetRow = 9;
const targetCol = 9;

function createGrid() {
    gridContainer.innerHTML = '';

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');

            cell.dataset.row = r;
            cell.dataset.col = c;
            cell.id = `cell-${r}-${c}`;
            
            if (r === startRow && c === startCol) {
                cell.classList.add('start');
            } else if (r === targetRow && c === targetCol) {
                cell.classList.add('target');
            }

            cell.addEventListener('click', () => toggleObstacle(cell, r, c));

            gridContainer.appendChild(cell);
        }
    }
}


function toggleObstacle(cell, r, c) {
    if((r === startRow && c === startCol) || (r === targetRow && c === targetCol)) {
        return;
    }

    cell.classList.toggle('obstacle');
}

createGrid();
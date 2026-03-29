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
            // Create a new div for each cell
            const cell = document.createElement('div');
            cell.classList.add('cell');
            
            // Store the row and column in the HTML so we can find it later
            cell.dataset.row = r;
            cell.dataset.col = c;
            cell.id = `cell-${r}-${c}`; // Give it a unique ID

            // Assign the start and target classes
            if (r === startRow && c === startCol) {
                cell.classList.add('start');
            } else if (r === targetRow && c === targetCol) {
                cell.classList.add('target');
            }

            // Add a click listener so we can draw obstacles
            cell.addEventListener('click', () => toggleObstacle(cell, r, c));

            // Add the cell to the grid container
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
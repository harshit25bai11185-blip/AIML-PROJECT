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

        cell.classList.toggle('obstacle');
    }
}

createGrid();

// Grab the start button
const startBtn = document.getElementById('start-btn');

// Directions the robot can move: Up, Down, Left, Right
const directions = [
    [-1, 0], // Up
    [1, 0],  // Down
    [0, -1], // Left
    [0, 1]   // Right
];

function findPath() {
    // 1. Setup the Queue, Visited tracking, and Parent Map (to remember the path)
    let queue = [[startRow, startCol]]; 
    let visited = new Set([`${startRow},${startCol}`]);
    let parentMap = new Map(); // Remembers "how we got to a cell"
    let found = false;

    // 2. The BFS Loop
    while (queue.length > 0) {
        let [r, c] = queue.shift(); // Get the next cell in line

        // Check if we reached the target!
        if (r === targetRow && c === targetCol) {
            found = true;
            break;
        }

        // Color the cell to show the algorithm visited it (skip the start cell)
        if (!(r === startRow && c === startCol)) {
            document.getElementById(`cell-${r}-${c}`).classList.add('visited');
        }

        // 3. Check all 4 neighbors
        for (let [dr, dc] of directions) {
            let newR = r + dr;
            let newC = c + dc;
            let posKey = `${newR},${newC}`;

            // Check if neighbor is inside the grid
            if (newR >= 0 && newR < rows && newC >= 0 && newC < cols) {
                let neighborCell = document.getElementById(`cell-${newR}-${newC}`);
                
                // Check if it's NOT a wall and NOT already visited
                if (!neighborCell.classList.contains('obstacle') && !visited.has(posKey)) {
                    visited.add(posKey);
                    parentMap.set(posKey, `${r},${c}`); // Record where we came from
                    queue.push([newR, newC]);
                }
            }
        }
    }

    // 4. Draw the final path if we found the target
    if (found) {
        drawPath(parentMap);
    } else {
        alert("No path found! The target is blocked.");
    }
}

function drawPath(parentMap) {
    let curr = `${targetRow},${targetCol}`;
    
    // Work backwards from target to start
    while (curr !== `${startRow},${startCol}`) {
        curr = parentMap.get(curr);
        
        // Don't color the start cell yellow
        if (curr !== `${startRow},${startCol}`) {
            let [r, c] = curr.split(',');
            document.getElementById(`cell-${r}-${c}`).classList.add('path');
        }
    }
}

// Hook up the button to the function
startBtn.addEventListener('click', findPath);

// Grab the new HTML elements
const resetBtn = document.getElementById('reset-btn');
const layoutSelect = document.getElementById('layout-select');

// Define our warehouse layouts (pairs of [row, col] representing shelves)
const layouts = {
    empty: [], // No obstacles
    aisles: [
        // Three vertical aisles
        [1,2],[2,3],[3,2],[4,2],[6,2],[7,2],[8,2],
        [1,5],[2,5],[3,5],[4,5],[6,5],[7,5],[8,5],
        [1,8],[2,7],[3,7],[4,7],[6,7],[7,7],[8,8],[9,8]
    ],
    maze: [
        // A tricky path to navigate
        [1,1],[1,2],[1,3],[1,5],[1,6],[1,7],[1,8],
        [3,1],[3,3],[3,4],[3,5],[3,8],
        [5,1],[5,2],[5,3],[5,5],[5,6],[5,7],
        [7,3],[7,4],[7,5],[7,6],[7,8],
        [8,1],[8,2],[8,8],[9,1]
    ]
};

// Function to wipe the board clean
function resetGrid() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            let cell = document.getElementById(`cell-${r}-${c}`);
            // Remove everything except start and target
            cell.classList.remove('obstacle', 'visited', 'path');
        }
    }
}

// Function to load a specific design
function loadLayout() {
    resetGrid(); // Clear the board first
    
    const selectedDesign = layoutSelect.value;
    const obstaclesToDraw = layouts[selectedDesign];

    // Draw the new shelves
    for (let [r, c] of obstaclesToDraw) {
        document.getElementById(`cell-${r}-${c}`).classList.add('obstacle');
    }
}

// Hook up the buttons and dropdown
resetBtn.addEventListener('click', resetGrid);
layoutSelect.addEventListener('change', loadLayout);
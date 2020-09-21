import './scss/index.scss';

import { Engine, Render, Runner, World, Bodies } from 'matter-js';

// Constants
const width: number = 600;
const height: number = 600;
const wallWidth: number = 40;
const cells = 3;

// Create engine and world object.
const engine = Engine.create();
const { world } = engine;

// Create render object to show content on the screen.
const render = Render.create({
	element: document.body,
	engine: engine,
	options: {
		width: width,
		height: height,
		// Shows shapes with color
		wireframes: false
	}
});

// Draw Content to screen.
Render.run(render);
Runner.run(Runner.create(), engine);

// Add mouse functionality to the world. Allows user to drag shapes on the canvas.
// World.add(
// 	world,
// 	MouseConstraint.create(engine, {
// 		mouse: Mouse.create(render.canvas)
// 	})
// );

// Wall objects stored in an array.
const walls = [
	// Top Wall
	Bodies.rectangle(width / 2, 0, width, wallWidth, { isStatic: true }),
	// Bottom Wall
	Bodies.rectangle(width / 2, height, width, wallWidth, { isStatic: true }),
	// Left Wall
	Bodies.rectangle(0, height / 2, wallWidth, height, { isStatic: true }),
	// Right Wall
	Bodies.rectangle(width, height / 2, wallWidth, height, { isStatic: true })
];

// Add walls to world
World.add(world, walls);

/*
 --MAZE GENERATION--
 Grid is a 2d array with all values initialized to false. After visiting 
 a cell on the grid, the value will change to true. We pick a random starting point
 and randomly pick a neighbor to visit.
*/
// Init a 3x3 Grid with every value initialized to false.
/*
  Steps
  1. Init an array of size 3,
  2. Fill array with null values,
  3. For each null value, return an array of length 3 with false values.
  4. Create 2d array to track horizontal and vertical walls.
*/
const grid: boolean[][] = Array(cells)
	.fill(null)
	.map(() => Array(cells).fill(false));

// Init verticals array.
const verticals = Array(cells).fill(null).map(() => Array(cells - 1).fill(false));
// Init horizontals array.
const horizontals = Array(cells - 1).fill(null).map(() => Array(cells).fill(false));

console.log('grid', grid);
console.log('verticals', verticals);
console.log('horizontals', horizontals);

// Shuffle Method
// takes an array and reorders elements inside of it
const shuffle = (arr: [number, number, string][]) => {
	let counter: number = arr.length;

	while (counter > 0) {
		const index = Math.floor(Math.random() * counter);

		counter--;

		const temp = arr[counter];
		arr[counter] = arr[index];
		arr[index] = temp;
	}

	return arr;
};

// Pick random starting point
const startRow = Math.floor(Math.random() * cells);
const startColumn = Math.floor(Math.random() * cells);

const stepThroughCell = (row: number, column: number) => {
	// If i have visited the cell at [row,column], then return.
	if (grid[row][column]) {
		return;
	}
	// Mark this cell as being visited.
	grid[row][column] = true;
	// Generate list of neighbors up, right, down, left
	const neighbors = shuffle([
		[ row - 1, column, 'up' ],
		[ row, column + 1, 'right' ],
		[ row + 1, column, 'down' ],
		[ row, column - 1, 'left' ]
	]);
	// console.log(neighbors);

	// For each neighbor...
	for (let neighbor of neighbors) {
		const [ nextRow, nextColumn, direction ] = neighbor;
		// See if neighbor is out of bounds
		if (nextRow < 0 || nextRow >= cells || nextColumn < 0 || nextColumn >= cells) {
			continue;
		}
		// If we have visited that neighbor, continue to next neighbor
		if (grid[nextRow][nextColumn]) {
			continue;
		}

		// Remove a wall from either horizontals or verticals
		if (direction === 'left') {
			verticals[row][column - 1] = true;
		} else if (direction === 'right') {
			verticals[row][column] = true;
		} else if (direction === 'up') {
			horizontals[row - 1][column] = true;
		} else if (direction === 'down') {
			horizontals[row][column] = true;
		}

		// Recurse the next cell to ensure we walk through the entire maze.
		stepThroughCell(nextRow, nextColumn);
	}
};

stepThroughCell(startRow, startColumn);
console.log(verticals, horizontals);

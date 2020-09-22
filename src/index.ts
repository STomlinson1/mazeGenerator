import './scss/index.scss';

import { Engine, Render, Runner, World, Bodies, Body, Events } from 'matter-js';

//DOM elements
const canvas: HTMLCanvasElement = document.getElementById(
	'world'
) as HTMLCanvasElement;

// Constants
const width: number = window.innerWidth;
const height: number = window.innerHeight;
const wallWidth: number = 2;

// The number of rows
const cellsHorizontal: number = 12;
// The number of columns
const cellsVertical: number = 10;

const unitLengthX: number = width / cellsHorizontal;
const unitLengthY: number = height / cellsVertical;

// Create engine and world object.
const engine = Engine.create();
// Disable gravity
engine.world.gravity.y = 0;
const { world } = engine;

// Create render object to show content on the screen.
const render = Render.create({
	canvas: canvas,
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
  1. Init an array of size N,
  2. Fill array with null values,
  3. For each null value, return an array of length N with false values.
  4. Create 2d array to track horizontal and vertical walls.
*/
const grid: boolean[][] = Array(cellsVertical)
	.fill(null)
	.map(() => Array(cellsHorizontal).fill(false));

// Init verticals array.
const verticals = Array(cellsVertical)
	.fill(null)
	.map(() => Array(cellsHorizontal - 1).fill(false));
// Init horizontals array.
const horizontals = Array(cellsVertical - 1)
	.fill(null)
	.map(() => Array(cellsHorizontal).fill(false));

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
const startRow = Math.floor(Math.random() * cellsVertical);
const startColumn = Math.floor(Math.random() * cellsHorizontal);

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
		if (
			nextRow < 0 ||
			nextRow >= cellsVertical ||
			nextColumn < 0 ||
			nextColumn >= cellsHorizontal
		) {
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

// Iterate over the verticals and horizontals array and draw walls to the canvas
horizontals.forEach((row, rowIndex) => {
	row.forEach((open, columnIndex) => {
		if (open) {
			return;
		}

		// Calulations for walls
		const wall = Bodies.rectangle(
			columnIndex * unitLengthX + unitLengthX / 2,
			rowIndex * unitLengthY + unitLengthY,
			unitLengthX,
			10,
			{
				isStatic: true,
				label: 'wall',
				render: {
					fillStyle: 'red'
				}
			}
		);

		World.add(world, wall);
	});
});

verticals.forEach((row, rowIndex) => {
	row.forEach((open, columnIndex) => {
		if (open) {
			return;
		}

		const wall = Bodies.rectangle(
			columnIndex * unitLengthX + unitLengthX,
			rowIndex * unitLengthY + unitLengthY / 2,
			10,
			unitLengthY,
			{
				isStatic: true,
				label: 'wall',
				render: {
					fillStyle: 'red'
				}
			}
		);
		World.add(world, wall);
	});
});

// Create goal
const goal = Bodies.rectangle(
	width - unitLengthX / 2,
	height - unitLengthY / 2,
	unitLengthX * 0.7,
	unitLengthY * 0.7,
	{
		isStatic: true,
		label: 'goal',
		render: {
			fillStyle: 'green'
		}
	}
);

World.add(world, goal);

// Ball
const ballRadius = Math.min(unitLengthX, unitLengthY) / 4;
const ball = Bodies.circle(unitLengthX / 2, unitLengthY / 2, ballRadius, {
	label: 'ball',
	render: {
		fillStyle: 'blue'
	}
});

World.add(world, ball);

// Add event Listeners for moving ball around canvas.
document.addEventListener('keydown', (event) => {
	const { keyCode } = event;
	const { x, y } = ball.velocity;

	if (keyCode === 87) {
		Body.setVelocity(ball, { x: x, y: y - 5 });
	}
	if (keyCode === 83) {
		Body.setVelocity(ball, { x: x, y: y + 5 });
	}
	if (keyCode === 65) {
		Body.setVelocity(ball, { x: x - 5, y: y });
	}
	if (keyCode === 68) {
		Body.setVelocity(ball, { x: x + 5, y: y });
	}
});

// Win Condition

Events.on(engine, 'collisionStart', (event) => {
	event.pairs.forEach((collision) => {
		const labels = [ 'ball', 'goal' ];

		if (
			labels.includes(collision.bodyA.label) &&
			labels.includes(collision.bodyB.label)
		) {
			world.gravity.y = 1;
			world.bodies.forEach((body) => {
				if (body.label === 'wall') {
					Body.setStatic(body, false);
				}
			});
			document.querySelector('.winner').classList.remove('hidden');
		}
	});
});

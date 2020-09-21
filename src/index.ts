import './scss/index.scss';

import { Engine, Render, Runner, World, Bodies } from 'matter-js';

// Constants
const width = 600;
const height = 600;

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
	Bodies.rectangle(width / 2, 0, width, 25, { isStatic: true }),
	// Bottom Wall
	Bodies.rectangle(width / 2, height, width, 25, { isStatic: true }),
	// Left Wall
	Bodies.rectangle(0, height / 2, 25, height, { isStatic: true }),
	// Right Wall
	Bodies.rectangle(width, height / 2, 25, height, { isStatic: true })
];

// Add walls to world
World.add(world, walls);

import './scss/index.scss';

import {
	Engine,
	Render,
	Runner,
	World,
	Bodies,
	MouseConstraint,
	Mouse
} from 'matter-js';

// Create engine and world object.
const engine = Engine.create();
const { world } = engine;

// Create render object to show content on the screen.
const render = Render.create({
	element: document.body,
	engine: engine,
	options: {
		width: 800,
		height: 600
	}
});

// Draw Content to screen.
Render.run(render);
Runner.run(Runner.create(), engine);

// Add mouse functionality to the world. Allows user to drag shapes on the canvas.
World.add(
	world,
	MouseConstraint.create(engine, {
		mouse: Mouse.create(render.canvas)
	})
);

// Wall objects stored in an array.
const walls = [
	Bodies.rectangle(400, 0, 800, 25, { isStatic: true }),
	Bodies.rectangle(400, 600, 800, 25, { isStatic: true }),
	Bodies.rectangle(0, 400, 25, 800, { isStatic: true }),
	Bodies.rectangle(800, 400, 25, 800, { isStatic: true })
];

// Add walls to world
World.add(world, walls);

World.add(world, Bodies.rectangle(300, 300, 50, 50));

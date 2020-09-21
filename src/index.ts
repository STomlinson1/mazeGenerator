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

// Constants
const width = 800;
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

// Generate Random Shapes
for (let i = 0; i < 30; i++) {
	if (Math.random() < 0.3) {
		World.add(
			world,
			Bodies.rectangle(Math.random() * width, Math.random() * height, 50, 50)
		);
	} else if (Math.random() < 0.7) {
		World.add(
			world,
			Bodies.trapezoid(Math.random() * width, Math.random() * height, 50, 50, 1)
		);
	} else {
		World.add(
			world,
			Bodies.circle(Math.random() * width, Math.random() * height, 50, {
				render: {
					fillStyle: 'red'
				}
			})
		);
	}
}

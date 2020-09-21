import './scss/index.scss';

import { Engine, Render, Runner, World, Bodies } from 'matter-js';

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

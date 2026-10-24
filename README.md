# GameTS 🎮

**Create 2D games for the web with TypeScript, inspired by Pygame.**

GameTS is a 2D game development library built from scratch in TypeScript. It provides tools to create games that run directly in the browser using HTML5 Canvas.

Its design is inspired by the simplicity and development experience of Pygame, making it familiar to developers who enjoy creating games with a straightforward programming API.

**GameTS does not convert Python or Pygame games into web games.** It is an independent library for building web games from scratch with TypeScript.

## ✨ Features

- 🎨 **2D rendering** — Draw shapes, images, lines, and text using Canvas.
- ⌨️ **Keyboard input** — Detect pressed, held, and released keys.
- 🖱️ **Mouse input** — Read mouse position and button interactions.
- 📐 **Vectors and rectangles** — Work with `Vector2`, `Rect`, and collision detection.
- 🖼️ **Sprites and images** — Build games using visual assets.
- 🔊 **Sound** — Play audio through the browser.
- ⏱️ **Game loop** — Update game logic and render frames.
- ⏸️ **Game control** — Pause, resume, and stop your game.
- 🌐 **Browser-native** — Create games designed to run on the web.
- 📦 **TypeScript-first** — Take advantage of types and modern JavaScript tooling.

## 🚀 Getting started

### Requirements

- Node.js
- npm
- Basic knowledge of TypeScript or JavaScript

### Installation

If you are using the published npm package:

```bash
npm install gamets
```

If you want to work with the source code, clone the repository:

```bash
git clone https://github.com/aminbena010-ai/GameTs.git
cd GameTs
npm install
```

Build the library:

```bash
npm run build
```

## 🕹️ Your first game

The following example illustrates the basic idea behind GameTS: create a game, update its logic, draw objects, and run the game loop.

```ts
import { Game, Color } from "gamets";

const game = new Game({
  width: 800,
  height: 600,
  title: "My First Game",
});

game.update((deltaTime) => {
  // Update your game logic here.
});

game.draw((renderer) => {
  // Draw your game objects here.
  renderer.fillRect(
    100,
    100,
    80,
    80,
    new Color(80, 190, 255)
  );
});

game.run();
```

> **Note:** This is an introductory example. Check the current implementation and exported types for the exact configuration and method signatures supported by your installed version.

## 📚 Core modules

GameTS provides several modules to help you build your own game systems.

| Module | Purpose |
| --- | --- |
| `Game` | Controls the game loop and game state. |
| `Renderer` | Draws shapes, images, and text on the canvas. |
| `Keyboard` | Handles keyboard input. |
| `Mouse` | Provides mouse position and button input. |
| `Vector2` | Represents and manipulates 2D vectors. |
| `Rect` | Represents rectangles and provides collision utilities. |
| `Color` | Represents colors used when drawing. |
| `Image` | Works with image assets. |
| `Sprite` | Provides sprite-related functionality. |
| `Sound` | Handles browser audio playback. |
| `Time` | Provides timing information for the game loop. |
| `Splash` | Supports splash-screen functionality. |

The library is evolving, so available features and APIs may change between versions.

## 🎨 Rendering

The `Renderer` module provides drawing utilities for 2D games, including:

- Rectangles and circles
- Ellipses and polygons
- Lines
- Text
- Images
- Transformations such as translation, rotation, and scaling
- Canvas resizing and fullscreen controls

These tools let you create game graphics without needing a separate rendering framework.

## ⌨️ Input handling

GameTS provides keyboard and mouse modules so your game can react to player input.

The keyboard API includes methods such as:

- `isDown()` — Check whether a key is being held.
- `isPressed()` — Check whether a key has just been pressed.
- `isReleased()` — Check whether a key has just been released.

The mouse module provides access to the pointer position and mouse-button interactions.

Refer to the source code and TypeScript definitions for the exact arguments and usage.

## 📐 Vectors, rectangles, and collisions

GameTS includes `Vector2` and `Rect` utilities to simplify common 2D game calculations.

The rectangle API includes operations for:

- Detecting point and rectangle collisions
- Checking collisions with circles
- Moving and resizing rectangles
- Calculating intersections and unions
- Clamping rectangles within other rectangles

These utilities can help you implement movement, hitboxes, boundaries, and simple collision systems.

## 🔊 Audio

The `Sound` module provides browser-based audio playback.

Keep in mind that browsers may restrict audio playback until the user interacts with the page. Your game should handle this behavior appropriately.

## 🧰 Development

To install the development dependencies:

```bash
npm install
```

Build the TypeScript library:

```bash
npm run build
```

Check the TypeScript project for errors:

```bash
npm run lint
```

Run the test suite:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

## 🗺️ Roadmap

GameTS is an evolving project. The following items represent possible future improvements, not necessarily features available today.

- [ ] Expand documentation and API examples.
- [ ] Add more complete example games.
- [ ] Improve automated tests and reliability.
- [ ] Continue improving rendering and input handling.
- [ ] Expand sprite and animation capabilities.
- [ ] Explore scene and camera management.
- [ ] Improve asset loading and resource management.
- [ ] Make game development workflows simpler and more intuitive.

The roadmap may change as the project develops.

## 🤝 Contributing

Contributions, bug reports, ideas, and feedback are welcome!

If you want to contribute:

1. Fork the repository.
2. Create a branch for your changes.
3. Make your changes and add tests where appropriate.
4. Run the build and tests.
5. Open a pull request explaining your changes.

Please check the existing source code and project conventions before adding new APIs.

## 💡 Project philosophy

GameTS aims to make 2D web game development approachable through a simple, game-focused API inspired by Pygame.

The goal is to provide developers with familiar concepts and useful building blocks while taking advantage of TypeScript and the browser.

**Write your game in TypeScript. Build it for the web. Make something fun.**

## 📄 License

GameTS is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Repository:** https://github.com/aminbena010-ai/GameTs
- **Issues and suggestions:** https://github.com/aminbena010-ai/GameTs/issues

// Core
export { Game } from "./core/Game.js";
export type {
    GameConfig,
    UpdateCallback,
    DrawCallback
} from "./core/Game.js";

export { Time } from "./core/Time.js";

// Graphics
export { Renderer } from "./graphics/Renderer.js";
export type {
    RendererConfig,
    DrawImageOptions,
    TextOptions
} from "./graphics/Renderer.js";

export { Image } from "./graphics/Image.js";
export { Color } from "./graphics/Color.js";

// Sprite
export { Sprite } from "./graphics/Sprite.js";
export type { SpriteOptions } from "./graphics/Sprite.js";

// Audio
export { Sound } from "./audio/Sound.js";
export type { SoundOptions } from "./audio/Sound.js";

// Input
export { Keyboard } from "./input/Keyboard.js";
export type { KeyboardConfig } from "./input/Keyboard.js";

export { Mouse } from "./input/Mouse.js";

// Math
export { Vector2 } from "./math/Vector2.js";
export { Rect } from "./math/Rect.js";
export type { RectLike } from "./math/Rect.js";
// Splash 
///*
export { Splash } from "./splash/Splash.js";
export type {
    SplashOptions,
    SplashAsset,
    Loadable
} from "./splash/Splash.js";//*/
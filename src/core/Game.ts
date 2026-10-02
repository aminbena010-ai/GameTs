import { Renderer } from "../graphics/Renderer.js";
import { Time } from "./Time.js";
import { Keyboard } from "../input/Keyboard.js";
import { Mouse } from "../input/Mouse.js";

export interface GameConfig {
    width: number;
    height: number;
    canvas?: HTMLCanvasElement;
    background?: string;
    /**
     * Lista de teclas (event.code o event.key) a las que se hará
     * preventDefault para evitar el scroll del navegador.
     */
    preventDefaultKeys?: string[];
}

export type UpdateCallback = (deltaTime: number) => void;
export type DrawCallback = (renderer: Renderer) => void;

export class Game {
    public readonly renderer: Renderer;
    public readonly time: Time;

    private updateCallback?: UpdateCallback;
    private drawCallback?: DrawCallback;

    private running = false;
    private paused = false;
    private animationFrame = 0;

    constructor(config: GameConfig) {
        this.renderer = new Renderer(config);
        this.time = new Time();

        Keyboard.initialize(
            config.preventDefaultKeys !== undefined
                ? { preventDefault: config.preventDefaultKeys }
                : {}
        );

        Mouse.initialize(this.renderer.canvas);
    }

    public update(callback: UpdateCallback): void {
        this.updateCallback = callback;
    }

    public draw(callback: DrawCallback): void {
        this.drawCallback = callback;
    }

    public run(): void {
        if (this.running) {
            return;
        }

        this.running = true;
        this.paused = false;

        this.time.start();

        const loop = (timestamp: number) => {
            if (!this.running) {
                return;
            }

            this.time.tick(timestamp);

            if (!this.paused) {
                this.updateCallback?.(this.time.deltaTime);
            }

            // Limpiar estados "pressed/released" después del update
            // y antes del draw, para que estén disponibles en ambos.
            Keyboard.update();
            Mouse.update();

            this.renderer.clear();

            this.drawCallback?.(this.renderer);

            this.animationFrame = requestAnimationFrame(loop);
        };

        this.animationFrame = requestAnimationFrame(loop);
    }

    public stop(): void {
        this.running = false;
        this.paused = false;

        cancelAnimationFrame(this.animationFrame);
    }

    public pause(): void {
        if (!this.running) {
            return;
        }

        this.paused = true;
    }

    public resume(): void {
        if (!this.running) {
            return;
        }

        this.paused = false;

        // Solo reinicia lastTime para evitar un delta enorme,
        // pero conserva elapsedTime.
        this.time.resetLastTime();
    }

    public get isRunning(): boolean {
        return this.running;
    }

    public get isPaused(): boolean {
        return this.paused;
    }
}
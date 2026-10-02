import { Image } from "./Image.js";
import { Rect } from "../math/Rect.js";
import { Vector2 } from "../math/Vector2.js";
import { Renderer } from "./Renderer.js";

export interface SpriteOptions {
    position?: Vector2;
    scale?: number | Vector2;
    rotation?: number;
    origin?: Vector2;
    width?: number;
    height?: number;
    flipX?: boolean;
    flipY?: boolean;
    opacity?: number;
    visible?: boolean;
}

export class Sprite {
    public image: Image;
    public position: Vector2;
    public scale: Vector2;
    public rotation: number;
    public origin: Vector2;

    public _width: number;
    public _height: number;

    public flipX: boolean;
    public flipY: boolean;

    public opacity: number;
    public visible: boolean;

    constructor(image: Image, options: SpriteOptions = {}) {
        this.image = image;

        this.position = options.position?.clone() ?? new Vector2(0, 0);

        if (options.scale === undefined) {
            this.scale = new Vector2(1, 1);
        } else if (typeof options.scale === "number") {
            this.scale = new Vector2(options.scale, options.scale);
        } else {
            this.scale = options.scale.clone();
        }

        this.rotation = options.rotation ?? 0;
        this.origin = options.origin?.clone() ?? new Vector2(0.5, 0.5);

        this._width = options.width ?? image.width;
        this._height = options.height ?? image.height;

        this.flipX = options.flipX ?? false;
        this.flipY = options.flipY ?? false;

        this.opacity = options.opacity ?? 1;
        this.visible = options.visible ?? true;
    }

    public get width(): number {
        return this._width;
    }

    public set width(value: number) {
        this._width = value;
    }

    public get height(): number {
        return this._height;
    }

    public set height(value: number) {
        this._height = value;
    }

    public get center(): Vector2 {
        return new Vector2(
            this.position.x,
            this.position.y
        );
    }

    /**
     * Rectángulo de colisión (AABB) ignorando rotación.
     */
    public get rect(): Rect {
        const w = this._width * Math.abs(this.scale.x);
        const h = this._height * Math.abs(this.scale.y);

        return new Rect(
            this.position.x - w * this.origin.x,
            this.position.y - h * this.origin.y,
            w,
            h
        );
    }

    public getRect(): Rect {
        return this.rect;
    }

    public moveTo(x: number, y: number): this {
        this.position.set(x, y);
        return this;
    }

    public moveBy(x: number, y: number): this {
        this.position.x += x;
        this.position.y += y;
        return this;
    }

    public setScale(x: number, y = x): this {
        this.scale.set(x, y);
        return this;
    }

    public setRotation(radians: number): this {
        this.rotation = radians;
        return this;
    }

    public setOrigin(x: number, y = x): this {
        this.origin.set(x, y);
        return this;
    }

    public draw(renderer: Renderer): void {
        if (!this.visible) return;
        if (!this.image.loaded) return;

        const w = this._width;
        const h = this._height;

        const sx = this.scale.x * (this.flipX ? -1 : 1);
        const sy = this.scale.y * (this.flipY ? -1 : 1);

        const prevAlpha = renderer.context.globalAlpha;

        if (this.opacity !== 1) {
            renderer.context.globalAlpha = prevAlpha * this.opacity;
        }

        renderer.save();
        renderer.translate(this.position.x, this.position.y);
        renderer.rotate(this.rotation);
        renderer.scale(sx, sy);

        renderer.context.drawImage(
            this.image.element,
            -w * this.origin.x,
            -h * this.origin.y,
            w,
            h
        );

        renderer.restore();

        if (this.opacity !== 1) {
            renderer.context.globalAlpha = prevAlpha;
        }
    }

    public clone(): Sprite {
        return new Sprite(this.image, {
            position: this.position.clone(),
            scale: this.scale.clone(),
            rotation: this.rotation,
            origin: this.origin.clone(),
            width: this._width,
            height: this._height,
            flipX: this.flipX,
            flipY: this.flipY,
            opacity: this.opacity,
            visible: this.visible
        });
    }

    /** Alias Pygame-style. */
    public copy(): Sprite {
        return this.clone();
    }

    public intersects(other: Sprite): boolean {
        return this.rect.intersects(other.rect);
    }

    public containsPoint(point: Vector2): boolean {
        return this.rect.containsPoint(point);
    }
}
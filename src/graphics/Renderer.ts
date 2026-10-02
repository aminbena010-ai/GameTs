import { Color } from "./Color.js";
import { Image } from "./Image.js";

export interface RendererConfig {
    width: number;
    height: number;
    canvas?: HTMLCanvasElement;
    background?: string;
}

export interface DrawImageOptions {
    width?: number;
    height?: number;
    rotation?: number;
    scaleX?: number;
    scaleY?: number;
    flipX?: boolean;
    flipY?: boolean;
}

export interface TextOptions {
    color?: Color | string;
    font?: string;
    align?: CanvasTextAlign;
    baseline?: CanvasTextBaseline;
    maxWidth?: number;
}

export class Renderer {
    public readonly canvas: HTMLCanvasElement;
    public readonly context: CanvasRenderingContext2D;

    private _width: number;
    private _height: number;

    public background: string;

    constructor(config: RendererConfig) {
        this._width = config.width;
        this._height = config.height;

        this.background =
            config.background ?? "#000000";

        this.canvas =
            config.canvas ??
            document.createElement("canvas");

        this.canvas.width = this._width;
        this.canvas.height = this._height;

        const context =
            this.canvas.getContext("2d");

        if (!context) {
            throw new Error(
                "GameTS: Could not create 2D rendering context."
            );
        }

        this.context = context;

        // Aplicar el background inmediatamente para evitar
        // el parpadeo transparente antes del primer clear().
        this.context.fillStyle = this.background;
        this.context.fillRect(0, 0, this._width, this._height);

        if (!config.canvas) {
            document.body.appendChild(this.canvas);
        }
    }

    public get width(): number {
        return this._width;
    }

    public get height(): number {
        return this._height;
    }

    public resize(width: number, height: number): void {
        if (width <= 0 || height <= 0) {
            throw new Error(
                "GameTS: Renderer size must be greater than zero."
            );
        }

        this._width = width;
        this._height = height;

        this.canvas.width = width;
        this.canvas.height = height;
    }

    public fullscreen(): void {
        this.canvas.style.width = "100vw";
        this.canvas.style.height = "100vh";
        this.canvas.style.display = "block";

        document.body.style.margin = "0";
        document.body.style.overflow = "hidden";
    }

    public async requestFullscreen(): Promise<void> {
        if (!document.fullscreenElement) {
            await this.canvas.requestFullscreen();
        }
    }

    public async exitFullscreen(): Promise<void> {
        if (document.fullscreenElement) {
            await document.exitFullscreen();
        }
    }

    public clear(): void {
        this.context.fillStyle = this.background;

        this.context.fillRect(
            0,
            0,
            this._width,
            this._height
        );
    }

    public clearColor(color: Color): void {
        this.context.fillStyle = color.toString();

        this.context.fillRect(
            0,
            0,
            this._width,
            this._height
        );
    }

    public fillRect(
        x: number,
        y: number,
        width: number,
        height: number,
        color: Color | string
    ): void {
        this.context.fillStyle =
            typeof color === "string"
                ? color
                : color.toString();

        this.context.fillRect(x, y, width, height);
    }

    public strokeRect(
        x: number,
        y: number,
        width: number,
        height: number,
        color: Color | string,
        lineWidth = 1
    ): void {
        this.context.strokeStyle =
            typeof color === "string"
                ? color
                : color.toString();

        this.context.lineWidth = lineWidth;

        this.context.strokeRect(x, y, width, height);
    }

    public fillCircle(
        x: number,
        y: number,
        radius: number,
        color: Color | string
    ): void {
        this.context.beginPath();

        this.context.arc(x, y, radius, 0, Math.PI * 2);

        this.context.fillStyle =
            typeof color === "string"
                ? color
                : color.toString();

        this.context.fill();
    }

    public circle(
        x: number,
        y: number,
        radius: number,
        color: Color | string
    ): void {
        this.fillCircle(x, y, radius, color);
    }

    public strokeCircle(
        x: number,
        y: number,
        radius: number,
        color: Color | string,
        lineWidth = 1
    ): void {
        this.context.beginPath();

        this.context.arc(x, y, radius, 0, Math.PI * 2);

        this.context.strokeStyle =
            typeof color === "string"
                ? color
                : color.toString();

        this.context.lineWidth = lineWidth;

        this.context.stroke();
    }

    public fillEllipse(
        x: number,
        y: number,
        radiusX: number,
        radiusY: number,
        color: Color | string
    ): void {
        this.context.beginPath();

        this.context.ellipse(
            x,
            y,
            radiusX,
            radiusY,
            0,
            0,
            Math.PI * 2
        );

        this.context.fillStyle =
            typeof color === "string"
                ? color
                : color.toString();

        this.context.fill();
    }

    public strokeEllipse(
        x: number,
        y: number,
        radiusX: number,
        radiusY: number,
        color: Color | string,
        lineWidth = 1
    ): void {
        this.context.beginPath();

        this.context.ellipse(
            x,
            y,
            radiusX,
            radiusY,
            0,
            0,
            Math.PI * 2
        );

        this.context.strokeStyle =
            typeof color === "string"
                ? color
                : color.toString();

        this.context.lineWidth = lineWidth;

        this.context.stroke();
    }

    public fillPolygon(
        points: Array<{ x: number; y: number }>,
        color: Color | string
    ): void {
        if (points.length < 3) {
            return;
        }

        const first = points[0];

        if (!first) {
            return;
        }

        this.context.beginPath();

        this.context.moveTo(first.x, first.y);

        for (let i = 1; i < points.length; i++) {
            const point = points[i];

            if (!point) {
                continue;
            }

            this.context.lineTo(point.x, point.y);
        }

        this.context.closePath();

        this.context.fillStyle =
            typeof color === "string"
                ? color
                : color.toString();

        this.context.fill();
    }

    public line(
        x1: number,
        y1: number,
        x2: number,
        y2: number,
        color: Color | string,
        lineWidth = 1
    ): void {
        this.context.beginPath();

        this.context.moveTo(x1, y1);
        this.context.lineTo(x2, y2);

        this.context.strokeStyle =
            typeof color === "string"
                ? color
                : color.toString();

        this.context.lineWidth = lineWidth;

        this.context.stroke();
    }

    /**
     * Dibuja texto en pantalla.
     *
     * Firma antigua (compatible):
     *   text(text, x, y, color, font)
     *
     * Firma nueva:
     *   text(text, x, y, { color, font, align, baseline, maxWidth })
     */
    public text(
        text: string,
        x: number,
        y: number,
        colorOrOptions: Color | string | TextOptions = "#ffffff",
        font = "16px sans-serif"
    ): void {
        let options: TextOptions;

        if (
            typeof colorOrOptions === "object" &&
            colorOrOptions !== null &&
            !(colorOrOptions instanceof Color)
        ) {
            options = colorOrOptions;
        } else {
            options = {
                color: colorOrOptions,
                font
            };
        }

        const {
            color = "#ffffff",
            font: fontValue = "16px sans-serif",
            align,
            baseline,
            maxWidth
        } = options;

        this.context.fillStyle =
            typeof color === "string"
                ? color
                : color.toString();

        this.context.font = fontValue;

        const prevAlign = this.context.textAlign;
        const prevBaseline = this.context.textBaseline;

        if (align) {
            this.context.textAlign = align;
        }

        if (baseline) {
            this.context.textBaseline = baseline;
        }

        if (maxWidth !== undefined) {
            this.context.fillText(text, x, y, maxWidth);
        } else {
            this.context.fillText(text, x, y);
        }

        // Restaurar para no contaminar el estado global.
        this.context.textAlign = prevAlign;
        this.context.textBaseline = prevBaseline;
    }

    public drawImage(
        image: Image,
        x: number,
        y: number
    ): void {
        if (!image.loaded) {
            return;
        }

        this.context.drawImage(image.element, x, y);
    }

    public drawImageScaled(
        image: Image,
        x: number,
        y: number,
        width: number,
        height: number
    ): void {
        if (!image.loaded) {
            return;
        }

        this.context.drawImage(
            image.element,
            x,
            y,
            width,
            height
        );
    }

    public drawImageTransformed(
        image: Image,
        x: number,
        y: number,
        options: DrawImageOptions = {}
    ): void {
        if (!image.loaded) {
            return;
        }

        const width = options.width ?? image.width;
        const height = options.height ?? image.height;

        const scaleX =
            options.scaleX ??
            (options.flipX ? -1 : 1);

        const scaleY =
            options.scaleY ??
            (options.flipY ? -1 : 1);

        const rotation = options.rotation ?? 0;

        this.save();

        this.translate(x + width / 2, y + height / 2);
        this.rotate(rotation);
        this.scale(scaleX, scaleY);

        this.context.drawImage(
            image.element,
            -width / 2,
            -height / 2,
            width,
            height
        );

        this.restore();
    }

    public save(): void {
        this.context.save();
    }

    public restore(): void {
        this.context.restore();
    }

    public translate(x: number, y: number): void {
        this.context.translate(x, y);
    }

    public rotate(angle: number): void {
        this.context.rotate(angle);
    }

    public scale(x: number, y: number): void {
        this.context.scale(x, y);
    }
}
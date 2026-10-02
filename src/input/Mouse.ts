export class Mouse {
    private static initialized = false;

    private static _x = 0;
    private static _y = 0;

    private static buttons = new Set<number>();
    private static pressedButtons = new Set<number>();
    private static releasedButtons = new Set<number>();

    public static initialize(
        canvas?: HTMLCanvasElement
    ): void {
        if (this.initialized) {
            return;
        }

        this.initialized = true;

        const target = canvas ?? window;

        target.addEventListener(
            "mousemove",
            ((event: MouseEvent) => {
                if (canvas) {
                    const rect =
                        canvas.getBoundingClientRect();

                    const scaleX =
                        canvas.width / rect.width;

                    const scaleY =
                        canvas.height / rect.height;

                    this._x =
                        (event.clientX - rect.left) * scaleX;

                    this._y =
                        (event.clientY - rect.top) * scaleY;
                } else {
                    this._x = event.clientX;
                    this._y = event.clientY;
                }
            }) as EventListener
        );

        target.addEventListener(
            "mousedown",
            ((event: MouseEvent) => {
                if (!this.buttons.has(event.button)) {
                    this.pressedButtons.add(event.button);
                }

                this.buttons.add(event.button);
            }) as EventListener
        );

        target.addEventListener(
            "mouseup",
            ((event: MouseEvent) => {
                this.buttons.delete(event.button);

                this.releasedButtons.add(event.button);
            }) as EventListener
        );

        window.addEventListener(
            "blur",
            () => {
                this.buttons.clear();
                this.pressedButtons.clear();
                this.releasedButtons.clear();
            }
        );
    }

    public static update(): void {
        this.pressedButtons.clear();
        this.releasedButtons.clear();
    }

    public static get x(): number {
        return this._x;
    }

    public static get y(): number {
        return this._y;
    }

    public static get position(): {
        x: number;
        y: number;
    } {
        return {
            x: this._x,
            y: this._y
        };
    }

    public static isButtonDown(button = 0): boolean {
        this.initialize();
        return this.buttons.has(button);
    }

    public static isButtonPressed(button = 0): boolean {
        this.initialize();
        return this.pressedButtons.has(button);
    }

    public static isButtonReleased(button = 0): boolean {
        this.initialize();
        return this.releasedButtons.has(button);
    }
}
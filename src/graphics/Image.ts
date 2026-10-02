export class Image {
    public readonly element: HTMLImageElement;

    private _loaded = false;
    private _error: Error | null = null;

    constructor(
        public readonly source: string
    ) {
        this.element = new window.Image();

        this.element.onload = () => {
            this._loaded = true;
        };

        this.element.onerror = () => {
            this._error = new Error(
                `GameTS: Could not load image "${source}".`
            );
        };

        this.element.src = source;
    }

    public get loaded(): boolean {
        return this._loaded;
    }

    public get error(): Error | null {
        return this._error;
    }

    public get width(): number {
        return this.element.naturalWidth;
    }

    public get height(): number {
        return this.element.naturalHeight;
    }

    public static load(source: string): Image {
        return new Image(source);
    }

    public async waitForLoad(): Promise<void> {
        if (this._loaded) {
            return;
        }

        if (this._error) {
            throw this._error;
        }

        await new Promise<void>((resolve, reject) => {
            this.element.onload = () => {
                this._loaded = true;
                resolve();
            };

            this.element.onerror = () => {
                this._error = new Error(
                    `GameTS: Could not load image "${this.source}".`
                );

                reject(this._error);
            };
        });
    }

    public clone(): Image {
        return new Image(this.source);
    }

    /** Alias Pygame-style. */
    public copy(): Image {
        return this.clone();
    }
}
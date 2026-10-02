export interface SoundOptions {
    /** Volumen inicial (0..1). Por defecto 1. */
    volume?: number;
    /** Si es true, el sonido se reproduce en bucle. Por defecto false. */
    loop?: boolean;
    /** Precargar el archivo. Por defecto true. */
    preload?: boolean;
}

export class Sound {
    public readonly element: HTMLAudioElement;

    private _volume: number;
    private _loop: boolean;
    private _loaded = false;
    private _error: Error | null = null;

    constructor(
        public readonly source: string,
        options: SoundOptions = {}
    ) {
        this._volume = options.volume ?? 1;
        this._loop = options.loop ?? false;

        this.element = new Audio();
        this.element.preload = options.preload === false ? "none" : "auto";
        this.element.volume = this._volume;
        this.element.loop = this._loop;
        this.element.src = source;

        this.element.addEventListener("canplaythrough", () => {
            this._loaded = true;
        });

        this.element.addEventListener("error", () => {
            this._error = new Error(
                `GameTS: Could not load sound "${source}".`
            );
        });
    }

    public get loaded(): boolean {
        return this._loaded;
    }

    public get error(): Error | null {
        return this._error;
    }

    public get volume(): number {
        return this._volume;
    }

    public set volume(value: number) {
        this._volume = Math.max(0, Math.min(1, value));
        this.element.volume = this._volume;
    }

    public get loop(): boolean {
        return this._loop;
    }

    public set loop(value: boolean) {
        this._loop = value;
        this.element.loop = value;
    }

    public async play(restart = true): Promise<void> {
        if (restart) {
            this.element.currentTime = 0;
        }

        try {
            await this.element.play();
        } catch {
            // Los navegadores bloquean autoplay hasta interacción del usuario.
            // Silenciamos el error para no romper el juego.
        }
    }

    public pause(): void {
        this.element.pause();
    }

    public stop(): void {
        this.element.pause();
        this.element.currentTime = 0;
    }

    public static load(
        source: string,
        options: SoundOptions = {}
    ): Sound {
        return new Sound(source, options);
    }

    public async waitForLoad(): Promise<void> {
        if (this._loaded) return;
        if (this._error) throw this._error;

        await new Promise<void>((resolve, reject) => {
            const onReady = () => {
                this._loaded = true;
                cleanup();
                resolve();
            };

            const onError = () => {
                this._error = new Error(
                    `GameTS: Could not load sound "${this.source}".`
                );
                cleanup();
                reject(this._error);
            };

            const cleanup = () => {
                this.element.removeEventListener(
                    "canplaythrough",
                    onReady
                );
                this.element.removeEventListener("error", onError);
            };

            this.element.addEventListener("canplaythrough", onReady);
            this.element.addEventListener("error", onError);
        });
    }

    public clone(): Sound {
        return new Sound(this.source, {
            volume: this._volume,
            loop: this._loop
        });
    }

    /** Alias Pygame-style. */
    public copy(): Sound {
        return this.clone();
    }
}
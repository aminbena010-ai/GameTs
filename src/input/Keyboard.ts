export interface KeyboardConfig {
    /**
     * Lista de teclas (event.code o event.key) a las que se hará
     * preventDefault para evitar el scroll del navegador.
     */
    preventDefault?: string[];
}

export class Keyboard {
    private static keys = new Set<string>();
    private static pressedKeys = new Set<string>();
    private static releasedKeys = new Set<string>();

    private static initialized = false;
    private static preventDefaultKeys: Set<string> = new Set();

    public static initialize(config: KeyboardConfig = {}): void {
        if (this.initialized) {
            // Permite actualizar la lista sin reinstalar listeners.
            if (config.preventDefault) {
                this.preventDefaultKeys = new Set(config.preventDefault);
            }
            return;
        }

        this.initialized = true;

        if (config.preventDefault) {
            this.preventDefaultKeys = new Set(config.preventDefault);
        }

        window.addEventListener("keydown", (event) => {
            if (
                this.preventDefaultKeys.has(event.code) ||
                this.preventDefaultKeys.has(event.key)
            ) {
                event.preventDefault();
            }

            const wasDown = this.keys.has(event.code);

            this.keys.add(event.code);
            this.keys.add(event.key);

            if (!wasDown) {
                this.pressedKeys.add(event.code);
                this.pressedKeys.add(event.key);
            }
        });

        window.addEventListener("keyup", (event) => {
            this.keys.delete(event.code);
            this.keys.delete(event.key);

            this.releasedKeys.add(event.code);
            this.releasedKeys.add(event.key);
        });

        window.addEventListener("blur", () => {
            this.keys.clear();
            this.pressedKeys.clear();
            this.releasedKeys.clear();
        });
    }

    public static update(): void {
        this.pressedKeys.clear();
        this.releasedKeys.clear();
    }

    public static isDown(key: string): boolean {
        this.initialize();
        return this.keys.has(key);
    }

    public static isPressed(key: string): boolean {
        this.initialize();
        return this.pressedKeys.has(key);
    }

    public static isReleased(key: string): boolean {
        this.initialize();
        return this.releasedKeys.has(key);
    }
}
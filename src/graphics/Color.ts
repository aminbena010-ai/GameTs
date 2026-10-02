export class Color {
    public r: number;
    public g: number;
    public b: number;
    public a: number;

    constructor(
        r: number,
        g: number,
        b: number,
        a = 1
    ) {
        this.r = Color.clamp(r, 0, 255);
        this.g = Color.clamp(g, 0, 255);
        this.b = Color.clamp(b, 0, 255);
        this.a = Color.clamp(a, 0, 1);
    }

    private static clamp(
        value: number,
        min: number,
        max: number
    ): number {
        return Math.max(min, Math.min(max, value));
    }

    public toString(): string {
        return `rgba(${Math.round(this.r)}, ${Math.round(this.g)}, ${Math.round(this.b)}, ${this.a})`;
    }

    public clone(): Color {
        return new Color(
            this.r,
            this.g,
            this.b,
            this.a
        );
    }

    /** Alias Pygame-style. */
    public copy(): Color {
        return this.clone();
    }

    public equals(other: Color): boolean {
        return (
            this.r === other.r &&
            this.g === other.g &&
            this.b === other.b &&
            this.a === other.a
        );
    }

    public static rgb(
        r: number,
        g: number,
        b: number
    ): Color {
        return new Color(r, g, b);
    }

    public static rgba(
        r: number,
        g: number,
        b: number,
        a: number
    ): Color {
        return new Color(r, g, b, a);
    }

    public static white(): Color {
        return new Color(255, 255, 255);
    }

    public static black(): Color {
        return new Color(0, 0, 0);
    }

    public static red(): Color {
        return new Color(255, 0, 0);
    }

    public static green(): Color {
        return new Color(0, 255, 0);
    }

    public static blue(): Color {
        return new Color(0, 0, 255);
    }

    public static yellow(): Color {
        return new Color(255, 255, 0);
    }

    public static orange(): Color {
        return new Color(255, 165, 0);
    }

    public static purple(): Color {
        return new Color(128, 0, 128);
    }

    public static cyan(): Color {
        return new Color(0, 255, 255);
    }

    public static gray(value = 128): Color {
        return new Color(value, value, value);
    }

    public static grey(value = 128): Color {
        return Color.gray(value);
    }

    public static transparent(): Color {
        return new Color(0, 0, 0, 0);
    }
}
export class Vector2 {
    public x: number;
    public y: number;

    constructor(
        x = 0,
        y = 0
    ) {
        this.x = x;
        this.y = y;
    }

    public set(
        x: number,
        y: number
    ): this {
        this.x = x;
        this.y = y;

        return this;
    }

    public add(
        vector: Vector2
    ): this {
        this.x += vector.x;
        this.y += vector.y;

        return this;
    }

    public subtract(
        vector: Vector2
    ): this {
        this.x -= vector.x;
        this.y -= vector.y;

        return this;
    }

    public multiply(
        value: number
    ): this {
        this.x *= value;
        this.y *= value;

        return this;
    }

    public divide(
        value: number
    ): this {
        if (value === 0) {
            throw new Error(
                "GameTS: Cannot divide Vector2 by zero."
            );
        }

        this.x /= value;
        this.y /= value;

        return this;
    }

    public length(): number {
        return Math.sqrt(
            this.x * this.x +
            this.y * this.y
        );
    }

    public lengthSquared(): number {
        return (
            this.x * this.x +
            this.y * this.y
        );
    }

    public normalize(): this {
        const length =
            this.length();

        if (length !== 0) {
            this.x /= length;
            this.y /= length;
        }

        return this;
    }

    public distanceTo(
        vector: Vector2
    ): number {
        const dx =
            vector.x - this.x;

        const dy =
            vector.y - this.y;

        return Math.sqrt(
            dx * dx +
            dy * dy
        );
    }

    public distanceSquaredTo(
        vector: Vector2
    ): number {
        const dx =
            vector.x - this.x;

        const dy =
            vector.y - this.y;

        return (
            dx * dx +
            dy * dy
        );
    }

    public dot(
        vector: Vector2
    ): number {
        return (
            this.x * vector.x +
            this.y * vector.y
        );
    }

    public angle(): number {
        return Math.atan2(
            this.y,
            this.x
        );
    }

    public rotate(
        angle: number
    ): this {
        const cos =
            Math.cos(angle);

        const sin =
            Math.sin(angle);

        const x = this.x * cos -
                  this.y * sin;

        const y = this.x * sin +
                  this.y * cos;

        this.x = x;
        this.y = y;

        return this;
    }

    public lerp(
        target: Vector2,
        amount: number
    ): this {
        this.x +=
            (target.x - this.x) *
            amount;

        this.y +=
            (target.y - this.y) *
            amount;

        return this;
    }

    public clone(): Vector2 {
        return new Vector2(
            this.x,
            this.y
        );
    }

    /** Alias Pygame-style. */
    public copy(): Vector2 {
        return this.clone();
    }

    public static zero(): Vector2 {
        return new Vector2(
            0,
            0
        );
    }

    public static one(): Vector2 {
        return new Vector2(
            1,
            1
        );
    }

    public static fromAngle(
        angle: number,
        length = 1
    ): Vector2 {
        return new Vector2(
            Math.cos(angle) * length,
            Math.sin(angle) * length
        );
    }

    public static lerp(
        a: Vector2,
        b: Vector2,
        amount: number
    ): Vector2 {
        return new Vector2(
            a.x + (b.x - a.x) * amount,
            a.y + (b.y - a.y) * amount
        );
    }
}
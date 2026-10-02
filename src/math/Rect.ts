import { Vector2 } from "./Vector2.js";

export interface RectLike {
    x: number;
    y: number;
    width: number;
    height: number;
}

export class Rect {
    public x: number;
    public y: number;
    public width: number;
    public height: number;

    constructor(x = 0, y = 0, width = 0, height = 0) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    // =========================================================
    // PROPIEDADES (idénticas a pygame.Rect)
    // =========================================================

    public get left(): number { return this.x; }
    public set left(v: number) { this.x = v; }

    public get right(): number { return this.x + this.width; }
    public set right(v: number) { this.x = v - this.width; }

    public get top(): number { return this.y; }
    public set top(v: number) { this.y = v; }

    public get bottom(): number { return this.y + this.height; }
    public set bottom(v: number) { this.y = v - this.height; }

    public get centerX(): number { return this.x + this.width / 2; }
    public set centerX(v: number) { this.x = v - this.width / 2; }

    public get centerY(): number { return this.y + this.height / 2; }
    public set centerY(v: number) { this.y = v - this.height / 2; }

    public get center(): Vector2 {
        return new Vector2(this.centerX, this.centerY);
    }

    public set center(v: Vector2) {
        this.centerX = v.x;
        this.centerY = v.y;
    }

    public get topleft(): Vector2 {
        return new Vector2(this.left, this.top);
    }

    public set topleft(v: Vector2) {
        this.x = v.x;
        this.y = v.y;
    }

    public get topright(): Vector2 {
        return new Vector2(this.right, this.top);
    }

    public set topright(v: Vector2) {
        this.right = v.x;
        this.top = v.y;
    }

    public get bottomleft(): Vector2 {
        return new Vector2(this.left, this.bottom);
    }

    public set bottomleft(v: Vector2) {
        this.left = v.x;
        this.bottom = v.y;
    }

    public get bottomright(): Vector2 {
        return new Vector2(this.right, this.bottom);
    }

    public set bottomright(v: Vector2) {
        this.right = v.x;
        this.bottom = v.y;
    }

    public get midtop(): Vector2 {
        return new Vector2(this.centerX, this.top);
    }

    public set midtop(v: Vector2) {
        this.centerX = v.x;
        this.top = v.y;
    }

    public get midleft(): Vector2 {
        return new Vector2(this.left, this.centerY);
    }

    public set midleft(v: Vector2) {
        this.left = v.x;
        this.centerY = v.y;
    }

    public get midright(): Vector2 {
        return new Vector2(this.right, this.centerY);
    }

    public set midright(v: Vector2) {
        this.right = v.x;
        this.centerY = v.y;
    }

    public get midbottom(): Vector2 {
        return new Vector2(this.centerX, this.bottom);
    }

    public set midbottom(v: Vector2) {
        this.centerX = v.x;
        this.bottom = v.y;
    }

    public get size(): Vector2 {
        return new Vector2(this.width, this.height);
    }

    public set size(v: Vector2) {
        this.width = v.x;
        this.height = v.y;
    }

    // =========================================================
    // MOVIMIENTO
    // =========================================================

    /**
     * Devuelve un nuevo Rect desplazado a (x, y).
     * Equivalente a pygame.Rect.move(x, y).
     */
    public move(x: number, y: number): Rect {
        return new Rect(x, y, this.width, this.height);
    }

    /**
     * Muta este Rect desplazándolo a (x, y).
     * Equivalente a pygame.Rect.move_ip(x, y).
     */
    public moveInPlace(x: number, y: number): this {
        this.x = x;
        this.y = y;
        return this;
    }

    /**
     * Alias de moveInPlace (retrocompatible con versiones anteriores).
     */
    public moveTo(x: number, y: number): this {
        return this.moveInPlace(x, y);
    }

    /**
     * Desplaza el rect por un delta.
     */
    public moveBy(x: number, y: number): this {
        this.x += x;
        this.y += y;
        return this;
    }

    /**
     * Muta este Rect para quedar centrado en el punto.
     */
    public moveToPoint(p: Vector2): this {
        this.x = p.x;
        this.y = p.y;
        return this;
    }

    /**
     * Devuelve un nuevo Rect centrado en el punto.
     */
    public moveToCenter(p: Vector2): Rect {
        return new Rect(
            p.x - this.width / 2,
            p.y - this.height / 2,
            this.width,
            this.height
        );
    }

    public setSize(width: number, height: number): this {
        this.width = width;
        this.height = height;
        return this;
    }

    // =========================================================
    // COLISIONES (idénticas a pygame.Rect)
    // =========================================================

    /**
     * pygame.Rect.collidepoint
     */
    public collidepoint(point: Vector2): boolean;
    public collidepoint(x: number, y: number): boolean;
    public collidepoint(a: Vector2 | number, b?: number): boolean {
        let px: number;
        let py: number;

        if (a instanceof Vector2) {
            px = a.x;
            py = a.y;
        } else {
            px = a;
            py = b as number;
        }

        return (
            px >= this.left &&
            px < this.right &&
            py >= this.top &&
            py < this.bottom
        );
    }

    /** Alias retrocompatible. */
    public containsPoint(point: Vector2): boolean {
        return this.collidepoint(point);
    }

    /**
     * pygame.Rect.colliderect
     */
    public colliderect(other: RectLike): boolean {
        return (
            this.left < other.x + other.width &&
            this.right > other.x &&
            this.top < other.y + other.height &&
            this.bottom > other.y
        );
    }

    /** Alias. */
    public intersects(other: RectLike): boolean {
        return this.colliderect(other);
    }

    /**
     * pygame.Rect.collidecircle
     * Colisión contra un círculo (centro + radio).
     */
    public collidecircle(center: Vector2, radius: number): boolean {
        const closestX = Math.max(
            this.left,
            Math.min(center.x, this.right)
        );

        const closestY = Math.max(
            this.top,
            Math.min(center.y, this.bottom)
        );

        const dx = center.x - closestX;
        const dy = center.y - closestY;

        return dx * dx + dy * dy <= radius * radius;
    }

    /**
     * pygame.Rect.collidelist
     */
    public collidelist(rects: RectLike[]): number {
        for (let i = 0; i < rects.length; i++) {
            if (this.colliderect(rects[i]!)) {
                return i;
            }
        }

        return -1;
    }

    /**
     * pygame.Rect.collidelistall
     */
    public collidelistall(rects: RectLike[]): number[] {
        const result: number[] = [];

        for (let i = 0; i < rects.length; i++) {
            if (this.colliderect(rects[i]!)) {
                result.push(i);
            }
        }

        return result;
    }

    /**
     * pygame.Rect.collidedict
     */
    public collidedict<K, V extends RectLike>(
        dict: Map<K, V>
    ): [K, V] | null {
        for (const [key, value] of dict) {
            if (this.colliderect(value)) {
                return [key, value];
            }
        }

        return null;
    }

    /**
     * pygame.Rect.collidedictall
     */
    public collidedictall<K, V extends RectLike>(
        dict: Map<K, V>
    ): Array<[K, V]> {
        const result: Array<[K, V]> = [];

        for (const [key, value] of dict) {
            if (this.colliderect(value)) {
                result.push([key, value]);
            }
        }

        return result;
    }

    /**
     * Colisión círculo ↔ círculo.
     */
    public static collideCircleCircle(
        centerA: Vector2,
        radiusA: number,
        centerB: Vector2,
        radiusB: number
    ): boolean {
        const dx = centerA.x - centerB.x;
        const dy = centerA.y - centerB.y;
        const r = radiusA + radiusB;

        return dx * dx + dy * dy <= r * r;
    }

    /**
     * Colisión punto ↔ círculo.
     */
    public static collidePointCircle(
        point: Vector2,
        center: Vector2,
        radius: number
    ): boolean {
        const dx = point.x - center.x;
        const dy = point.y - center.y;

        return dx * dx + dy * dy <= radius * radius;
    }

    // =========================================================
    // OPERACIONES GEOMÉTRICAS
    // =========================================================

    /**
     * pygame.Rect.clip
     */
    public clip(other: RectLike): Rect {
        const x1 = Math.max(this.left, other.x);
        const y1 = Math.max(this.top, other.y);
        const x2 = Math.min(this.right, other.x + other.width);
        const y2 = Math.min(this.bottom, other.y + other.height);

        if (x2 <= x1 || y2 <= y1) {
            return new Rect(x1, y1, 0, 0);
        }

        return new Rect(x1, y1, x2 - x1, y2 - y1);
    }

    /**
     * pygame.Rect.union
     */
    public union(other: RectLike): Rect {
        const x1 = Math.min(this.left, other.x);
        const y1 = Math.min(this.top, other.y);
        const x2 = Math.max(this.right, other.x + other.width);
        const y2 = Math.max(this.bottom, other.y + other.height);

        return new Rect(x1, y1, x2 - x1, y2 - y1);
    }

    /**
     * pygame.Rect.unionall
     */
    public unionall(rects: RectLike[]): Rect {
        let result = this.clone();

        for (const r of rects) {
            result = result.union(r);
        }

        return result;
    }

    /**
     * pygame.Rect.inflate
     */
    public inflate(x: number, y: number): Rect {
        return new Rect(
            this.x - x,
            this.y - y,
            this.width + x * 2,
            this.height + y * 2
        );
    }

    public inflateIp(x: number, y: number): this {
        const inflated = this.inflate(x, y);
        this.x = inflated.x;
        this.y = inflated.y;
        this.width = inflated.width;
        this.height = inflated.height;

        return this;
    }

    /**
     * pygame.Rect.clamp
     */
    public clamp(other: RectLike): Rect {
        const result = this.clone();

        if (result.left < other.x) {
            result.left = other.x;
        }

        if (result.right > other.x + other.width) {
            result.right = other.x + other.width;
        }

        if (result.top < other.y) {
            result.top = other.y;
        }

        if (result.bottom > other.y + other.height) {
            result.bottom = other.y + other.height;
        }

        return result;
    }

    public clampIp(other: RectLike): this {
        const clamped = this.clamp(other);
        this.x = clamped.x;
        this.y = clamped.y;
        this.width = clamped.width;
        this.height = clamped.height;

        return this;
    }

    /**
     * pygame.Rect.fit
     */
    public fit(other: RectLike): Rect {
        const result = this.clone();

        result.x = this.centerX - other.width / 2;
        result.y = this.centerY - other.height / 2;
        result.width = other.width;
        result.height = other.height;

        return result;
    }

    // =========================================================
    // UTILIDADES
    // =========================================================

    public get area(): number {
        return this.width * this.height;
    }

    public get isEmpty(): boolean {
        return this.width <= 0 || this.height <= 0;
    }

    public equals(other: RectLike): boolean {
        return (
            this.x === other.x &&
            this.y === other.y &&
            this.width === other.width &&
            this.height === other.height
        );
    }

    public clone(): Rect {
        return new Rect(this.x, this.y, this.width, this.height);
    }

    /** Alias Pygame-style. */
    public copy(): Rect {
        return this.clone();
    }

    public toString(): string {
        return `<Rect(${this.x}, ${this.y}, ${this.width}, ${this.height})>`;
    }

    /** Construye un Rect desde dos esquinas. */
    public static fromPoints(a: Vector2, b: Vector2): Rect {
        const x = Math.min(a.x, b.x);
        const y = Math.min(a.y, b.y);
        const w = Math.abs(a.x - b.x);
        const h = Math.abs(a.y - b.y);

        return new Rect(x, y, w, h);
    }

    /** Construye un Rect centrado en un punto. */
    public static fromCenter(
        center: Vector2,
        width: number,
        height: number
    ): Rect {
        return new Rect(
            center.x - width / 2,
            center.y - height / 2,
            width,
            height
        );
    }
}
export class Time {
    private lastTime = 0;

    private _deltaTime = 0;
    private _elapsedTime = 0;
    private _fps = 0;

    public start(): void {
        this.lastTime = performance.now();
        this._deltaTime = 0;
        this._elapsedTime = 0;
    }

    /**
     * Reinicia solo el timestamp interno sin tocar elapsedTime.
     * Útil al reanudar una pausa para evitar un delta enorme.
     */
    public resetLastTime(): void {
        this.lastTime = performance.now();
        this._deltaTime = 0;
    }

    public tick(currentTime: number): void {
        let delta = (currentTime - this.lastTime) / 1000;

        // Evita valores enormes si la pestaña estuvo congelada.
        delta = Math.min(delta, 0.1);

        this._deltaTime = delta;
        this._elapsedTime += delta;

        this._fps = delta > 0 ? 1 / delta : 0;

        this.lastTime = currentTime;
    }

    public get deltaTime(): number {
        return this._deltaTime;
    }

    public get elapsedTime(): number {
        return this._elapsedTime;
    }

    public get fps(): number {
        return this._fps;
    }
}
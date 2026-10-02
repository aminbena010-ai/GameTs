import { Game } from "../core/Game.js";
import type { Renderer } from "../graphics/Renderer.js";

/** Cualquier cosa con waitForLoad() (Image, Sound...). */
export interface Loadable {
    waitForLoad(): Promise<void>;
}

/** Un recurso a seguir: Image, Sound o cualquier Promise. */
export type SplashAsset = Loadable | Promise<unknown>;

export interface SplashOptions {
    /**
     * Recursos que se están cargando. La barra avanza según
     * cuántos han terminado. Si no se pasa nada, la barra
     * avanza sola durante `minDuration`.
     */
    assets?: SplashAsset[];

    /** Duración mínima del splash en segundos. Por defecto 2.2. */
    minDuration?: number;

    /**
     * Duración máxima en segundos. Si algún recurso no termina
     * nunca de cargar, el splash se completa igualmente al llegar
     * a este límite para no bloquear el juego. Por defecto
     * `minDuration + 5`.
     */
    maxDuration?: number;
}

// ============================================================
// ESTILO
// ============================================================

const LOGO_TEXT_LIGHT = "Game";
const LOGO_TEXT_ACCENT = "Ts";

const FONT_FAMILY =
    '"Poppins", "Inter", "Segoe UI", "Helvetica Neue", Arial, sans-serif';

const FONT_LINK_ID = "gamets-splash-font";
const FONT_URL =
    "https://fonts.googleapis.com/css2?family=Poppins:wght@600&display=swap";

const COLOR_BG_EDGE = "#14161b";
const COLOR_BG_CENTER = "#272c35";
const COLOR_TEXT = "#e3e6ec";
const COLOR_BLUE = "#478cbf";       // azul Godot
const COLOR_BLUE_LIGHT = "#6bb0e6";
const COLOR_BLUE_DARK = "#2f6f9f";
const COLOR_TRACK = "#2b303a";

// Tiempos (segundos)
const NAME_FADE_IN = 0.9;
const BAR_FADE_DELAY = 0.35;
const BAR_FADE_IN = 0.6;
const HOLD_AFTER_DONE = 0.3;
const FADE_OUT = 0.55;

// Márgenes de seguridad (milisegundos / segundos)
const FONT_WAIT_MS = 400;
const MAX_EXTRA = 5;

// ============================================================
// UTILIDADES
// ============================================================

const clamp01 = (v: number): number => Math.max(0, Math.min(1, v));

const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);

const easeInOutCubic = (t: number): number =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

const delay = (ms: number): Promise<void> =>
    new Promise((resolve) => setTimeout(resolve, ms));

/** Carga la tipografía; si falla o tarda, se usa la de reserva. */
async function loadFont(): Promise<void> {
    try {
        if (!document.getElementById(FONT_LINK_ID)) {
            const link = document.createElement("link");

            link.id = FONT_LINK_ID;
            link.rel = "stylesheet";
            link.href = FONT_URL;

            const stylesheet = new Promise<void>((resolve) => {
                link.onload = () => resolve();
                link.onerror = () => resolve();
            });

            document.head.appendChild(link);

            await Promise.race([
                stylesheet,
                new Promise<void>((resolve) => setTimeout(resolve, 800))
            ]);
        }

        await Promise.race([
            document.fonts.load('600 64px "Poppins"').then(() => undefined),
            new Promise<void>((resolve) => setTimeout(resolve, 800))
        ]);
    } catch {
        // Sin tipografía externa: se usa la de reserva.
    }
}

// ============================================================
// SPLASH
// ============================================================

export class Splash {
    private static current: Promise<void> | null = null;

    /**
     * Muestra el splash a pantalla completa y se resuelve cuando
     * termina (barra llena + fundido de salida).
     *
     *   await Splash.init();
     *   await Splash.init({ assets: [image, sound, fetch(...)] });
     */
    public static init(options: SplashOptions = {}): Promise<void> {
        if (!Splash.current) {
            Splash.current = Splash.run(options).finally(() => {
                Splash.current = null;
            });
        }

        return Splash.current;
    }

    private static async run(options: SplashOptions): Promise<void> {
        const minDuration = options.minDuration ?? 2.2;
        const maxDuration = Math.max(
            options.maxDuration ?? minDuration + MAX_EXTRA,
            minDuration
        );
        const assets = options.assets ?? [];

        // --------------------------------------------------------
        // SEGUIMIENTO DE RECURSOS
        // --------------------------------------------------------

        let loaded = 0;

        for (const asset of assets) {
            const promise: Promise<unknown> =
                "waitForLoad" in asset ? asset.waitForLoad() : asset;

            promise
                .catch(() => undefined)
                .then(() => {
                    loaded++;
                });
        }

        // --------------------------------------------------------
        // CANVAS A PANTALLA COMPLETA
        // Se crea antes de cualquier espera: el splash se pinta
        // desde el primer instante, sin pantalla en negro.
        // --------------------------------------------------------

        const dpr = Math.min(window.devicePixelRatio || 1, 2);

        const canvas = document.createElement("canvas");

        canvas.style.position = "fixed";
        canvas.style.left = "0";
        canvas.style.top = "0";
        canvas.style.width = "100vw";
        canvas.style.height = "100vh";
        canvas.style.zIndex = "2147483647";
        canvas.style.display = "block";

        document.body.appendChild(canvas);

        const game = new Game({
            width: Math.max(1, Math.round(window.innerWidth * dpr)),
            height: Math.max(1, Math.round(window.innerHeight * dpr)),
            canvas,
            background: COLOR_BG_EDGE
        });

        const onResize = (): void => {
            const w = Math.round(window.innerWidth * dpr);
            const h = Math.round(window.innerHeight * dpr);

            if (w > 0 && h > 0) {
                game.renderer.resize(w, h);
            }
        };

        window.addEventListener("resize", onResize);

        // --------------------------------------------------------
        // ESTADO
        // --------------------------------------------------------

        let t = 0;
        let shown = 0;
        let doneAt: number | null = null;
        let started = false;
        let finish: (() => void) | null = null;

        game.update((dt) => {
            // La animación empieza cuando la tipografía está lista
            // (o cuando se agota la espera); antes solo se pinta
            // el fondo.
            if (!started) {
                return;
            }

            t += dt;

            // Si algún recurso no llega nunca, se completa igual
            // para no dejar el juego bloqueado para siempre.
            const timedOut = t >= maxDuration;

            const real =
                assets.length === 0 || timedOut
                    ? 1
                    : loaded / assets.length;

            // La barra nunca va más rápido que el tiempo mínimo,
            // ni más rápido que la carga real.
            const paced = easeInOutCubic(clamp01(t / minDuration));
            const target = Math.min(real, paced);

            shown += (target - shown) * (1 - Math.exp(-10 * dt));

            if (
                doneAt === null &&
                real >= 1 &&
                t >= minDuration &&
                shown >= 0.995
            ) {
                shown = 1;
                doneAt = t;
            }

            if (doneAt !== null) {
                const out = clamp01(
                    (t - doneAt - HOLD_AFTER_DONE) / FADE_OUT
                );

                canvas.style.opacity = String(1 - out);

                if (out >= 1) {
                    game.stop();
                    window.removeEventListener("resize", onResize);
                    canvas.remove();
                    finish?.();
                }
            }
        });

        game.draw((renderer) => {
            Splash.draw(renderer, t, shown);
        });

        game.run();

        // La tipografía nunca bloquea el dibujo del fondo.
        await Promise.race([loadFont(), delay(FONT_WAIT_MS)]);

        started = true;

        return new Promise<void>((resolve) => {
            finish = resolve;
        });
    }

    // ========================================================
    // DIBUJO
    // ========================================================

    private static draw(
        renderer: Renderer,
        t: number,
        progress: number
    ): void {
        const ctx = renderer.context;
        const w = renderer.width;
        const h = renderer.height;

        // Unidad: píxeles por "unidad lógica" (diseño base 1280x720).
        const u = Math.min(w / 1280, h / 720);

        const cx = w / 2;
        const nameY = h / 2 - 18 * u;
        const barY = h / 2 + 52 * u;

        // ----- Fondo con viñeta -----

        const bg = ctx.createRadialGradient(
            cx,
            h / 2,
            0,
            cx,
            h / 2,
            Math.max(w, h) * 0.7
        );

        bg.addColorStop(0, COLOR_BG_CENTER);
        bg.addColorStop(1, COLOR_BG_EDGE);

        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, w, h);

        // ----- Nombre: "GameTs" -----

        const nameAlpha = easeOutCubic(clamp01(t / NAME_FADE_IN));
        const rise = (1 - nameAlpha) * 18 * u;

        // Resplandor azul suave detrás del nombre.
        const glow = ctx.createRadialGradient(
            cx,
            nameY,
            0,
            cx,
            nameY,
            260 * u
        );

        glow.addColorStop(0, `rgba(71, 140, 191, ${0.2 * nameAlpha})`);
        glow.addColorStop(1, "rgba(71, 140, 191, 0)");

        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, w, h);

        ctx.save();

        ctx.globalAlpha = nameAlpha;
        ctx.font = `600 ${88 * u}px ${FONT_FAMILY}`;
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";

        const lightWidth = ctx.measureText(LOGO_TEXT_LIGHT).width;
        const accentWidth = ctx.measureText(LOGO_TEXT_ACCENT).width;
        const startX = cx - (lightWidth + accentWidth) / 2;

        ctx.fillStyle = COLOR_TEXT;
        ctx.fillText(LOGO_TEXT_LIGHT, startX, nameY + rise);

        ctx.fillStyle = COLOR_BLUE;
        ctx.fillText(LOGO_TEXT_ACCENT, startX + lightWidth, nameY + rise);

        ctx.restore();

        // ----- Barra de carga (debajo del nombre) -----

        const barAlpha = easeOutCubic(
            clamp01((t - BAR_FADE_DELAY) / BAR_FADE_IN)
        );

        const barW = 380 * u;
        const barH = 6 * u;
        const barX = cx - barW / 2;
        const radius = barH / 2;

        ctx.save();
        ctx.globalAlpha = barAlpha;

        // Pista
        ctx.fillStyle = COLOR_TRACK;
        ctx.beginPath();
        ctx.roundRect(barX, barY, barW, barH, radius);
        ctx.fill();

        // Relleno
        if (progress > 0.001) {
            const fillW = Math.max(barH, barW * progress);

            const fill = ctx.createLinearGradient(barX, 0, barX + barW, 0);
            fill.addColorStop(0, COLOR_BLUE_DARK);
            fill.addColorStop(1, COLOR_BLUE_LIGHT);

            ctx.save();

            ctx.shadowColor = "rgba(71, 140, 191, 0.55)";
            ctx.shadowBlur = 14 * u;

            ctx.fillStyle = fill;
            ctx.beginPath();
            ctx.roundRect(barX, barY, fillW, barH, radius);
            ctx.fill();

            ctx.restore();

            // Brillo que recorre el relleno
            ctx.save();

            ctx.beginPath();
            ctx.roundRect(barX, barY, fillW, barH, radius);
            ctx.clip();

            const stripW = 90 * u;
            const sweep = ((t * 0.8) % 1.5) - 0.25;
            const stripX = barX + sweep * barW - stripW / 2;

            const shine = ctx.createLinearGradient(
                stripX,
                0,
                stripX + stripW,
                0
            );

            shine.addColorStop(0, "rgba(255, 255, 255, 0)");
            shine.addColorStop(0.5, "rgba(255, 255, 255, 0.35)");
            shine.addColorStop(1, "rgba(255, 255, 255, 0)");

            ctx.fillStyle = shine;
            ctx.fillRect(stripX, barY, stripW, barH);

            ctx.restore();
        }

        ctx.restore();
    }
}

# Changelog

Todos los cambios notables de GameTS se documentan en este archivo.
El formato sigue [Keep a Changelog](https://keepachangelog.com/es/1.1.0/)
y el versionado sigue [SemVer](https://semver.org/lang/es/).

## [0.1.5] - 2026-10-01

### Añadido
- `Rect` ahora implementa la API completa de colisiones estilo
  `pygame.Rect`:
  - `collidepoint(x, y)` y `collidepoint(point)`
  - `colliderect(other)`
  - `collidecircle(center, radius)`
  - `collidelist(list)` y `collidelistall(list)`
  - `collidedict(map)` y `collidedictall(map)`
  - `clip(other)`, `union(other)`, `unionall(list)`
  - `inflate(x, y)`, `clamp(other)`, `fit(other)`
  - Propiedades `left`, `right`, `top`, `bottom`, `center`,
    `centerX`, `centerY`, `topleft`, `topright`, `bottomleft`,
    `bottomright`, `midtop`, `midleft`, `midright`, `midbottom`
    con setters (idéntico a pygame)
  - `move(x, y)` devuelve un nuevo `Rect` (Pygame-style)
  - `moveInPlace(x, y)` muta el `Rect` actual
  - `moveToCenter(point)`, `moveToPoint(point)`
- Métodos estáticos en `Rect`:
  - `Rect.fromPoints(a, b)`
  - `Rect.fromCenter(center, width, height)`
  - `Rect.collideCircleCircle(a, ra, b, rb)`
  - `Rect.collidePointCircle(p, c, r)`
- Método `copy()` (alias de `clone()`) en `Rect`, `Vector2`,
  `Color`, `Image`, `Sprite` y `Sound`, para coherencia con la API
  de Pygame.
- `Sound.copy()` crea un `Sound` nuevo con su propio
  `HTMLAudioElement`, permitiendo reproducir el mismo sonido dos
  veces solapadas.
- `Sprite` con soporte de posición, escala, rotación, origen,
  flip, opacidad, visibilidad y colisión AABB.
- `Sound` para reproducir audio con volumen, loop, pause y stop.
- Exportado el tipo `RectLike` desde `index.ts`.

### Cambiado
- `Rect.move(x, y)` ya no muta el rect: ahora devuelve uno nuevo
  (comportamiento de Pygame). Usa `moveInPlace(x, y)` para mutar.
- `Rect.intersects()` ahora es un alias de `colliderect()`.
- `Rect.containsPoint()` ahora es un alias de `collidepoint()`.
- `Rect.colliderect()` acepta cualquier `RectLike`, no solo `Rect`.

### Corregido
- Ninguno.

## [0.1.1] - 2026-10-01

### Corregido
- `Keyboard.isPressed()` / `Keyboard.isReleased()` y sus equivalentes
  en `Mouse` quedaban bloqueados en `true` tras la primera pulsación,
  porque `Keyboard.update()` y `Mouse.update()` nunca se llamaban.
  Ahora `Game.run()` los invoca automáticamente cada frame.
- `Game.resume()` reiniciaba `elapsedTime` a 0 al reanudar una pausa.
  Ahora el tiempo transcurrido se conserva entre pausas.
- `Color.toString()` devolvía componentes RGB con decimales.
  Ahora los redondea.

### Añadido
- `Renderer` aplica el `background` configurado al construir el canvas.
- `Keyboard.initialize()` acepta un objeto de configuración con una
  lista de teclas a las que hacer `preventDefault`.
- `GameConfig.preventDefaultKeys`.
- `Renderer.text()` acepta un objeto de opciones con `color`, `font`,
  `align`, `baseline` y `maxWidth`.
- `Image.error` expone el error de carga si la imagen falla.
- `Time.resetLastTime()`.

## [0.1.0] - 2026-09-XX

### Añadido
- Versión inicial de GameTS.
- Core: `Game`, `Time`.
- Graphics: `Renderer`, `Image`, `Color`.
- Input: `Keyboard`, `Mouse`.
- Math: `Vector2`, `Rect`.
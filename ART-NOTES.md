# Adaptación del arte aprobado

Se usó la herramienta integrada de edición de imágenes (ImageGen). Referencia: concept art aprobado de Valle Esmeralda. Las imágenes fueron revisadas directamente después de generarlas.

## Escenario jugable — public/art/level-1.png

Use case: precise-object-edit. Edit target: attached approved Valle Esmeralda game concept. Create the actual gameplay background plate by removing ONLY all UI: logo top left, level sign, top parchment, counters, hearts, menu, speech bubble, bottom curvatura panel, bottom wooden text sign, bottom professor portrait/dialog panel; also remove the white dotted aiming curve and the two white projectile dots. Inpaint their areas with continuous scenery. Preserve EVERYTHING ELSE as nearly pixel-identical as possible: exact painterly detailed cartoon fantasy style, composition, aspect ratio 3:2, landscape, foliage, towers, ruins, waterfalls, little white wolf hero with blue cloak and goggles at left, blue/brass cannon at left, bandit with red bandana and club at right on wooden platform, crate, barrel, banner, blue glowing crystal on right stone column. Keep hero feet at 60% height, cannon mouth at 24% width 50% height, bandit at 74% width 41% height, crystal at 93% width 38% height. NO redesign, NO flat vectors, NO new objects, NO text or UI or trajectories. Preserve approved art, clean surgical removal of UI only. Output high quality landscape image.

## Regiones de victoria — public/art/level-1-cleared.png

Use case: precise-object-edit. Edit target: supplied game background. Make a level-completed plate. Remove ONLY the red-bandana bandit with club standing on right wooden platform (roughly x1070..1195 y360..474 in 1536x1024 image) and ONLY the glowing blue floating crystal over far right stone column (roughly x1380..1468 y344..438), including its glow. Inpaint with the matching distant scenery behind them. Keep the entire rest of image unchanged and pixel-aligned: same size, same landscape, hero, cannon, platform, crate, barrel, banner, stone column. Do not remove platform, do not move anything. No text, no UI, no additional characters. Exact same framing and dimensions 1536x1024.

La segunda imagen se muestra únicamente en las dos regiones donde desaparecen el Saqueador y el cristal; el resto conserva la primera lámina.

## Expresión de sorpresa — public/art/hero-surprised.png

Edición con ImageGen integrado usando level-1.png como referencia. Prompt: Change ONLY the small white wolf hero facial expression at x145..200 y504..549: surprised small open O mouth, raised eyebrows, eyes looking up and right after a missed shot; friendly surprise, not sadness. Preserve exact identity, silhouette, goggles, fur, body, scale and location. Keep the entire rest of the 1536x1024 plate pixel aligned. No text, effects or UI. Solo se muestra la región del rostro para conservar el escenario aprobado.


## Expresiones del Saqueador (ImageGen integrado)

public/art/enemy-happy.png:
Precise-object-edit of attached approved 1536x1024 game scene. Edit ONLY bandit facial expression at x1100..1160 y390..429. Make him visibly laughing gleefully with a broad open laughing mouth, squinting happy eyes, amused by player's missed shot. Preserve exact bandit identity, red bandana, head silhouette, scale, location, body and club. Entire rest of scene pixel aligned unchanged. Do not move or redesign anything. No UI, text or added effects. Output exact same 1536x1024 framing. The face will be clipped into the original game plate.

public/art/enemy-angry.png:
Precise-object-edit of attached approved 1536x1024 game scene. Edit ONLY bandit facial expression at x1100..1160 y390..429. Make him visibly angry and frustrated: sharply furrowed brows, scowling eyes and clenched teeth after being hit. Comic child-friendly frustration, no injuries. Preserve exact bandit identity, red bandana, head silhouette, scale, location, body and club. Entire rest of scene pixel aligned unchanged. Do not move or redesign anything. No UI, text or added effects. Output exact same 1536x1024 framing. The face will be clipped into the original game plate.


## Nivel 2 — public/art/level-2.png

Herramienta: ImageGen integrado. Prompt: Preserve the approved 1536x1024 game scene pixel aligned. Add only one narrow tall wooden barricade immediately left of the bandit's platform, standing on the right grassy cliff, solid wooden planks with iron braces in the same painterly cartoon fantasy style. Keep hero, cannon, enemy, crystal, platform, scenery and framing unchanged. No text, UI or trajectory. Se ajustó la colisión a la posición visible de la barrera generada.

## Recursos de Nivel 3 — ImageGen integrado

public/art/level-3.png. Prompt: Preserve the approved 1536x1024 game plate pixel aligned; add only a second red-bandana Saqueador with matching design on the lower right grassy ledge, right of the platform/barrel and left of the crystal column. Preserve existing hero, cannon, enemy, barrel, crystal and scenery. No UI or text.

public/art/barrel-cleared.png. Prompt: Remove only the explosive red barrel from the approved plate and reconstruct the wooden beams and distant scenery behind it. Preserve the entire rest of the image pixel aligned. No effects, text or other changes.

public/art/approved-reference.png es una copia de la referencia aprobada del usuario; solo se encuadra el retrato original del Profe Dani B mediante la vista del componente, sin regenerar su diseño.

## Nivel 4 — public/art/level-4.png

ImageGen integrado, edición directa de level-1.png. Prompt: Adapt approved Valle Esmeralda scene to an outdoor inventor workshop. Keep framing, valley, waterfalls, hero and cannon. Replace bandit with brass/cyan concentric training target on stand centered near x1135 y422. Remove explosive barrel and pirate banner; use a blue gear-emblem banner. Add a cozy timber workshop under the left tree with tools, gears and lantern, without obscuring hero/cannon. Preserve crystal, detailed painterly cartoon fantasy style. No UI, text or trajectories.

## Cañón móvil del Nivel 4

public/art/workshop-no-cannon.png. ImageGen integrado, edición precisa de level-4.png. Se eliminó únicamente el cañón azul y dorado y se reconstruyeron el taller, la vegetación y el suelo detrás, preservando al protagonista y el resto del escenario.

public/art/workshop-cannon.png. ImageGen integrado, extracción visual del mismo cañón del Nivel 4. En el juego se recorta a su silueta y se coloca sobre la lámina sin cañón. Su desplazamiento vertical usa exactamente el mismo valor que el origen de la parábola, por lo que el proyectil sale de la boca en cualquier valor de ALTURA.

// Génère les icônes PNG de la PWA (public/pwa-*.png, apple-touch-icon.png)
// à partir d'un dessin de feuille, via resvg-wasm (pas de dépendance native).
//   npm run icones
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { initWasm, Resvg } from '@resvg/resvg-wasm'

const racine = join(dirname(fileURLToPath(import.meta.url)), '..')
await initWasm(readFileSync(join(racine, 'node_modules/@resvg/resvg-wasm/index_bg.wasm')))

// Feuille MonAgri dans un repère 512, centrée autour de (256, 256).
// `echelle` agrandit la feuille par rapport au fond (marge = zone de sécurité).
function svgIcone(echelle) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="#68724f"/>
  <g transform="translate(256 256) scale(${echelle}) scale(16) translate(-16 -16)"
     fill="none" stroke="#f7f2e7" stroke-width="${(2 / echelle).toFixed(3)}"
     stroke-linejoin="round" stroke-linecap="round">
    <path d="M24.5 6.5S11.5 7.5 8.7 16c-2.6 7.8 2.8 8.8 2.8 8.8s9.4-1 12.2-9c1.4-4 .8-9.3.8-9.3Z"/>
    <path d="M10.8 24.2C12.2 17.4 15.5 13.4 21.5 10.6"/>
  </g>
</svg>`
}

const png = (svg, taille) =>
  new Resvg(svg, { fitTo: { mode: 'width', value: taille } }).render().asPng()

const plein = svgIcone(1.28) // icônes « any » + apple-touch
const maskable = svgIcone(1.02) // marge pour le masquage Android

const sorties = [
  ['public/pwa-64x64.png', plein, 64],
  ['public/pwa-192x192.png', plein, 192],
  ['public/pwa-512x512.png', plein, 512],
  ['public/apple-touch-icon.png', plein, 180],
  ['public/pwa-maskable-512x512.png', maskable, 512],
]

for (const [chemin, svg, taille] of sorties) {
  writeFileSync(join(racine, chemin), png(svg, taille))
  console.log('écrit', chemin)
}

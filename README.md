# 🥔 Potato Farm

Un **clicker / idle game** d'élevage de patates, 100 % web : aucune image externe,
tout est dessiné en **SVG/CSS** dans le code, dans un style **anime/cartoon**
(contours épais, couleurs saturées, gros yeux brillants, joues roses).

## 🎮 Gameplay

- **Cliquez sur la patate** pour gagner des **Patacoins** (elle danse en boucle,
  rebondit à chaque clic, avec un « +X » flottant).
- **Arroser** : ×2 de production pendant 30 s (recharge 60 s), arrosoir animé avec gouttes.
- **Ajouter de la terre** : ravitaille la jauge de **nutriments** (vide = malus,
  pleine = bonus).
- **Changer de terre** : 5 sols débloquables (basique → terreau → volcanique →
  lunaire → cosmique), chacun avec un **multiplicateur** et une **couleur visible**.
- **Boutique** : 8 bâtiments de production passive (Ver de terre → Noyau patatier)
  au prix **exponentiel** (`base × 1.15^niveau`, raffiné par palier de 25) et
  8 améliorations de clic (additives et multiplicatives).
- **Nombres grands** formatés : `1.2K`, `3.4M`, `5.6B`, puis `aa`, `ab`, …

### Évolution visuelle de la patate

Chaque achat améliore visiblement la patate : chapeau de paille, lunettes de
soleil, couronne, cape, aura, ailes — puis des évolutions de forme selon le gain
de vie : **Patate → Super Patate → Patate Dorée → Patate Cosmique → Patate
Transcendante**.

Chaque achat déclenche des **effets proportionnels au prix** (barème `log10`) :
quelques étincelles → confettis + flash → explosion plein écran, secousse,
rayons de lumière → **pluie de mini-patates**.

### Fonctionnalités bonus

- 🌟 **Patate dorée** : apparaît aléatoirement, 10 s pour la capturer = gros gain.
- 🏆 **17 succès** avec toasts animés (premier clic, 1 000 clics, 1 M, toutes les
  terres, prestige, combo max…).
- 🌱 **Prestige « Replanter »** : reset contre **Graines légendaires**
  (`⌊√(gagné/1 M)⌋`), +2 % de production **permanente** par graine.
- 🌦️ **Météo aléatoire** : pluie (bonus ×1.5 + nutriments), soleil (×1.3), orage
  (×2 + éclair), avec décor animé.
- 📴 **Gains hors-ligne** : production passive au retour, **plafond 8 h**,
  popup récapitulative.
- ⚡ **Combo** : clics rapides = multiplicateur temporaire avec jauge (jusqu'à ×2.5).
- 📊 **Statistiques** : total gagné, clics, temps de jeu, meilleur combo… +
  bouton **reset** complet (double confirmation).
- 🔊 **Sons optionnels** (Web Audio API, aucun asset), **coupés par défaut**,
  bouton mute dans le bandeau.

### UX / accessibilité

- Responsive : patate au centre, boutique à droite sur desktop, **tiroir bas**
  sur mobile.
- Boutons achetables mis en évidence (brillance animée), non achetables grisés
  avec le montant manquant.
- Labels ARIA, `prefers-reduced-motion` réduit/disactive les effets,
  patate cliquable au clavier (Entrée/Espace).
- **Sauvegarde automatique** dans `localStorage` toutes les 5 s et au départ de
  la page.

## 🧱 Stack

- **Next.js 15** (App Router) + **TypeScript** + **Tailwind CSS 4**
- **framer-motion** (danse, rebonds, toasts, tiroir)
- **zustand** (état client) + persistance `localStorage`
- **canvas-confetti** (particules)
- **vitest** (tests de la logique pure)
- **Capacitor 8** (empaquetage Android)

## 🚀 Commandes

```bash
npm install          # dépendances
npm run dev          # serveur de dev (http://localhost:3000)
npm run dev -- -H 0.0.0.0 -p 3100   # démo accessible sur le réseau
npm run build        # build de production
npm start            # sert le build de production
npm run lint         # ESLint
npm test             # vitest (46 tests : coûts exponentiels, formatage,
                     # prestige, gains hors-ligne, combo, météo, succès…)
```

## 🤖 Android (APK)

Le jeu est empaqueté en **APK** avec [Capacitor](https://capacitorjs.com)
(`@capacitor/core` + `@capacitor/android`) :

- `next.config.ts` est en **`output: "export"`** : `npm run build` génère un
  site statique dans `out/` (images non optimisées, aucun backend requis).
- `capacitor.config.ts` : `appId = com.alexandrelebegue.potatoclicker`,
  `appName = "Potato Clicker"`, `webDir = out`.

```bash
# Build local de l'APK debug (nécessite Node >= 22, Java 21 et l'Android SDK)
npm run build
npx cap sync android
cd android && ./gradlew assembleDebug
# -> android/app/build/outputs/apk/debug/app-debug.apk
```

Le workflow GitHub **`.github/workflows/android.yml`** (push sur `main`,
pull requests, ou manuel via *Actions*) fait exactement la même chose sur
`ubuntu-latest` (Node 22, Java 21 Temurin) et **publie l'APK debug en
artifact** : `potato-clicker-debug.apk`, téléchargeable dans l'onglet
*Artifacts* de chaque run.

## 📁 Organisation

```
app/                  # App Router (layout, page, globals.css : thème + keyframes)
components/           # UI : PotatoSvg, SoilPlot, PotatoScene, Shop, TopBar,
                      # WeatherLayer, GoldenPotato, Toasts, FxLayer, modales…
lib/
  data.ts             # définitions : bâtiments, améliorations, terres, succès,
                      # météo, évolutions, constantes
  game.ts             # formules pures : coûts, cps, clic, combo, prestige,
                      # hors-ligne, évolution, barème d'effets (testé)
  format.ts           # formatage des nombres (1.2K, 3.4M, aa, ab…) et durées
  persistence.ts      # sauvegarde / chargement / assainissement localStorage
  sound.ts            # sons Web Audio (optionnels, coupés par défaut)
  fx.ts               # bus d'événements pour les effets visuels
store/useGame.ts      # store zustand : boucle de jeu (tick 250 ms), achats,
                      # arrosage, prestige, météo, patate dorée, autosave
tests/                # tests vitest de la logique pure
```

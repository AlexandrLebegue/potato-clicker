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
- 🎵 **Musique** : lecteur « MIDI-like » 100 % Web Audio (oscillateurs, aucun
  fichier audio), **7 morceaux** à débloquer dans la boutique (onglet
  *Musique*) avec des **graines légendaires** (1 → 25, prix croissants) :
  4 chants de marins du **domaine public** (Blow the Man Down, Drunken Sailor,
  The Wellerman, Sailor's Hornpipe — transcriptions approchées) + 3
  compositions originales, dont **« Le Corsaire de la baie »** (ambiance
  pirate, sol mineur). **Pas de lecture en arrière-plan** : chaque clic sur
  la patate joue la *note suivante* du morceau sélectionné — c'est le joueur
  qui crée le rythme ; la note a une durée courte et fixe et est coupée par
  le clic suivant ; si vous vous arrêtez de cliquer, le son s'arrête.
  L'indicateur de progression dans le morceau est visible dans la boutique
  (onglet *Musique*) et dans les réglages.
  Réglages (bouton engrenage) : volume musique / effets, coupure du son,
  notes on/off. Le son ne démarre qu'après votre premier geste
  (contrainte navigateur/WebView).
- 🌱 **Graines légendaires** : monnaie de prestige, gagnées en « Replantant »
  (`⌊√(gagné/1 M)⌋` graine(s)`) ; elles débloquent les morceaux de musique.

### UX / accessibilité

- **Téléphone sans défilement** : tout tient dans `100dvh` (+ safe-areas
  notch/gestes : `viewport-fit=cover`, `env(safe-area-inset-*)`) — la patate
  est **posée sur la terre** (visible sous elle), la boutique est un tiroir
  bas **défilable à l'intérieur uniquement**, les menus sont des panneaux.
  Vérifié automatiquement avec **Playwright** en portrait `360×740` et
  `412×915` (captures dans `tests/screenshots/`, script `scripts/visual-check.mjs`).
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
- **vitest** + **Playwright** (tests de la logique + vérification visuelle)
- **Capacitor 8** (empaquetage Android)

## 🚀 Commandes

```bash
npm install          # dépendances
npm run dev          # serveur de dev (http://localhost:3000)
npm run dev -- -H 0.0.0.0 -p 3100   # démo accessible sur le réseau
npm run build        # build de production (export statique -> out/)
npm start            # sert le build de production
npm run lint         # ESLint
npm test             # vitest (55 tests : coûts exponentiels, formatage,
                      # migration de sauvegarde v1 -> v2, export/import,
                      # prestige, gains hors-ligne, combo, météo, succès…)
# Vérification visuelle du layout (necessite le build + Chromium Playwright) :
npm run build && node scripts/visual-check.mjs
# Régénérer toutes les icônes (Android + web) depuis assets/icon/*.svg :
node scripts/generate-icons.mjs
```

## 🤖 Android (APK)

Le jeu est empaqueté en **APK** avec [Capacitor](https://capacitorjs.com)
(`@capacitor/core` + `@capacitor/android`) :

- `next.config.ts` est en **`output: "export"`** : `npm run build` génère un
  site statique dans `out/` (images non optimisées, aucun backend requis).
- `capacitor.config.ts` : `appId = com.alexandrelebegue.potatoclicker`,
  `appName = "Potato Farm"`, `webDir = out`.
- L'icône est une **patate cartoon** du style du jeu : source SVG dans
  `assets/icon/`, toutes les tailles générées par
  `node scripts/generate-icons.mjs` (icône **adaptative** Android
  foreground/background + legacy carré/ronde, favicon, apple-touch-icon,
  web manifest — aucun outil payant).

```bash
# Build local de l'APK (nécessite Node >= 22, Java 21 et l'Android SDK)
npm run build
npx cap sync android
cd android && ./gradlew assembleDebug
# -> android/app/build/outputs/apk/debug/app-debug.apk
```

### 🔐 Signature fixe & mise à jour sans perte de données

**Pourquoi c'est important.** Avant, l'APK debug de la CI était signé avec une
clé *debug* **regénérée sur chaque runner** : Android refusait alors
l'installation de la nouvelle version par-dessus l'ancienne (signatures
différentes) et il fallait **désinstaller** l'appli = **perte de la
sauvegarde** (`localStorage`).

**La correction.** Tous les builds (CI et locale) sont signés avec **un même
keystore fixe** (RSA 2048, validité 30 ans, alias `potato`) :

- Le keystore vit **hors du dépôt** : `~/potato-keystore/potato-clicker.keystore`
  (jamais commité ; `android/keystore/` est dans `.gitignore`).
- **Côté CI** : il est stocké en **secrets GitHub** et décodé à la volée par
  le workflow. Les **4 secrets à créer** (Réglages → Secrets → *Actions*) :
  | Secret | Contenu |
  |---|---|
  | `POTATO_KEYSTORE_B64` | `base64 potato-clicker.keystore` (le fichier binaire encodé) |
  | `POTATO_KEYSTORE_STORE_PASSWORD` | mot de passe du store |
  | `POTATO_KEYSTORE_KEY_PASSWORD` | mot de passe de la clé (ici = store password) |
  | `POTATO_KEYSTORE_ALIAS` | `potato` |
- **Côté local** : `android/app/build.gradle` pointe sur le keystore via la
  variable d'env `POTATO_KEYSTORE_FILE` (+ `POTATO_KEYSTORE_STORE_PASSWORD`,
  `POTATO_KEYSTORE_KEY_PASSWORD`, `POTATO_KEYSTORE_ALIAS`). Sans ces variables,
  il retombe sur la signature debug automatique (dev uniquement).
- **Versioning automatique** : en CI, `versionCode = numéro de run GitHub`
  (toujours croissant) et `versionName = tag` (ex. `v2.0.0`) ou `0.0.0-ci<n>`.
  Localement, `versionCode` est volontairement élevé (2 000 000) pour pouvoir
  installer un build local par-dessus un build CI, et inversement.

**Ce qui est garanti au moment d'une mise à jour d'APK :**
- **Même signature** → Android autorise l'installation **par-dessus** l'ancienne
  version (pas de désinstallation).
- **Même `applicationId`** (`com.alexandrelebegue.potatoclicker`) +
  `versionCode` **strictement supérieur** → la mise à jour est acceptée.
- **La sauvegarde survit** : elle est dans `localStorage`, qui n'est pas touché
  par une mise à jour par-dessus (seule une *désinstallation* l'efface).
- En plus, la sauvegarde est **versionnée** (format `version`, avec
  **migrations** v1→v2 dans `lib/persistence.ts`) : une ancienne sauvegarde est
  lue et **ré-écrite** au nouveau format sans perte, et une sauvegarde
  illisible n'est **jamais effacée** (mise de côté dans
  `potato-farm-save-backup`).
- **Filet de sécurité** : dans les réglages, **Exporter / Importer** la
  sauvegarde en **code texte** (`POTATO2:…`) : exportez avant une mise à jour
  risquée, réimportez sur l'appareil suivant. L'import d'un code invalide ne
  modifie jamais la partie actuelle.

**Procédure recommandée pour mettre à jour sur un téléphone :**
1. (Optionnel, prudence) *Réglages → Exporter la sauvegarde* → copier le code.
2. Installer la nouvelle APK **par-dessus** l'ancienne (téléphone →
   « Installer l'application »). La progression est conservée.
3. Au 1er lancement, la sauvegarde v1 est migrée automatiquement au format v2.
4. (Si besoin) *Réglages → Importer la sauvegarde* → coller le code.

Le workflow GitHub **`.github/workflows/android.yml`** (push sur `main`,
pull requests, tags `v*`, ou manuel via *Actions*) fait exactement la même
chose sur `ubuntu-latest` (Node 22, Java 21 Temurin) : il décode le keystore
fixe, **signe l'APK** avec lui, et **publie** l'APK en **artifact**
(`potato-clicker-debug.apk`, téléchargeable dans l'onglet *Artifacts*) ainsi
qu'en **release GitHub** quand le trigger est un tag `v*`.

## 📁 Organisation

```
app/                  # App Router (layout, page, icon.svg, apple-icon,
                      # favicon, manifest, globals.css : thème + keyframes)
components/           # UI : PotatoSvg, SoilPlot, PotatoScene, Shop, TopBar,
                      # WeatherLayer, GoldenPotato, Toasts, FxLayer, modales…
lib/
  data.ts             # définitions : bâtiments, améliorations, terres, succès,
                      # météo, évolutions, constantes (dont clés de sauvegarde)
  game.ts             # formules pures : coûts, cps, clic, combo, prestige,
                      # hors-ligne, évolution, barème d'effets (testé)
  format.ts           # formatage des nombres (1.2K, 3.4M, aa, ab…) et durées
  persistence.ts      # sauvegarde versionnée : chargement, migration v1->v2,
                      # mise de côté, assainissement, export/import de code
  audio.ts            # AudioContext partagé + buses master/effets/musique
  music.ts            # lecteur « MIDI-like » Web Audio (oscillateurs) :
                      # 1 clic = la note suivante (pas de lecture en boucle)
  musicTracks.ts      # les 7 morceaux stockés en notes (+ prix en graines)
  sound.ts            # sons d'effets Web Audio (sur la bus « effets »)
  fx.ts               # bus d'événements pour les effets visuels
store/useGame.ts      # store zustand : boucle de jeu (tick 250 ms), achats,
                      # arrosage, prestige, météo, patate dorée, musique,
                      # réglages, export/import, autosave
assets/icon/          # source SVG de l'icône (patate cartoon)
scripts/
  generate-icons.mjs  # génère toutes les icônes (Android + web) depuis le SVG
  visual-check.mjs    # vérification layout Playwright (360×740, 412×915, desktop)
tests/                # tests vitest de la logique pure
tests/screenshots/    # captures de la vérification visuelle
```

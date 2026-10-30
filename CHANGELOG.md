# Changelog

Format inspiré de [Keep a Changelog](https://keepachangelog.com/fr/1.1.0/).

## [v2.0.2] — 2026-10-30

### Musique : plus aucune lecture en arrière-plan (retour Chef)

- **La lecture automatique / en boucle est supprimée** du moteur Web Audio
  (`lib/music.ts`) : le **seul mode** est maintenant **« 1 clic = 1 note »** —
  chaque clic sur la patate joue la **note suivante** du morceau sélectionné.
  C'est le joueur qui crée le rythme ; la note a une **durée courte et fixe**
  (~0,18 s) et est **coupée par le clic suivant** ; **aucune note sans clic** :
  si le joueur s'arrête, le son s'arrête.
- Le toggle « 1 clic = 1 note » des réglages est **supprimé** (c'est devenu le
  seul mode) : il reste un interrupteur **« Une note sonne à chaque clic sur
  la patate »** (on/off) + volume musique. Le champ `clickNote` n'existe plus
  dans la sauvegarde (les vieilles sauvegardes qui l'avaient se chargent sans
  problème, le champ est ignoré).
- **Indicateur de progression dans le morceau** (nouveau composant
  `components/TrackProgress.tsx`) : note suivante / total + barre de
  progression, visible dans la **boutique (onglet Musique**, ligne du morceau
  sélectionné) et dans les **réglages** ; remis à zéro au changement de
  morceau.
- Tests : `tests/music.test.ts` ajouté (fréquences, données des 7 morceaux,
  moteur sans AudioContext) ; tests de persistance mis à jour.
- **Correction** : `noteToFreq` ne reconnaissait que les dièses — le `Bb4`
  d'un morceau original était joué à la mauvaise hauteur depuis v2.0.0 ;
  les bémols (Bb, Db, Eb, Gb, Ab) sont maintenant gérés.

## [v2.0.1] — 2026-10-30

### Correction (retour Chef)

- **Le menu « Réglages » n'apparaît plus deux fois sur téléphone** : le
  **bouton « Réglages » de la barre du bas est supprimé** (il doublonnait
  l'**icône engrenage du bandeau haut**, toujours présente). La barre du bas
  mobile ne garde que **Boutique** et **Stats**, répartis en **2 boutons
  équilibrés** (`flex-1`).
- Captures Playwright `360×740` / `412×915` régénérées ; lint, 55 tests et build
  verts.

## [v2.0.0] — 2026-10-30

### Conserver la progression d'une mise à jour d'APK à l'autre (priorité 1)

- **Keystore de signature fixe** (RSA 2048, 30 ans) généré **hors du dépôt**
  (`~/potato-keystore/potato-clicker.keystore`) et stocké en **secrets GitHub** ;
  le workflow CI le décode et signe l'APK debug **avec cette même clé** pour
  chaque build. Avant, la clé debug était recréée à chaque runner et Android
  imposait une désinstallation (perte de la sauvegarde).
- **Versioning auto** : en CI `versionCode = numéro de run` (croissant),
  `versionName = tag` (ex. `v2.0.0`) ; build local `versionCode = 2000000`
  (installable par-dessus un build CI).
- **Sauvegarde versionnée** (`version` + **migrations** dans `lib/persistence.ts`) :
  une sauvegarde **v1** (ancien champ `v`) est lue puis **ré-écrite en v2** au
  chargement, que vienne-t-elle de la clé courante ou de l'ancienne clé
  `potato-farm-save-v1`.
- **Aucune sauvegarde n'est jamais détruite** : si le JSON est illisible ou la
  version inconnue, il est **mis de côté** dans `potato-farm-save-backup`
  (et jamais effacé).
- **Réglages → Exporter / Importer** la sauvegarde en **code texte**
  (`POTATO2:…`, base64) : filet de sécurité pour une mise à jour d'APK ou un
  changement d'appareil. Un import **invalide ne modifie jamais** la partie
  actuelle.
- **Tests** : migration v1→v2 (2 clés), mise de côté, aller-retour export/import,
  rejet des codes invalides.

### Mise en page téléphone

- **Écran principal sans défilement** : tout tient dans `100dvh` + safe-areas
  (`viewport-fit=cover`, `env(safe-area-inset-*)`) ; zoom pincement désactivé.
- **La patate est posée sur la terre** : le pot/la terre sont **visibles sous
  la patate** (chevauchement calibré) au lieu d'être masqués.
- La **jauge de nutriments** passe en **HTML** (jamais derrière la patate) et la
  jauge de combo est intégrée à la scène.
- La **boutique** est un **tiroir bas défilable à l'intérieur uniquement** ;
  menus en panneaux. Boutons d'action compacts sur mobile.
- **Vérification Playwright** (`scripts/visual-check.mjs`) en portrait
  `360×740` et `412×915` + desktop `1440×900` : 0 px de défilement, terre
  chevronne le bas de la patate, rien n'est coupé ; **captures dans
  `tests/screenshots/`**.

### Musique « MIDI » débloquable avec les graines

- **Lecteur 100 % Web Audio** (oscillateurs, aucune dépendance lourde, aucun
  fichier audio) ; les **mélodies sont stockées en notes** dans le code
  (`lib/music.ts`, `lib/musicTracks.ts`).
- **7 morceaux** débloquables dans la boutique (onglet *Musique*) avec des
  **graines légendaires** (1 → 25, prix croissants) : 4 chants de marins du
  **domaine public** (Blow the Man Down, Drunken Sailor, The Wellerman,
  Sailor's Hornpipe) + 3 compositions originales, dont **« Le Corsaire de la
  baie »** (ambiance pirate). **Aucune musique protégée n'est recopiée.**
- **Mode « 1 clic = 1 note »** : chaque clic sur la patate joue la note suivante
  du morceau sélectionné (la mélodie avance au rythme des clics).
- **Réglages** : volumes musique / effets, coupure du son ; le son ne démarre
  qu'après une interaction (règle navigateur/WebView).
- **Graines** : gagnées lentement via le **prestige « Replanter »**
  (`⌊√(gagné/1 M)⌋`) ; elles débloquent la musique.

### Icône d'application

- **Patate cartoon** dans le style du jeu, **source SVG dans le dépôt**
  (`assets/icon/`).
- **Toutes les tailles générées** par `node scripts/generate-icons.mjs`
  (sharp, gratuit) : Android **adaptative** (foreground/background, 5 densités)
  + legacy **carré/ronde** (48→192) ; web **favicon** (`.ico` + `.svg`),
  **apple-touch-icon**, **manifest** (192/512/**maskable**).

### Divers

- Nom de l'app aligné sur **Potato Farm** (`strings.xml`).
- README : procédure de mise à jour d'APK, secrets à créer, règles des graines.

### Ce qui reste / à savoir

- **À faire côté GitHub** (si pas déjà fait) : créer les **4 secrets** du
  tableau README → *Android → Signature fixe* (`POTATO_KEYSTORE_B64`,
  `POTATO_KEYSTORE_STORE_PASSWORD`, `POTATO_KEYSTORE_KEY_PASSWORD`,
  `POTATO_KEYSTORE_ALIAS`). Sans eux, la CI retombe sur la signature debug
  auto (fonctionnel en dev, mais sans garantie de mise à jour par-dessus).
- Les **morceaux** sont des transcriptions approchées des airs traditionnels ;
  un vrai rendu « piano » plus riche reste possible (harmonisation) si on veut.
- La **jauge de nutriments** est désormais une pastille HTML entre le pot et
  les boutons ; son placement exact est un choix de mise en page à affiner si
  besoin.

# MonAgri — Frontend

Interface web de MonAgri. **React + Vite**. Consomme l'API
[MonAgri-backend](https://github.com/flynacorp/MonAgri-backend) pour toutes les
données, et **Supabase Auth** directement pour la connexion / inscription.

## Stack

- **React 19** + **Vite**
- **react-router-dom** — navigation
- **@supabase/supabase-js** — auth uniquement (récupère le JWT de session)

## Démarrage

```bash
npm install
cp .env.example .env.local   # puis renseigner les 3 variables
npm run dev                  # http://localhost:5173
```

Le backend doit tourner en parallèle (`npm run dev` dans MonAgri-backend,
port 3000). En dev il accepte toutes les origines (CORS).

## Configuration (`.env.local`)

| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | URL du projet Supabase (même que le backend) |
| `VITE_SUPABASE_ANON_KEY` | clé publishable / anon |
| `VITE_API_URL` | URL de l'API backend (`http://localhost:3000` en dev) |

Ces valeurs partent dans le navigateur — ce ne sont pas des secrets — mais on les
garde hors du dépôt (`.env*` est ignoré, sauf `.env.example`).

## Structure

```
src/
  supabase.js        client Supabase (auth seulement)
  AuthContext.jsx    <AuthProvider> + hook useAuth() : session, connexion,
                     inscription, deconnexion
  lib/api.js         fetch vers l'API backend, ajoute le jeton Bearer
  components/
    Layout.jsx       en-tête + navigation + état de connexion
  components/
    UploadPhoto.jsx       envoi d'image vers Supabase Storage + aperçu
    CarteProduit.jsx      carte + formulaire de réservation (quantité)
    CarteParcelle.jsx     carte (+ photo) + formulaire de réservation (m², culture, date)
    GestionProduits.jsx   agriculteur : ajouter / modifier / retirer ses produits
    GestionParcelles.jsx  idem pour les parcelles (+ statut disponible/reservee)
    ReservationsRecues.jsx  agriculteur : accepter / refuser les réservations reçues
  pages/
    Produits.jsx          liste des produits, réservation par carte
    Parcelles.jsx         liste des parcelles, réservation par carte
    Connexion.jsx         formulaire connexion / inscription
    MonProfil.jsx         éditer sa fiche (nom, ferme, bio, photo, région)
    ProfilAgriculteur.jsx fiche publique d'un agriculteur + ses annonces
    MesReservations.jsx   mes réservations (produits + parcelles) avec statut
    EspaceAgriculteur.jsx  hub agriculteur : devenir agriculteur, puis gestion
  App.jsx                routes
  main.jsx               BrowserRouter + AuthProvider
```

## Comment ça parle au backend

1. Connexion via `supabase.auth.signInWithPassword` → Supabase renvoie une
   session (JWT), stockée par `@supabase/supabase-js` dans le navigateur.
2. `lib/api.js` lit `supabase.auth.getSession()` avant chaque appel et ajoute
   `Authorization: Bearer <jwt>`.
3. Le backend valide ce JWT et applique le RLS (`auth.uid()`, rôle).

## Fait / à faire

- [x] Listes publiques produits & parcelles
- [x] Connexion / inscription / déconnexion
- [x] Réserver un produit (quantité)
- [x] **Parcelle partagée** : réserver une portion en m² + une culture (choisie
      dans les cultures autorisées) + date ; la carte affiche la surface restante
- [x] « Mes réservations » (produits + parcelles, avec statut et détails)
- [x] Espace agriculteur : devenir agriculteur ; créer / **modifier** / retirer
      ses produits et parcelles (dont `cultures_autorisees`, `max_m2_par_client`) ;
      accepter / refuser les réservations reçues
- [x] **Phase B** : prix des réservations (affiché + figé), statut « payé »
      (l'agriculteur le coche), date de récolte (l'agriculteur la pose), le
      client peut annuler sa réservation tant qu'elle est en attente
- [x] **Phase C** : photos via Supabase Storage — photo de la parcelle
      (agriculteur), photo de la culture en cours sur une réservation confirmée
      (agriculteur) ; affichées sur les cartes et dans « Mes réservations »
- [x] **E1** : fiche publique agriculteur (nom de ferme, bio, photo, région) ;
      page « Mon profil » pour l'éditer ; lien « vendu par… » sur chaque carte
- [x] **E2** : notes & avis — seul un client ayant eu une réservation confirmée
      avec l'agriculteur peut le noter ; note moyenne affichée dans l'en-tête de
      la fiche et sur les cartes produit / parcelle
- [x] **Refonte visuelle « Terroir »** : palette olive/kaki + papier crème,
      titres Zilla Slab + texte Karla ; bandeau d'accueil avec recherche ;
      **responsive** (barre d'onglets en bas sur mobile)
- [x] **PWA** : installable sur mobile (`vite-plugin-pwa`) — manifeste, icône,
      service worker qui met en cache la coquille de l'appli
- [ ] Déploiement (Vercel/Netlify + `CORS_ORIGINS` sur le backend)

## Direction visuelle

Palette dans `src/index.css` (`:root`) : `--olive #68724f` (principale),
`--olive-fonce #3f4733` (titres), `--ocre #a9762f` (prix, étoiles),
`--paper #f7f2e7` (fond), `--sable #e4d9c0` (bordures). Polices : **Zilla Slab**
(titres) + **Karla** (texte), chargées depuis Google Fonts dans `index.html`.
Point de rupture mobile : `max-width: 768px` (l'en-tête se simplifie, la
`.bottom-nav` apparaît).

## PWA (application installable)

Configurée dans `vite.config.js` (`vite-plugin-pwa`). Le service worker n'est
actif qu'en **production** (`npm run build`), pas en `npm run dev`. Il met en
cache la coquille de l'appli (JS/CSS/HTML/polices/icônes) ; les données passent
toujours par le réseau.

Pour tester : `npm run build && npm run preview`, puis dans le navigateur
« Installer l'application ».

Les icônes (`public/pwa-*.png`, `apple-touch-icon.png`) sont générées à partir
d'un dessin de feuille par `npm run icones` (`scripts/generer-icones.mjs`).

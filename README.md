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
- [ ] Déploiement (Vercel/Netlify + `CORS_ORIGINS` sur le backend)

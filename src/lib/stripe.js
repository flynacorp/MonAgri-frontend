// Stripe.js (formulaire de carte hébergé par Stripe : le numéro de carte ne
// passe JAMAIS par notre serveur ni par notre code).
// La clé PUBLIQUE (pk_...) peut sans risque se trouver dans le navigateur.

// « /pure » : la variante qui ne charge rien à l'import. L'import classique
// ('@stripe/stripe-js') injecte le script Stripe dès le chargement de la page.
import { loadStripe } from '@stripe/stripe-js/pure'

const cle = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY

let promesse = null

// Stripe.js n'est chargé qu'au moment où un formulaire de carte s'affiche, pas
// à chaque visite du site : inutile (et moins respectueux de la vie privée) de
// faire charger un script de paiement à quelqu'un qui consulte juste le marché.
// Renvoie `null` si la clé publique n'est pas configurée.
export function chargerStripe() {
  if (!cle) return null
  if (!promesse) promesse = loadStripe(cle)
  return promesse
}

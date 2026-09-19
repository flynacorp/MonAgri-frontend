// Stripe.js (formulaire de carte hébergé par Stripe : le numéro de carte ne
// passe JAMAIS par notre serveur ni par notre code).
// La clé PUBLIQUE (pk_...) peut sans risque se trouver dans le navigateur.

import { loadStripe } from '@stripe/stripe-js'

const cle = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY

// Chargé une seule fois. `null` si la clé publique n'est pas configurée.
export const stripePromise = cle ? loadStripe(cle) : null

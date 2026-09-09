// Client Supabase utilisé UNIQUEMENT pour l'authentification (connexion,
// inscription, session). Toutes les autres données passent par l'API
// MonAgri-backend (cf. src/lib/api.js).

import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const cle = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!url || !cle) {
  throw new Error(
    'VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY manquent : copie .env.example en .env.local.'
  )
}

export const supabase = createClient(url, cle)

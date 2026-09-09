// Petit client pour l'API MonAgri-backend.
// Récupère le jeton de session Supabase et l'ajoute en en-tête Authorization.

import { supabase } from '../supabase'

const BASE = import.meta.env.VITE_API_URL

export async function api(chemin, { method = 'GET', body } = {}) {
  const { data } = await supabase.auth.getSession()
  const token = data.session?.access_token

  const reponse = await fetch(BASE + chemin, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  })

  const texte = await reponse.text()
  let corps = null
  try {
    corps = texte ? JSON.parse(texte) : null
  } catch {
    corps = texte
  }

  if (!reponse.ok) {
    throw new Error((corps && corps.erreur) || `Erreur ${reponse.status}`)
  }
  return corps
}

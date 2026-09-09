// Contexte d'authentification : expose la session Supabase, le profil MonAgri
// (dont le rôle) et les actions connexion / inscription / déconnexion / devenir
// agriculteur, via le hook useAuth().

import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from './supabase'
import { api } from './lib/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [profilCharge, setProfilCharge] = useState(null)
  const [chargement, setChargement] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setChargement(false)
    })
    const { data } = supabase.auth.onAuthStateChange((_evenement, nouvelleSession) => {
      setSession(nouvelleSession)
    })
    return () => data.subscription.unsubscribe()
  }, [])

  // À chaque changement d'utilisateur connecté, on récupère sa ligne
  // `utilisateurs` (nom, email, role...) depuis l'API.
  const utilisateurId = session?.user?.id ?? null
  useEffect(() => {
    if (!utilisateurId) return
    api('/mon-profil')
      .then(setProfilCharge)
      .catch(() => setProfilCharge(null))
  }, [utilisateurId])

  // Le profil chargé n'est valable que s'il correspond à l'utilisateur courant.
  const profil = utilisateurId && profilCharge?.id === utilisateurId ? profilCharge : null

  const valeur = {
    session,
    utilisateur: session?.user ?? null,
    profil,
    estAgriculteur: profil?.role === 'agriculteur',
    chargement,

    async connexion(email, motDePasse) {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password: motDePasse,
      })
      if (error) throw new Error(error.message)
    },

    async inscription(email, motDePasse) {
      const { error } = await supabase.auth.signUp({
        email,
        password: motDePasse,
      })
      if (error) throw new Error(error.message)
    },

    async deconnexion() {
      await supabase.auth.signOut()
    },

    async devenirAgriculteur() {
      const p = await api('/devenir-agriculteur', { method: 'POST' })
      setProfilCharge(p)
    },
  }

  return <AuthContext.Provider value={valeur}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const contexte = useContext(AuthContext)
  if (!contexte) throw new Error('useAuth doit être utilisé dans <AuthProvider>')
  return contexte
}

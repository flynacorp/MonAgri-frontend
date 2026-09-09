// Contexte d'authentification : expose la session Supabase et les actions
// connexion / inscription / déconnexion à toute l'appli via le hook useAuth().

import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from './supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [chargement, setChargement] = useState(true)

  useEffect(() => {
    // session au démarrage
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setChargement(false)
    })
    // puis on suit les changements (connexion, déconnexion, refresh du jeton)
    const { data } = supabase.auth.onAuthStateChange((_evenement, nouvelleSession) => {
      setSession(nouvelleSession)
    })
    return () => data.subscription.unsubscribe()
  }, [])

  const valeur = {
    session,
    utilisateur: session?.user ?? null,
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
  }

  return <AuthContext.Provider value={valeur}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const contexte = useContext(AuthContext)
  if (!contexte) throw new Error('useAuth doit être utilisé dans <AuthProvider>')
  return contexte
}

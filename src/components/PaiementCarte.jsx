import { useState } from 'react'
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { stripePromise } from '../lib/stripe'

// Aspect du formulaire Stripe, aligné sur le thème « Terroir » du site.
const apparence = {
  theme: 'flat',
  variables: {
    colorPrimary: '#68724f',
    colorBackground: '#fffdf7',
    colorText: '#2c2a22',
    colorDanger: '#a5402c',
    fontFamily: 'Karla, system-ui, sans-serif',
    borderRadius: '8px',
  },
}

function FormulairePaiement({ montant, onAutorise, onAnnuler }) {
  const stripe = useStripe()
  const elements = useElements()
  const [erreur, setErreur] = useState(null)
  const [enCours, setEnCours] = useState(false)

  async function payer(e) {
    e.preventDefault()
    if (!stripe || !elements) return
    setEnCours(true)
    setErreur(null)

    // La carte est seulement AUTORISÉE (l'argent est bloqué, pas débité) :
    // le débit n'a lieu que si l'agriculteur confirme la réservation.
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
    })

    if (error) {
      setErreur(error.message)
    } else if (paymentIntent.status === 'requires_capture') {
      await onAutorise(paymentIntent.id)
    } else {
      setErreur(`Le paiement n'a pas abouti (${paymentIntent.status}).`)
    }
    setEnCours(false)
  }

  return (
    <form className="paiement-carte" onSubmit={payer}>
      <PaymentElement />
      <p className="detail">
        Ta carte est <strong>autorisée</strong> maintenant, mais{' '}
        <strong>débitée seulement si l'agriculteur confirme</strong>. S'il refuse, rien n'est prélevé.
      </p>
      {erreur && <p className="erreur">{erreur}</p>}
      <div className="actions">
        <button type="submit" disabled={enCours || !stripe}>
          {enCours ? '…' : `Autoriser ${Number(montant).toFixed(2)} €`}
        </button>
        <button type="button" className="lien" onClick={onAnnuler} disabled={enCours}>
          Annuler
        </button>
      </div>
    </form>
  )
}

// Formulaire de carte Stripe pour une intention de paiement créée par le serveur.
// `onAutorise(paymentIntentId)` est appelé une fois la carte autorisée.
export default function PaiementCarte({ clientSecret, montant, onAutorise, onAnnuler }) {
  if (!stripePromise) {
    return (
      <>
        <p className="erreur">Le paiement en ligne n'est pas disponible pour le moment.</p>
        <button type="button" className="lien" onClick={onAnnuler}>
          Retour
        </button>
      </>
    )
  }
  return (
    <Elements stripe={stripePromise} options={{ clientSecret, appearance: apparence, locale: 'fr' }}>
      <FormulairePaiement montant={montant} onAutorise={onAutorise} onAnnuler={onAnnuler} />
    </Elements>
  )
}

import { Link } from 'react-router-dom'
import PageLegale, { Valeur } from '../components/PageLegale'
import { EDITEUR } from '../legal/editeur'

export default function Conditions() {
  return (
    <PageLegale titre="Conditions d'utilisation" misAJour="23 octobre 2026">
      <p>
        En créant un compte, vous acceptez ces conditions. MonAgri est actuellement en phase de
        test (« pilote ») : le service est gratuit et peut évoluer.
      </p>

      <h2>1. Ce qu'est MonAgri</h2>
      <p>
        MonAgri met en relation des producteurs agricoles et des clients. MonAgri n'est pas le
        vendeur : la vente est conclue directement entre le producteur et le client, qui sont seuls
        responsables de leur engagement. MonAgri ne garantit ni la qualité des produits, ni la
        disponibilité continue du service.
      </p>

      <h2>2. Votre compte</h2>
      <ul>
        <li>Vous donnez des informations exactes et vous les tenez à jour.</li>
        <li>Votre compte est personnel : gardez votre mot de passe pour vous.</li>
        <li>
          Vous devez être majeur, ou avoir l'accord de votre représentant légal, pour utiliser le
          service.
        </li>
      </ul>

      <h2>3. Les producteurs</h2>
      <ul>
        <li>
          Pour proposer des produits, un producteur indique son numéro SIRET. Il est vérifié
          auprès du registre officiel des entreprises, puis la candidature est validée par l'équipe
          avant que la boutique soit visible.
        </li>
        <li>
          Le producteur est responsable de ses annonces : produits réels, prix et quantités
          exacts, respect des règles d'hygiène, d'étiquetage et de vente qui s'appliquent à son
          activité.
        </li>
        <li>
          Il accepte ou refuse les réservations dans un délai raisonnable, tient ses engagements
          une fois la réservation acceptée, et renseigne un lieu de retrait.
        </li>
      </ul>

      <h2>4. Les clients</h2>
      <ul>
        <li>
          Réserver, c'est demander un produit au producteur : la réservation n'est ferme qu'une
          fois acceptée. Tant qu'elle est en attente, vous pouvez l'annuler.
        </li>
        <li>
          Une fois la réservation acceptée, vous recevez l'adresse exacte et vous venez retirer
          votre commande à l'heure indiquée.
        </li>
        <li>
          La plupart des produits proposés sont des denrées susceptibles de se périmer
          rapidement : le droit de rétractation de 14 jours ne s'applique pas à ces ventes.
        </li>
      </ul>

      <h2>5. Prix et paiement</h2>
      <p>
        Les prix sont fixés par les producteurs, en euros, toutes taxes comprises le cas échéant.
        Pendant la phase de test, le paiement se fait sur place, au retrait. Si un producteur
        active le paiement par carte, votre carte est autorisée au moment de la réservation et
        n'est débitée que si le producteur accepte ; s'il refuse, l'autorisation est libérée. Le
        paiement est traité par Stripe, MonAgri ne voit jamais votre numéro de carte.
      </p>

      <h2>6. Avis et contenus</h2>
      <ul>
        <li>
          Seuls les clients dont une réservation a été acceptée peuvent noter un producteur, une
          fois par producteur.
        </li>
        <li>
          Vous êtes responsable de ce que vous publiez (textes, photos, avis). Pas de contenu
          illicite, trompeur, injurieux, ni portant atteinte aux droits d'autrui.
        </li>
        <li>
          Nous pouvons retirer un contenu qui ne respecte pas ces règles. Pour en signaler un :{' '}
          <Valeur v={EDITEUR.contact} />.
        </li>
      </ul>

      <h2>7. Responsabilité</h2>
      <p>
        MonAgri met en œuvre les moyens raisonnables pour que le service fonctionne, sans garantir
        qu'il soit toujours disponible ni exempt d'erreur, en particulier pendant la phase de test.
        MonAgri n'est pas responsable des litiges entre producteurs et clients, ni de la qualité
        des produits ; nous pouvons toutefois aider à les résoudre. Rien dans ces conditions
        n'exclut une responsabilité que la loi ne permet pas d'exclure.
      </p>

      <h2>8. Suspension et fin du compte</h2>
      <p>
        Vous pouvez demander la suppression de votre compte à tout moment (voir la{' '}
        <Link to="/confidentialite">politique de confidentialité</Link>). Nous pouvons suspendre ou
        supprimer un compte en cas de non-respect de ces conditions ou d'abus.
      </p>

      <h2>9. Vos données</h2>
      <p>
        Le traitement de vos données personnelles est décrit dans la{' '}
        <Link to="/confidentialite">politique de confidentialité</Link>.
      </p>

      <h2>10. Droit applicable et litiges</h2>
      <p>
        Ces conditions sont soumises au droit français. En cas de litige, contactez-nous d'abord à{' '}
        <Valeur v={EDITEUR.contact} />. Si vous êtes consommateur, vous pouvez recourir
        gratuitement au médiateur de la consommation : <Valeur v={EDITEUR.mediateur} />.
      </p>

      <h2>11. Modifications</h2>
      <p>
        Nous pouvons modifier ces conditions ; la date en haut de page indique la dernière
        version. Les <Link to="/mentions-legales">mentions légales</Link> précisent l'éditeur du
        site.
      </p>
    </PageLegale>
  )
}

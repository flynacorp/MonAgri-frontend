import { Link } from 'react-router-dom'
import PageLegale, { Valeur } from '../components/PageLegale'
import { EDITEUR } from '../legal/editeur'

export default function Confidentialite() {
  return (
    <PageLegale titre="Politique de confidentialité" misAJour="23 octobre 2026">
      <p>
        Cette page explique quelles données MonAgri collecte, pourquoi, qui peut les voir et
        comment exercer vos droits. Nous collectons le strict nécessaire pour faire fonctionner le
        service.
      </p>

      <h2>Qui est responsable de vos données ?</h2>
      <p>
        <Valeur v={EDITEUR.nom} />, <Valeur v={EDITEUR.adresse} />. Contact pour toute question :{' '}
        <Valeur v={EDITEUR.contact} />.
      </p>

      <h2>Les données que nous collectons</h2>
      <ul>
        <li>
          <strong>Votre compte :</strong> adresse e-mail, mot de passe (jamais lisible : il est
          transformé par le service de connexion), nom affiché, région.
        </li>
        <li>
          <strong>Si vous êtes producteur :</strong> nom de la ferme, présentation, photos, numéro
          SIRET, raison sociale et code d'activité (récupérés auprès du registre officiel des
          entreprises), lieu et horaires de retrait, adresse exacte de retrait, annonces et prix.
        </li>
        <li>
          <strong>Vos réservations et avis :</strong> produit ou parcelle, quantité, prix, date,
          état (en attente, confirmée, annulée), mode de paiement, notes et commentaires.
        </li>
        <li>
          <strong>Vos photos :</strong> celles que vous ajoutez à vos annonces ou à votre fiche.
        </li>
        <li>
          <strong>Données techniques :</strong> adresse IP et informations de connexion, conservées
          dans les journaux de nos hébergeurs pour assurer la sécurité du service.
        </li>
      </ul>

      <h2>Pourquoi, et sur quel fondement ?</h2>
      <ul>
        <li>
          Créer votre compte, gérer vos réservations et vous envoyer les e-mails qui s'y
          rapportent : <strong>exécution du service que vous demandez</strong>.
        </li>
        <li>
          Vérifier l'identité professionnelle des producteurs (SIRET) et prévenir les abus et la
          fraude : <strong>intérêt légitime</strong> à garantir un service de confiance.
        </li>
        <li>
          Conserver des preuves et respecter nos obligations : <strong>obligation légale</strong>{' '}
          et intérêt légitime.
        </li>
      </ul>
      <p>
        Nous n'utilisons pas vos données pour de la publicité et nous ne les vendons pas.
      </p>

      <h2>Qui voit quoi ?</h2>
      <ul>
        <li>
          <strong>Le public</strong> voit la fiche d'un producteur : nom de la ferme, présentation,
          photo, région, commune et horaires de retrait, annonces, notes et avis (avec le nom
          affiché de leur auteur).
        </li>
        <li>
          <strong>Le producteur</strong> voit le nom affiché du client et le détail de sa
          réservation. Il ne reçoit ni son adresse e-mail ni son mot de passe.
        </li>
        <li>
          <strong>Le client</strong> reçoit l'adresse exacte de retrait uniquement une fois sa
          réservation confirmée.
        </li>
        <li>
          <strong>L'équipe MonAgri</strong> accède aux données pour faire fonctionner le service et
          valider les candidatures de producteurs.
        </li>
      </ul>

      <h2>Nos prestataires</h2>
      <p>Nous faisons appel à des prestataires techniques, qui traitent les données pour notre compte :</p>
      <ul>
        <li>Supabase : base de données, connexion des utilisateurs et stockage des photos ;</li>
        <li>Render : serveur de l'application (situé à Francfort, en Allemagne) ;</li>
        <li>Vercel : hébergement des pages du site ;</li>
        <li>un service d'envoi d'e-mails (Brevo) : e-mails de notification et de connexion ;</li>
        <li>
          Stripe : paiement par carte, uniquement si le producteur l'a activé. Votre numéro de
          carte est saisi sur un formulaire de Stripe et ne passe jamais par MonAgri.
        </li>
      </ul>
      <p>
        Certains de ces prestataires sont établis hors de l'Union européenne (États-Unis,
        Singapour). Les transferts s'appuient, selon le prestataire, sur les clauses contractuelles
        types de la Commission européenne ou sur le cadre de protection des données UE–États-Unis.
      </p>

      <h2>Combien de temps conservons-nous vos données ?</h2>
      <ul>
        <li>Votre compte et votre profil : tant que le compte existe, puis effacés sur votre demande.</li>
        <li>
          Les réservations : 5 ans à partir de leur date, à titre de preuve, puis supprimées ou
          rendues anonymes.
        </li>
        <li>Les journaux techniques : quelques mois, selon les règles de nos hébergeurs.</li>
      </ul>

      <h2>Vos droits</h2>
      <p>
        Vous pouvez demander l'accès à vos données, leur rectification, leur effacement, la
        limitation de leur traitement, leur portabilité, et vous opposer à certains traitements. Écrivez à{' '}
        <Valeur v={EDITEUR.contact} /> : nous répondons dans un délai d'un mois. Si vous estimez
        que vos droits ne sont pas respectés, vous pouvez saisir la CNIL (cnil.fr).
      </p>

      <h2>Cookies et stockage dans votre navigateur</h2>
      <p>
        MonAgri n'utilise ni cookie publicitaire ni outil de mesure d'audience. Le site garde dans
        votre navigateur le jeton qui vous maintient connecté ; ce stockage est indispensable au
        fonctionnement du service. Lors d'un paiement par carte, Stripe peut déposer des éléments
        nécessaires à la sécurité du paiement ; ils ne sont chargés qu'à ce moment-là.
      </p>

      <h2>Sécurité</h2>
      <p>
        Les échanges sont chiffrés (HTTPS). Les mots de passe ne sont jamais stockés en clair.
        L'adresse exacte de retrait n'est visible que de son propriétaire et des clients dont la
        réservation est confirmée.
      </p>

      <h2>Modifications</h2>
      <p>
        Nous pouvons mettre cette page à jour ; la date en haut de page indique la dernière version.
        Les <Link to="/conditions">conditions d'utilisation</Link> et les{' '}
        <Link to="/mentions-legales">mentions légales</Link> complètent ce texte.
      </p>
    </PageLegale>
  )
}

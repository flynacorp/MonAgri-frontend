import { Link } from 'react-router-dom'
import PageLegale, { Valeur } from '../components/PageLegale'
import { EDITEUR } from '../legal/editeur'

export default function MentionsLegales() {
  return (
    <PageLegale titre="Mentions légales" misAJour="23 octobre 2026">
      <h2>Éditeur du site</h2>
      <p>
        MonAgri est édité par <Valeur v={EDITEUR.nom} />, <Valeur v={EDITEUR.forme} />,
        immatriculé sous le numéro SIRET <Valeur v={EDITEUR.siret} />, dont le siège est situé{' '}
        <Valeur v={EDITEUR.adresse} />.
      </p>
      <p>
        Directeur de la publication : <Valeur v={EDITEUR.directeur} />.
      </p>
      <p>
        Contact : <Valeur v={EDITEUR.contact} />.
      </p>

      <h2>Hébergement</h2>
      <ul>
        <li>
          <strong>Pages du site :</strong> Vercel Inc., 440 N Barranca Avenue #4133, Covina, CA
          91723, États-Unis (vercel.com).
        </li>
        <li>
          <strong>Serveur de l'application :</strong> Render, serveur situé à Francfort
          (Allemagne) (render.com).
        </li>
        <li>
          <strong>Base de données, comptes et photos :</strong> Supabase (supabase.com), région :{' '}
          <Valeur v={EDITEUR.regionBase} />.
        </li>
      </ul>

      <h2>Le rôle de MonAgri</h2>
      <p>
        MonAgri est une plateforme qui met en relation des producteurs agricoles et leurs clients.
        MonAgri n'est pas le vendeur des produits : chaque vente est conclue directement entre le
        producteur et le client. Les règles de fonctionnement sont détaillées dans les{' '}
        <Link to="/conditions">conditions d'utilisation</Link>.
      </p>

      <h2>Propriété intellectuelle</h2>
      <p>
        Les textes, photos et informations publiés par les producteurs et les clients restent leur
        propriété ; ils autorisent MonAgri à les afficher sur le site pour le fonctionnement du
        service. Le nom MonAgri, le graphisme et le code du site sont protégés ; toute reproduction
        sans autorisation est interdite.
      </p>

      <h2>Signaler un contenu</h2>
      <p>
        Pour signaler un contenu qui vous paraît illicite ou inapproprié, écrivez à{' '}
        <Valeur v={EDITEUR.contact} /> en indiquant l'adresse de la page et le motif. Nous
        l'examinons rapidement et le retirons s'il y a lieu.
      </p>

      <h2>Données personnelles</h2>
      <p>
        Le traitement de vos données est décrit dans la{' '}
        <Link to="/confidentialite">politique de confidentialité</Link>.
      </p>
    </PageLegale>
  )
}

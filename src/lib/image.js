// Réduit une photo avant son envoi : une photo de téléphone pèse souvent de
// 3 à 8 Mo, ce qui ralentit l'envoi (surtout en campagne) et remplit vite le
// stockage gratuit. Après réduction : 1280 px de côté au plus, en JPEG, soit
// quelques centaines de Ko.
//
// Renvoie un Blob JPEG, ou le fichier d'origine si la réduction n'est pas
// possible ou n'allège rien (navigateur ancien, format non géré, GIF…).
export async function reduireImage(fichier, coteMax = 1280, qualite = 0.82) {
  try {
    if (!fichier.type.startsWith('image/')) return fichier
    if (fichier.type === 'image/gif' || fichier.type === 'image/svg+xml') return fichier

    // 'from-image' remet la photo à l'endroit selon les données de l'appareil.
    const image = await createImageBitmap(fichier, { imageOrientation: 'from-image' })
    const echelle = Math.min(1, coteMax / Math.max(image.width, image.height))
    const largeur = Math.round(image.width * echelle)
    const hauteur = Math.round(image.height * echelle)

    const canvas = document.createElement('canvas')
    canvas.width = largeur
    canvas.height = hauteur
    const contexte = canvas.getContext('2d')
    contexte.fillStyle = '#ffffff' // un PNG transparent ne devient pas noir en JPEG
    contexte.fillRect(0, 0, largeur, hauteur)
    contexte.drawImage(image, 0, 0, largeur, hauteur)
    image.close?.()

    const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', qualite))
    return blob && blob.size < fichier.size ? blob : fichier
  } catch {
    return fichier
  }
}

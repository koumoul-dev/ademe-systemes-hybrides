## Générer les fichiers

 * Décompressez l'archive `suivi_systemes_hybrides.zip`, cela va créer un dossier `suivi_systemes_hybrides`.
 * Allez dedans et supprimez les fichiers de log dans les zones rouges (se reporter au fichier `Systèmes_hybrides_disponibilité_mesures.xlsx`)
 * lancez la commande `node process.js` pour construire le fichier CSV

## Description des autres fichiers

 * `variables.csv` : fichier créé à la main depuis le fichier `tableau-recap-mesures_v0.xlsx`, utilisé pour les autres traitements comme table de correspondance
 * `variables.json` : fichier produit en lançant la commande `node build-variables.js`. Les fichiers de données sont analysés en détails et le résultat de l'analyse est sauvegardé dans ce fichier json pour gagner du temps ensuite
 * `analyse-variables-meta.csv` et `analyse-variables-remontees.csv` : fichiers produits en lançant la commande `node analyze.js`. Il permettent de voir la correspondance entre les variables décrites dans les métadonnées (fichier `tableau-recap-mesures_v0.xlsx`) et celles remontées par les mesures de capteurs.

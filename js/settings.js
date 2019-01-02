// tableau de jeu
const monTableau = [];

// création des armes
const gun1 = new Arme('gun1', 10);
const gun2 = new Arme('gun2', 10);
const rifle = new Arme('rifle', 15);
const bazooka = new Arme('bazooka', 20)

// création des personnages
const perso1 = new Personnage('perso1', gun1, 100);
const perso2 = new Personnage('perso2', gun2, 100);

// Cellule du joueur actif
let celJoueur;
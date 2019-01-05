// tableau contenant toutes les infos
const monTableau = [];

// création des armes
const gun1 = new Arme('gun1', 10);
const gun2 = new Arme('gun2', 10);
const rifle = new Arme('rifle', 20);
const bazooka = new Arme('bazooka', 20)

// création des personnages
const perso1 = new Personnage('perso1', gun1, 100);
const perso2 = new Personnage('perso2', gun2, 100);

// Cellule du joueur actif
let celJoueur;

// musiques
const sons = document.getElementsByTagName('audio');
const theme1 = sons[0];
const sonFight = sons[1];
const theme2 = sons[2];
const theme3 = sons[3];
const deathScream = sons[4];
const saut = sons[5];
const laser = sons[6];
const sonBouclier = sons[7];
const SonNvArme = sons[8];